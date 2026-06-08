import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Typed client for frontend use
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Untyped server client for API routes — avoids Supabase generic inference issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createServerSupabaseClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ) as ReturnType<typeof createClient<Database>>;
