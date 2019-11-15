require('dotenv').config();

const express = require('express');
const accountHelper = require('./helpers/accounts');
const postHelper = require('./helpers/posts');
const jwt = require('./helpers/jwt');

const app = express();
app.use(express.json());

const authenticateMiddleware = (req, res, next) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
        return res.status(403).send();
    }

    const token = authorization.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (!payload) {
        return res.status(403).send();
    }
    req.user = payload;
    next();
}

// TODO: implement refresh token and learn why we need refresh token

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            success: false,
            message: "Please provide username and password",
        });
    }
    if (accountHelper.add(username, password)) {
        return res.json({
            success: true,
        });
    }

    return res.json({
        success: false,
        message: 'Unable to create account.'
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const account = accountHelper.find(username, password);
    if (!account) {
        return res.json({
            success: false,
            message: 'No account was found with this combination of username and password',
        });
    }

    // generate token
    const payload = {
        id: account.id,
        username: account.username
    };
    const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: 3600 * 1000 }); // 3600 seconds = 1 hour
    return res.json({
        success: true,
        token,
    });
});

app.post('/posts', authenticateMiddleware, (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.json({ success: false, message: 'Please input post content' });
    }
    return res.json(postHelper.add(req.user.id, content));
});

app.get('/posts', authenticateMiddleware, (req, res) => {
    const posts = postHelper.findByUserId(req.user.id);
    return res.json(posts)
});

app.get('/posts/:postId', authenticateMiddleware, (req, res) => {
    const post = postHelper.findByPostId(req.params.postId);
    if (!post) {
        return res.status(404).send();
    }
    if (post.userId !== req.user.id) {
        return res.status(403).send();
    }
    return post;
});

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000');
});
