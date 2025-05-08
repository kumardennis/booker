import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { group_id, training_id } = await req.json();

    if (!confirmedRequiredParams([group_id])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: users, error } = await supabase
      .from("history_events")
      .select("*").match({ group_id, ...(training_id && { training_id }) });

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
