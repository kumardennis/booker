import { CreateNotificationType, Notification } from "@/app/types";

export class NotificationService {
    public static instance: NotificationService;
    notifications: Notification[] = [];
    createdNotifications: CreateNotificationType[] = [];
    private getApiUrl =
        "http://localhost:3000/notifications/api/get-notifications";
    private createApiUrl =
        "http://localhost:3000/notifications/api/create-notification";
    private sendApiUrl =
        "http://localhost:3000/notifications/api/send-notifications";

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    public createNotification(
        notification: Omit<CreateNotificationType, "user_id">,
        user_ids: number[],
    ) {
        for (const user_id of user_ids) {
            const notificationObj: CreateNotificationType = {
                ...notification,
                user_id,
            };
            this.createdNotifications.push(notificationObj);
        }
    }

    public async saveNotification() {
        if (this.createdNotifications.length === 0) {
            throw new Error("No notifications to save");
        }

        return fetch(this.createApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.createdNotifications),
        });
    }

    public async sendNotification() {
        if (this.createdNotifications.length === 0) {
            throw new Error("No notifications to send");
        }

        await fetch(this.sendApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ notifications: this.createdNotifications }),
        });
    }

    public async getNotifications() {
        return this.notifications;
    }
}

export const notificationService = NotificationService.getInstance();
