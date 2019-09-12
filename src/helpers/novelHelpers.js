import Sequelize from 'sequelize';
import models from '../database/models';

const { Op } = Sequelize;
const { Genre, User } = models;

/**
 * extractBooks
 *
 * @param { string } title
 * @param { string } genre
 * @param { string } author
 * @param { string } keyword
 * @param { string } isPublished
 * @returns { array } formated novels
 */
const filter = (title, genre, author, keyword, isPublished) => {
  const queryParams = {
    query: {
      '$Novel.title$': { [Op.iLike]: `%${title}%` },
      '$Genre.name$': { [Op.iLike]: `${genre}` },
      where: Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.firstName'), ' ', Sequelize.col('User.lastName')), {
        [Op.iLike]: `%${author}%`
      })
    },
    keyword: {
      [Op.or]: {
        '$Novel.title$': { [Op.iLike]: `%${keyword}%` },
        '$Genre.name$': { [Op.iLike]: `${keyword}` },
        where: Sequelize.where(Sequelize.fn('concat', Sequelize.col('User.firstName'), ' ', Sequelize.col('User.lastName')), {
          [Op.iLike]: `%${keyword}%`
        })
      }
    }
  };
  if (!title) delete queryParams.query['$Novel.title$'];
  if (!genre) delete queryParams.query['$Genre.name$'];
  if (!author) delete queryParams.query.where;
  const filterQuery = (keyword) ? { ...queryParams.keyword } : { ...queryParams.query };
  return {
    include: [{ model: User }, { model: Genre }],
    where: (keyword || title || genre || author) ? {
      ...filterQuery, isPublished
    } : isPublished
  };
};


/**
 * extractBooks
 *
 * @param { array } results
 * @returns { array } formated novels
 */
const extractNovels = (results) => {
  if (results.constructor !== Array) {
    throw new Error('invalid argument type');
  }
  return results.map((novel) => {
    const {
      id, title, slug, description, coverImgUrl, thumbImgUrl,
      readTime, isPublished, createdAt, updatedAt,
    } = novel;

    return {
      id,
      title,
      slug,
      author: `${novel.User.firstName} ${novel.User.lastName}`,
      genre: novel.Genre.name,
      description,
      coverImgUrl,
      thumbImgUrl,
      readTime,
      isPublished,
      createdAt,
      updatedAt
    };
  });
};

export default { filter, extractNovels };
