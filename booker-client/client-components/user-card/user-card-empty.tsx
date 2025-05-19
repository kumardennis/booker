import { User, UserElement } from "@/app/types";
import "./user-card.styles.scss";
import cn from "classnames";
import { ReactNode } from "react";

export const UserCardEmpty = ({
  requestToJoin,
}: {
  requestToJoin: () => Promise<void>;
}) => {
  const joinRequest = async () => {
    requestToJoin();
  };
  return (
    <div className={cn("user-card__item empty")}>
      <div className="user-card__item__user">
        <img
          src={"https://cdn-icons-png.flaticon.com/512/992/992651.png"}
          alt="user"
        />
      </div>

      <div className="get-in-waiting-list">
        <button onClick={joinRequest}>Get in Waitinglist!</button>
      </div>
    </div>
  );
};
