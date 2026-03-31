import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    group_id: string | undefined;
    till_date: string | undefined;
    from_date: string | undefined;
};

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        group_id,
        from_date,
        till_date,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        group_id: undefined,
        from_date: undefined,
        till_date: undefined,
    };

    body.group_id = group_id;
    body.from_date = from_date;
    body.till_date = till_date;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/trainings/create-group-trainings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": auth ?? "",
            },
            body: JSON.stringify(Object.keys(requestData).length ? body : {}),
        },
    );

    const data = await response.json();

    return Response.json(data);
}
