import "./history.styles.scss";
import { format, parseISO } from "date-fns";
import { HistoryEvent } from "@/app/types";
import { HistoryList } from "../../client-components/history-list/history-list";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { group_id?: string; training_id?: string };
}) {
  const training_id = searchParams.training_id;
  const group_id = searchParams.group_id;

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

  return (
    <div className="history">
      <HistoryList history={history} />
    </div>
  );
}
