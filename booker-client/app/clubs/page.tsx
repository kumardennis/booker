import { jetBrainsMono } from "../fonts";
import { Club } from "../types";
import "./clubs.styles.scss";
import Link from "next/link";

export default async function ClubsPage() {
  const response = await fetch("http://localhost:3000/clubs/api/get-clubs");
  const dataJSON = await response.json();

  const clubs: Club[] = dataJSON.data;

  return (
    <div className="club-thumbnails flex-1 w-full flex flex-col gap-12">
      {clubs.map((club) => (
        <Link href={`/groups?club_id=${club.id}`} key={club.id}>
          <div className="club-thumbnail">
            <img src={club.image} alt={club.name} />
            <div className={`${jetBrainsMono.className} club-thumbnail-info`}>
              <div className="club-name">{club.name}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
