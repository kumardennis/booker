import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";
import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { group_id, training_id, from_id, to_id, event, event_type } =
      await req.json();

    if (!confirmedRequiredParams([event, event_type])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: users, error } = await supabase
      .from("history_events").insert({
        event,
        event_type,
        ...(group_id && { group_id }),
        ...(training_id && { training_id }),
        ...(from_id && { from_id }),
        ...(to_id && { to_id }),
      }).select("*");

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
