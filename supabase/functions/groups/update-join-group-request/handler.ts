import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { user_id, group_id, is_accepted, is_rejected } = await req.json();

    if (!confirmedRequiredParams([user_id, group_id])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: requestData, error: requestError } = await supabase
      .from("join_group_requests")
      .select("id").match({
        ...(user_id && { user_id }),
        ...(group_id && { club_group_id: group_id }),
      }).single();

    const dbFunctionToCall = is_accepted
      ? "accept_join_group_request"
      : is_rejected
      ? "reject_join_group_request"
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
