import "./training.styles.scss";
import { format, parseISO } from "date-fns";
import {
  CRUDType,
  GroupEventType,
  GroupTraining,
  TrainingEventType,
} from "@/app/types";
import { UserCard } from "@/client-components/user-card/user-card";
import { DetailsPageHeader } from "@/client-components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/client-components/details-page-subheader/details-page-subheader";
import { getClearanceForTraining } from "@/app/clearance/utils/actions";
import { createClient } from "@/utils/supabase/server";
import { getPermissions } from "@/app/clearance/utils/helpers";
import { UserCardEmptyContainer } from "@/client-components/user-card/user-card-empty-container";
import { DeleteJoinTrainingRequestButton } from "./components/delete-join-training-request-button";
import { UpdateJoinTrainingRequestButton } from "./components/update-join-training-request-button";
import { UserCardContainer } from "@/client-components/user-card/user-card-container";
import { LeaveTrainingButton } from "./components/leave-training-button";
import { getTrainingsData } from "../get-trainings-data";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ training_id?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const training_id = resolvedSearchParams.training_id;

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const user_uuid = user.data.user?.id;
  const shouldBlurUserNames = !user.data.user;

  const [clearanceData, trainingData] = await Promise.all([
    getClearanceForTraining({
      training_id: training_id,
      event_types: Object.keys(TrainingEventType) as GroupEventType[],
      user_uuid,
    }),
    getTrainingsData({
      trainingId: training_id,
    }),
  ]);

  const trainings: GroupTraining[] = trainingData.data ?? [];
  const training: GroupTraining | undefined = trainings[0];

  if (!training) {
    return (
      <div className="training-details training-details--empty">
        <div className="training-details__empty-state">
          <h1 className="training-details__empty-title">Training not found</h1>
          <p className="training-details__empty-description">
            This training might have been moved or removed.
          </p>
        </div>
      </div>
    );
  }

  const pendingRequests =
    training.requests?.filter(
      (request) => !request.is_accepted && !request.is_rejected,
    ) ?? [];

  const updateJoinRequestClearance = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_JOIN_REQUEST,
    CRUDType.UPDATE,
  );

  const canUserDeleteJoinRequest = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_JOIN_REQUEST,
    CRUDType.DELETE,
  )?.forPeople.self;

  const canUserUpdateJoinRequest =
    updateJoinRequestClearance?.forPeople.others === true;

  const updateLeaveClearance = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_LEAVE,
    CRUDType.UPDATE,
  );

  const activeUsersCount =
    training.users?.filter((user) => user.is_active).length ?? 0;

  const trainingAddress = training.club_groups?.addresses?.address;

  return (
    <div className="training-details">
      <section className="training-details__top-card">
        <DetailsPageHeader
          leftRow1Node={
            <span className="training-details__header__date">
              {format(parseISO(training.start_timestamp.toString()), "do MMMM")}
            </span>
          }
          leftRow2Node={
            <span className="training-details__header__day">
              {format(parseISO(training.start_timestamp.toString()), "EEEE")}
            </span>
          }
          rightRow2Node={
            <span className="training-details__header__trainers">{`${training.trainers[0]?.trainer?.first_name ?? "-"} ${training.trainers[0]?.trainer?.last_name ?? "-"}`}</span>
          }
          rightRow1Node={
            <div className="training-details__header__time">
              {format(parseISO(training.start_timestamp.toString()), "HH:mm")} -{" "}
              {format(parseISO(training.end_timestamp.toString()), "HH:mm")}
            </div>
          }
        />

        {trainingAddress && (
          <div className="training-details__address">
            <span className="training-details__address-label">Address</span>
            <span className="training-details__address-value">
              {trainingAddress}
            </span>
          </div>
        )}

        <hr />

        <DetailsPageSubHeader
          max_occupancy={training.max_occupancy ?? 0}
          users_length={activeUsersCount}
        />
      </section>

      <section className="training-details__section">
        <div className="training-details__section-header">
          <h2>Pending requests</h2>
          <span>{pendingRequests.length}</span>
        </div>

        <div className="training-details__requests">
          <UserCardEmptyContainer
            userIds={[
              ...training.users?.map((user) => user.user.id),
              ...training.requests?.map((request) => request.user.id),
            ]}
            trainingId={training.id}
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
                      <DeleteJoinTrainingRequestButton
                        user_uuid={user_uuid}
                        trainingId={training.id}
                      />
                    )}
                  {!clearanceData.isRegularUser && canUserUpdateJoinRequest && (
                    <UpdateJoinTrainingRequestButton
                      studentId={request.user.id}
                      trainingId={training.id}
                      studentFirstName={request.user.first_name}
                      studentLastName={request.user.last_name}
                    />
                  )}
                </>
              }
            />
          ))}

          {pendingRequests.length === 0 && (
            <div className="training-details__empty-card">
              No pending requests right now.
            </div>
          )}
        </div>
      </section>

      <section className="training-details__section">
        <div className="training-details__section-header">
          <h2>Training members</h2>
          <span>{training.users?.length ?? 0}</span>
        </div>

        <div className="training-details__users">
          {training.users?.map((user) => (
            <UserCardContainer
              user={user.user}
              isNotActive={!user.is_active}
              blurUserNames={shouldBlurUserNames}
              CTASlot={
                user.is_active ? (
                  updateLeaveClearance?.forPeople.self && (
                    <LeaveTrainingButton
                      user_uuid={user_uuid}
                      trainingId={training.id}
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

          {(training.users?.length ?? 0) === 0 && (
            <div className="training-details__empty-card">
              No attendees yet. Be the first to join.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
