// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    deleteUser(id: ID!): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  
  input CreateCommentInput {
    text: String!
    author: String!
    post: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

export default typeDefs;
