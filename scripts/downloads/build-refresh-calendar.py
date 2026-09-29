#!/usr/bin/env python3
"""Build the refresh-calendar template linked from
/blog/ai-search-content-refresh-calendar:

  public/downloads/ai-search-refresh-calendar.xlsx  (Calendar, Intervals, Change Log, Read Me)
  public/downloads/ai-search-refresh-calendar.csv   (the Calendar sheet only, values, blank Status)

Standard library only, so it runs anywhere: the .xlsx is written as raw
SpreadsheetML. Formulas use only IF, TODAY and date + days, so the file behaves
the same in Google Sheets, Excel and Numbers. Cached formula results are as of
AS_OF, which is what file previews show before an app recalculates.

The page types, intervals and Tallyfold rows must match the post. Run from the
repo root:  python3 scripts/downloads/build-refresh-calendar.py
"""
import csv
import datetime as dt
import io
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path("public/downloads")
AS_OF = dt.date(2026, 9, 29)
FORMULA_ROWS = 500

CAL_HEAD = [
    "URL", "Page title", "Page type", "Priority", "Owner", "Interval (days)", "Last reviewed",
    "Next review", "Status", "Tripwires", "Last outcome", "Last substantive update", "Notes",
]
PAGE_TYPES = ["Pricing", "Comparison", "Integration doc", "Statistics post", "Evergreen guide",
              "Feature page", "Glossary term", "Dated post"]
PRIORITIES = ["High", "Normal", "Low"]
OUTCOMES = ["Confirmed", "Updated", "Rewritten", "Merged or retired"]

# URL, title, type, priority, owner, interval, last reviewed, tripwires, outcome, last substantive update, notes
CAL_ROWS = [
    ("https://tallyfold.example/pricing", "Tallyfold pricing", "Pricing", "High", "Product marketing", 30, "2026-09-01",
     "Any price, plan, fee or trial change", "Updated", "2026-09-01", "Plan limits changed on 1 Sep 2026"),
    ("https://tallyfold.example/compare/tallyfold-vs-brindlework", "Tallyfold vs Brindlework", "Comparison", "High", "Product marketing", 60, "2026-07-20",
     "Brindlework changes its pricing or plans; we ship a feature the page compares", "Updated", "2026-07-20", "Sales heard Brindlework is changing its plans"),
    ("https://tallyfold.example/compare/tallyfold-vs-kestrelyn", "Tallyfold vs Kestrelyn", "Comparison", "Normal", "Product marketing", 60, "2026-08-25",
     "Kestrelyn changes its pricing or plans; we ship a feature the page compares", "Confirmed", "2026-06-02", ""),
    ("https://tallyfold.example/blog/best-invoicing-software-for-agencies", "Best invoicing software for agencies", "Comparison", "High", "Content lead", 60, "2026-08-04",
     "A listed tool changes its price or plans; a new tool launches", "Updated", "2026-08-04", "List of seven tools, each price dated"),
    ("https://tallyfold.example/docs/integrations/stripe", "Connect Stripe to Tallyfold", "Integration doc", "High", "Docs team", 90, "2026-06-30",
     "Stripe major API release; Stripe dashboard redesign; our Stripe connector changes", "Updated", "2026-06-30", "Check every step and screenshot against Stripe's current API version"),
    ("https://tallyfold.example/docs/integrations/quickbooks-online", "Sync invoices to QuickBooks Online", "Integration doc", "Normal", "Docs team", 90, "2026-08-12",
     "QuickBooks Online API or settings change; our sync rules change", "Confirmed", "2026-05-14", ""),
    ("https://tallyfold.example/blog/late-payment-statistics", "Late payment statistics for agencies", "Statistics post", "High", "Content lead", 90, "2026-07-06",
     "A cited survey publishes a new edition; a source link breaks", "Updated", "2026-07-06", "Nine figures from four sources"),
    ("https://tallyfold.example/features/retainer-billing", "Retainer billing", "Feature page", "Normal", "Product marketing", 90, "2026-09-10",
     "Any release that changes retainer billing", "Updated", "2026-09-10", ""),
    ("https://tallyfold.example/blog/how-to-write-a-retainer-agreement", "How to write a retainer agreement", "Evergreen guide", "Normal", "Content lead", 180, "2026-04-14",
     "A contract or e-signature rule the guide explains changes", "Updated", "2026-04-14", ""),
    ("https://tallyfold.example/glossary/net-30", "What is net 30?", "Glossary term", "Low", "Content lead", 365, "2025-10-20",
     "The term's common meaning shifts", "Confirmed", "2025-03-03", ""),
]

