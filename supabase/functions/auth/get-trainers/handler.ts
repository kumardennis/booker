import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";

export const handler = async (req: Request) => {
  const supabase = await createSupabase(req);

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*").match({ is_trainer: true });

    const responseData = {
      isRequestSuccessfull: error === null,
      data: users,
      error,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ data: err }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
