"use client";

import toast from "react-hot-toast";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  trainingId: string | number;
};

export const LeaveTrainingButton = ({
  user_uuid,
  trainingId,
}: LeaveGroupButtonProps) => {
  const leaveGroup = async (
    user_uuid: string | undefined,
    group_id: number
  ) => {
    // if (!user_uuid || !group_id) {
    //   return null;
    // }
    // await leaveMyGroup(user_uuid, group_id);
    // toast.success("You left the group!");
  };

  return (
    <button
      onClick={() => leaveGroup(user_uuid, Number(trainingId))}
      className="user-cta"
    >
      Leave
    </button>
  );
};
