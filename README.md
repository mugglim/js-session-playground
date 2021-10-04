# js-session-playground

session을 이용하여 사용자 인증절차 구현

## Flow

- ![img](docs/flow.png);

## User Table

```
+----------------+-------------+------+-----+---------+----------------+
| Field          | Type        | Null | Key | Default | Extra          |
+----------------+-------------+------+-----+---------+----------------+
| id             | int         | NO   | PRI | NULL    | auto_increment |
| user_name      | varchar(45) | NO   | UNI | NULL    |                |
| user_github_id | int         | NO   | UNI | NULL    |                |
+----------------+-------------+------+-----+---------+----------------+
```

## Setup

### 1. Set all config file

- 설정 파일의 경로 : `server/config/*.config.js`
- (1) db.config.js

```js
module.exports = {
	host: 'localhost',
	user: '{Your User Name}',
	password: '{Your Password}',
	database: '{Your DB}',
};
```

- (2) oauth.config.js

```js
module.exports = {
	CLIENT_ID: '{Your Github Clinet ID}',
	CLIENT_SECRET_ID: '{Your Github Secret ID}',
	CALLBACK_URL: 'http://localhost:3000/oauth/callback', // this must be same
};
```

- (3) session.config.js

```js
module.exports = {
	secret: '{Your Secret key}',
	resave: false,
	saveUninitialized: true,
};
```

### 2. Install package

> npm install

### 3. Start 🚀

> npm run start
