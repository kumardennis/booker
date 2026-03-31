import { notificationService } from "@/services/notification-service";
import { useState } from "react";
import { Notification } from "../types";
import { CreateNotificationType } from "../types";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createNotification = (
        notification: Omit<CreateNotificationType, "user_id">,
        user_ids: number[],
    ) => {
        try {
            notificationService.createNotification(notification, user_ids);
        } catch (err) {
            console.error("Error creating notification:", err);
            setError("Failed to create notification");
        }
    };

    const saveNotification = async () => {
        setLoading(true);
        setError(null);
        try {
            await notificationService.saveNotification();
        } catch (err) {
            console.error("Error saving notifications:", err);
            setError("Failed to save notifications");
        } finally {
            setLoading(false);
        }
    };

    const sendNotification = async () => {
        setLoading(true);
        setError(null);
        try {
            await notificationService.sendNotification();
        } catch (err) {
            console.error("Error sending notifications:", err);
            setError("Failed to send notifications");
        } finally {
            setLoading(false);
        }
    };

    const getNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedNotifications = await notificationService
                .getNotifications();
            setNotifications(fetchedNotifications);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    return {
        notifications,
        loading,
        error,
        createNotification,
        saveNotification,
        sendNotification,
        getNotifications,
    };
};
