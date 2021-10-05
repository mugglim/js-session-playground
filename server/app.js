const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./router/index');
const oauthRouter = require('./router/oauth');
const path = require('path');
const app = express();
const sessionConfig = require('./config/session.config');

const sequelize = require('./models/index').sequelize;

const sequelizeDriver = async () => {
	try {
		await sequelize.sync();
	} catch (err) {
		console.error('sequelize 연동 실패', err);
		return;
	}
	console.log('sequelize 연동 성공!');
};

sequelizeDriver();

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
app.use('/oauth', oauthRouter);

app.listen(3000, () => {
	console.log('3000!');
});
