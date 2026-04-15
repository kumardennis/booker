import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { club_id } = await req.json();

    const { data: addresses, error } = await supabase
      .from("addresses")
      .select("*")
      .match({ ...(club_id && { club_id }) });

    const responseData = {
      isRequestSuccessfull: error === null,
      data: addresses,
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