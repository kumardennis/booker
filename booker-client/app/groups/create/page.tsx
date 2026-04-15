import Link from "next/link";
import { days } from "@/app/const";
import { FormMessage, Message } from "@/components/form-message";
import { headers } from "next/headers";
import {
  getClubsData,
  type ClubWithAddresses,
} from "@/app/clubs/get-clubs-data";
import type { Database } from "../../../../database.types";
import { createGroupAction } from "./actions";
import "./create-group.styles.scss";

type SearchParams = {
  club_id?: string;
  success?: string;
  error?: string;
};

type ClubOption = Pick<
  Database["public"]["Tables"]["clubs"]["Row"],
  "id" | "name"
>;

type AddressOption = Pick<
  Database["public"]["Tables"]["addresses"]["Row"],
  "id" | "name" | "address" | "club_id"
>;

export default async function CreateGroupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const headersList = await headers();
  const authorization = headersList.get("Authorization");

  const clubsResponse = await getClubsData({ authorization });
  const clubsData = clubsResponse.data;

  const clubs: ClubWithAddresses[] = Array.isArray(clubsData) ? clubsData : [];

  const selectedClubId =
    resolvedSearchParams.club_id &&
    resolvedSearchParams.club_id.trim().length > 0
      ? resolvedSearchParams.club_id
      : String(clubs[0]?.id ?? "");

  const selectedClubIdAsNumber = Number(selectedClubId);

  const selectedClub = Number.isInteger(selectedClubIdAsNumber)
    ? clubs.find((club) => club.id === selectedClubIdAsNumber)
    : undefined;

  const addresses: AddressOption[] = Array.isArray(selectedClub?.addresses)
    ? selectedClub.addresses
    : [];

  const defaultAddressId = String(addresses[0]?.id ?? "");

  const message: Message = {
    success: resolvedSearchParams.success,
    error: resolvedSearchParams.error,
  };

  return (
    <section className="create-group-page">
      <header className="create-group-page__header">
        <div>
          <p className="create-group-page__eyebrow">Groups</p>
          <h1>Create a new group</h1>
          <p className="create-group-page__subtitle">
            Set up a new weekly group schedule. Permissions will be added later.
          </p>
        </div>
        <Link className="create-group-page__back-link" href="/groups">
          Back to groups
        </Link>
      </header>

      <form action={createGroupAction} className="create-group-form">
        <div className="create-group-form__field">
          <label htmlFor="club_id">Club</label>
          <select id="club_id" name="club_id" defaultValue={selectedClubId}>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
          <p className="create-group-form__hint">
            Changing club updates available addresses after submit/reload.
          </p>
        </div>

        <div className="create-group-form__field">
          <label htmlFor="address_id">Address</label>
          <select
            id="address_id"
            name="address_id"
            defaultValue={defaultAddressId}
            required
          >
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {address.name} - {address.address}
              </option>
            ))}
          </select>
        </div>

        <div className="create-group-form__grid">
          <div className="create-group-form__field">
            <label htmlFor="day">Day</label>
            <select id="day" name="day" defaultValue={days[0]} required>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="create-group-form__field">
            <label htmlFor="max_occupancy">Max occupancy</label>
            <input
              id="max_occupancy"
              name="max_occupancy"
              type="number"
              min={1}
              defaultValue={12}
              required
            />
          </div>

          <div className="create-group-form__field">
            <label htmlFor="once_in_number_of_weeks">
              Repeat every N weeks
            </label>
            <input
              id="once_in_number_of_weeks"
              name="once_in_number_of_weeks"
              type="number"
              min={1}
              defaultValue={1}
              required
            />
          </div>
        </div>

        <div className="create-group-form__grid">
          <div className="create-group-form__field">
            <label htmlFor="start_time">Start time</label>
            <input id="start_time" name="start_time" type="time" required />
          </div>

          <div className="create-group-form__field">
            <label htmlFor="end_time">End time</label>
            <input id="end_time" name="end_time" type="time" required />
          </div>
        </div>

        <FormMessage message={message} />

        <div className="create-group-form__actions">
          <Link href="/groups" className="create-group-form__cancel">
            Cancel
          </Link>
          <button type="submit" className="create-group-form__submit">
            Create group
          </button>
        </div>
      </form>
    </section>
  );
}
