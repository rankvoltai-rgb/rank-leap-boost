/**
 * The mock-mode switch.
 *
 * On (VITE_MOCK_DATA=1, set in .env.development) the app makes no calls to
 * Supabase, Stripe, Firecrawl, the AI providers or Notion: auth is local to the
 * browser and every read and write goes to src/lib/mock. Off, the real
 * integrations run unchanged.
 *
 * Its own module so the auth and data facades can both read it without
 * importing each other.
 */
export const IS_MOCK = import.meta.env.VITE_MOCK_DATA === "1";
