import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { club_id, day, fromDate, tillDate } = await req.json();

    if (!confirmedRequiredParams([])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: users, error } = await supabase
      .from("group_trainings")
      .select(
        "*, club_groups!inner(*,  clubs(*), addresses(*)), users:users_trainings(id, user:users(*)), trainers:trainers_trainings(id, trainer:users(*))",
      )
      .match({
        ...(club_id && { club_id }),
        ...(day && { "club_groups.day": day }),
      }).gte("start_timestamp", fromDate).lte("end_timestamp", tillDate);
    544444444444444;

    const responseData = {
      isRequestSuccessfull: error === null,
      data: users,
      error,
    };

    return new Response(JSON.stringify(responseData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ data: err.toString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
