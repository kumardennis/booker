"use client";

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
  clubs: Club[];
};

export const TrainingsFilter = ({ clubs }: PropTypes) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const clubId = searchParams.get("club_id") || "";
  const day = searchParams.get("day") || "MONDAY";
  const groupId = searchParams.get("group_id") || "";
  const date = searchParams.get("date") || "";

  const [urlState, setUrlState] = useState<urlStateType>({
    day: day,
    club_id: clubId,
    group_id: groupId,
    date: 1,
    month: 1,
    year: 2022,
  });

  useEffect(() => {
    const today = new Date();
    const todayDate = date ? Number(date) : today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const dayOfWeek = today.getDay();

    setUrlState((prev) => ({
      ...prev,
      date: todayDate,
      month: month,
      year: year,
      day: days[dayOfWeek],
    }));
  }, []);

  const handleChange =
    (field: "day" | "date" | "month" | "year" | "club_id") =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value;

      if (field === "day") {
        setUrlState((prev) => ({
          ...prev,
          day: newValue,
          date: !newValue
            ? ""
            : getDateByDayOfWeek(
                days.indexOf(newValue),
                Number(urlState.month),
                Number(urlState.year)
              ).getDate(),
        }));
        return;
      }

      const dayIndex = new Date(
        field === "year" ? Number(newValue) : Number(urlState.year),
        field === "month" ? Number(newValue) : Number(urlState.month) - 1,
        field === "date" ? Number(newValue) : Number(urlState.date)
      ).getDay();

      setUrlState((prev) => ({
        ...prev,
        [field]: newValue,
        day: days[dayIndex],
      }));
    };

  useEffect(() => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(urlState)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    router?.push(`${currentPathname}?${params.toString()}`);
  }, [urlState]);

  return (
    <div className="trainings-filter">
      <select
        value={urlState.club_id}
        onChange={handleChange("club_id")}
        className="form-select"
      >
        {clubs.map((club) => (
          <option value={club.id}>{club.name}</option>
        ))}
      </select>

      <select
        value={urlState.day}
        onChange={handleChange("day")}
        className="form-select"
      >
        <option value={""}>Not selected</option>
        {days.map((day) => (
          <option value={day}>{day}</option>
        ))}
      </select>

      <select
        value={urlState.date}
        onChange={handleChange("date")}
        className="form-select"
      >
        <option value={""}>Not selected</option>
        {Array.from({ length: 31 }, (_, index) => (
          <option value={index + 1}>{index + 1}</option>
        ))}
      </select>

      <select
        value={urlState.month}
        onChange={handleChange("month")}
        className="form-select"
      >
        {Array.from({ length: 12 }, (_, index) => (
          <option value={index + 1}>{months[index]}</option>
        ))}
      </select>

      <select
        value={urlState.year}
        onChange={handleChange("year")}
        className="form-select"
      >
        {Array.from({ length: 10 }, (_, index) => (
          <option value={2022 + index}>{2022 + index}</option>
        ))}
      </select>
    </div>
  );
};
