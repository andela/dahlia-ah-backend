/**
 * @description returns read time of string in minutes
 * @param {string} string a string
 * @returns {number} number in minutes
 */
const generateReadTime = (string) => {
  const wordCount = string.split(' ').length;
  const readTimeMinutes = Math.round(wordCount / 200);
  return readTimeMinutes;
};

export default generateReadTime;
