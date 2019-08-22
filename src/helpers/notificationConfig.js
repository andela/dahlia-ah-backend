export default [
  {
    id: 0,
    entity: 'novel',
    following: 'user',
    description: 'This notification is sent when a novel is created',
    message: 'created a novel with the title'
  },
  {
    id: 1,
    entity: 'like',
    following: 'novel',
    description: 'This notification is sent when someone like a novel',
    message: 'like the novel - '
  },
  {
    id: 2,
    entity: 'comment',
    following: 'novel',
    description: 'This notification is sent when a comment is added to a novel',
    message: 'commented on your novel'
  },
  {
    id: 3,
    entity: 'comment',
    description: 'This notification is sent when a comment is added to a novel',
    message: 'commented on your novel'
  },
  {
    id: 4,
    entity: 'follow',
    description: 'This notifies an author when he has a follow',
    message: 'started following you'
  }
];
