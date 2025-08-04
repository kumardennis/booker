import { EventType, HistoryEvent, Notice } from "@/app/types";

export class NotificationService {
    public static instance: NotificationService;
    notices: Notice[] = [];
    createdNotice: Partial<Omit<Notice, "id" | "created_at" | "user">> | null =
        null;
    private getNoticesApiUrl = "http://localhost:3000/notices/api/get-notices";
    private createNoticeApiUrl =
        "http://localhost:3000/notices/api/create-notice";

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
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

            const { isRequestSuccessfull, data: notices } = data;
            if (isRequestSuccessfull) {
                this.notices = notices.map(
                    (event: Notice) => {
                        const { id, ...rest } = event;
                        return rest;
                    },
                );
            }
            return this.notices;
        } catch (err) {
            console.log(err);
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
        const { isRequestSuccessfull, data: notices } = data;

        if (isRequestSuccessfull) {
            this.notices = notices.map((event: Notice) => {
                const { id, ...rest } = event;
                return rest;
            });
        }
        return this.notices;
    }

    public formatHistoryEventsForDisplay() {
    }

    private clearLocalHistoryList() {
        this.notices = [];
    }
}

export const notificationService = NotificationService.getInstance();
