import Link from "next/link";
import "./groups-by-day.styles.scss";
import cn from "classnames";
import { format, parse } from "date-fns";
import { ClubGroup } from "@/app/types";
import { days } from "@/app/const";
import { UsersCard } from "@/components/users-card/users-card";

export default async function GroupsPage({
  searchParams,
}: {
  searchParams: { club_id?: string; day?: string; group_id?: string };
}) {
  const clubId = searchParams.club_id;
  const day = searchParams.day;
  const groupId = searchParams.group_id;

  const apiQueryParams = new URLSearchParams();

  if (clubId) apiQueryParams.append("club_id", clubId);
  if (day) apiQueryParams.append("day", day);
  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const response = await fetch(
    `http://localhost:3000/groups/api/get-club-groups?${queryString}`
  );

  const data = await response.json();

  const groups: ClubGroup[] = data.data;

  const getGroupsInDay = (day: string) =>
    groups.filter((group) => group.day.includes(day));

  const setNewURLSearchParams = (day: string) => {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }

    params.set("day", day);

    return params;
  };

  return (
    <div className="groups-by-day">
      <div className="groups-by-day__header">
        {days.map((day) => (
          <Link href={`/groups/groups-by-day?${setNewURLSearchParams(day)}`}>
            <div
              className={cn("groups-by-day__header__day", {
                "is-active": day === searchParams.day,
              })}
            >
              {day.toLowerCase()}
            </div>
          </Link>
        ))}
      </div>
      <div className="groups-by-day__items">
        {getGroupsInDay(searchParams.day || "").map((group) => (
          <>
            <UsersCard
              users={group.users}
              headerSlot={
                <span>
                  {format(
                    parse(group.start_time, "HH:mm:ss", new Date()),
                    "HH:mm"
                  )}{" "}
                  -{" "}
                  {format(
                    parse(group.end_time, "HH:mm:ss", new Date()),
                    "HH:mm"
                  )}
                </span>
              }
              subHeaderSlot={`${group.trainers[0].trainer.first_name} ${group.trainers[0].trainer.last_name}`}
              CTASlot={
                <Link
                  href={`/groups/group-details?${apiQueryParams}&group_id=${group.id}`}
                >
                  <div className="groups-times-day__item__cta__button">
                    Check group
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
