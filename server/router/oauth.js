const express = require('express');
const router = express.Router();
const httpRequest = require('../util/http-request');

const ouathConfig = require('../config/oauth.config');
const model = require('../models/index');

async function getToken(req) {
	try {
		const { code } = req.query;
		const { CLIENT_ID, CLIENT_SECRET_ID } = ouathConfig;
		const data = {
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET_ID,
			code,
		};

		const response = await httpRequest.post(
			'github.com',
			'/login/oauth/access_token',
			data,
		);

		const { access_token } = response;
		return Promise.resolve(access_token);
	} catch (err) {
		console.log(err);
	}
}

async function getUserInfo(token) {
	try {
		const header = { Authorization: `token ${token}` };
		const response = await httpRequest.get('api.github.com', '/user', header);
		return Promise.resolve(response);
	} catch (err) {
		console.log(err);
	}
}

async function insertUser(user_name, user_github_id) {
	try {
		await models.User.create({ user_name, user_github_id });
		console.log('User 가입 성공!');
	} catch (err) {
		console.log(err);
	}
}

async function readUser(user_github_id) {
	return new Promise((resolve, reject) => {
		model.User.findOne({ where: { user_github_id } }).then(user => {
			if (user) {
				resolve(true);
			} else {
				reject('user is not exist');
			}
		});
	});
}

async function checkUserSignUp(github_id) {
	const isUserExist = await readUser(github_id);
	return isUserExist === true;
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

		console.log('Token:', token);

		// 2. get user info
		const userInfo = await getUserInfo(token);
		console.log('userInfo:', userInfo);
		// 3. check user is signed up
		const { id, login } = userInfo;
		const isUserSignUp = await checkUserSignUp(id);

		if (!isUserSignUp) {
			// 	// 3.1 insert to DB
			await insertUser(login, id);
		}

		// // 4. generate session and redirect
		req.session.isLogin = true;
		req.session.userName = login;
		req.session.save(() => res.redirect('/'));
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
