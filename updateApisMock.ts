const updateUser = () => {
  // update user in db
  // return success or error
};

const updateClubGroup = (
  clubId,
  address,
  maxOccupancy,
  time,
  day,
  trainers,
  isArchived,
) => {
  // update club group
};

const updateUserInGroup = (groupId, userId) => {
  // update seperate entry for each user in group
};

const updateTrainings = (
  trainingId,
  timestamp,
  until,
) => {
  // update seperate trainings based on group
};

const updateUserInTraining = (trainingId, userId, isNotAttending) => {
  // update seperate entry for each user in training
};

const updateRequest = (
  reuqestId,
  comments,
  isPending,
  isAccepted,
  isRejected,
) => {
  // update request status
};
