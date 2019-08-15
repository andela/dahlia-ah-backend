import badWords from './badWords';

const checkForBadWords = (novelBody) => {
  const isBadWordPresent = badWords.some((badWord) => {
    const regex = new RegExp(`\\b${badWord}\\b`, 'i');
    const result = regex.test(novelBody);
    return result === true;
  });
  return isBadWordPresent;
};

export default {
  checkForBadWords
};
