const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
        return db.users;
        }
        return db.users.filter(e => {
        return e.name.toLowerCase().includes(args.query.toLowerCase());
        });
    },
    me() {
        return {
        id: "zxc123",
        email: "gian@tactic.com"
        };
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
        return db.posts;
        }
        return db.posts.filter(e => {
        const foundByTitle = e.title
            .toLowerCase()
            .includes(args.query.toLowerCase());
        const foundByBody = e.body
            .toLowerCase()
            .includes(args.query.toLowerCase());

        return foundByTitle || foundByBody;
        });
    },
    comments(parent, args, { db }, info) {
        return db.comments;
    }
};

export default Query;