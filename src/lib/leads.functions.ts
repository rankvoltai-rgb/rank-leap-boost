import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadInput = z.object({
  email: z.string().trim().email().max(255),
  name: z.string().trim().max(120).optional(),
  role: z.string().trim().max(300).optional(),
  tool: z.string().trim().max(120).optional(),
});

export const captureToolLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => LeadInput.parse(d))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("tool_leads").upsert(
      {
        email: data.email.toLowerCase(),
        name: data.name ?? null,
        role: data.role ?? null,
        tool: data.tool ?? null,
      },
      { onConflict: "email" },
    );
    if (error) {
      throw new Error("Couldn't save your email. Please try again.");
    }
    return { ok: true };
  });
