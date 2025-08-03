import type { User, Post } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Eleanor Vance',
    email: 'eleanor@reflectzen.com',
    bio: 'Philosopher and writer, exploring the depths of consciousness one thought at a time.',
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'The Illusion of Time',
    content: 'Time is not a river, but a vast, still ocean. We are not passengers on its currents, but divers exploring its depths. Each moment is a new discovery, a new perspective on the whole.',
    authorId: '1',
    authorName: 'Eleanor Vance',
    createdAt: new Date('2023-10-26T10:00:00Z'),
  },
  {
    id: 'p2',
    title: 'On Solitude and Creativity',
    content: 'In the quiet hum of solitude, the mind finds its true voice. It is in the spaces between the noise that creativity blossoms, that ideas take root and grow into something beautiful.',
    authorId: '1',
    authorName: 'Eleanor Vance',
    createdAt: new Date('2023-10-28T14:30:00Z'),
  },
    {
    id: 'p3',
    title: 'The Architecture of Thought',
    content: 'Our thoughts are not random occurrences. They are structures we build, brick by brick, with our beliefs, experiences, and biases. To change our lives, we must first become the architects of our own minds.',
    authorId: '1',
    authorName: 'Eleanor Vance',
    createdAt: new Date('2023-11-02T09:15:00Z'),
  },
];
