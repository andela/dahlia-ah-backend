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
  highlightNovel: {
    title: 'This is the highlight',
    description: 'The very first highlight description',
    body: 'The body contains text that is really long and highlighted',
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
  },
  seedNovel1: {
    id: '7f45df6d-7003-424f-86ec-1e2b36e2fd14',
    slug: 'hancock',
  },
  seedNovel2: {
    id: '8bd8c0ec-3b50-4228-bb71-e617c7b8d3b5',
    slug: 'bancock',
  }
};

export default novelMock;
