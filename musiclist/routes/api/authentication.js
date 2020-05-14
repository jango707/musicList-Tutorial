const crypto = require('crypto');
const express = require('express');
const mailgun = require('mailgun-js')({
  apiKey: 'a636a1dd6b35962c6783a1938a16059c-3e51f8d2-7bf9b606',
  domain: 'sandbox3c89ed5ee4e04ec3a61492bd9ebe121f.mailgun.org',
});
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('../../models/user.js');

const router = express.Router();

mongoose.Promise = global.Promise;

//GET to /checksession
router.get('/checksession', (req, res) => {
	if(req.user) {
		return res.send(JSON.stringify(req.user));
	}
	return res.send(JSON.stringify({}));
});


//GET to logout
router.get('/logout', (req, res)=> {
	req.logout();
	return res.send(JSON.stringify(req.user));
});

//POST to /login
router.post('/login', async (req, res)=> {
	//look up user by email
	const query= User.findOne({ email: req.body.email });

	const foundUser = await query.exec();

	//if they exist, they'll have a username, so add that to body
	if ( foundUser ) { req.body.username = foundUser.username; }

	passport.authenticate('local')(req, res, () => {
	//if logged in, we should have user info to sen back
	if(req.user){
		return res.send(JSON.stringify(req.user));
	}

	return res.send(JSON.stringify({error: 'There was an error logging in'}));
	});
});

//POST to /register
router.post('/register',async (req, res) => {
	//check if email doesnt exist already
	const query = User.findOne({ email: req.body.email });
	const foundUser = await query.exec();

	if(foundUser) { return res.send(JSON.stringify({ error: 'Email or username already exists'})); }
	//create a user object to save (coming from json)
	if (!foundUser) {
		const newUser = new User(req.body);

		//Save via passport's "register" method, the user
		return User.register(newUser, req.body.password, (err)=>{
			if(err){
				return res.send(JSON.stringify({error: err}));
			}
			return passport.authenticate('local')(req, res, () => {
				//if logged in, we should have user info to send back
				if(req.user) {
					return res.send(JSON.stringify(req.user));
				}
				//Otherwise return error
				return res.send(JSON.stringify({ error: 'There was an error on registering the user'}));
			});
		});
	}

	//return error if all fails
	return res.send(JSON.stringify({error: 'There was an error on registering the user'}));
});

// POST to savepassword
router.post('/savepassword', async (req, res) => {
  let result;
  try {
    // look up user in the DB based on reset hash
    const query = User.findOne({ passwordReset: req.body.hash });
    const foundUser = await query.exec();

    // If the user exists save their new password
    if (foundUser) {
      // user passport's built-in password set method
      foundUser.setPassword(req.body.password, (err) => {
        if (err) {
          result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
        } else {
          // once the password's set, save the user object
          foundUser.save((error) => {
            if (error) {
              result = res.send(JSON.stringify({ error: 'Password could not be saved. Please try again' }));
            } else {
              // Send a success message
              result = res.send(JSON.stringify({ success: true }));
            }
          });
        }
      });
    } else {
    	result = res.send(JSON.stringify({ error: 'Reset hash not found in database.' }));
    }
  } catch (err) {
      result = res.send(JSON.stringify({ error: 'There was an error connecting to the database.' }));
  }
  return result;
});

// POST to saveresethash
router.post('/saveresethash', async (req, res) => {
  let result;
  try {
    // check and make sure the email exists
    const query = User.findOne({ email: req.body.email });
    const foundUser = await query.exec();

    // If the user exists, save their password hash
    const timeInMs = Date.now();
    const hashString = `${req.body.email}${timeInMs}`;
    const secret = 'alongrandomstringshouldgohere';
    const hash = crypto.createHmac('sha256', secret)
                       .update(hashString)
                       .digest('hex');
    foundUser.passwordReset = hash;

    foundUser.save((err) => {
      if (err) { result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' })); }
      
        // Put together the email
      const emailData = {
       	from: 'JANGO <postmaster@sandbox3c89ed5ee4e04ec3a61492bd9ebe121f.mailgun.org>',
        to: foundUser.email,
        subject: 'Reset Your Password',
        text: `A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: http://localhost:3000/account/change-password/${foundUser.passwordReset} ... if you didn't make this request, feel free to ignore it!`,
        html: `<p>A password reset has been requested for the MusicList account connected to this email address. If you made this request, please click the following link: http://localhost:3000/account/change-password/${foundUser.passwordReset}>http://localhost:3000/account/change-password/${foundUser.passwordReset} .If you didn't make this request, feel free to ignore it!</p>`,
      };

       // Send it
      mailgun.messages().send(emailData, (error, body) => {
        if (error || !body) {
          result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to send the email. Please try again.' }));
        } else {
          result = res.send(JSON.stringify({ success: true }));
        }
      });

    });
  } catch (err) {
    // if the user doesn't exist, error out
    result = res.send(JSON.stringify({ error: 'Something went wrong while attempting to reset your password. Please Try again' }));
  }
  return result;
});


module.exports = router;