const express = require('express');
const router = express.Router();

function authIsLoign(req) {
	const { isLogin } = req.session;
	return isLogin === true;
}

router.get('/', (req, res, next) => {
	const isLogin = authIsLoign(req);

	if (isLogin) {
		res.render('logout', { id: req.session.loginId });
	} else {
		res.render('index', {});
	}
});

module.exports = router;
