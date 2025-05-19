import Link from "next/link";
import "./training.styles.scss";
import { format, parse, parseISO } from "date-fns";
import {
  CRUDType,
  GroupEventType,
  GroupTraining,
  HistoryEvent,
  TrainingEventType,
} from "@/app/types";
import { UserCard } from "@/client-components/user-card/user-card";
import { DetailsPageHeader } from "@/client-components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/client-components/details-page-subheader/details-page-subheader";
import { getClearanceForTraining } from "@/app/clearance/utils/actions";
import { getHistory } from "@/app/history/actions";
import { getTrainings } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { getPermissions } from "@/app/clearance/utils/helpers";
import { UserCardEmptyContainer } from "@/client-components/user-card/user-card-empty-container";
import { DeleteJoinGroupRequestButton } from "@/app/groups/components/delete-join-group-request-button";
import { UpdateJoinGroupRequestButton } from "@/app/groups/components/update-join-group-request-button";
import { DeleteJoinTrainingRequestButton } from "./components/delete-join-training-request-button";
import { UpdateJoinTrainingRequestButton } from "./components/update-join-training-request-button";
import { UserCardContainer } from "@/client-components/user-card/user-card-container";
import { LeaveTrainingButton } from "./components/leave-training-button";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: { training_id?: string };
}) {
  const training_id = searchParams.training_id;

  const apiQueryParams = new URLSearchParams();

  if (training_id) apiQueryParams.append("training_id", training_id);

  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  const user_uuid = user.data.user?.id;

  const [clearanceData, trainingData, historyData] = await Promise.all([
    getClearanceForTraining({
      training_id: training_id,
      event_types: Object.keys(GroupEventType) as GroupEventType[],
      user_uuid,
    }),
    getTrainings(Number(training_id)),
    getHistory(Number(training_id)),
  ]);

  const trainings: GroupTraining[] = trainingData.data;
  const training: GroupTraining | undefined = trainings[0];
  const history: HistoryEvent[] = historyData.data;

  const updateJoinRequestClearance = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_JOIN_REQUEST,
    CRUDType.UPDATE
  );

  const canUserDeleteJoinRequest = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_JOIN_REQUEST,
    CRUDType.DELETE
  )?.forPeople.self;

  const canUserUpdateJoinRequest =
    updateJoinRequestClearance?.forPeople.others === true;

  const updateLeaveClearance = getPermissions(
    clearanceData.eventsPermissions,
    TrainingEventType.TRAINING_USER_LEAVE,
    CRUDType.UPDATE
  );

  console.log("clearanceData", clearanceData);
  console.log("historyData", historyData);
  console.log("trainingData", trainingData);

  return (
    <div className="training-details">
      <DetailsPageHeader
        leftRow1Node={
          <span className="training-details__header__date">
            {format(
              parseISO(training.start_timestamp.toString()),
              "do MMMM"
            )}{" "}
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

      <hr />

      <DetailsPageSubHeader
        max_occupancy={training?.max_occupancy ?? 0}
        users_length={training?.users?.length ?? 0}
        history={history}
      />

      <div className="training-details__requests">
        <UserCardEmptyContainer
          userIds={[
            ...training.users?.map((user) => user.user.id),
            ...training.requests?.map((request) => request.user.id),
          ]}
          trainingId={training.id}
        />
        {training.requests
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
                  {clearanceData.isRegularUser && canUserDeleteJoinRequest && (
                    <DeleteJoinTrainingRequestButton
                      user_uuid={user_uuid}
                      trainingId={training.id}
                    />
                  )}
                  {!clearanceData.isRegularUser && canUserUpdateJoinRequest && (
                    <UpdateJoinTrainingRequestButton
                      student_id={request.user.id}
                      trainingId={training.id}
                    />
                  )}
                </>
              }
            />
          ))}
      </div>

      <div className="training-details__users">
        {training.users?.map((user) => (
          <UserCardContainer
            user={user.user}
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
      </div>
    </div>
  );
}
