import "./group.styles.scss";
import { format, parse, parseISO } from "date-fns";
import {
  ClubGroup,
  CRUDType,
  EventTypePermission,
  GroupEventType,
} from "@/app/types";
import { UserCard } from "@/client-components/user-card/user-card";
import { DetailsPageHeader } from "@/client-components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/client-components/details-page-subheader/details-page-subheader";
import { UserCardEmptyContainer } from "@/client-components/user-card/user-card-empty-container";
import { getClearanceForGroup } from "@/app/clearance/utils/actions";
import { UserCardContainer } from "@/client-components/user-card/user-card-container";
import { createClient } from "@/utils/supabase/server";
import { LeaveGroupButton } from "../components/leave-group-button";
import { deleteJoinGroupRequest } from "./actions";
import toast from "react-hot-toast";
import { DeleteJoinGroupRequestButton } from "../components/delete-join-group-request-button";
import { UpdateJoinGroupRequestButton } from "../components/update-join-group-request-button";
import { getPermissions } from "@/app/clearance/utils/helpers";
import Link from "next/link";
import { GenerateTrainingsCTA } from "../components/generate-trainings-cta";
import { getGroupsData } from "../get-groups-data";

export default async function GroupPage({
  searchParams,
}: {
  searchParams: Promise<{ group_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const groupId = resolvedSearchParams.group_id;

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const shouldBlurUserNames = !user.data.user;
  const user_uuid = user.data.user?.id;

  const [clearanceData, groupsData] = await Promise.all([
    getClearanceForGroup({
      group_id: groupId,
      event_types: Object.keys(GroupEventType) as GroupEventType[],
      user_uuid,
    }),
    getGroupsData({
      groupId,
      userId: user_uuid,
    }),
  ]);

  const groups: ClubGroup[] = groupsData.data ?? [];
  const group: ClubGroup | undefined = groups[0];

  const canUserGenerateTraining = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_GENERATE_TRAINING,
    CRUDType.CREATE,
  )?.forPeople.others;

  const updateJoinRequestClearance = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_JOIN_REQUEST,
    CRUDType.UPDATE,
  );

  const canUserDeleteJoinRequest = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_JOIN_REQUEST,
    CRUDType.DELETE,
  )?.forPeople.self;

  const canUserUpdateJoinRequest =
    updateJoinRequestClearance?.forPeople.others === true;

  const updateLeaveClearance = getPermissions(
    clearanceData.eventsPermissions,
    GroupEventType.GROUP_USER_LEAVE,
    CRUDType.UPDATE,
  );

  if (!group) {
    return (
      <div className="group-details group-details--empty">
        <h1>Group not found</h1>
        <p>
          We could not find this group. Try opening it from the groups list.
        </p>
      </div>
    );
  }

  const pendingRequests =
    group.requests?.filter(
      (request) => !request.is_accepted && !request.is_rejected,
    ) ?? [];

  const activeUsersCount =
    group.users?.filter((user) => user.is_active).length ?? 0;

  const upcomingTrainingsParams = new URLSearchParams({
    group_id: String(group.id),
  });

  if (group.club_id) {
    upcomingTrainingsParams.set("club_id", String(group.club_id));
  }

  const upcomingTrainingsHref = `/trainings?${upcomingTrainingsParams.toString()}`;

  return (
    <div className="group-details">
      <div className="group-details__top-card">
        <DetailsPageHeader
          leftRow1Node={
            <span className="group-details__header__day">{group.day}</span>
          }
          leftRow2Node={
            <span className="group-details__header__time">
              {format(parse(group.start_time, "HH:mm:ss", new Date()), "HH:mm")}{" "}
              - {format(parse(group.end_time, "HH:mm:ss", new Date()), "HH:mm")}
            </span>
          }
          rightRow2Node={
            <span className="group-details__header__trainers">{`${group.trainers[0].trainer.first_name} ${group.trainers[0].trainer.last_name}`}</span>
          }
          rightRow1Node={
            <div className="group-details__header__cta-row">
              <Link
                href={upcomingTrainingsHref}
                className="group-details__header__cta group-details__header__cta--upcoming"
              >
                Upcoming trainings
              </Link>
              {canUserGenerateTraining && (
                <GenerateTrainingsCTA groupId={group.id} />
              )}
            </div>
          }
        />

        <hr />

        <DetailsPageSubHeader
          max_occupancy={group.max_occupancy ?? 0}
          users_length={activeUsersCount}
        />
      </div>

      <section className="group-details__section">
        <div className="group-details__section-header">
          <h2>Pending requests</h2>
          <span>{pendingRequests.length}</span>
        </div>

        <div className="group-details__requests">
          <UserCardEmptyContainer
            userIds={[
              ...group.users?.map((user) => user.user.id),
              ...group.requests?.map((request) => request.user.id),
            ]}
            groupId={group.id}
          />
          {pendingRequests.map((request) => (
            <UserCard
              user={request.user}
              isRequest
              blurUserNames={shouldBlurUserNames}
              extraInfoSlot={`Since ${format(
                parseISO(request.created_at.toString()),
                "do MMMM HH:mm",
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
          {pendingRequests.length === 0 && (
            <div className="group-details__empty-card">
              No pending requests right now.
            </div>
          )}
        </div>
      </section>

      <section className="group-details__section">
        <div className="group-details__section-header">
          <h2>Group members</h2>
          <span>{group.users?.length ?? 0}</span>
        </div>

        <div className="group-details__users">
          {group.users?.map((user) => (
            <UserCardContainer
              user={user.user}
              isNotActive={!user.is_active}
              blurUserNames={shouldBlurUserNames}
              CTASlot={
                user.is_active ? (
                  updateLeaveClearance?.forPeople.self && (
                    <LeaveGroupButton
                      user_uuid={user_uuid}
                      groupId={group.id}
                    />
                  )
                ) : (
                  <div className="user-cta disabled">
                    Ask club admin yourself to add you back
                  </div>
                )
              }
            />
          ))}
          {(group.users?.length ?? 0) === 0 && (
            <div className="group-details__empty-card">
              No members have joined this group yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
