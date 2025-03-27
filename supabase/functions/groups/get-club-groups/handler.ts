import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { club_id, day, group_id } = await req.json();

    if (!confirmedRequiredParams([])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: users, error } = await supabase
      .from("club_groups")
      .select(
        "*, clubs(*), addresses(*), users:users_groups(id, user:users(*)), trainers:trainers_groups(id, trainer:users(*))",
      )
      .match({
        ...(club_id && { club_id }),
        ...(day && { day }),
        ...(group_id && { id: group_id }),
      });

    const responseData = {
      isRequestSuccessfull: error === null,
      data: users,
      error,
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
