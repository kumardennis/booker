import { jetBrainsMono } from "../fonts";
import { Club } from "../types";
import "./clubs.styles.scss";
import Link from "next/link";
import { headers } from "next/headers";
import { getClubsData } from "./get-clubs-data";

export const dynamic = "force-dynamic";

export default async function ClubsPage() {
  const headersList = await headers();
  const authorization = headersList.get("Authorization");

  let clubs: Club[] = [];

  try {
    const dataJSON = await getClubsData({ authorization });
    clubs = Array.isArray(dataJSON.data) ? dataJSON.data : [];
  } catch {
    clubs = [];
  }

  return (
    <section className="clubs-page flex-1 w-full flex flex-col gap-10">
      <header className="clubs-hero">
        <div className="clubs-hero-copy">
          <p className="clubs-eyebrow">Find Your Community</p>
          <h1 className={`${jetBrainsMono.className} clubs-title`}>
            Explore Clubs
          </h1>
          <p className="clubs-subtitle">
            Browse active clubs and jump into groups that match your training
            style.
          </p>
        </div>
        <div className="clubs-count" aria-label="total clubs">
          <span className={`${jetBrainsMono.className} clubs-count-value`}>
            {clubs.length}
          </span>
          <span className="clubs-count-label">
            {clubs.length === 1 ? "Club live" : "Clubs live"}
          </span>
        </div>
      </header>

      <div className="club-grid">
        {clubs.map((club) => (
          <Link
            href={`/groups?club_id=${club.id}`}
            key={club.id}
            className="club-link"
          >
            <article className="club-thumbnail">
              <div className="club-media">
                <img src={club.image} alt={club.name} loading="lazy" />
              </div>
              <div className="club-thumbnail-info">
                <p className="club-label">Club #{club.id}</p>
                <div className={`${jetBrainsMono.className} club-name`}>
                  {club.name}
                </div>
                <div className="club-meta">
                  <span className="club-cta">View Groups</span>
                  <span className="club-arrow" aria-hidden="true">
                    ↗
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}

        {clubs.length === 0 && (
          <div className="empty-state">
            <h2 className={`${jetBrainsMono.className} empty-title`}>
              No clubs yet
            </h2>
            <p className="empty-description">Check back soon for new clubs.</p>
          </div>
        )}
      </div>
    </section>
  );
}
