import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { club_id, day, from_date, till_date, training_id } = await req
      .json();

    if (!confirmedRequiredParams([])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const query = supabase
      .from("group_trainings")
      .select(
        "*, club_groups!inner(*,  clubs(*), addresses(*)), users:users_trainings(id, marked_absent, marked_absent_timestamp, promo_code_id, user:users(*)), trainers:trainers_trainings(id, trainer:users(*))",
      )
      .match({
        ...(training_id && { id: training_id }),
        ...(club_id && { club_id }),
        ...(day && { "club_groups.day": day }),
      });

    if (from_date) query.gte("start_timestamp", from_date);
    if (till_date) query.lte("end_timestamp", till_date);

    const { data: users, error } = await query;

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
