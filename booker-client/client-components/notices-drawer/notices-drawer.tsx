"use client";

import { Notice } from "@/app/types";
import { noticeService } from "@/services/notice-service";
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
import "./notices-drawer.styles.scss";
import { NoticesList } from "../notices-list/notices-list";

export const NoticesDrawer = () => {
  const searchParams = useSearchParams();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedGroupId = Number(searchParams.get("group_id"));
  const parsedTrainingId = Number(searchParams.get("training_id"));
  const groupId = Number.isFinite(parsedGroupId) ? parsedGroupId : undefined;
  const trainingId = Number.isFinite(parsedTrainingId)
    ? parsedTrainingId
    : undefined;

  const loadNotices = useCallback(async () => {
    if (hasLoaded || isLoading) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const fetchedNotices = await noticeService.getNotices({
      group_id: groupId,
      training_id: trainingId,
      });

      setNotices(fetchedNotices);
      setHasLoaded(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not load notices.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [groupId, hasLoaded, isLoading, trainingId]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open) {
      await loadNotices();
    }
  };

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger>
        <div className="notices">Notices</div>
      </DrawerTrigger>
      <DrawerContent className="history-drawer__content">
        <DrawerHeader className="history-drawer__content__header">
          <DrawerTitle>Notices</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription>
          {isLoading ? (
            <div className="drawer-state">Loading notices...</div>
          ) : errorMessage ? (
            <div className="drawer-state drawer-state--error">{errorMessage}</div>
          ) : notices.length === 0 ? (
            <div className="drawer-state">No notices yet.</div>
          ) : (
            <NoticesList notices={notices} />
          )}
        </DrawerDescription>

        <DrawerFooter>
          <DrawerClose></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
