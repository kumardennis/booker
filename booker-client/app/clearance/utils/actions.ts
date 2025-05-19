import {
    CRUDType,
    EventType,
    EventTypeCombined,
    EventTypePermission,
    GroupEventType,
    TrainingEventType,
    User,
} from "@/app/types";
import { createClient } from "@/utils/supabase/server";

type BodyTypeGroup = {
    group_id: string | undefined;
    user_uuid: string | undefined;
    event_types: EventType[];
};
type BodyTypeTraining = {
    training_id: string | undefined;
    user_uuid: string | undefined;
    event_types: EventType[];
};

export async function getClearanceForGroup(requestData: BodyTypeGroup) {
    const supabase = await createClient();

    const {
        group_id,
        event_types,
        user_uuid,
    } = requestData;

    if (!group_id || !event_types) {
        return {
            error: "Missing required fields",
        };
    }

    const { data: authData } = await supabase.auth.getUser();
    const { data: userData, error: userError } = await supabase
        .from("users").select(
            "id, user_id, is_trainer, is_club_admin",
        ).eq("user_id", authData?.user?.id).single();

    const isTheSameUser = user_uuid === authData?.user?.id;

    const trainerGroupQuery =
        "trainers_groups!inner(id, users:trainer_id!inner(user_id, is_trainer, is_club_admin)";
    const userGroupQuery =
        "users_groups!inner(id, users:user_id!inner(user_id, is_trainer, is_club_admin)";

    const { data: groupData, error } = await supabase
        .from("club_groups")
        .select(
            `id, users:${
                userData?.is_trainer ? trainerGroupQuery : userGroupQuery
            })`,
        )
        .eq("id", group_id).eq(
            userData?.is_trainer
                ? "users.trainer_id.user_id"
                : "users.user_id.user_id",
            userData?.user_id,
        );

    // if (error) {
    //     return Response.json({
    //         error: "FUCKKKK",
    //         groupData,
    //         authData,
    //     }, {
    //         status: 500,
    //     });
    // }

    const responseToSend: {
        eventsPermissions: EventTypePermission[];
    } = {
        eventsPermissions: [],
    };

    const user = groupData
        ? groupData[0]?.users[0]?.users as unknown as {
            user_id: any;
            is_trainer: any;
            is_club_admin: any;
        }
        : null;

    for (const eventType of event_types) {
        if (userData?.is_club_admin) {
            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                ],
            });
        }

        if (user?.is_trainer && !user?.is_club_admin) {
            const allowedEventTypesForUser = [
                EventTypeCombined.GROUP_USER_LEAVE,
                EventTypeCombined.GROUP_USER_JOIN,
                EventTypeCombined.GROUP_USER_JOIN_REQUEST,
            ];

            const isAllowedEventType = groupData &&
                allowedEventTypesForUser.includes(
                    eventType as GroupEventType,
                );

            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: Boolean(isAllowedEventType),
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: false,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: false,
                            self: true,
                        },
                    },
                ],
            });
        }

        if (!user?.is_trainer && !user?.is_club_admin) {
            const allowedEventTypesForUser = [
                EventTypeCombined.GROUP_USER_LEAVE,
                EventTypeCombined.GROUP_USER_JOIN_REQUEST,
            ];

            const isAllowedEventType = (eventTypeArg: GroupEventType) =>
                allowedEventTypesForUser.includes(
                    eventTypeArg,
                );

            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: isTheSameUser,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser && isAllowedEventType(
                                eventType as GroupEventType,
                            ),
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser && isAllowedEventType(
                                eventType as GroupEventType,
                            ),
                        },
                    },
                ],
            });
        }
    }
    return {
        eventsPermissions: responseToSend.eventsPermissions,
        isRegularUser: !userData?.is_trainer && !userData?.is_club_admin,
        error,
    };
}

export async function getClearanceForTraining(requestData: BodyTypeTraining) {
    const supabase = await createClient();

    const {
        training_id,
        event_types,
        user_uuid,
    } = requestData;

    if (!training_id || !event_types) {
        return {
            error: "Missing required fields",
        };
    }

    const { data: authData } = await supabase.auth.getUser();
    const { data: userData, error: userError } = await supabase
        .from("users").select(
            "id, user_id, is_trainer, is_club_admin",
        ).eq("user_id", authData?.user?.id).single();

    const isTheSameUser = user_uuid === authData?.user?.id;

    const trainerGroupQuery =
        "trainers_trainings!inner(id, users:trainer_id!inner(user_id, is_trainer, is_club_admin)";
    const userGroupQuery =
        "users_trainings!inner(id, users:user_id!inner(user_id, is_trainer, is_club_admin)";

    const { data: trainingData, error } = await supabase
        .from("group_trainings")
        .select(
            `id, users:${
                userData?.is_trainer ? trainerGroupQuery : userGroupQuery
            })`,
        )
        .eq("id", training_id).eq(
            userData?.is_trainer
                ? "users.trainer_id.user_id"
                : "users.user_id.user_id",
            userData?.user_id,
        );

    // if (error) {
    //     return Response.json({
    //         error: "FUCKKKK",
    //         groupData,
    //         authData,
    //     }, {
    //         status: 500,
    //     });
    // }

    const responseToSend: {
        eventsPermissions: EventTypePermission[];
    } = {
        eventsPermissions: [],
    };

    const user = trainingData
        ? trainingData[0]?.users[0]?.users as unknown as {
            user_id: any;
            is_trainer: any;
            is_club_admin: any;
        }
        : null;

    for (const eventType of event_types) {
        if (userData?.is_club_admin) {
            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                ],
            });
        }

        if (user?.is_trainer && !user?.is_club_admin) {
            const allowedEventTypesForUser = [
                EventTypeCombined.TRAINING_USER_LEAVE,
                EventTypeCombined.TRAINING_USER_JOIN,
                EventTypeCombined.TRAINING_USER_JOIN_REQUEST,
            ];

            const isAllowedEventType = trainingData &&
                allowedEventTypesForUser.includes(
                    eventType as TrainingEventType,
                );

            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: Boolean(isAllowedEventType),
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: false,
                            self: true,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: false,
                            self: true,
                        },
                    },
                ],
            });
        }

        if (!user?.is_trainer && !user?.is_club_admin) {
            const allowedEventTypesForUser = [
                EventTypeCombined.TRAINING_USER_LEAVE,
                EventTypeCombined.TRAINING_USER_JOIN_REQUEST,
            ];

            const isAllowedEventType = (eventTypeArg: TrainingEventType) =>
                allowedEventTypesForUser.includes(
                    eventTypeArg,
                );

            responseToSend.eventsPermissions.push({
                event_type: eventType,
                crudAllowed: [
                    {
                        crud: CRUDType.READ,
                        forPeople: {
                            others: true,
                            self: isTheSameUser,
                        },
                    },
                    {
                        crud: CRUDType.UPDATE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser && isAllowedEventType(
                                eventType as TrainingEventType,
                            ),
                        },
                    },
                    {
                        crud: CRUDType.CREATE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser,
                        },
                    },
                    {
                        crud: CRUDType.DELETE,
                        forPeople: {
                            others: false,
                            self: isTheSameUser && isAllowedEventType(
                                eventType as TrainingEventType,
                            ),
                        },
                    },
                ],
            });
        }
    }
    return {
        eventsPermissions: responseToSend.eventsPermissions,
        isRegularUser: !userData?.is_trainer && !userData?.is_club_admin,
        error,
    };
}
