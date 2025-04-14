import Link from "next/link";
import "./group.styles.scss";
import { format, parse } from "date-fns";
import { ClubGroup } from "@/app/types";
import cn from "classnames";
import { UserCard } from "@/components/user-card/user-card";
import { DetailsPageHeader } from "@/components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/components/details-page-subheader/details-page-subheader";

export default async function GroupPage({
  searchParams,
}: {
  searchParams: { group_id?: string };
}) {
  const groupId = searchParams.group_id;

  const apiQueryParams = new URLSearchParams();

  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const response = await fetch(
    `http://localhost:3000/groups/api/get-club-groups?${queryString}`
  );
  const data = await response.json();

  const groups: ClubGroup[] = data.data;

  const group: ClubGroup | undefined = groups[0];

  return (
    <div className="group-details">
      <DetailsPageHeader
        leftRow1Node={
          <span className="group-details__header__day">{group?.day}</span>
        }
        leftRow2Node={
          <span className="group-details__header__time">
            {format(parse(group.start_time, "HH:mm:ss", new Date()), "HH:mm")} -{" "}
            {format(parse(group.end_time, "HH:mm:ss", new Date()), "HH:mm")}
          </span>
        }
        rightRow2Node={
          <span className="group-details__header__trainers">{`${group.trainers[0].trainer.first_name} ${group.trainers[0].trainer.last_name}`}</span>
        }
        rightRow1Node={
          <div className="group-details__header__cta">Generate trainings</div>
        }
      />

      <hr />

      <DetailsPageSubHeader
        max_occupancy={group?.max_occupancy ?? 0}
        users_length={group?.users?.length ?? 0}
      />

      <div className="group-details__users">
        {group.users?.map((user) => (
          <UserCard
            user={user}
            CTASlot={
              <>
                <div className="user-cta">CTA</div>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
}
