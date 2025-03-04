const createUser = () => {
  // create user in db
  // return success or error
};

const createClubGroup = (
  clubId,
  address,
  maxOccupancy,
  time,
  day,
  trainers,
) => {
  // create club group
};

const createUserInGroup = (groupId, userId) => {
  // create seperate entry for each user in group
};

const createTrainingsFromGroup = (
  groupId,
  timestamp,
  until,
  isUserPrioritized,
) => {
  // create seperate trainings based on group
};

const createUserInTraining = (trainingId, userId) => {
  // create seperate entry for each user in training
};

const createHistoryEventInTraining = (
  trainingId,
  originatedUserId,
  targetedUserId,
) => {
  // create seperate history entry for each event in training
};

const createHistoryEventInGroup = (
  groupId,
  originatedUserId,
  targetedUserId,
) => {
  // create seperate history entry for each event in training
};

const createRequest = () => {
  return [
    {
      fromUserId: 1,
      toClubId: 1,
      isPending: true,
      isAccepted: false,
      isRejected: false,
      comments: "",
    },
  ];
};
