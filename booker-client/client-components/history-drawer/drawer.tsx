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

export const HistoryDrawer = ({ history }: { history: HistoryEvent[] }) => {
  return (
    <>
      <Drawer>
        <DrawerTrigger>
          <div className="history">History</div>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>History</DrawerTitle>
            <DrawerDescription>
              <HistoryList history={history} />
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
