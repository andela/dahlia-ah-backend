import models from '../database/models';

const { Genre, Novel } = models;

/**
 *
 *
 * @param {object} novel
 * @param {object} author
 * @returns {object} json
 */
const createNewNovel = async (novel, author) => {
  const {
    genre,
    title,
    description,
    body
  } = novel;
  const getGenre = await Genre.findOne({ where: { name: genre } });
  const slug = `${title.toLowerCase().split(' ').join('-')}-${author.id}`;
  const foundNovel = await Novel.findOne({ where: { slug } });
  if (foundNovel) {
    return {
      status: 409,
      error: 'You already have a novel with this title'
    };
  }
  const createdNovel = await Novel.create({
    authorId: author.id,
    genreId: getGenre.id,
    slug,
    title,
    description,
    body
  });
  return {
    id: createdNovel.id,
    slug: createdNovel.slug,
    title: createdNovel.title,
    description: createdNovel.description,
    body: createdNovel.body,
    genre,
    author: `${author.firstName} ${author.lastName}`,
    createdAt: createdNovel.createdAt,
    updatedAt: createdNovel.updatedAt
  };
};

export default createNewNovel;
