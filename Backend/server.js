require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routes/auth.routes');
const repoRouter = require('./src/routes/repo.routes');
const commitRouter = require('./src/routes/commit.routes');
const issueRouter = require('./src/routes/issue.router');
const objectRouter = require('./src/routes/object.routes');
const port = process.env.PORT || 3000;


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/repos', repoRouter);
app.use('/api/repo/commits', commitRouter);
app.use('/api/issues', issueRouter);
app.use('/api/objects', objectRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