INT_HEAD = ["Page type", "Default interval (days)", "Covers", "What goes stale", "Typical tripwires", "What a review checks"]
INT_ROWS = [
    ("Pricing", 30, "Your pricing page and any page listing your plans or fees", "Prices, plan limits, fees, trial terms",
     "Any price, plan, fee or trial change (update the same day)", "Every number against your billing system; plan names; trial and refund terms"),
    ("Comparison", 60, '"X vs Y" pages, alternatives pages, best-of lists', "Rivals' prices, plans and features",
     "A rival changes its pricing or launches a plan; you ship a feature the page compares", 'Each rival\'s own pricing page and changelog; every fact dated "as of" the check'),
    ("Integration doc", 90, "Setup and how-to docs for a partner integration", "Setup steps, screenshots, partner API versions",
     "A partner's major API release or settings redesign; your connector changes", "Each step against the live partner screens; every screenshot; version numbers"),
    ("Statistics post", 90, "Posts built on cited figures", "Cited figures and study editions",
     "A source publishes a new edition; a source link breaks", "Every source link opens; every figure still matches its source; newest edition used"),
    ("Evergreen guide", 180, "How-to guides on stable topics", "Examples, tool names, links, rules",
     "A law, standard or platform rule the guide explains changes", "Links; tool and product names; rules and examples still current"),
    ("Feature page", 90, "Pages describing one of your own features", "What the feature does, limits, screenshots",
     "A release that touches the feature", "Claims against the live product; limits; screenshots"),
    ("Glossary term", 365, "Definitions and glossary entries", "Rarely anything",
     "The term's meaning or common use shifts", "Definition still accurate; links work"),
    ("Dated post", 365, "News, recaps, case studies, announcements", "Nothing; the post records a moment",
     "Someone reports a factual error", "Links only. Never re-date a dated post."),
]
INT_NOTES = [
    "These intervals are Rankbox's starting defaults, not numbers any search engine or AI engine publishes. Tune them with the halve-or-double rule.",
    "Halve-or-double rule: after two reviews in a row end in Updated or Rewritten, halve the interval (not below 14 days). After two reviews in a row end in Confirmed, double it (not above 365 days). Otherwise keep it.",
    "Set each interval shorter than the usual gap between changes to that page's facts.",
]

LOG_HEAD = ["Date", "URL", "What changed", "Source", "Who"]
LOG_ROWS = [
    ("2026-09-10", "https://tallyfold.example/features/retainer-billing", "Added the new rollover-hours setting, with a screenshot and a worked example", "Tallyfold release notes, 10 Sep 2026", "Product marketing"),
    ("2026-09-01", "https://tallyfold.example/pricing", "Updated the plan limits in the pricing table and the pricing FAQ", "Tallyfold billing system, plan change effective 1 Sep 2026", "Product marketing"),
    ("2026-08-04", "https://tallyfold.example/blog/best-invoicing-software-for-agencies", "Updated two tools' prices and added one new tool to the list", "Each tool's own pricing page, checked 4 Aug 2026", "Content lead"),
    ("2026-07-20", "https://tallyfold.example/compare/tallyfold-vs-brindlework", "Updated Brindlework's plan prices in the comparison table", "brindlework.example/pricing, checked 20 Jul 2026", "Product marketing"),
    ("2026-07-06", "https://tallyfold.example/blog/late-payment-statistics", "Replaced two figures with the survey's 2026 edition and fixed one dead source link", "The survey publisher's 2026 report page, checked 6 Jul 2026", "Content lead"),
    ("2026-06-30", "https://tallyfold.example/docs/integrations/stripe", "Rewrote setup steps 3 to 5 and replaced four screenshots to match Stripe's current settings screens", "Stripe Dashboard and Stripe docs, checked 30 Jun 2026", "Docs team"),
]

