import Link from "next/link";
import "./training.styles.scss";
import { format, parse, parseISO } from "date-fns";
import { GroupTraining } from "@/app/types";
import { UserCard } from "@/components/user-card/user-card";
import { DetailsPageHeader } from "@/components/details-page-header/details-page-header";
import { DetailsPageSubHeader } from "@/components/details-page-subheader/details-page-subheader";

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: { training_id?: string };
}) {
  const training_id = searchParams.training_id;

  const apiQueryParams = new URLSearchParams();

  if (training_id) apiQueryParams.append("training_id", training_id);

  const response = await fetch(
    `http://localhost:3000/trainings/api/get-group-trainings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        training_id,
      }),
      cache: "no-store",
    }
  );

  const data = await response.json();

  const trainings: GroupTraining[] = data.data;

  const training: GroupTraining | undefined = trainings[0];

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
      />

      <div className="training-details__users">
        {training.users?.map((user) => (
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
