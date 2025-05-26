"use client";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { acceptJoinTrainingRequest } from "../../actions";

type PropTypes = {
  student_id: number | undefined;
  trainingId: number | number;
};

export const UpdateJoinTrainingRequestButton = ({
  student_id,
  trainingId,
}: PropTypes) => {
  const router = useRouter();

  const acceptRequest = async () => {
    const data = await acceptJoinTrainingRequest(student_id, trainingId);
    if (data.error) {
      toast.error(data.error, {
        icon: "❌",
      });
      return;
    }
    if (data.isRequestSuccessfull) {
      toast.success("Join training request accepted", {
        icon: "✅",
      });
      router.refresh();
    }
  };

  const rejectRequest = async () => {
    // const data = await rejectJoinGroupRequest(student_id, groupId);
    // if (data.error) {
    //   toast.error(data.error, {
    //     icon: "❌",
    //   });
    //   return;
    // }
    // if (data.isRequestSuccessfull) {
    //   toast.success("Join group request rejected", {
    //     icon: "✅",
    //   });
    //   router.refresh();
    // }
  };

  return (
    <>
      <div onClick={acceptRequest} className="user-request-accept">
        Accept
      </div>
      <div onClick={rejectRequest} className="user-request-reject">
        Reject
      </div>
    </>
  );
};