# (text, bold)
README = [
    ("AI Search Content Refresh Calendar", True),
    ("A free template from Rankbox. Guide: https://rankbox.xyz/blog/ai-search-content-refresh-calendar", False),
    ("Free to use, change and share with your team or clients. If you publish it or pass it on, please link back to the guide above.", False),
    ("The example rows describe Tallyfold, a made-up invoicing app. Delete them before you add your own pages.", False),
    ("How to use it", True),
    ("1. Add one row per page on the Calendar sheet: URL, title, page type, priority and owner.", False),
    ("2. Copy the default interval for its page type from the Intervals sheet into Interval (days).", False),
    ("3. Enter Last reviewed. If you don't know it, use the date the page last really changed. Spread first dates out so pages don't all come due on the same day.", False),
    ("4. Write the page's tripwires: the events that make it due immediately.", False),
    ("5. Each week, sort by Next review. Work Overdue rows first, then Due soon.", False),
    ("6. After each review, set Last reviewed to today and pick the Last outcome.", False),
    ("What each outcome changes", True),
    ("Confirmed: nothing on the page changed. Update Last reviewed only. Do not change the page's dates. No Change Log row.", False),
    ('Updated: facts, sections or sources changed. Update Last reviewed and Last substantive update, change the page\'s "Last updated" date and dateModified, add a Change Log row.', False),
    ("Rewritten: most of the page was replaced at the same URL. Same as Updated, and summarise the rewrite in the Change Log.", False),
    ("Merged or retired: the page was folded into another or removed. Add a Change Log row naming the redirect target, then delete the Calendar row.", False),
    ("Status meanings", True),
    ("Overdue: the next review date has passed. Due soon: due today or within 14 days. Scheduled: due later. Not reviewed: no Last reviewed date yet.", False),
    ("Tune the intervals", True),
    ("After two Updated or Rewritten outcomes in a row, halve the interval (not below 14 days). After two Confirmed outcomes in a row, double it (not above 365 days).", False),
    ("Works in", True),
    ("Google Sheets, Microsoft Excel and Apple Numbers. The formulas use only IF, TODAY and date addition. The CSV copy holds the Calendar sheet only, with fixed values and a blank Status column.", False),
]


def day(s):
    return dt.date.fromisoformat(s)


def next_review(row):
    return day(row[6]) + dt.timedelta(days=row[5])


def status(nxt):
    if nxt < AS_OF:
        return "Overdue"
    if nxt <= AS_OF + dt.timedelta(days=14):
        return "Due soon"
    return "Scheduled"


# ---------------------------------------------------------------- CSV
def build_csv():
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator="\n")
    w.writerow(CAL_HEAD)
    for r in CAL_ROWS:
        w.writerow([r[0], r[1], r[2], r[3], r[4], r[5], r[6], next_review(r).isoformat(), "", r[7], r[8], r[9], r[10]])
    return buf.getvalue()


# ---------------------------------------------------------------- XLSX
STRINGS, SIDX = [], {}


def sst(text):
    if text not in SIDX:
        SIDX[text] = len(STRINGS)
        STRINGS.append(text)
    return SIDX[text]


def col(n):
    s = ""
    n += 1
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def serial(d):
    return (d - dt.date(1899, 12, 30)).days


# style ids (cellXfs order in STYLES)
S_TEXT, S_HEAD, S_DATE, S_WRAP, S_BOLD, S_NUM = 0, 1, 2, 3, 4, 5


def c_str(ref, text, style=S_TEXT):
    return f'<c r="{ref}" s="{style}" t="s"><v>{sst(text)}</v></c>'


def c_num(ref, n, style=S_NUM):
    return f'<c r="{ref}" s="{style}"><v>{n}</v></c>'


def c_date(ref, d):
    return f'<c r="{ref}" s="{S_DATE}"><v>{serial(d)}</v></c>'


def c_fnum(ref, formula, cached, style):
    return f'<c r="{ref}" s="{style}"><f>{escape(formula)}</f><v>{cached}</v></c>'


def c_fstr(ref, formula, cached, style=S_TEXT):
    return f'<c r="{ref}" s="{style}" t="str"><f>{escape(formula)}</f><v>{escape(cached)}</v></c>'


