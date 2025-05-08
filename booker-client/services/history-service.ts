import { HistoryEvent, HistoryEventType } from "@/app/types";

export class HistoryService {
    historyEvents: Partial<Omit<HistoryEvent, "id" | "created_at">>[] = [];
    private historyApiUrl = "http://localhost:3000/history/api/get-history";

    public createHistoryEvent(
        { eventText, eventType, groupOrTrainingId, groupOrTraining }: {
            eventText: string;
            eventType: HistoryEventType;
            groupOrTrainingId: number;
            groupOrTraining: "GROUP" | "TRAINING";
        },
    ) {
        const event = {
            event: eventText,
            event_type: eventType,
            ...(groupOrTraining === "GROUP" &&
                { group_id: groupOrTrainingId }),
            ...(groupOrTraining === "TRAINING" &&
                { training_id: groupOrTrainingId }),
        };

        this.historyEvents.push(event);
    }

    public async sendHistoryEventToDB() {
        try {
        } catch (err) {
        } finally {
            this.clearLocalHistoryList();
        }
    }

    public async getHistoryEvents(
        { group_id, training_id }: { group_id: number; training_id: number },
    ) {
        const response = await fetch(this.historyApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                group_id,
                training_id,
            }),
        });

        const data = await response.json();
        const { isRequestSuccessfull, data: historyEvents } = data;
        if (isRequestSuccessfull) {
            this.historyEvents = historyEvents.map((event: HistoryEvent) => {
                const { id, ...rest } = event;
                return rest;
            });
        }
        return this.historyEvents;
    }

    public formatHistoryEventsForDisplay() {
    }

    private clearLocalHistoryList() {
        this.historyEvents = [];
    }
}
