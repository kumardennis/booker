import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { getGroupsData } from "../../get-groups-data";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const club_id = searchParams.get("club_id") ?? undefined;
    const day = searchParams.get("day") ?? undefined;
    const group_id = searchParams.get("group_id") ?? undefined;
    const user_id = searchParams.get("user_id") ?? undefined;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const data = await getGroupsData({
        clubId: club_id,
        day,
        groupId: group_id,
        userId: user_id,
        authorization: auth,
    });

    return Response.json(data);
}