def header_row(names):
    return '<row r="1">' + "".join(c_str(f"{col(i)}1", n, S_HEAD) for i, n in enumerate(names)) + "</row>"


def sheet_xml(rows, widths, extra="", frozen=True):
    view = (
        '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
        '<selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>'
        if frozen else '<sheetViews><sheetView workbookViewId="0"/></sheetViews>'
    )
    cols = "<cols>" + "".join(
        f'<col min="{i + 1}" max="{i + 1}" width="{w}" customWidth="1"/>' for i, w in enumerate(widths)
    ) + "</cols>"
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"{view}<sheetFormatPr defaultRowHeight=\"15\"/>{cols}<sheetData>{''.join(rows)}</sheetData>{extra}"
        '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>'
    )


def calendar_sheet():
    rows = [header_row(CAL_HEAD)]
    for i in range(2, FORMULA_ROWS + 1):
        h = f'IF(G{i}="","",G{i}+F{i})'
        s = f'IF(A{i}="","",IF(H{i}="","Not reviewed",IF(H{i}<TODAY(),"Overdue",IF(H{i}<=TODAY()+14,"Due soon","Scheduled"))))'
        k = i - 2
        if k < len(CAL_ROWS):
            r = CAL_ROWS[k]
            nxt = next_review(r)
            cells = [
                c_str(f"A{i}", r[0]), c_str(f"B{i}", r[1], S_WRAP), c_str(f"C{i}", r[2]), c_str(f"D{i}", r[3]),
                c_str(f"E{i}", r[4]), c_num(f"F{i}", r[5]), c_date(f"G{i}", day(r[6])),
                c_fnum(f"H{i}", h, serial(nxt), S_DATE), c_fstr(f"I{i}", s, status(nxt)),
                c_str(f"J{i}", r[7], S_WRAP), c_str(f"K{i}", r[8]), c_date(f"L{i}", day(r[9])),
            ]
            if r[10]:
                cells.append(c_str(f"M{i}", r[10], S_WRAP))
        else:
            cells = [c_fstr(f"H{i}", h, "", S_DATE), c_fstr(f"I{i}", s, "")]
        rows.append(f'<row r="{i}">' + "".join(cells) + "</row>")

    def lst(values):
        return '"' + ",".join(values) + '"'

    cf = (
        f'<conditionalFormatting sqref="I2:I{FORMULA_ROWS}">'
        '<cfRule type="cellIs" dxfId="0" priority="1" operator="equal"><formula>"Overdue"</formula></cfRule>'
        '<cfRule type="cellIs" dxfId="1" priority="2" operator="equal"><formula>"Due soon"</formula></cfRule>'
        "</conditionalFormatting>"
    )
    dv = (
        '<dataValidations count="3">'
        f'<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="C2:C{FORMULA_ROWS}"><formula1>{escape(lst(PAGE_TYPES))}</formula1></dataValidation>'
        f'<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="D2:D{FORMULA_ROWS}"><formula1>{escape(lst(PRIORITIES))}</formula1></dataValidation>'
        f'<dataValidation type="list" allowBlank="1" showErrorMessage="1" sqref="K2:K{FORMULA_ROWS}"><formula1>{escape(lst(OUTCOMES))}</formula1></dataValidation>'
        "</dataValidations>"
    )
    widths = [52, 34, 16, 10, 18, 15, 14, 14, 13, 48, 16, 22, 44]
    return sheet_xml(rows, widths, cf + dv)


def intervals_sheet():
    rows = [header_row(INT_HEAD)]
    for k, r in enumerate(INT_ROWS):
        i = k + 2
        rows.append(f'<row r="{i}">' + c_str(f"A{i}", r[0]) + c_num(f"B{i}", r[1])
                    + "".join(c_str(f"{col(j)}{i}", r[j], S_WRAP) for j in range(2, 6)) + "</row>")
    i = len(INT_ROWS) + 3
    for note in INT_NOTES:
        rows.append(f'<row r="{i}">' + c_str(f"A{i}", note) + "</row>")
        i += 1
    return sheet_xml(rows, [18, 12, 34, 30, 40, 44])


