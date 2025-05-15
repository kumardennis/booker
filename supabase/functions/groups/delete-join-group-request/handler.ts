import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { user_id, group_id } = await req.json();

    if (!confirmedRequiredParams([user_id, group_id])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: existsData, error: existsError } = await supabase
      .from("join_group_requests")
      .delete()
      .match({
        ...(user_id && { user_id }),
        ...(group_id && { club_group_id: group_id }),
      });

    const responseData = {
      isRequestSuccessfull: existsData === null,
      data: existsData,
      error: existsError,
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
