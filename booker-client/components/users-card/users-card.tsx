import { UserElement } from "@/app/types";
import "./users-card.styles.scss";
import { format, parse } from "date-fns";
import { ReactNode } from "react";

export const UsersCard = ({
  users,
  headerSlot,
  subHeaderSlot,
  CTASlot,
}: {
  users: UserElement[];
  headerSlot: ReactNode;
  subHeaderSlot: ReactNode;
  CTASlot: ReactNode;
}) => {
  return (
    <div className="users-card__item">
      <div className="users-card__item__title">{headerSlot}</div>
      <hr />
      <div className="users-card__item__subtitle">{subHeaderSlot}</div>

      <div className="users-card__item__users">
        {users.map((user) => (
          <div className="users-card__item__users__user">
            <img src={user.user.profile_image} alt="user" />
            {`${user.user.first_name} ${user.user.last_name}`}
          </div>
        ))}
      </div>

      <div className="users-card__item__cta">{CTASlot}</div>
    </div>
  );
};
