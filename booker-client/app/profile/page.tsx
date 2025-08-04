import { getUserProfile } from "@/lib/user-cache";
import "./profile.styles.scss";
import { createClient } from "@/utils/supabase/server";
import { getProfilePageData } from "./actions";
import { format, parseISO } from "date-fns";

export default async function ProfilePage() {
  const { profile, user_uuid, club, groups, trainings } =
    await getProfilePageData();

  console.log("Profile Page Data:", {
    profile,
    user_uuid,
    club,
    groups,
    trainings,
  });
  return (
    <div className="profile">
      <div className="profile__content">
        <div className="profile__content__header">
          <img
            src={profile?.profile_image || "/default-profile.png"}
            alt="Profile Picture"
            className="profile__content__header__picture"
          />
          <span>
            {profile?.first_name} {profile?.last_name}
          </span>
        </div>
        <div className="profile__content__details">
          {profile?.is_club_admin && (
            <div className="profile__content__details__item">Club admin</div>
          )}

          {profile?.is_trainer && (
            <div className="profile__content__details__item">Trainer</div>
          )}

          {!profile?.is_club_admin && !profile?.is_trainer && (
            <div className="profile__content__details__item">Student</div>
          )}

          <div className="profile__content__details__item club-name">
            {club?.name}
          </div>

          <div className="profile__content__details__item groups">
            <h2>Groups</h2>
            {groups.map((group) => (
              <div
                key={group.id}
                className="profile__content__details__item__content"
              >
                {group.day.slice(0, 3)} | {group.start_time} - {group.end_time}
              </div>
            ))}
          </div>

          <div className="profile__content__details__item trainings">
            <h2>Trainings</h2>

            {trainings?.map((training) => (
              <div
                key={training.id}
                className="profile__content__details__item__content"
              >
                {training.club_groups.day.slice(0, 3)} |{" "}
                {format(
                  parseISO(training.start_timestamp.toString()),
                  "do MMM"
                )}{" "}
                -{" "}
                {format(
                  parseISO(training.start_timestamp.toString()),
                  "do MMM"
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
