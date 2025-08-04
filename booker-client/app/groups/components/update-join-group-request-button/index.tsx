"use client";

import toast from "react-hot-toast";
import {
  acceptJoinGroupRequest,
  deleteJoinGroupRequest,
  rejectJoinGroupRequest,
} from "../../group/actions";
import { useRouter } from "next/navigation";
import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";

type LeaveGroupButtonProps = {
  studentId: number | undefined;
  studentName: string | undefined;
  groupId: number | number;
};

export const UpdateJoinGroupRequestButton = ({
  studentId,
  studentName,
  groupId,
}: LeaveGroupButtonProps) => {
  const router = useRouter();

  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

  const acceptRequest = async () => {
    const data = await acceptJoinGroupRequest(studentId, groupId);
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

      await createEvent({
        eventType: "GROUP_USER_JOIN",
        groupId: groupId,
        eventText: `Accepted join group request for ${studentName}`,
        fromId: user?.id,
        toId: studentId,
      });

      router.refresh();
    }
  };

  const rejectRequest = async () => {
    const data = await rejectJoinGroupRequest(studentId, groupId);
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
