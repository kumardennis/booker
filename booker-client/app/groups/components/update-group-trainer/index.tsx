"use client";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateGroupTrainer } from "../../group/actions";

type TrainerOption = {
  id: number;
  first_name: string | null;
  last_name: string | null;
};

type UpdateGroupTrainerProps = {
  groupId: number;
  trainers: TrainerOption[];
  currentTrainerId?: number;
  canUserUpdateTrainer?: boolean;
};

export const UpdateGroupTrainer = ({
  groupId,
  trainers,
  currentTrainerId,
  canUserUpdateTrainer,
}: UpdateGroupTrainerProps) => {
  const router = useRouter();
  const [selectedTrainerId, setSelectedTrainerId] = useState(
    currentTrainerId ? String(currentTrainerId) : String(""),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateTrainer = async (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const nextTrainerId = event.target.value;
    setSelectedTrainerId(nextTrainerId);

    const parsedTrainerId = Number(nextTrainerId);

    if (!Number.isInteger(parsedTrainerId)) {
      toast.error("Please select a valid trainer", {
        icon: "❌",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await updateGroupTrainer(parsedTrainerId, groupId);

      if (data?.error || !data?.isRequestSuccessfull) {
        toast.error(data?.error || "Could not update trainer", {
          icon: "❌",
        });
        return;
      }

      toast.success("Trainer updated", {
        icon: "✅",
      });
      router.refresh();
    } catch {
      toast.error("Could not update trainer", {
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canUserUpdateTrainer) {
    const currentTrainer = trainers.find(
      (trainer) => trainer.id === currentTrainerId,
    );
    return (
      <span className="group-details__header__trainers">
        {currentTrainer
          ? `${currentTrainer.first_name ?? ""} ${currentTrainer.last_name ?? ""}`.trim()
          : "No trainers"}
      </span>
    );
  }

  if (trainers.length === 0) {
    return <span className="group-details__header__trainers">No trainers</span>;
  }

  return (
    <label className="group-details__trainer-picker">
      <span>Trainer</span>
      <select
        value={selectedTrainerId}
        onChange={handleUpdateTrainer}
        disabled={isSubmitting}
        aria-label="Select trainer"
      >
        <option key={0} value="">
          Select a trainer
        </option>

        {trainers.map((trainer) => {
          const fullName =
            `${trainer.first_name ?? ""} ${trainer.last_name ?? ""}`.trim();

          return (
            <option key={trainer.id} value={trainer.id}>
              {fullName || `Trainer #${trainer.id}`}
            </option>
          );
        })}
      </select>
    </label>
  );
};
