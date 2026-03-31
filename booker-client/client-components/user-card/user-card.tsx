"use client";

import { User, UserElement } from "@/app/types";
import "./user-card.styles.scss";
import cn from "classnames";
import { ReactNode } from "react";

export const UserCard = ({
  user,
  CTASlot,
  isNotActive,
  extraInfoSlot,
  isRequest = false,
  blurUserNames = false,
}: {
  user: User;
  CTASlot: ReactNode;
  isNotActive?: boolean;
  isRequest?: boolean;
  extraInfoSlot?: ReactNode | string;
  blurUserNames?: boolean;
}) => {
  const getMaskedToken = (value?: string) => {
    if (!value) {
      return "********";
    }

    const maskedLength = Math.max(6, Math.min(value.trim().length, 10));
    return "*".repeat(maskedLength);
  };

  return (
    <div
      className={cn("user-card__item", {
        "is-request": isRequest,
        "is-inactive": isNotActive,
      })}
    >
      <div className="user-card__item__user">
        <img src={user.profile_image} alt="user" />
        <span
          className={cn("user-card__item__user__name", {
            "is-blurred": blurUserNames,
          })}
        >
          {blurUserNames
            ? `${getMaskedToken(user.first_name)} ${getMaskedToken(user.last_name)}`
            : `${user.first_name} ${user.last_name}`}
        </span>
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
