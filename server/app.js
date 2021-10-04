const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./router/index');
const authRouter = require('./router/auth');
const path = require('path');
const app = express();
const sessionConfig = require('./config/session.config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(
	session({
		...sessionConfig,
		store: new FileStore(),
	}),
);

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(3000, () => {
	console.log('3000!');
});
