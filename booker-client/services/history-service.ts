import { EventType, HistoryEvent } from "@/app/types";

export class HistoryService {
    public static instance: HistoryService;
    historyEvents: HistoryEvent[] = [];
    createEvent: Partial<Omit<HistoryEvent, "id" | "created_at">> | null = null;
    private getHistoryApiUrl = "http://localhost:3000/history/api/get-history";
    private createHistoryApiUrl =
        "http://localhost:3000/history/api/create-history";

    public static getInstance(): HistoryService {
        if (!HistoryService.instance) {
            HistoryService.instance = new HistoryService();
        }
        return HistoryService.instance;
    }

    public createHistoryEvent(
        { eventText, eventType, groupId, trainingId, fromId, toId }: {
            eventText: string;
            eventType: EventType;
            groupId?: number;
            trainingId?: number;
            fromId?: number;
            toId?: number;
        },
    ) {
        const event = {
            event: eventText,
            event_type: eventType,
            ...(groupId &&
                { group_id: groupId }),
            ...(trainingId &&
                { training_id: trainingId }),
            ...(fromId &&
                { from_id: fromId }),
            ...(toId &&
                { to_id: toId }),
        };

        this.createEvent = event;

        return this;
    }

    public async sendHistoryEventToDB() {
        try {
            if (!this.createEvent?.event) {
                throw new Error("No event to create");
            }

            const response = await fetch(this.createHistoryApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.createEvent),
            });

            const data = await response.json();

            const { isRequestSuccessfull, data: historyEvents } = data;
            if (isRequestSuccessfull) {
                this.historyEvents = historyEvents.map(
                    (event: HistoryEvent) => {
                        const { id, ...rest } = event;
                        return rest;
                    },
                );
            }
            return this.historyEvents;
        } catch (err) {
            console.log(err);
        } finally {
            this.createEvent = null;
        }
    }

    public async getHistoryEvents(
        { group_id, training_id }: { group_id?: number; training_id?: number },
    ) {
        const response = await fetch(this.getHistoryApiUrl, {
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

export const historyService = HistoryService.getInstance();
