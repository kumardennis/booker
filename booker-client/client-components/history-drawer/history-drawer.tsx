"use client";

import { HistoryEvent } from "@/app/types";
import { historyService } from "@/services/history-service";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { HistoryList } from "../history-list/history-list";
import "./history-drawer.styles.scss";

export const HistoryDrawer = () => {
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedGroupId = searchParams.get("group_id");
  const parsedTrainingId = searchParams.get("training_id");
  const groupId = parsedGroupId ? Number(parsedGroupId) : undefined;
  const trainingId = parsedTrainingId ? Number(parsedTrainingId) : undefined;

  const loadHistory = useCallback(async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const historyEvents = await historyService.getHistoryEvents({
        group_id: groupId,
        training_id: trainingId,
      });

      setHistory(historyEvents);
      setHasLoaded(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load history.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [groupId, isLoading, trainingId]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open) {
      await loadHistory();
    }
  };

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger>
        <div className="history">History</div>
      </DrawerTrigger>
      <DrawerContent className="history-drawer__content">
        <DrawerHeader className="history-drawer__content__header">
          <DrawerTitle>History</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>
          {isLoading ? (
            <div className="drawer-state">Loading history...</div>
          ) : errorMessage ? (
            <div className="drawer-state drawer-state--error">
              {errorMessage}
            </div>
          ) : history.length === 0 ? (
            <div className="drawer-state">No history yet.</div>
          ) : (
            <HistoryList history={history} />
          )}
        </DrawerDescription>

        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
