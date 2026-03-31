import Link from "next/link";
import { Club, ClubGroup } from "../types";
import "./groups.styles.scss";
import cn from "classnames";
import { format, parse } from "date-fns";
import { days } from "../const";
import { jetBrainsMono } from "../fonts";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: Promise<{ club_id?: string; day?: string; group_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const normalizeSearchParam = (value?: string) => {
    if (!value) return undefined;
    const trimmedValue = value.trim();
    return trimmedValue.length > 0 ? trimmedValue : undefined;
  };

  const clubId = normalizeSearchParam(resolvedSearchParams.club_id);
  const groupId = normalizeSearchParam(resolvedSearchParams.group_id);

  const clubsResponse = await fetch(`/clubs/api/get-clubs`);
  const clubsData = await clubsResponse.json();
  const clubs: Club[] = clubsData.data ?? [];

  const selectedClubId = clubId ?? String(clubs[0]?.id ?? "");

  const apiQueryParams = new URLSearchParams();

  if (selectedClubId) apiQueryParams.append("club_id", selectedClubId);
  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const response = await fetch(` /groups/api/get-club-groups?${queryString}`);
  const data = await response.json();

  const groups: ClubGroup[] = data.data ?? [];

  const getGroupsInDay = (day: string) =>
    groups?.filter((group) => group.day.includes(day)) ?? [];

  const totalGroups = groups?.length ?? 0;

  return (
    <section className="groups-page flex-1 w-full flex flex-col gap-6">
      <header className="groups-hero">
        <div className="groups-hero__copy">
          <p className="groups-hero__eyebrow">Weekly schedule</p>
          <h1 className={`${jetBrainsMono.className} groups-hero__title`}>
            Explore Groups
          </h1>
          <p className="groups-hero__subtitle">
            Discover training groups by day and check which slots still have
            open spots.
          </p>
        </div>
        <div className="groups-hero__stats" aria-label="total groups">
          <span className={`${jetBrainsMono.className} groups-hero__value`}>
            {totalGroups}
          </span>
          <span className="groups-hero__label">
            {totalGroups === 1 ? "Group live" : "Groups live"}
          </span>
        </div>
      </header>

      <form className="groups-filter" method="GET" action="/groups">
        <label htmlFor="club_id" className="groups-filter__label">
          Club
        </label>
        <select
          id="club_id"
          name="club_id"
          className="groups-filter__select"
          defaultValue={selectedClubId}
        >
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </select>
        <button type="submit" className="groups-filter__apply">
          Apply
        </button>
      </form>

      <div className="groups-times-aggregator">
        {days.map((day) => (
          <article className="groups-times-aggregator__item" key={day}>
            <div className="groups-times-aggregator__item__title">
              <div className="groups-times-aggregator__item__title__day">
                {day.slice(0, 3)}
              </div>
              <div className="groups-times-aggregator__item__title__groups">
                {`${getGroupsInDay(day).length} Groups`}
              </div>
            </div>
            <div className="groups-times-aggregator__item__content">
              {getGroupsInDay(day).map((group) => (
                <div
                  key={`${group.id}-${group.start_time}`}
                  className={cn(
                    "groups-times-aggregator__item__content__time",
                    {
                      "is-vacant": group.users.length < group.max_occupancy,
                    },
                  )}
                >
                  <span className="time-range">
                    {format(
                      parse(group.start_time, "HH:mm:ss", new Date()),
                      "HH:mm",
                    )}{" "}
                    -{" "}
                    {format(
                      parse(group.end_time, "HH:mm:ss", new Date()),
                      "HH:mm",
                    )}
                  </span>
                  <span className="time-capacity">
                    {group.users.length}/{group.max_occupancy}
                  </span>
                </div>
              ))}

              {getGroupsInDay(day).length === 0 && (
                <div className="groups-times-aggregator__item__content__empty">
                  No sessions on this day.
                </div>
              )}
            </div>

            <div className="groups-times-aggregator__item__cta">
              <Link href={`/groups/groups-by-day?${apiQueryParams}&day=${day}`}>
                <div className="groups-times-aggregator__item__cta__button">
                  Check groups
                </div>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
