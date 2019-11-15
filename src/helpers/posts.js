const posts = [];
let postId = 1;

const add = (userId, content) => {
    const post = {
        id: postId++,
        userId,
        content,
    };
    posts.push(post);
    return post;
};

const findByUserId = userId => {
    return posts.filter(post => post.userId === userId);
}

const findByPostId = postId => {
    return posts.find(post => post.id === Number(postId));
};

module.exports = {
    add,
    findByUserId,
    findByPostId,
};
