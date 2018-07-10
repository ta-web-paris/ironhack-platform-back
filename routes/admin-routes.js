const express = require( "express" );
const adminRouter = express.Router();
const passport = require( "passport" );
const flash = require( "connect-flash" );

const Admin = require( "./../models/admin-model" );

const bcrypt = require( "bcrypt" );
const bcryptSalt = 10;

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////




// GET SIGNUP
///////////////////////////////////////////////////////////////////////////

adminRouter.get( "/signup", ( req, res, next ) => {
    res.render( "signup" );
});



// POST SIGNUP
///////////////////////////////////////////////////////////////////////////

adminRouter.post( "/process-signup", ( req, res, next ) => {
    const { username, email, password } = req.body;

    if (username === "" || password === "") {
        const err = new Error( "Username or password invalid" );
        err.status = 400;
        next( err );
        return;
    }

    Admin.findOne({ username }, "username", (err, admin) => {
        if (admin !== null) {
            const err = new Error( "The username already exists" );
            err.status = 400;
            next( err );
            return;
        }
    
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);
    
        const newAdmin = new Admin({
          username,
          email,
          encryptedPassword: hashPass,
          isAdmin: true
        });
    
        newAdmin.save(( err ) => {
          if ( err ) {
            next( err );
          } else {
            req.login( newAdmin, () => {
              // Clear the password before sending (it's a security risk)
              newAdmin.encryptedPassword = undefined;
              console.log( "User created and logged in!" );
              res.json({ userInfo: newAdmin });
            });
          }
        });
      });

});



// GET LOGIN
///////////////////////////////////////////////////////////////////////////

adminRouter.get( "/login", ( req, res, next ) => {
    res.render( "login" );
});



// POST LOGIN
///////////////////////////////////////////////////////////////////////////

adminRouter.post( "/process-login", ( req, res, next ) => {
    passport.authenticate("local", ( err, theUser, failureDetails ) => {
      if( err ) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      if( !theUser ) {
        res.status(401).json(failureDetails);
        return;
      }

      req.login( theUser, () => {
        // Clear the password before sending (it's a security risk)
        theUser.encryptedPassword = undefined;
        res.json({ userInfo: theUser });
      });
    })( req, res, next );
});



// POST LOGOUT
///////////////////////////////////////////////////////////////////////////

adminRouter.post( "/logout", ( req, res, next ) => {
    req.logout();
    res.status( 200 ).json({ message: "Logged out" });
})



// ENSURE LOGGEDIN
///////////////////////////////////////////////////////////////////////////

adminRouter.get( "/loggedin", ( req, res, next ) => {
    if( req.isAuthenticated ) {
        res.status( 200 ).json( req.user );
        return;
    }
    res.status( 403 ).json({ message: "Unauthorized" });
});


module.exports = adminRouter;