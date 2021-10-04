const express = require('express');
const router = express.Router();
const axios = require('axios');
const ouathConfig = require('../config/oauth.config');

const mysql = require('mysql2');
const dbConfig = require('../config/db.config');

async function getToken(req) {
	try {
		const { code } = req.query;
		const { CLIENT_ID, CLIENT_SECRET_ID } = ouathConfig;
		const opts = { headers: { accept: 'application/json' } };
		const body = {
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET_ID,
			code,
		};

		const tokenUrl = 'https://github.com/login/oauth/access_token';
		const { data } = await axios.post(tokenUrl, body, opts);
		const { access_token } = data;

		return Promise.resolve(access_token);
	} catch (err) {
		console.log(err);
	}
}

async function getUserInfo(token) {
	try {
		const userProfileUrl = 'https://api.github.com/user';
		const opts = { headers: { Authorization: `token ${token}` } };
		const response = await axios.get(userProfileUrl, opts);
		const { data } = response;

		return Promise.resolve(data);
	} catch (err) {
		console.log(err);
	}
}

async function insertUser(github_user_name, github_id) {
	const userInsertQuery = `insert into user(user_name,user_github_id) values('${github_user_name}',${github_id});`;
	const connection = mysql.createConnection(dbConfig);

	connection.connect();
	connection.execute(userInsertQuery, (err, result, fields) => {
		if (err) throw err;
		console.log(result);
	});
	connection.end();
}

async function checkUserSignUp(github_id) {
	const selectQuery = `select * from user where user_github_id='${github_id}';`;
	const connection = mysql.createConnection(dbConfig);

	return new Promise((res, rej) => {
		connection.connect();
		connection.execute(selectQuery, (err, result, fields) => {
			if (err) rej(err);
			res(result.length != 0);
		});
	});
}

router.get('/logout', async (req, res, next) => {
	req.session.destroy(err => {
		if (err) throw err;
		res.redirect('/');
	});
});

router.get('/callback', async (req, res, next) => {
	try {
		// 1. get token
		const token = await getToken(req);

		// 2. get user info
		const userInfo = await getUserInfo(token);

		// 3. check user is signed up
		const { id, login } = userInfo;
		const isUserSignUp = await checkUserSignUp(id);

		if (!isUserSignUp) {
			// 3.1 insert to DB
			await insertUser(login, id);
		}

		// 4. generate session and redirect
		req.session.isLogin = true;
		req.session.userName = login;
		req.session.save(() => res.redirect('/'));
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
