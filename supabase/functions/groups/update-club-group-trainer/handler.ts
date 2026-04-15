import { corsHeaders } from "../../_shared/cors.ts";
import { createSupabase } from "../../_shared/supabaseClient.ts";
import {
    confirmedRequiredParams,
    errorResponseData,
} from "../../_shared/confirmedRequiredParams.ts";

export const handler = async (req: Request) => {
    const supabase = createSupabase(req);

    try {
        const { trainer_id, group_id } = await req.json();

        if (!confirmedRequiredParams([trainer_id, group_id])) {
            return new Response(JSON.stringify(errorResponseData), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { data: trainerGroup, error } = await supabase
            .from("trainers_groups")
            .insert({
                trainer_id: Number(trainer_id),
                club_group_id: Number(group_id),
            })
            .select("*")
            .single();

        const responseData = {
            isRequestSuccessfull: error === null,
            data: trainerGroup,
            error,
        };

        return new Response(JSON.stringify(responseData), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ data: (err as Error).toString() }),
            {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
        );
    }
};
