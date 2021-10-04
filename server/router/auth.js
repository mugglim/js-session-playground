const express = require('express');
const router = express.Router();

router.get('/login', (req, res, next) => {
	res.render('login', {});
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

router.post('/login_process', (req, res, next) => {
	const { id, pw } = req.body;

	if (id === userData.id && pw === userData.pw) {
		req.session.isLogin = true;
		req.session.loginId = id;
		req.session.save(() => res.redirect('/'));
	} else {
		res.send('실패!');
	}
});

module.exports = router;
