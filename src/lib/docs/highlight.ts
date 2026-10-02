/**
 * A small syntax highlighter for the docs' code blocks. It runs on the server
 * while a page renders, so no highlighting library ships to the browser.
 *
 * It's a sticky-regex scanner: at each position the language's rules are
 * tried in order and the first match becomes a <span class="tk-*">. Enough
 * for request examples and short snippets; it is not a parser.
 *
 * Classes: tk-c comment, tk-s string, tk-n number, tk-k keyword,
 * tk-p property or key, tk-f command or function, tk-v variable,
 * tk-a added line, tk-d deleted line, tk-t tag.
 */

type Rule = [RegExp, string | ((m: RegExpExecArray) => string | null)];

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const words = (list: string) => new Set(list.split(/\s+/).filter(Boolean));

const JS_KEYWORDS = words(`
  const let var function return if else for while do switch case break continue new
  try catch finally throw await async import export from default class extends
  typeof instanceof in of void delete yield this super null undefined true false
  interface type enum implements as satisfies readonly declare keyof
`);
const PY_KEYWORDS = words(`
  def return if elif else for while in not and or is import from as class try except
  finally raise with lambda yield pass break continue None True False async await global
`);
const PHP_KEYWORDS = words(`
  function return if else elseif foreach for while as new echo array null true false
  use namespace class public private protected static try catch throw isset empty
`);
const BASH_COMMANDS = words(`
  curl export echo npm npx node python python3 pip cat jq openssl git wget cd ls
  mkdir chmod source set unset printf
`);
const HTTP_METHODS = words("GET POST PUT PATCH DELETE HEAD OPTIONS");

const STRING_DQ = /"(?:[^"\\\n]|\\.)*"/y;
const STRING_SQ = /'(?:[^'\\\n]|\\.)*'/y;
const NUMBER = /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y;

function identifier(keywords: Set<string>, cls = "tk-k"): Rule {
  return [/[A-Za-z_$][\w$]*/y, (m) => (keywords.has(m[0]) ? cls : null)];
}

