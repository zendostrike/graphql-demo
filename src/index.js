import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";

import DummyData from "../data";
import typeDefs from "./types";

// Resolvers
const resolvers = {
  Query: {
    users(_, args) {
      if (!args.query) {
        return DummyData.users;
      }
      return DummyData.users.filter(e => {
        return e.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    me() {
      return {
        id: "zxc123",
        email: "gian@tactic.com"
      };
    },
    posts(_, args) {
      if (!args.query) {
        return DummyData.posts;
      }
      return DummyData.posts.filter(e => {
        const foundByTitle = e.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const foundByBody = e.body
          .toLowerCase()
          .includes(args.query.toLowerCase());

        return foundByTitle || foundByBody;
      });
    },
    comments() {
      return DummyData.comments;
    }
  },
  Mutation: {
    createUser(_, args) {
      const emailTaken = DummyData.users.some(
        user => user.email === args.data.email
      );

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      DummyData.users.push(user);

      return user;
    },
    deleteUser(_, args) {
      const userIndex = DummyData.users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found.");
      }

      const deletedUsers = DummyData.users.splice(userIndex, 1);

      DummyData.posts = DummyData.posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          DummyData.comments = DummyData.comments.filter(
            comment => comment.post !== post.id
          );
        }

        return !match;
      });

      DummyData.comments = DummyData.comments.filter(
        comment => comment.author !== args.id
      );

      return deletedUsers[0];
    },
    createPost(_, args) {
      const userExists = DummyData.users.some(
        user => user.id === args.data.author
      );

      if (!userExists) {
        throw new Error("User not found.");
      }

      const post = {
        id: uuidv4(),
        ...args.data
      };

      DummyData.posts.push(post);

      return post;
    },
    createComment(_, args) {
      const userExists = DummyData.users.some(
        user => user.id === args.data.author
      );
      const postExists = DummyData.posts.some(
        ({ id, published }) => id === args.data.author && published
      );

      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post.");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      DummyData.comments.push(comment);

      return comment;
    }
  },
  Post: {
    author(parent, args) {
      return DummyData.users.find(user => user.id === parent.author);
    },
    comments(parent, args) {
      return DummyData.comments.filter(comment => comment.post === parent.id);
    }
  },
  User: {
    posts(parent, args) {
      return DummyData.posts.filter(post => post.author === parent.id);
    },
    comments(parent, args) {
      return DummyData.comments.filter(comment => comment.author === parent.id);
    }
  },
  Comment: {
    author(parent, args) {
      return DummyData.users.find(user => user.id === parent.author);
    },
    post(parent, args) {
      return DummyData.posts.find(post => post.id === parent.post);
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("server started up");
});
