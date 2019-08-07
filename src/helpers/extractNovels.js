/**
 * extractBooks
 *
 * @param { array } results
 * @returns { array } formated novels
 */
export default (results) => {
  if (results.constructor !== Array) {
    throw new Error('invalid argument type');
  }
  return results.map((novel) => {
    const {
      id, title, slug, description, createdAt, updatedAt, User, Genre
    } = novel;

    return {
      id,
      title,
      slug,
      author: `${User.firstName} ${User.lastName}`,
      genre: Genre.name,
      description,
      createdAt,
      updatedAt
    };
  });
};
