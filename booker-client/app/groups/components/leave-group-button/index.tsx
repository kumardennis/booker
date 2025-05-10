"use client";

import toast from "react-hot-toast";
import { leaveMyGroup } from "../../group/actions";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  groupId: string | number;
};

export const LeaveGroupButton = ({
  user_uuid,
  groupId,
}: LeaveGroupButtonProps) => {
  const leaveGroup = async (
    user_uuid: string | undefined,
    group_id: number
  ) => {
    if (!user_uuid || !group_id) {
      return null;
    }
    await leaveMyGroup(user_uuid, group_id);

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
