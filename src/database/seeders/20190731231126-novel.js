export const up = queryInterface => queryInterface.bulkInsert('Novels', [{
  slug: 'religion-versus-spirituality',
  title: 'Religion And Spirituality',
  description: 'A beautiful take on religion and Spirituality',
  body: 'Religion and Christianity proposes that all the answers can be found in the Bible, while Christianity is all bout searching for anwsers.',
  authorId: 1,
  genreId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
}], {});
export const down = queryInterface => queryInterface.bulkDelete('Novels', null, {});
