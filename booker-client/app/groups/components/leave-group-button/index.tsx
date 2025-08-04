"use client";

import toast from "react-hot-toast";
import { leaveMyGroup } from "../../group/actions";
import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  groupId: string | number;
};

export const LeaveGroupButton = ({
  user_uuid,
  groupId,
}: LeaveGroupButtonProps) => {
  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

  const leaveGroup = async (
    user_uuid: string | undefined,
    group_id: number
  ) => {
    if (!user_uuid || !group_id) {
      return null;
    }
    await leaveMyGroup(user_uuid, group_id);

    await createEvent({
      eventText: `${user?.first_name} ${user?.last_name} left the group`,
      eventType: "GROUP_USER_LEAVE",
      groupId: group_id,
      fromId: user?.id,
    });

    toast.success("You left the group!");
  };

  return (
    <button
      onClick={() => leaveGroup(user_uuid, Number(groupId))}
      className="user-cta"
    >
      Leave
    </button>
  );
};
