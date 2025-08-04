"use client";

import toast from "react-hot-toast";
import { deleteJoinGroupRequest } from "../../group/actions";
import { useRouter } from "next/navigation";
import { useHistory } from "@/app/hooks/useHistory";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";

type LeaveGroupButtonProps = {
  user_uuid: string | undefined;
  groupId: string | number;
};

export const DeleteJoinGroupRequestButton = ({
  user_uuid,
  groupId,
}: LeaveGroupButtonProps) => {
  const router = useRouter();
  const { createEvent } = useHistory();
  const user = useUserProfileStore((state) => state.user);

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

      await createEvent({
        eventText: `${user?.first_name} ${user?.last_name} deleted the request to join group`,
        eventType: "GROUP_USER_JOIN_REQUEST_DELETE",
        groupId: Number(groupId),
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
