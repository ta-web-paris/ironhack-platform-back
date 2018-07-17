const passport = require( "passport" );
const Admin = require( "./../models/admin-model" );

passport.serializeUser(( userDoc, done ) => {
    done( null, userDoc._id );
});

passport.deserializeUser(( idFromSession, done ) => {
    Admin.findById( idFromSession )
    .then(( userDoc ) => {
        done( null, userDoc );
    })
    .catch(( err ) => {
        done( err );
    });
});

function passportSetup ( app ) {
    app.use( passport.initialize() );
    app.use( passport.session() );
}

module.exports = passportSetup;