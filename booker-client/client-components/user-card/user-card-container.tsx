"use client";

import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { UserCard } from "./user-card";
import { User } from "@/app/types";
import { ReactNode } from "react";

export const UserCardContainer = (props: {
  user: User;
  CTASlot: ReactNode;
  isNotActive?: boolean;
  isRequest?: boolean;
  extraInfoSlot?: ReactNode | string;
}) => {
  const user = useUserProfileStore((state) => state.user);
  if (user?.id !== undefined && props.user.id === user.id) {
    return <UserCard {...props} />;
  }

  return <UserCard {...props} CTASlot={null} />;
};
