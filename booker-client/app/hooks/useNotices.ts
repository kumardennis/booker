import { noticeService } from "@/services/notice-service";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

export function useNotices() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNotice = useCallback(
        async (
            params: {
                notice: string;
                groupId?: number;
                trainingId?: number;
                userId?: number;
            },
        ) => {
            setLoading(true);
            setError(null);
            try {
                const result = await noticeService.createNotice(
                    params,
                )
                    .sendNoticeObjToDB();

                toast.success("Added to notices", {
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

    const getNotices = useCallback(
        async (
            { group_id, training_id, user_id }: {
                group_id: number;
                training_id: number;
                user_id: number;
            },
        ) => {
            setLoading(true);
            setError(null);
            try {
                const result = await noticeService.getNotices({
                    group_id,
                    training_id,
                    user_id,
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
        createNotice,
        getNotices,
        loading,
        error,
        service: noticeService,
    };
}
