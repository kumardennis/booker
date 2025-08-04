import { getUserProfile } from "@/lib/user-cache";
import { createClient } from "@/utils/supabase/server";
import { Club, ClubGroup, GroupTraining, User, UserElement } from "../types";
import { getClubGroups } from "../groups/group/actions";
import { getGroupTrainings } from "../trainings/actions";

export const getProfilePageData = async (): Promise<{
    profile: User | null;
    user_uuid: string | undefined;
    club: Club | null;
    groups: ClubGroup[];
    trainings: GroupTraining[];
}> => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    const user_uuid = user.data.user?.id;

    if (!user_uuid) {
        throw new Error("User not authenticated");
    }

    const profile = await getUserProfile(user_uuid);

    let clubUrl = `http://localhost:3000/clubs/api/get-clubs`;
    if (profile?.club_id) {
        clubUrl += `?${new URLSearchParams({
            club_id: String(profile.club_id),
        })}`;
    }

    const groupQueryParams = new URLSearchParams();

    if (profile?.id) groupQueryParams.append("user_id", profile.id.toString());
    const queryString = groupQueryParams.toString();

    const clubQuery = fetch(clubUrl);

    const [clubResponse, groupsData, trainingsData] = await Promise.all([
        clubQuery,
        getClubGroups(queryString),
        ...(profile?.id
            ? [getGroupTrainings({
                user_id: profile?.id.toString(),
            })]
            : []),
    ]);
    const clubData = await clubResponse.json();
    if (clubData.error) {
        throw new Error(`Failed to fetch club data: ${clubData.error}`);
    }

    return {
        profile,
        user_uuid,
        club: clubData.data.length > 0 ? clubData.data[0] : null,
        groups: groupsData.data,
        trainings: trainingsData,
    };
};
