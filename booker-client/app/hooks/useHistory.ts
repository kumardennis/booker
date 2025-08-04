import { historyService } from "@/services/history-service";
import { useCallback, useState } from "react";
import { EventType } from "../types";
import toast from "react-hot-toast";

export function useHistory() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createEvent = useCallback(
        async (
            params: {
                eventText: string;
                eventType: EventType;
                groupId?: number;
                trainingId?: number;
                fromId?: number;
                toId?: number;
            },
        ) => {
            setLoading(true);
            setError(null);
            try {
                const result = await historyService.createHistoryEvent(params)
                    .sendHistoryEventToDB();

                toast.success("Added to history", {
                    icon: "✅",
                });
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : "Unknown error";
                setError(errorMessage);
                toast.error((err as Error).toString(), {
                    icon: "❌",
                });
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getEvents = useCallback(
        async (
            { group_id, training_id }: {
                group_id: number;
                training_id: number;
            },
        ) => {
            setLoading(true);
            setError(null);
            try {
                const result = await historyService.getHistoryEvents({
                    group_id,
                    training_id,
                });
                return result;
            } catch (err) {
                const errorMessage = err instanceof Error
                    ? err.message
                    : "Unknown error";
                setError(errorMessage);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        createEvent,
        getEvents,
        loading,
        error,
        service: historyService,
    };
}
