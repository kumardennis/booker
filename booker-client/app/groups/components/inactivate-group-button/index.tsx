"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setGroupUpcomingUsersTrainingsActive } from "../../group/actions";

type InactivateGroupButtonProps = {
  groupId: number;
  canUserInactivateGroup?: boolean;
};

export const InactivateGroupButton = ({
  groupId,
  canUserInactivateGroup,
}: InactivateGroupButtonProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInactivateGroup = async () => {
    if (!groupId) {
      toast.error("Group is missing. Please reload the page.");
      return;
    }

    const isConfirmed = window.confirm(
      "Inactivate all upcoming members for this group?",
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setIsSubmitting(true);
      await setGroupUpcomingUsersTrainingsActive(groupId, false);
      toast.success("Upcoming trainings inactivated for this group.");
      router.refresh();
    } catch {
      toast.error("Could not inactivate upcoming trainings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canUserInactivateGroup) {
    return null;
  }

  return (
    <button
      type="button"
      className="group-details__header__cta group-details__header__cta--danger"
      onClick={handleInactivateGroup}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Inactivating..." : "Inactivate group"}
    </button>
  );
};
