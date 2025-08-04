"use client";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";
import { acceptJoinTrainingRequest } from "../../actions";
import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";

type PropTypes = {
  studentId: number | undefined;
  trainingId: number | number;
};

export const UpdateJoinTrainingRequestButton = ({
  studentId,
  trainingId,
}: PropTypes) => {
  const router = useRouter();
  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

  const acceptRequest = async () => {
    const data = await acceptJoinTrainingRequest(studentId, trainingId);
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

      await createEvent({
        eventText: `${user?.first_name} ${user?.last_name} deleted the request to join training`,
        eventType: "TRAINING_USER_JOIN",
        trainingId: Number(trainingId),
        fromId: user?.id,
        toId: studentId,
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
