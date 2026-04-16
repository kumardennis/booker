"use client";

import { ClubWithAddresses } from "@/app/clubs/get-clubs-data";
import { days, months } from "@/app/const";
import { Club } from "@/app/types";
import { getDateByDayOfWeek } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type urlStateType = {
  day: string;
  club_id: string | number;
  group_id: string | number;
  date: string | number;
  month: string | number;
  year: string | number;
};

type PropTypes = {
  clubs: ClubWithAddresses[];
};

export const TrainingsFilter = ({ clubs }: PropTypes) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const today = new Date();
  const defaultDate = today.getDate();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();

  const clubId = searchParams.get("club_id") ?? "";
  const day = searchParams.get("day") ?? "MONDAY";
  const groupId = searchParams.get("group_id") ?? "";
  const date = searchParams.get("date");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const parsedDate = date ? Number(date) : defaultDate;
  const parsedMonth = month ? Number(month) : defaultMonth;
  const parsedYear = year ? Number(year) : defaultYear;

  const [urlState, setUrlState] = useState<urlStateType>({
    day,
    club_id: clubId,
    group_id: groupId,
    date: Number.isNaN(parsedDate) ? defaultDate : parsedDate,
    month: Number.isNaN(parsedMonth) ? defaultMonth : parsedMonth,
    year: Number.isNaN(parsedYear) ? defaultYear : parsedYear,
  });

  const handleChange =
    (field: "day" | "date" | "month" | "year" | "club_id") =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;

      if (field === "day") {
        setUrlState((prev) => ({
          ...prev,
          day: newValue,
        }));
        return;
      }

      setUrlState((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    };

  useEffect(() => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(urlState)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    router?.replace(`${currentPathname}?${params.toString()}`);
  }, [currentPathname, router, urlState]);

  return (
    <div className="trainings-filter">
      <p className="trainings-filter__label">Filter Sessions</p>

      <div className="trainings-filter__controls">
        <label className="trainings-filter__field">
          <span>Club</span>
          <select
            value={urlState.club_id}
            onChange={handleChange("club_id")}
            className="form-select"
            aria-label="Select club"
          >
            <option value={""}>All clubs</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </label>

        <label className="trainings-filter__field">
          <span>Day</span>
          <select
            value={urlState.day}
            onChange={handleChange("day")}
            className="form-select"
            aria-label="Select day"
          >
            <option value={""}>Not selected</option>
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </label>

        <label className="trainings-filter__field trainings-filter__field--small">
          <span>Date</span>
          <select
            value={urlState.date}
            onChange={handleChange("date")}
            className="form-select"
            aria-label="Select date"
          >
            <option value={""}>Not selected</option>
            {Array.from({ length: 31 }, (_, index) => (
              <option key={`date-${index + 1}`} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </label>

        <label className="trainings-filter__field trainings-filter__field--small">
          <span>Month</span>
          <select
            value={urlState.month}
            onChange={handleChange("month")}
            className="form-select"
            aria-label="Select month"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={`month-${index + 1}`} value={index + 1}>
                {months[index]}
              </option>
            ))}
          </select>
        </label>

        <label className="trainings-filter__field trainings-filter__field--small">
          <span>Year</span>
          <select
            value={urlState.year}
            onChange={handleChange("year")}
            className="form-select"
            aria-label="Select year"
          >
            {Array.from({ length: 10 }, (_, index) => (
              <option key={`year-${2022 + index}`} value={2022 + index}>
                {2022 + index}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};
