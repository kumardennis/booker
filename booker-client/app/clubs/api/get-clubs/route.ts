import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { getClubsData } from "../../get-clubs-data";

export async function GET(request: NextRequest) {
    const clubId = request.nextUrl.searchParams.get("club_id") ?? undefined;

    const headersList = await headers();
    const authorization = headersList.get("Authorization");

    try {
        const data = await getClubsData({
            clubId,
            authorization,
        });

        return Response.json(data);
    } catch (error) {
        return Response.json(
            {
                isRequestSuccessfull: false,
                data: [],
                error,
            },
            { status: 500 },
        );
    }
}
