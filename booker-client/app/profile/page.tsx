import "./profile.styles.scss";
import { getProfilePageData } from "./actions";
import { format, parseISO } from "date-fns";

export default async function ProfilePage() {
  const { profile, club, groups = [], trainings = [] } = await getProfilePageData();

  const roleBadges: string[] = [];
  if (profile?.is_club_admin) roleBadges.push("Club admin");
  if (profile?.is_trainer) roleBadges.push("Trainer");
  if (roleBadges.length === 0) roleBadges.push("Student");

  const totalGroups = groups.length;
  const totalTrainings = trainings.length;

  const displayName = `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim();
  return (
    <div className="profile">
      <div className="profile__content">
        <section className="profile__hero">
          <img
            src={profile?.profile_image || "/default-profile.png"}
            alt="Profile picture"
            className="profile__hero__picture"
          />

          <div className="profile__hero__copy">
            <p className="profile__eyebrow">Profile overview</p>
            <h1>{displayName || "Unnamed user"}</h1>
            <p className="profile__club-name">{club?.name || "No club assigned"}</p>

            <div className="profile__role-badges">
              {roleBadges.map((badge) => (
                <span key={badge} className="profile__badge">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="profile__stats">
            <div className="profile__stat-card">
              <span className="profile__stat-label">Groups</span>
              <span className="profile__stat-value">{totalGroups}</span>
            </div>
            <div className="profile__stat-card">
              <span className="profile__stat-label">Trainings</span>
              <span className="profile__stat-value">{totalTrainings}</span>
            </div>
          </div>
        </section>

        <section className="profile__details-grid">
          <article className="profile__panel">
            <div className="profile__panel__header">
              <h2>Groups</h2>
              <span className="profile__panel__count">{totalGroups}</span>
            </div>

            {totalGroups === 0 && <p className="profile__empty">No groups yet.</p>}

            {groups.map((group) => (
              <div key={group.id} className="profile__row">
                <span className="profile__row__left">{group.day.slice(0, 3)}</span>
                <span className="profile__row__right">
                  {group.start_time} - {group.end_time}
                </span>
              </div>
            ))}
          </article>

          <article className="profile__panel">
            <div className="profile__panel__header">
              <h2>Trainings</h2>
              <span className="profile__panel__count">{totalTrainings}</span>
            </div>

            {totalTrainings === 0 && (
              <p className="profile__empty">No trainings yet.</p>
            )}

            {trainings.map((training) => (
              <div key={training.id} className="profile__row">
                <span className="profile__row__left">
                  {training.club_groups.day.slice(0, 3)}
                </span>
                <span className="profile__row__right">
                  {format(parseISO(training.start_timestamp.toString()), "do MMM")} |{" "}
                  {training.club_groups.start_time} - {training.club_groups.end_time}
                </span>
              </div>
            ))}
          </article>
        </section>
      </div>
    </div>
  );
}
