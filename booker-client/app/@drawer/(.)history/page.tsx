import { Suspense } from "react";
import { HistoryDrawer } from "../../../client-components/history-drawer/history-drawer";

export default async function HistoryPage(_props: {
  searchParams: Promise<{ group_id?: string; training_id?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <HistoryDrawer />
    </Suspense>
  );
}