def log_sheet():
    rows = [header_row(LOG_HEAD)]
    for k, r in enumerate(LOG_ROWS):
        i = k + 2
        rows.append(f'<row r="{i}">' + c_date(f"A{i}", day(r[0])) + c_str(f"B{i}", r[1])
                    + c_str(f"C{i}", r[2], S_WRAP) + c_str(f"D{i}", r[3], S_WRAP) + c_str(f"E{i}", r[4]) + "</row>")
    return sheet_xml(rows, [14, 52, 60, 44, 18])


def readme_sheet():
    rows = []
    for k, (text, bold) in enumerate(README):
        i = k + 1
        rows.append(f'<row r="{i}">' + c_str(f"A{i}", text, S_BOLD if bold else S_WRAP) + "</row>")
    return sheet_xml(rows, [100], frozen=False)


STYLES = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="yyyy-mm-dd"/></numFmts>
<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFE7E9EE"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="6">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="top"/></xf>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment horizontal="left" vertical="top"/></xf>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
<dxfs count="2">
<dxf><fill><patternFill patternType="solid"><bgColor rgb="FFFBD5D5"/></patternFill></fill></dxf>
<dxf><fill><patternFill patternType="solid"><bgColor rgb="FFFDEBC8"/></patternFill></fill></dxf>
</dxfs>
</styleSheet>"""

SHEETS = ["Calendar", "Intervals", "Change Log", "Read Me"]


def build_xlsx(path):
    sheets = [calendar_sheet(), intervals_sheet(), log_sheet(), readme_sheet()]
    sst_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        f'<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="{len(STRINGS)}" uniqueCount="{len(STRINGS)}">'
        + "".join(f'<si><t xml:space="preserve">{escape(s)}</t></si>' for s in STRINGS) + "</sst>"
    )
    ct = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        + "".join(
            f'<Override PartName="/xl/worksheets/sheet{i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(len(SHEETS))
        )
        + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>'
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        "</Types>"
    )
    rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
        '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>'
        "</Relationships>"
    )
    wb = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        '<bookViews><workbookView activeTab="0"/></bookViews><sheets>'
        + "".join(f'<sheet name="{escape(n)}" sheetId="{i + 1}" r:id="rId{i + 1}"/>' for i, n in enumerate(SHEETS))
        + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>'
    )
    n = len(SHEETS)
    wb_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(
            f'<Relationship Id="rId{i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i + 1}.xml"/>'
            for i in range(n)
        )
        + f'<Relationship Id="rId{n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        f'<Relationship Id="rId{n + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>'
        "</Relationships>"
    )
    stamp = f"{AS_OF.isoformat()}T00:00:00Z"
    core = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        "<dc:title>AI Search Content Refresh Calendar</dc:title><dc:creator>Rankbox</dc:creator>"
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{stamp}</dcterms:created>'
        f'<dcterms:modified xsi:type="dcterms:W3CDTF">{stamp}</dcterms:modified>'
        "</cp:coreProperties>"
    )
    app = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties">'
        "<Application>Rankbox</Application></Properties>"
    )
    fixed = (2026, 9, 29, 0, 0, 0)  # stable zip timestamps, so rebuilds are byte-identical
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for name, data in [
            ("[Content_Types].xml", ct), ("_rels/.rels", rels), ("docProps/core.xml", core), ("docProps/app.xml", app),
            ("xl/workbook.xml", wb), ("xl/_rels/workbook.xml.rels", wb_rels), ("xl/styles.xml", STYLES),
            *[(f"xl/worksheets/sheet{i + 1}.xml", s) for i, s in enumerate(sheets)],
            ("xl/sharedStrings.xml", sst_xml),
        ]:
            info = zipfile.ZipInfo(name, fixed)
            info.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(info, data)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "ai-search-refresh-calendar.csv").write_text(build_csv(), encoding="utf-8")
    build_xlsx(OUT / "ai-search-refresh-calendar.xlsx")
    counts = {}
    for r in CAL_ROWS:
        counts[status(next_review(r))] = counts.get(status(next_review(r)), 0) + 1
    print("built", OUT / "ai-search-refresh-calendar.xlsx", OUT / "ai-search-refresh-calendar.csv", counts)
