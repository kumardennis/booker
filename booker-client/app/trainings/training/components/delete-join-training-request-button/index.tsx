"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteJoinTrainingRequest } from "../../actions";
import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";

type LeaveTrainingButtonProps = {
  user_uuid: string | undefined;
  trainingId: string | number;
};

export const DeleteJoinTrainingRequestButton = ({
  user_uuid,
  trainingId,
}: LeaveTrainingButtonProps) => {
  const router = useRouter();
  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

  const deleteRequest = async () => {
    const data = await deleteJoinTrainingRequest(user_uuid, Number(trainingId));
    if (data.error) {
      toast.error(data.error, {
        icon: "❌",
      });
      return;
    }
    if (data.isRequestSuccessfull) {
      toast.success("Join training request deleted", {
        icon: "✅",
      });

      await createEvent({
        eventText: `${user?.first_name} ${user?.last_name} deleted the request to join training`,
        eventType: "TRAINING_USER_JOIN_REQUEST_DELETE",
        trainingId: Number(trainingId),
        fromId: user?.id,
      });

      router.refresh();
    }
  };

  return (
    <div onClick={deleteRequest} className="user-request-delete">
      Delete
    </div>
  );
};
