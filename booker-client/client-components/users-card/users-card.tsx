import { UserElement } from "@/app/types";
import "./users-card.styles.scss";
import cn from "classnames";
import { ReactNode } from "react";

export const UsersCard = ({
  users,
  headerSlot,
  subHeaderSlot,
  CTASlot,
  blurUserNames = false,
}: {
  users: UserElement[];
  headerSlot: ReactNode;
  subHeaderSlot: ReactNode;
  CTASlot: ReactNode;
  blurUserNames?: boolean;
}) => {
  const getMaskedToken = (value?: string) => {
    if (!value) {
      return "********";
    }

    // Keep masking length bounded so actual name length is not obvious.
    const maskedLength = Math.max(6, Math.min(value.trim().length, 10));
    return "*".repeat(maskedLength);
  };

  return (
    <div className="users-card__item">
      <div className="users-card__item__title">{headerSlot}</div>
      <hr />
      <div className="users-card__item__subtitle">{subHeaderSlot}</div>

      <div className="users-card__item__users">
        {users.map((user) => (
          <div
            key={user.user.id}
            className={cn("users-card__item__users__user", {
              "is-inactive": !user.is_active,
            })}
          >
            <img src={user.user.profile_image} alt="user" />
            <span
              className={cn("users-card__item__users__user__name", {
                "is-blurred": blurUserNames,
              })}
            >
              {blurUserNames
                ? `${getMaskedToken(user.user.first_name)} ${getMaskedToken(user.user.last_name)}`
                : `${user.user.first_name} ${user.user.last_name}`}
            </span>
          </div>
        ))}
      </div>

      <div className="users-card__item__cta">{CTASlot}</div>
    </div>
  );
};
