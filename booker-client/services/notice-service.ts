import { EventType, HistoryEvent, Notice } from "@/app/types";

const resolveRequestSuccess = (data: Record<string, unknown>) =>
    Boolean(data.isRequestSuccessful ?? data.isRequestSuccessfull);

const resolveErrorMessage = (
    data: Record<string, unknown>,
    fallback: string,
) => {
    const error = data.error;

    if (typeof error === "string") {
        return error;
    }

    if (error && typeof error === "object" && "message" in error) {
        const message = error.message;

        if (typeof message === "string") {
            return message;
        }
    }

    return fallback;
};

export class NoticeService {
    public static instance: NoticeService;
    notices: Notice[] = [];
    createdNotice: Partial<Omit<Notice, "id" | "created_at" | "user">> | null =
        null;
    private getNoticesApiUrl = "/notices/api/get-notices";
    private createNoticeApiUrl = "/notices/api/create-notice";

    public static getInstance(): NoticeService {
        if (!NoticeService.instance) {
            NoticeService.instance = new NoticeService();
        }
        return NoticeService.instance;
    }

    public createNotice(
        { notice, groupId, trainingId, userId }: {
            notice: string;
            groupId?: number;
            trainingId?: number;
            userId?: number;
        },
    ) {
        const noticeObj = {
            notice,
            ...(groupId &&
                { group_id: groupId }),
            ...(trainingId &&
                { training_id: trainingId }),
            ...(userId &&
                { user_id: userId }),
        };

        this.createdNotice = noticeObj;

        return this;
    }

    public async sendNoticeObjToDB() {
        try {
            if (!this.createdNotice?.notice) {
                throw new Error("No notice to create");
            }

            const response = await fetch(this.createNoticeApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.createdNotice),
            });

            const data = await response.json();

            if (!response.ok || !resolveRequestSuccess(data)) {
                throw new Error(
                    resolveErrorMessage(data, "Could not create notice."),
                );
            }

            this.notices = Array.isArray(data.data)
                ? data.data as Notice[]
                : [];

            return this.notices;
        } finally {
            this.createdNotice = null;
        }
    }

    public async getNotices(
        { group_id, training_id, user_id }: {
            group_id?: number;
            training_id?: number;
            user_id?: number;
        },
    ) {
        const response = await fetch(this.getNoticesApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                group_id,
                training_id,
                user_id,
            }),
        });

        const data = await response.json();
        if (!response.ok || !resolveRequestSuccess(data)) {
            throw new Error(
                resolveErrorMessage(data, "Could not load notices."),
            );
        }

        this.notices = Array.isArray(data.data) ? data.data as Notice[] : [];

        return this.notices;
    }

    public formatHistoryEventsForDisplay() {
    }

    private clearLocalHistoryList() {
        this.notices = [];
    }
}

export const noticeService = NoticeService.getInstance();
