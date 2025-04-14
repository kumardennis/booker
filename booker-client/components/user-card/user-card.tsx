import { UserElement } from "@/app/types";
import "./user-card.styles.scss";
import { format, parse } from "date-fns";
import { ReactNode } from "react";

export const UserCard = ({
  user,
  CTASlot,
}: {
  user: UserElement;
  CTASlot: ReactNode;
}) => {
  return (
    <div className="user-card__item">
      <div className="user-card__item__user">
        <img src={user.user.profile_image} alt="user" />
        {`${user.user.first_name} ${user.user.last_name}`}
      </div>

      <hr />

      <div className="user-card__item__cta">{CTASlot}</div>
    </div>
  );
};
