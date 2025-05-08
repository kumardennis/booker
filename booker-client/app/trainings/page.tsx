import { format, parse, parseISO } from "date-fns";
import { Club, GroupTraining } from "../types";
import { TrainingsFilter } from "./components/trainings-filter";
import "./trainings.styles.scss";
import { UsersCard } from "@/client-components/users-card/users-card";
import Link from "next/link";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: {
    club_id?: string;
    day?: string;
    group_id?: string;
    date?: string;
    month?: string;
    year?: string;
  };
}) {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const clubId = searchParams.club_id ?? "1";
  const day = searchParams.day ?? "MONDAY";
  const groupId = searchParams.group_id ?? "1";
  const date = searchParams.date ?? todayDate;
  const month = searchParams.month ?? todayMonth;
  const year = searchParams.year ?? todayYear;

  console.log({
    club_id: clubId,
    day,
    group_id: groupId,
    date,
    month,
    year,
  });

  const [response, responseClubs] = await Promise.all([
    fetch(`http://localhost:3000/trainings/api/get-group-trainings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        club_id: clubId,
        day,
        group_id: groupId,
        date,
        month,
        year,
      }),
      cache: "no-store",
    }),
    fetch("http://localhost:3000/clubs/api/get-clubs"),
  ]);

  const dataJSON = await responseClubs.json();

  const clubs: Club[] = dataJSON.data;

  const data = await response.json();

  const trainings: GroupTraining[] = data.data;

  return (
    <div className="group-trainings">
      <TrainingsFilter clubs={clubs} />
      <div className="group-trainings__items">
        {trainings?.map((training) => (
          <>
            <UsersCard
              users={training.users}
              headerSlot={
                <div className="groups-times-day__item__header">
                  <span className="groups-times-day__item__header__date">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "do MMM"
                    )}
                  </span>
                  <span className="groups-times-day__item__header__day">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "EEE"
                    )}
                  </span>
                </div>
              }
              subHeaderSlot={
                <div className="groups-times-day__item__subheader">
                  <span className="groups-times-day__item__subheader__time">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "HH:mm"
                    )}{" "}
                    -{" "}
                    {format(
                      parseISO(training.end_timestamp.toString()),
                      "HH:mm"
                    )}
                  </span>
                  <span>{`${training.trainers[0]?.trainer?.first_name ?? "-"} ${training.trainers[0]?.trainer?.last_name ?? "-"}`}</span>
                </div>
              }
              CTASlot={
                <Link href={`/trainings/training?training_id=${training.id}`}>
                  <div className="groups-times-day__item__cta__button">
                    Check trainings
                  </div>
                </Link>
              }
            />
          </>
        ))}
      </div>
    </div>
  );
}
