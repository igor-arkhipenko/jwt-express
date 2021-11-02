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

app.post('/login', (req, res) => {
    // Read username and password from request body
    const { username, password } = req.body

    // Find user from the users array by username and password
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret)

        res.json({ accessToken })
    } else {
        res.send('Username or password incorrect');
    }
});
