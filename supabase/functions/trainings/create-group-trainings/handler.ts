import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { group_id, from_date, till_date } = await req.json();

    if (!confirmedRequiredParams([group_id, from_date, till_date])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: existsData, error: existsError } = await supabase
      .from("club_groups")
      .select("*")
      .match(
        { id: group_id },
      ).single();

    if (existsError) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: "No group found with this group_id",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    console.log("existsData", existsData);

    const {
      club_id,
      start_time,
      end_time,
      max_occupancy,
      level,
      once_in_number_of_weeks,
    } = existsData;

    const fromDate = new Date(
      from_date.includes("T") ? from_date : `${from_date}T00:00:00Z`,
    );
    const tillDate = new Date(
      till_date.includes("T") ? till_date : `${till_date}T00:00:00Z`,
    );

    if (isNaN(fromDate.getTime()) || isNaN(tillDate.getTime())) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: "Invalid date range.",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const groupDay = new Date(fromDate);
    const groupDayOfWeek = fromDate.getDay(); // Day of the week for `fromDate`
    const scheduledDayOfWeek = new Date(`1970-01-01T${start_time}`).getDay(); // Day of the week for `start_time`

    if (groupDayOfWeek <= scheduledDayOfWeek) {
      groupDay.setDate(
        fromDate.getDate() + (scheduledDayOfWeek - groupDayOfWeek),
      );
    } else {
      groupDay.setDate(
        fromDate.getDate() + (7 - (groupDayOfWeek - scheduledDayOfWeek)),
      );
    }

    const trainingRows = [];
    let currentDate = groupDay;

    while (currentDate <= tillDate) {
      const startTimestamp = new Date(
        `${currentDate.toISOString().split("T")[0]}T${start_time}`,
      );
      const endTimestamp = new Date(
        `${currentDate.toISOString().split("T")[0]}T${end_time}`,
      );

      trainingRows.push({
        group_id,
        club_id,
        start_timestamp: startTimestamp.toISOString(),
        end_timestamp: endTimestamp.toISOString(),
        max_occupancy,
        level,
      });

      currentDate.setDate(currentDate.getDate() + once_in_number_of_weeks * 7);
    }

    const { error: rpcError } = await supabase.rpc("create_trainings_batch", {
      _trainings: trainingRows,
    });

    if (rpcError) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error: rpcError.message,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Respond with success
    return new Response(
      JSON.stringify({
        isRequestSuccessfull: true,
        data: { trainingRows },
        error: null,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ data: (err as Error).toString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};
