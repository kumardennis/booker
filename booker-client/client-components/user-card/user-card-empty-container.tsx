"use client";

import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { UserCardEmpty } from "./user-card-empty";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const UserCardEmptyContainer = ({
  userIds,
  groupId,
  trainingId,
  ...props
}: {
  userIds: number[];
  groupId?: number;
  trainingId?: number;
}) => {
  const router = useRouter();

  const user = useUserProfileStore((state) => state.user);
  if (user?.id !== undefined && userIds.includes(user.id)) {
    return null;
  }

  const urlToCall = trainingId
    ? "http://localhost:3000/trainings/api/join-training-request"
    : groupId
      ? "http://localhost:3000/groups/api/join-group-request"
      : null;

  const requestToJoin = async () => {
    if (!urlToCall) {
      throw new Error("No url to call");
    }
    const response = await fetch(urlToCall, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user?.id,
        ...(groupId && { group_id: groupId }),
        ...(trainingId && { training_id: trainingId }),
      }),
    });

    const data = await response.json();
    if (!data.isRequestSuccessfull) {
      toast(data.error, {
        icon: "❌",
      });

      return;
    }
    toast.success("Join request sent", {
      icon: "✅",
    });

    router.refresh();
  };

  return <UserCardEmpty requestToJoin={requestToJoin} {...props} />;
};
