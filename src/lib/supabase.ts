import { createClient } from "@supabase/supabase-js";

// ponytail: singleton — env not available at build time, defer to first call
let _client: ReturnType<typeof createClient> | undefined;

export const getSupabase = () =>
  (_client ??= createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
