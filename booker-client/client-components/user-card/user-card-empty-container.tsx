"use client";

import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { UserCardEmpty } from "./user-card-empty";

export const UserCardEmptyContainer = ({
  userIds,
  ...props
}: {
  userIds: number[];
}) => {
  const user = useUserProfileStore((state) => state.user);
  if (user?.id !== undefined && userIds.includes(user.id)) {
    return null;
  }

  return <UserCardEmpty {...props} />;
};
