import { format, parseISO } from "date-fns";
import "./notices-list.styles.scss";
import { Notice } from "@/app/types";

export const NoticesList = ({ notices }: { notices: Notice[] }) => {
  return notices?.map((event) => (
    <div key={event.id} className="notice__event">
      <div className="notice__event__date">
        {format(parseISO(event.created_at.toString()), "do MMMM HH:mm")}
      </div>
      <div className="notice__event__day">
        {format(parseISO(event.created_at.toString()), "EEEE")} :{" "}
      </div>
      <div className="notice__event__text">{event.notice}</div>
    </div>
  ));
};
