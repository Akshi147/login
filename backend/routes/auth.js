const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require("../db");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

        if (user) {
            return done(null, user); // User already exists, proceed with login
        }

        const existingUser = await User.findOne({ username: profile.emails[0].value});

        if (existingUser) {
            return done(null, false, { message: 'Email already in use' }, {redirectUrl: `${process.env.CLIENT_URL}`}); // Custom error message
        }

        // Create a new user
        user = new User({
            username: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            oauthProvider: 'google',
            oauthId: profile.id,
            password: null
        });
        await user.save();
        
        done(null, user);
    } catch (err) {
        done(err, false);
    }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
})