const JSON_RULES: Rule[] = [
  [/"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, "tk-p"],
  [STRING_DQ, "tk-s"],
  [NUMBER, "tk-n"],
  [/\b(?:true|false|null)\b/y, "tk-k"],
];

const JS_RULES: Rule[] = [
  [/\/\/[^\n]*/y, "tk-c"],
  [/\/\*[\s\S]*?\*\//y, "tk-c"],
  [/`(?:[^`\\]|\\.)*`/y, "tk-s"],
  [STRING_DQ, "tk-s"],
  [STRING_SQ, "tk-s"],
  [NUMBER, "tk-n"],
  [/[A-Za-z_$][\w$]*(?=\s*\()/y, (m) => (JS_KEYWORDS.has(m[0]) ? "tk-k" : "tk-f")],
  identifier(JS_KEYWORDS),
];

const PY_RULES: Rule[] = [
  [/#[^\n]*/y, "tk-c"],
  [/"""[\s\S]*?"""|'''[\s\S]*?'''/y, "tk-s"],
  [/[fbr]?"(?:[^"\\\n]|\\.)*"|[fbr]?'(?:[^'\\\n]|\\.)*'/y, "tk-s"],
  [NUMBER, "tk-n"],
  [/[A-Za-z_]\w*(?=\s*\()/y, (m) => (PY_KEYWORDS.has(m[0]) ? "tk-k" : "tk-f")],
  identifier(PY_KEYWORDS),
];

const PHP_RULES: Rule[] = [
  [/\/\/[^\n]*|#[^\n]*/y, "tk-c"],
  [/\/\*[\s\S]*?\*\//y, "tk-c"],
  [STRING_DQ, "tk-s"],
  [STRING_SQ, "tk-s"],
  [/\$[A-Za-z_]\w*/y, "tk-v"],
  [NUMBER, "tk-n"],
  [/[A-Za-z_]\w*(?=\s*\()/y, (m) => (PHP_KEYWORDS.has(m[0]) ? "tk-k" : "tk-f")],
  identifier(PHP_KEYWORDS),
];

const BASH_RULES: Rule[] = [
  [/(?<=^|\s)#[^\n]*/my, "tk-c"],
  [STRING_DQ, "tk-s"],
  [STRING_SQ, "tk-s"],
  [/\$\{[^}\n]*\}|\$[A-Za-z_]\w*/y, "tk-v"],
  [/(?<=\s)--?[A-Za-z][\w-]*/y, "tk-p"],
  [/[A-Za-z_][\w.-]*/y, (m) => (BASH_COMMANDS.has(m[0]) ? "tk-f" : null)],
];

const HTTP_RULES: Rule[] = [
  [/(?<=^)[A-Z]+(?= )/my, (m) => (HTTP_METHODS.has(m[0]) ? "tk-k" : null)],
  [/(?<=^)[A-Za-z][\w-]*(?=:)/my, "tk-p"],
  [/HTTP\/[\d.]+/y, "tk-c"],
  ...JSON_RULES,
];

const HTML_RULES: Rule[] = [
  [/<!--[\s\S]*?-->/y, "tk-c"],
  [/<\/?[A-Za-z][\w-]*/y, "tk-t"],
  [/[A-Za-z-:]+(?==)/y, "tk-p"],
  [STRING_DQ, "tk-s"],
  [STRING_SQ, "tk-s"],
];

const CONFIG_RULES: Rule[] = [
  [/#[^\n]*/y, "tk-c"],
  [/(?<=^\s*)[A-Za-z_][\w.-]*(?=\s*[:=])/my, "tk-p"],
  [/(?<=^\s*)\[[^\]\n]+\]/my, "tk-k"],
  [STRING_DQ, "tk-s"],
  [STRING_SQ, "tk-s"],
  [NUMBER, "tk-n"],
  [/\b(?:true|false|null)\b/y, "tk-k"],
];

const LANGUAGES: Record<string, Rule[]> = {
  json: JSON_RULES,
  js: JS_RULES,
  javascript: JS_RULES,
  ts: JS_RULES,
  typescript: JS_RULES,
  tsx: JS_RULES,
  jsx: JS_RULES,
  python: PY_RULES,
  py: PY_RULES,
  php: PHP_RULES,
  bash: BASH_RULES,
  sh: BASH_RULES,
  shell: BASH_RULES,
  zsh: BASH_RULES,
  http: HTTP_RULES,
  html: HTML_RULES,
  xml: HTML_RULES,
  yaml: CONFIG_RULES,
  yml: CONFIG_RULES,
  toml: CONFIG_RULES,
};

/** Code as HTML: escaped, with token spans where the language has rules. */
export function highlight(code: string, language: string): string {
  const lang = language.toLowerCase();
  if (lang === "diff") {
    return code
      .split("\n")
      .map((line) => {
        const cls = line.startsWith("+") ? "tk-a" : line.startsWith("-") ? "tk-d" : null;
        return cls ? `<span class="${cls}">${escape(line)}</span>` : escape(line);
      })
      .join("\n");
  }
  const rules = LANGUAGES[lang];
  if (!rules) return escape(code);

  let out = "";
  let plain = "";
  let i = 0;
  const flush = () => {
    out += escape(plain);
    plain = "";
  };
  while (i < code.length) {
    let matched = false;
    for (const [pattern, cls] of rules) {
      pattern.lastIndex = i;
      const m = pattern.exec(code);
      if (!m || m[0].length === 0) continue;
      const name = typeof cls === "function" ? cls(m) : cls;
      if (name) {
        flush();
        out += `<span class="${name}">${escape(m[0])}</span>`;
      } else {
        plain += m[0];
      }
      i += m[0].length;
      matched = true;
      break;
    }
    if (!matched) plain += code[i++];
  }
  flush();
  return out;
}
