import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const { group_id, from, till } = await req.json();

    if (!confirmedRequiredParams([group_id, from, till])) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse `from` and `till` to ensure they are valid dates
    const fromDate = new Date(from.includes("T") ? from : `${from}T00:00:00Z`);
    const tillDate = new Date(till.includes("T") ? till : `${till}T00:00:00Z`);

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

    // Fetch group details to get the scheduled day of the week
    const { data: groupData, error: groupError } = await supabase
      .from("club_groups")
      .select("start_time")
      .eq("id", group_id)
      .single();

    if (!groupData || groupError) {
      return new Response(
        JSON.stringify({
          isRequestSuccessfull: false,
          data: null,
          error:
            "Group not found or an error occurred while fetching group details.",
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const { start_time } = groupData;

    // Calculate the correct starting date aligned with the group's scheduled day
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

    // Call the `refresh_trainings_with_users` database function
    const { error: rpcError } = await supabase.rpc(
      "refresh_trainings_with_users",
      {
        _group_id: group_id,
        _from_date: groupDay.toISOString(),
        _till_date: tillDate.toISOString(),
      },
    );

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
        data: "Trainings refreshed successfully.",
        error: null,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ data: (err as Error).toString() }), {
      headers: { "Content-Type": "application/json" },
    });
  }
};
