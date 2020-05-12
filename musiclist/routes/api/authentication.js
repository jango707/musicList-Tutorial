const express = require('express');
const passport = require('passport');
const User = require('../../models/user.js');

const router = express.Router();

//POST to /register
router.post('/register', (req, res) => {
	//create a user object to save (coming from json)
	const newUser = new User(req.body);

	//Save via passport's "register" method, the user
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			return res.send(JSON.stringify({error: err}));
		}
		return res.send(JSON.stringify(user));
	});
});

//POST to /login
router.post('/login', (req, res)=> {
	passport.authenticate('local')(req, res, () => {
	//if logged in, we should have user info to sen back
	if(req.user){
		return res.send(JSON.stringify(req.user));
	}

	return res.send(JSON.stringify({error: 'There was an error logging in'}));
	});
});

//GET to logout
router.get('/logout', (req, res)=> {
	req.logout();
	return res.send(JSON.stringify(req.user));
});

module.exports = router;