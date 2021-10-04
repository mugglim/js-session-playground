const express = require('express');
const router = express.Router();

function authIsLoign(req) {
	const { isLogin } = req.session;
	return isLogin === true;
}

router.get('/', (req, res, next) => {
	const isLogin = authIsLoign(req);

	if (isLogin) {
		const { userName } = req.session;
		res.render('logout', { userName });
	} else {
		res.render('index', {});
	}
});

module.exports = router;
