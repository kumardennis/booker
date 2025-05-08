import { HistoryEvent } from "@/app/types";
import { HistoryDrawer } from "../../../client-components/history-drawer/history-drawer";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { group_id?: string; training_id?: string };
}) {
  const training_id = (await searchParams).training_id;
  const group_id = (await searchParams).group_id;

  const response = await fetch(
    `http://localhost:3000/history/api/get-history`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(training_id && { training_id }),
        ...(group_id && { group_id }),
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  const history: HistoryEvent[] = data.data;

  console.log(history);

  return (
    <div className="history">
      FUCKKKKK
      {/* <HistoryDrawer button={undefined} children={undefined} /> */}
    </div>
  );
}
