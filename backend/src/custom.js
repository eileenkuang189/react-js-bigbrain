/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  const publicData = {
    ...question,
    answerOptions: question.answerOptions.map(({ id, text }) => ({ id, text }))
  };
  return publicData;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  const correctAnswers = question.answerOptions.filter(item => item.isCorrect).map(item => item.id);
  return correctAnswers;
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  let answers = [];
  question.answerOptions.map(item => item.id)
  return answers;
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timeLimit;
};
