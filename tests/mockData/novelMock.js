const novelMock = {
  validNovel: {
    title: 'This is the first',
    description: 'The very first description',
    body: 'The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read',
    genre: 'action'
  },
  validNovel2: {
    title: 'This is the second',
    description: 'The very second description',
    body: 'The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read, The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read, The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read, The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read, The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read, The body contains text that is really long, it is a long text, it is very long, but it would not be too long to read',
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
