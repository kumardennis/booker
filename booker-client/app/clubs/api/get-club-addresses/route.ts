import { headers } from "next/headers";
import { type NextRequest } from "next/server";
import { getAddressesData } from "../../get-addresses-data";

export async function GET(request: NextRequest) {
    const clubId = request.nextUrl.searchParams.get("club_id") ?? undefined;

    const headersList = await headers();
    const authorization = headersList.get("Authorization");

    try {
        const data = await getAddressesData({
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