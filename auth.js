const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(3000, () => {
    console.log('Authentication service started on port 3000');
})

const users = [
    {
        username: 'John Doe',
        password: 'johndoe',
        role: 'admin'
    },
    {
        username: 'Jane Doe',
        password: 'janedoe',
        role: 'member'
    }
];

const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
let refreshTokens = [];

app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body

    // Find user from the users array by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshTokens);

        res.json({ accessToken, refreshToken })
    } else {
        res.send('Username or password incorrect');
    }
});

app.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '1m' });

        res.json({
            accessToken
        });
    });
});

app.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(t => t !== token);

    res.send("Logout successful");
});
