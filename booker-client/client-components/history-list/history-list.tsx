import { format, parseISO } from "date-fns";
import "./history-list.styles.scss";

export const HistoryList = ({
  history,
}: {
  history: {
    id: number;
    created_at: Date;
    event: string;
    event_type: string;
    group_id?: number;
    training_id?: number;
  }[];
}) => {
  return history?.map((event) => (
    <div key={event.id} className="history__event">
      <div className="history__event__date">
        {format(parseISO(event.created_at.toString()), "do MMMM")}
      </div>
      <div className="history__event__day">
        {format(parseISO(event.created_at.toString()), "EEEE")} :{" "}
      </div>
      <div className="history__event__text">{event.event}</div>
    </div>
  ));
};
