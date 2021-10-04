const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const indexRouter = require('./router/index');
const authRouter = require('./router/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

// request 객체에 session property를 추가해준다.
app.use(
	session({
		secret: 'keyboard cat', // 이 부분은 노출되면 안 됨
		resave: false, // 세션 데이터를 ?
		saveUninitialized: true, // 세션이 필요하기 전 까지 세션 구동 X
		store: new FileStore(),
	}),
);

app.use('/', indexRouter);
app.use('/auth', authRouter);

app.listen(3000, function () {
	console.log('3000!');
});
