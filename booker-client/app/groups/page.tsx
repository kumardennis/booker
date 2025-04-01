import Link from "next/link";
import { ClubGroup } from "../types";
import "./groups.styles.scss";
import cn from "classnames";
import { format, parse } from "date-fns";
import { days } from "../const";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: { club_id?: string; day?: string; group_id?: string };
}) {
  const clubId = searchParams.club_id;
  const groupId = searchParams.group_id;

  const apiQueryParams = new URLSearchParams();

  if (clubId) apiQueryParams.append("club_id", clubId);
  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const response = await fetch(
    `http://localhost:3000/groups/api/get-club-groups?${queryString}`
  );
  const data = await response.json();

  const groups: ClubGroup[] = data.data;

  const getGroupsInDay = (day: string) =>
    groups.filter((group) => group.day.includes(day));

  return (
    <div className="groups-times-aggregator">
      {days.map((day) => (
        <div className="groups-times-aggregator__item">
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
                className={cn("groups-times-aggregator__item__content__time", {
                  "is-vacant": group.users.length < group.max_occupancy,
                })}
              >
                {format(
                  parse(group.start_time, "HH:mm:ss", new Date()),
                  "HH:mm"
                )}{" "}
                -{" "}
                {format(parse(group.end_time, "HH:mm:ss", new Date()), "HH:mm")}
              </div>
            ))}
          </div>

          <div className="groups-times-aggregator__item__cta">
            <Link href={`/groups/groups-by-day?${apiQueryParams}&day=${day}`}>
              <div className="groups-times-aggregator__item__cta__button">
                Check groups
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
