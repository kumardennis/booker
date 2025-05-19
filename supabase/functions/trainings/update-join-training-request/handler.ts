import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { user_id, training_id, is_accepted, is_rejected } = await req.json();

    if (!confirmedRequiredParams([user_id, training_id])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: requestData, error: requestError } = await supabase
      .from("join_training_requests")
      .select("id").match({
        ...(user_id && { user_id }),
        ...(training_id && { training_id: training_id }),
      }).single();

    const dbFunctionToCall = is_accepted
      ? "accept_join_training_request"
      : is_rejected
      ? "reject_join_training_request"
      : null;

    if (!dbFunctionToCall) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: "No action specified",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { data: dbData, error: dbError } = await supabase.rpc(
      dbFunctionToCall,
      {
        request_id: requestData.id,
      },
    );

    const responseData = {
      isRequestSuccessfull: dbError === null,
      data: dbData,
      error: dbError,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ data: (err as Error).toString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
