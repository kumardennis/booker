"use client";

import toast from "react-hot-toast";
import { deleteJoinGroupRequest } from "../../group/actions";
import { useRouter } from "next/navigation";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  groupId: string | number;
};

export const DeleteJoinGroupRequestButton = ({
  user_uuid,
  groupId,
}: LeaveGroupButtonProps) => {
  const router = useRouter();
  const deleteRequest = async () => {
    const data = await deleteJoinGroupRequest(user_uuid, Number(groupId));
    if (data.error) {
      toast.error(data.error, {
        icon: "❌",
      });
      return;
    }
    if (data.isRequestSuccessfull) {
      toast.success("Join group request deleted", {
        icon: "✅",
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
