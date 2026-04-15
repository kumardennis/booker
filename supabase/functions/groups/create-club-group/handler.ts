import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
  confirmedRequiredParams,
  errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
  const supabase = createSupabase(req);

  try {
    const {
      club_id,
      address_id,
      max_occupancy,
      once_in_number_of_weeks,
      day,
      start_time,
      end_time,
    } = await req.json();

    if (
      !confirmedRequiredParams([
        club_id,
        address_id,
        max_occupancy,
        once_in_number_of_weeks,
        day,
        start_time,
        end_time,
      ])
    ) {
      return new Response(JSON.stringify(errorResponseData), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: group, error } = await supabase
      .from("club_groups")
      .insert({
        club_id: Number(club_id),
        address_id: Number(address_id),
        max_occupancy: Number(max_occupancy),
        once_in_number_of_weeks: Number(once_in_number_of_weeks),
        day,
        start_time,
        end_time,
      })
      .select("*")
      .single();

    const responseData = {
      isRequestSuccessfull: error === null,
      data: group,
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