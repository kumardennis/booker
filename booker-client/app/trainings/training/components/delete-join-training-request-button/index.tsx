"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type LeaveTrainingButtonProps = {
  user_uuid: string | undefined;
  trainingId: string | number;
};

export const DeleteJoinTrainingRequestButton = ({
  user_uuid,
  trainingId,
}: LeaveTrainingButtonProps) => {
  const router = useRouter();
  const deleteRequest = async () => {
    // const data = await deleteJoinTraining(user_uuid, Number(trainingId));
    // if (data.error) {
    //   toast.error(data.error, {
    //     icon: "❌",
    //   });
    //   return;
    // }
    // if (data.isRequestSuccessfull) {
    //   toast.success("Join group request deleted", {
    //     icon: "✅",
    //   });
    //   router.refresh();
    // }
  };

  return (
    <div onClick={deleteRequest} className="user-request-delete">
      Delete
    </div>
  );
};
