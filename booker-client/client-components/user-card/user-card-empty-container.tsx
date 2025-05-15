"use client";

import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { UserCardEmpty } from "./user-card-empty";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const UserCardEmptyContainer = ({
  userIds,
  groupId,
  ...props
}: {
  userIds: number[];
  groupId: number;
}) => {
  const router = useRouter();

  const user = useUserProfileStore((state) => state.user);
  if (user?.id !== undefined && userIds.includes(user.id)) {
    return null;
  }

  const requestToJoinGroup = async () => {
    const response = await fetch(
      "http://localhost:3000/groups/api/join-group-request",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          group_id: groupId,
        }),
      }
    );

    const data = await response.json();
    if (!data.isRequestSuccessfull) {
      toast(data.error, {
        icon: "❌",
      });

      return;
    }
    toast.success("Join group request sent", {
      icon: "✅",
    });

    router.refresh();
  };

  return <UserCardEmpty requestToJoinGroup={requestToJoinGroup} {...props} />;
};
