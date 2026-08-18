import { environment } from "@/configs/environment";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreateClientOptions = {
  isAdmin?: boolean;
};

export async function createClient({
  isAdmin = false,
}: CreateClientOptions = {}) {
  const cookiStore = await cookies();
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    environment;
  return createServerClient(
    SUPABASE_URL!,
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY! : SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookiStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookiStore.set(name, value, options),
            );
          } catch {
            console.error("Error setting cookies", cookiesToSet);
          }
        },
      },
    },
  );
}
