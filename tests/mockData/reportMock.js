const reportMock = {
  validReport: {
    type: 'general',
    body: 'This novel is very bad, it criticizes my faith',
  },
  invalidReport: {
    typ: 'general',
    body: 'This novel is very bad, it criticizes my faith',
  },
  invalidType: {
    type: 'oh',
    body: 'This novel is very bad, it criticizes my faith',
  },
  validReportBadWords: {
    type: 'badWords',
    body: 'This novel is very bad, it criticizes my faith',
  }
};

export default reportMock;
