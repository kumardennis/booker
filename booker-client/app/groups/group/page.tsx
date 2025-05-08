import "./group.styles.scss";
import { format, parse, parseISO } from "date-fns";
import {
  ClubGroup,
  CRUDType,
  EventTypePermission,
  GroupEventType,
  HistoryEvent,
} from "@/app/types";
import { UserCard } from "@/client-components/user-card/user-card";
import { DetailsPageHeader } from "@/client-components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/client-components/details-page-subheader/details-page-subheader";
import { UserCardEmptyContainer } from "@/client-components/user-card/user-card-empty-container";
import { getClearance } from "@/app/clearance/utils/actions";
import { UserCardContainer } from "@/client-components/user-card/user-card-container";

export default async function GroupPage({
  searchParams,
}: {
  searchParams: { group_id?: string };
}) {
  const groupId = searchParams.group_id;

  const apiQueryParams = new URLSearchParams();

  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const [clearanceResponse, groupsDataResponse, historyResponse] =
    await Promise.all([
      getClearance({
        group_id: groupId,
        event_types: Object.keys(GroupEventType) as GroupEventType[],
      }),
      fetch(`http://localhost:3000/groups/api/get-club-groups?${queryString}`),
      fetch(`http://localhost:3000/history/api/get-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(groupId && { group_id: groupId }),
        }),
        cache: "no-store",
      }),
    ]);

  const [clearanceData, groupsData, historyData] = await Promise.all([
    clearanceResponse.json(),
    groupsDataResponse.json(),
    historyResponse.json(),
  ]);

  const groups: ClubGroup[] = groupsData.data;
  const group: ClubGroup | undefined = groups[0];
  const history: HistoryEvent[] = historyData.data;

  const canUserGenerateTraining =
    clearanceData.eventsPermissions
      ?.find(
        (event: EventTypePermission) =>
          event.event_type === GroupEventType.GROUP_GENERATE_TRAINING
      )
      ?.crudAllowed.includes(CRUDType.CREATE) ?? false;

  const canUserUpdateJoinRequest =
    clearanceData.eventsPermissions
      ?.find(
        (event: EventTypePermission) =>
          event.event_type === GroupEventType.GROUP_USER_JOIN_REQUEST
      )
      ?.crudAllowed.includes(CRUDType.UPDATE) ?? false;

  const canUserUpdateLeave =
    clearanceData.eventsPermissions
      ?.find(
        (event: EventTypePermission) =>
          event.event_type === GroupEventType.GROUP_USER_LEAVE
      )
      ?.crudAllowed.includes(CRUDType.UPDATE) ?? false;

  console.log(clearanceData);

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
          canUserGenerateTraining && (
            <div className="group-details__header__cta">Generate trainings</div>
          )
        }
      />

      <hr />

      <DetailsPageSubHeader
        max_occupancy={group?.max_occupancy ?? 0}
        users_length={group?.users?.length ?? 0}
        history={history}
      />

      <div className="group-details__requests">
        <UserCardEmptyContainer
          userIds={[
            ...group.users?.map((user) => user.user.id),
            ...group.requests?.map((request) => request.user.id),
          ]}
        />
        {group.requests?.map((request) => (
          <UserCard
            user={request.user}
            isRequest
            extraInfoSlot={`Since ${format(
              parseISO(request.created_at.toString()),
              "do MMMM HH:mm"
            )}`}
            CTASlot={
              canUserUpdateJoinRequest && (
                <>
                  <div className="user-request-accept">Accept</div>{" "}
                  <div className="user-request-reject">Reject</div>
                </>
              )
            }
          />
        ))}
      </div>

      <div className="group-details__users">
        {group.users?.map((user) => (
          <UserCardContainer
            user={user.user}
            CTASlot={
              canUserUpdateLeave && (
                <>
                  <div className="user-cta">Leave</div>
                </>
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
