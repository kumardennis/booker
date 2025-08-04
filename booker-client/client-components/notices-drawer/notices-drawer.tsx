"use client";

import { Notice } from "@/app/types";
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

export const NoticesDrawer = ({ notices }: { notices: Notice[] }) => {
  return (
    <>
      <Drawer direction="bottom">
        <DrawerTrigger>
          <div className="notices">Notices</div>
        </DrawerTrigger>
        <DrawerContent className="history-drawer__content">
          <DrawerHeader className="history-drawer__content__header">
            <DrawerTitle>Notices</DrawerTitle>
          </DrawerHeader>
          <DrawerDescription>
            <NoticesList notices={notices} />
          </DrawerDescription>

          <DrawerFooter>
            <DrawerClose></DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
