import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { club_id, day, group_id, user_id } = await req.json();

    if (!confirmedRequiredParams([])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: users, error } = await supabase
      .from("club_groups")
      .select(
        `*, clubs(*), addresses(*), requests:join_group_requests(id, created_at, is_accepted, is_rejected, comments, user:users(*)), users:users_groups${
          user_id ? "!inner" : ""
        }(id, is_active, user:users(*)), trainers:trainers_groups(id, trainer:users(*))`,
      )
      .match({
        ...(club_id && { club_id }),
        ...(day && { day }),
        ...(group_id && { id: group_id }),
        ...(user_id &&
          { "users_groups.user_id": user_id, "users_groups.is_active": true }),
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
