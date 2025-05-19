import {
    CRUDType,
    EventTypePermission,
    GroupEventType,
    TrainingEventType,
} from "@/app/types";

export const getPermissions = (
    eventsPermissions: EventTypePermission[] | undefined,
    eventType: GroupEventType | TrainingEventType,
    crudType: CRUDType,
) => {
    if (!eventsPermissions) return null;

    return eventsPermissions
        ?.find((event: EventTypePermission) => event.event_type === eventType)
        ?.crudAllowed.find((crud) => crud.crud === crudType);
};
