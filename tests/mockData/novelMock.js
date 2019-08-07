const novelMock = {
  validNovel: {
    title: 'This is the first',
    description: 'The very first description',
    body: 'The body contains text that is really long',
    genre: 'action'
  },
  validGenre: {
    name: 'prose'
  },
  existingGenre: {
    name: 'thriller'
  },
  invalidGenre: {
    name: 'thr**ille**r'
  },
  emptyGenre: {
    name: ''
  }
};

export default novelMock;
