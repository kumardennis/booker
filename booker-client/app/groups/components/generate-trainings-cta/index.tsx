"use client";

import { useMemo, useState } from "react";
import { addMonths, format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type GenerateTrainingsCTAProps = {
  groupId: number;
};

const getTodayAsISODate = () => format(new Date(), "yyyy-MM-dd");

export const GenerateTrainingsCTA = ({
  groupId,
}: GenerateTrainingsCTAProps) => {
  const router = useRouter();
  const defaultFromDate = useMemo(() => getTodayAsISODate(), []);
  const defaultTillDate = useMemo(
    () => format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    [],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [tillDate, setTillDate] = useState(defaultTillDate);

  const generateTrainings = async () => {
    if (!groupId) {
      toast.error("Group is missing. Please reload the page.");
      return;
    }

    if (!fromDate || !tillDate) {
      toast.error("Please select both from and till dates.");
      return;
    }

    if (new Date(fromDate) > new Date(tillDate)) {
      toast.error("From date cannot be after till date.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        "http://localhost:3000/trainings/api/create-group-trainings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            group_id: String(groupId),
            from_date: fromDate,
            till_date: tillDate,
          }),
        },
      );

      const data = await response.json();

      if (!data?.isRequestSuccessfull) {
        toast.error(data?.error || "Could not generate trainings.");
        return;
      }

      const generatedCount = data?.data?.trainingRows?.length ?? 0;
      toast.success(
        generatedCount > 0
          ? `Generated ${generatedCount} trainings`
          : "Trainings generation completed",
      );

      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Could not generate trainings. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="group-details__generate">
      <button
        type="button"
        className="group-details__header__cta"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        Generate trainings
      </button>

      {isOpen && (
        <div className="group-details__generate-panel">
          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <label>
            Till
            <input
              type="date"
              value={tillDate}
              onChange={(event) => setTillDate(event.target.value)}
              disabled={isSubmitting}
            />
          </label>

          <div className="group-details__generate-actions">
            <button
              type="button"
              className="group-details__header__cta group-details__header__cta--upcoming"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className="group-details__header__cta"
              onClick={generateTrainings}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
