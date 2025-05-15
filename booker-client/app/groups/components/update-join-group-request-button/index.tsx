"use client";

import toast from "react-hot-toast";
import {
  acceptJoinGroupRequest,
  deleteJoinGroupRequest,
  rejectJoinGroupRequest,
} from "../../group/actions";
import { useRouter } from "next/navigation";

type LeaveGroupButtonProps = {
  student_id: number | undefined;
  groupId: number | number;
};

export const UpdateJoinGroupRequestButton = ({
  student_id,
  groupId,
}: LeaveGroupButtonProps) => {
  const router = useRouter();

  const acceptRequest = async () => {
    const data = await acceptJoinGroupRequest(student_id, groupId);
    if (data.error) {
      toast.error(data.error, {
        icon: "❌",
      });
      return;
    }
    if (data.isRequestSuccessfull) {
      toast.success("Join group request accepted", {
        icon: "✅",
      });

      router.refresh();
    }
  };

  const rejectRequest = async () => {
    const data = await rejectJoinGroupRequest(student_id, groupId);
    if (data.error) {
      toast.error(data.error, {
        icon: "❌",
      });
      return;
    }
    if (data.isRequestSuccessfull) {
      toast.success("Join group request rejected", {
        icon: "✅",
      });

      router.refresh();
    }
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
