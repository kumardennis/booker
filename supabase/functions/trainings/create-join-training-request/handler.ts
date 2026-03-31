import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { user_id, training_id } = await req.json();

    if (!confirmedRequiredParams([user_id, training_id])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: existsData, error: existsError } = await supabase
      .from("join_training_requests")
      .select("*")
      .match({ user_id, training_id })
      .maybeSingle();

    if (existsError) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: existsError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (existsData) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: "Join training request already exists",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const { data: addedData, error: addedError } = await supabase
      .from("join_training_requests")
      .insert({
        user_id,
        training_id: training_id,
      }).select();

    const responseData = {
      isRequestSuccessfull: addedError === null,
      data: addedData,
      error: addedError,
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
