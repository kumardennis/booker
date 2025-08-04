"use client";

import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import toast from "react-hot-toast";
import { leaveMyTraining } from "../../actions";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  trainingId: string | number;
};

export const LeaveTrainingButton = ({
  user_uuid,
  trainingId,
}: LeaveGroupButtonProps) => {
  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

  const leaveTraining = async (
    user_uuid: string | undefined,
    training_id: number
  ) => {
    if (!user_uuid || !training_id) {
      return null;
    }
    await leaveMyTraining(user_uuid, training_id);

    await createEvent({
      eventText: `${user?.first_name} ${user?.last_name} left the training`,
      eventType: "TRAINING_USER_LEAVE",
      trainingId: training_id,
      fromId: user?.id,
    });

    toast.success("You left the training!");
  };

  return (
    <button
      onClick={() => leaveTraining(user_uuid, Number(trainingId))}
      className="user-cta"
    >
      Leave
    </button>
  );
};
