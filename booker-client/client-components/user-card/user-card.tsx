"use client";

import { User, UserElement } from "@/app/types";
import "./user-card.styles.scss";
import cn from "classnames";
import { ReactNode } from "react";

export const UserCard = ({
  user,
  CTASlot,
  extraInfoSlot,
  isRequest = false,
}: {
  user: User;
  CTASlot: ReactNode;
  isRequest?: boolean;
  extraInfoSlot?: ReactNode | string;
}) => {
  return (
    <div className={cn("user-card__item", { "is-request": isRequest })}>
      <div className="user-card__item__user">
        <img src={user.profile_image} alt="user" />
        {`${user.first_name} ${user.last_name}`}
      </div>

      {isRequest ? (
        <div className="user-card__waiting_text">Waiting</div>
      ) : (
        <hr />
      )}

      <div className="user-card__extra-info">{extraInfoSlot}</div>

      <div className="user-card__item__cta">{CTASlot}</div>
    </div>
  );
};
