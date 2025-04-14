import "./details-page-subheader.styles.scss";
import cn from "classnames";

type DetailsPageSubHeaderProps = {
  max_occupancy: number;
  users_length: number;
};

export const DetailsPageSubHeader: React.FC<DetailsPageSubHeaderProps> = ({
  max_occupancy,
  users_length,
}) => {
  return (
    <div className="details-page__subheader">
      <div className="details-page__stats">
        <div className="details-page__stats__maximum">
          <span className="maximum field">Maximum</span>
          <span className="maximum value">{max_occupancy}</span>
        </div>

        <div className="details-page__stats__attending">
          <span className={cn("attending field")}>Attending</span>
          <span
            className={cn("attending value", {
              "is-full": max_occupancy === users_length,
            })}
          >
            {users_length ?? "-"}
          </span>
        </div>

        <div className="details-page__stats__empty-spots">
          <span className="empty-spots field">Empty Spots</span>
          <span
            className={cn("empty-spots value", {
              "is-almost-full": max_occupancy - users_length < 3,
            })}
          >
            {max_occupancy - users_length}
          </span>
        </div>
      </div>

      <div className="details-page__history__notices">
        <div className="history">History</div>
        <div className="notices">Notice Board</div>
      </div>
    </div>
  );
};
