import "./group.styles.scss";
import { format, parse, parseISO } from "date-fns";
import {
  ClubGroup,
  CRUDType,
  EventTypePermission,
  GroupEventType,
  HistoryEvent,
  Notice,
} from "@/app/types";
import { UserCard } from "@/client-components/user-card/user-card";
import { DetailsPageHeader } from "@/client-components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/client-components/details-page-subheader/details-page-subheader";
import { UserCardEmptyContainer } from "@/client-components/user-card/user-card-empty-container";
import { getClearanceForGroup } from "@/app/clearance/utils/actions";
import { UserCardContainer } from "@/client-components/user-card/user-card-container";
import { createClient } from "@/utils/supabase/server";
import { LeaveGroupButton } from "../components/leave-group-button";
import { deleteJoinGroupRequest, getClubGroups } from "./actions";
import toast from "react-hot-toast";
import { DeleteJoinGroupRequestButton } from "../components/delete-join-group-request-button";
import { UpdateJoinGroupRequestButton } from "../components/update-join-group-request-button";
import { getHistory } from "@/app/history/actions";
import { getPermissions } from "@/app/clearance/utils/helpers";
import { historyService } from "@/services/history-service";
import { notificationService } from "@/services/notification-service";

export default async function GroupPage({
  searchParams,
}: {
  searchParams: { group_id?: string };
}) {
  const groupId = searchParams.group_id;

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const user_uuid = user.data.user?.id;

  const apiQueryParams = new URLSearchParams();

  if (groupId) apiQueryParams.append("group_id", groupId);

  const queryString = apiQueryParams.toString();

  const [clearanceData, groupsData, historyData, noticesData] =
    await Promise.all([
      getClearanceForGroup({
        group_id: groupId,
        event_types: Object.keys(GroupEventType) as GroupEventType[],
        user_uuid,
      }),
      getClubGroups(queryString),
      historyService.getHistoryEvents({ group_id: Number(groupId) }),
      notificationService.getNotices({ group_id: Number(groupId) }),
    ]);

  const groups: ClubGroup[] = groupsData.data;
  const group: ClubGroup | undefined = groups[0];
  const history: HistoryEvent[] = historyData;
  const notices: Notice[] = noticesData;

  const canUserGenerateTraining = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_GENERATE_TRAINING,
    CRUDType.CREATE
  )?.forPeople.others;

  const updateJoinRequestClearance = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_JOIN_REQUEST,
    CRUDType.UPDATE
  );

  const canUserDeleteJoinRequest = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_JOIN_REQUEST,
    CRUDType.DELETE
  )?.forPeople.self;

  const canUserUpdateJoinRequest =
    updateJoinRequestClearance?.forPeople.others === true;

  const updateLeaveClearance = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_LEAVE,
    CRUDType.UPDATE
  );

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
        users_length={
          group?.users?.filter((user) => user.is_active).length ?? 0
        }
        history={history}
        notices={notices}
      />

      <div className="group-details__requests">
        <UserCardEmptyContainer
          userIds={[
            ...group.users?.map((user) => user.user.id),
            ...group.requests?.map((request) => request.user.id),
          ]}
          groupId={group.id}
        />
        {group.requests
          ?.filter((request) => !request.is_accepted && !request.is_rejected)
          .map((request) => (
            <UserCard
              user={request.user}
              isRequest
              extraInfoSlot={`Since ${format(
                parseISO(request.created_at.toString()),
                "do MMMM HH:mm"
              )}`}
              CTASlot={
                <>
                  {clearanceData.isRegularUser &&
                    request.user?.userId === user_uuid &&
                    canUserDeleteJoinRequest && (
                      <DeleteJoinGroupRequestButton
                        user_uuid={user_uuid}
                        groupId={group.id}
                      />
                    )}
                  {!clearanceData.isRegularUser && canUserUpdateJoinRequest && (
                    <UpdateJoinGroupRequestButton
                      studentId={request.user.id}
                      studentName={`${request.user.first_name} ${request.user.last_name}`}
                      groupId={group.id}
                    />
                  )}
                </>
              }
            />
          ))}
      </div>

      <div className="group-details__users">
        {group.users?.map((user) => (
          <UserCardContainer
            user={user.user}
            isNotActive={!user.is_active}
            CTASlot={
              user.is_active ? (
                updateLeaveClearance?.forPeople.self && (
                  <LeaveGroupButton user_uuid={user_uuid} groupId={group.id} />
                )
              ) : (
                <div className="user-cta disabled">
                  Ask club admin yourself to add you back
                </div>
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
