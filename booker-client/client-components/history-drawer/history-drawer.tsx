"use client";

import { HistoryEvent } from "@/app/types";
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

export const HistoryDrawer = ({ history }: { history: HistoryEvent[] }) => {
  return (
    <>
      <Drawer direction="bottom">
        <DrawerTrigger>
          <div className="history">History</div>
        </DrawerTrigger>
        <DrawerContent className="history-drawer__content">
          <DrawerHeader className="history-drawer__content__header">
            <DrawerTitle>History</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription>
            <HistoryList history={history} />
          </DrawerDescription>

          <DrawerFooter>
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
