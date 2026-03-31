import Link from "next/link";
import "./groups-by-day.styles.scss";
import cn from "classnames";
import { format, parse } from "date-fns";
import { ClubGroup } from "@/app/types";
import { days } from "@/app/const";
import { UsersCard } from "@/client-components/users-card/users-card";
import { createClient } from "@/utils/supabase/server";

export default async function GroupsByDayPage({
  searchParams,
}: {
  searchParams: Promise<{ club_id?: string; day?: string; group_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const shouldBlurUserNames = !user;

  const clubId = resolvedSearchParams.club_id;
  const day = resolvedSearchParams.day;
  const groupId = resolvedSearchParams.group_id;

  const apiQueryParams = new URLSearchParams();

  if (clubId) apiQueryParams.append("club_id", clubId);
  if (day) apiQueryParams.append("day", day);
  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const response = await fetch(`groups/api/get-club-groups?${queryString}`);

  const data = await response.json();

  const groups: ClubGroup[] = data.data ?? [];

  const selectedDay =
    resolvedSearchParams.day && days.includes(resolvedSearchParams.day)
      ? resolvedSearchParams.day
      : days[0];

  const getGroupsInDay = (day: string) =>
    groups.filter((group) => group.day.includes(day));

  const dayGroups = getGroupsInDay(selectedDay);
  const totalGroups = groups.length;

  const setNewURLSearchParams = (day: string) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(resolvedSearchParams)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    params.set("day", day);

    return params;
  };

  return (
    <div className="groups-by-day">
      <header className="groups-by-day__hero">
        <div>
          <p className="groups-by-day__eyebrow">Weekly board</p>
          <h1>Groups By Day</h1>
          <p className="groups-by-day__subtitle">
            Explore every group in one timeline and jump directly into a group.
          </p>
        </div>

        <div className="groups-by-day__stats" aria-label="groups count">
          <span>{dayGroups.length}</span>
          <small>
            {dayGroups.length === 1
              ? `Session on ${selectedDay.toLowerCase()}`
              : `Sessions on ${selectedDay.toLowerCase()}`}
          </small>
          {/* // TODO: add total groups count for the week as well, maybe as a tooltip on the right side of this block? */}
          {/* <small className="is-muted">{totalGroups} total this week</small> */}
        </div>
      </header>

      <div
        className="groups-by-day__header"
        role="tablist"
        aria-label="Pick a day"
      >
        {days.map((currentDay) => (
          <Link
            key={currentDay}
            href={`/groups/groups-by-day?${setNewURLSearchParams(currentDay)}`}
            className={cn("groups-by-day__header__day", {
              "is-active": currentDay === selectedDay,
            })}
          >
            {currentDay.toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="groups-by-day__items">
        {dayGroups.map((group) => {
          const activeUsers = group.users.filter(
            (user) => user.is_active,
          ).length;
          const occupancyLabel = `${activeUsers}/${group.max_occupancy}`;

          return (
            <UsersCard
              key={group.id}
              users={group.users}
              blurUserNames={shouldBlurUserNames}
              headerSlot={
                <div className="groups-by-day__card-title">
                  <span>
                    {format(
                      parse(group.start_time, "HH:mm:ss", new Date()),
                      "HH:mm",
                    )}
                    {" - "}
                    {format(
                      parse(group.end_time, "HH:mm:ss", new Date()),
                      "HH:mm",
                    )}
                  </span>
                  <span className="groups-by-day__card-occupancy">
                    {occupancyLabel}
                  </span>
                </div>
              }
              subHeaderSlot={
                <div className="groups-by-day__card-subtitle">
                  <span>
                    {`${group.trainers[0]?.trainer.first_name ?? "Coach"} ${group.trainers[0]?.trainer.last_name ?? ""}`.trim()}
                  </span>
                  <span className="groups-by-day__card-level">
                    Level {group.level}
                  </span>
                </div>
              }
              CTASlot={
                <Link href={`/groups/group?group_id=${group.id}`}>
                  <div className="groups-times-day__item__cta__button">
                    Check group
                  </div>
                </Link>
              }
            />
          );
        })}

        {dayGroups.length === 0 && (
          <div className="groups-by-day__empty">
            <h2>No sessions on {selectedDay.toLowerCase()} yet</h2>
            <p>
              Switch the day above to browse other available groups this week.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
