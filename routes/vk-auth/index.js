const express = require("express");
const vkApp = require("../../config/vk-app.js");
const controllers = {
    users: require("../../controllers/controller-users.js"),
    regions: require("../../controllers/controller-regions.js"),
    programs: require("../../controllers/controller-programs.js"),
    vk: require("../../controllers/controller-vk.js")
}

const router = express.Router();

const passport = require("passport");
const VKontakteStrategy = require("passport-vkontakte").Strategy;

passport.use(new VKontakteStrategy({
        clientID: vkApp.clientID,
        clientSecret: vkApp.clientSecret,
        callbackURL: '/api/vk-auth/callback',
        scope: [ 'profile', 'email' ]
    },
    function myVerifyCallbackFn(
            accessToken,
            refreshToken,
            params,
            profile,
            done
        ) {
            return done(null, profile)
        }
));

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});

router.get('/', passport.authenticate('vkontakte'));
router.get('/callback', passport.authenticate('vkontakte', {
    successRedirect: '/api/vk-auth/user',
    failureRedirect: '/api/vk-auth'
}));

router.post("/decode-token-vk", controllers.vk.decodeTokenVk);

router.get('/user', controllers.vk.showUser);

router.post("/add-user", controllers.vk.createUserVk);

router.post("/user-in-db", controllers.vk.checkUserInDb);

module.exports = router;