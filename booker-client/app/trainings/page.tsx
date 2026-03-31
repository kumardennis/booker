import { format, parseISO } from "date-fns";
import { Club, GroupTraining } from "../types";
import { TrainingsFilter } from "./components/trainings-filter";
import "./trainings.styles.scss";
import { UsersCard } from "@/client-components/users-card/users-card";
import Link from "next/link";
import { getGroupTrainings } from "./actions";
import { createClient } from "@/utils/supabase/server";

export default async function TrainingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    club_id?: string;
    day?: string;
    group_id?: string;
    date?: string;
    month?: string;
    year?: string;
  }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const shouldBlurUserNames = !user;

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  const clubId = resolvedSearchParams.club_id ?? "1";
  const day = resolvedSearchParams.day ?? "MONDAY";
  const groupId = resolvedSearchParams.group_id ?? "1";
  const date = resolvedSearchParams.date ?? todayDate.toString();
  const month = resolvedSearchParams.month ?? todayMonth.toString();
  const year = resolvedSearchParams.year ?? todayYear.toString();

  const [response, responseClubs] = await Promise.all([
    getGroupTrainings({
      club_id: clubId,
      day,
      group_id: groupId,
      date,
      month,
      year,
    }),
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/clubs/api/get-clubs`),
  ]);

  const dataJSON = await responseClubs.json();

  const clubs: Club[] = dataJSON.data;

  const trainings: GroupTraining[] = response;
  const totalAttendees = trainings.reduce(
    (acc, training) =>
      acc + (training.users?.filter((member) => member.is_active).length ?? 0),
    0,
  );

  return (
    <section className="group-trainings">
      <header className="group-trainings__hero">
        <div className="group-trainings__hero-copy">
          <p className="group-trainings__eyebrow">Training Calendar</p>
          <h1 className="group-trainings__title">Trainings</h1>
          <p className="group-trainings__subtitle">
            Track upcoming sessions, occupancy, and participants across this
            club schedule.
          </p>
        </div>

        <div className="group-trainings__stats" aria-label="trainings stats">
          <div className="group-trainings__stats-item">
            <span className="group-trainings__stats-value">
              {trainings.length}
            </span>
            <span className="group-trainings__stats-label">
              {trainings.length === 1 ? "Session" : "Sessions"}
            </span>
          </div>
          <div className="group-trainings__stats-item">
            <span className="group-trainings__stats-value">
              {totalAttendees}
            </span>
            <span className="group-trainings__stats-label">
              Active attendees
            </span>
          </div>
        </div>
      </header>

      <div className="group-trainings__filter-wrap">
        <TrainingsFilter clubs={clubs} />
      </div>

      <div className="group-trainings__items">
        {trainings?.map((training) => {
          const activeMembers =
            training.users?.filter((member) => member.is_active).length ?? 0;

          return (
            <UsersCard
              key={training.id}
              users={training.users}
              blurUserNames={shouldBlurUserNames}
              headerSlot={
                <div className="groups-times-day__item__header">
                  <span className="groups-times-day__item__header__date">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "do MMM yyyy",
                    )}
                  </span>
                  <span className="groups-times-day__item__header__day">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "EEE",
                    )}
                  </span>
                  <span className="groups-times-day__item__header__occupancy">
                    {activeMembers}/{training.max_occupancy} active
                  </span>
                </div>
              }
              subHeaderSlot={
                <div className="groups-times-day__item__subheader">
                  <span className="groups-times-day__item__subheader__time">
                    {format(
                      parseISO(training.start_timestamp.toString()),
                      "HH:mm",
                    )}{" "}
                    -{" "}
                    {format(
                      parseISO(training.end_timestamp.toString()),
                      "HH:mm",
                    )}
                  </span>
                  <span>{`${training.trainers[0]?.trainer?.first_name ?? "-"} ${training.trainers[0]?.trainer?.last_name ?? "-"}`}</span>
                </div>
              }
              CTASlot={
                <Link
                  href={`/trainings/training?training_id=${training.id}&club_id=${clubId}`}
                >
                  <div className="groups-times-day__item__cta__button">
                    Open training
                  </div>
                </Link>
              }
            />
          );
        })}

        {trainings.length === 0 && (
          <div className="group-trainings__empty-state">
            <h2>No trainings found</h2>
            <p>Try changing filters to see sessions for another day or club.</p>
          </div>
        )}
      </div>
    </section>
  );
}
