import { headers } from "next/headers";
import { type NextRequest } from "next/server";

type BodyType = {
    club_id: string | undefined;
    day: string | undefined;
    training_id: string | undefined;
    group_id: string | undefined;
    till_date: string | undefined;
    from_date: string | undefined;
};

export async function POST(request: NextRequest) {
    const requestData = request.body ? await request.json() : {};

    const {
        club_id,
        day,
        date,
        month,
        year,
        group_id,
        till_date,
        training_id,
    } = requestData;

    const headersList = await headers();
    const auth = headersList.get("Authorization");

    const body: BodyType = {
        club_id: undefined,
        day: undefined,
        training_id: undefined,
        group_id: undefined,
        till_date: undefined,
        from_date: undefined,
    };

    const dateForQuery = year && month && date && day
        ? (day && !date)
            ? `${year}-${month.toString().padStart(2, "0")}-01`
            : `${year}-${month.toString().padStart(2, "0")}-${
                date.toString().padStart(2, "0")
            }`
        : undefined;

    body.club_id = club_id;
    body.day = !date ? day : undefined;
    body.training_id = training_id;
    body.group_id = group_id;
    body.from_date = dateForQuery;
    body.till_date = till_date;

    const response = await fetch(
        "http://127.0.0.1:54321/functions/v1/trainings/get-group-trainings",
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
