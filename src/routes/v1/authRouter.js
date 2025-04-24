// const passport = require('passport');
import express from 'express';
import { authController } from '~/controllers/authController';
import { authValidation } from '~/validations/authValidation';

const router = express.Router();

// router.get('/current-user', authMiddleware.isAuthorized, authController.getCurrentUser);
router.post('/sign-up', authValidation.signUp, authController.signUp);
router.post('/sign-in', authValidation.signIn, authController.signIn);
// router.post('/verify', authMiddleware.isAuthorized, authController.verifyServices);
// router.post('/refresh-token', authController.refreshToken);
// router.patch('/verify-account', authValidation.verifyAccount, authController.verifyAccount);
// router.delete('/logout', authController.logout);

// GET /auth/google
// router.get('/google', (req, res, next) => {
//     const redirectUrl = req.query.continue;
//     const isPopup = !!req.query.popup;
//
//     const state = JSON.stringify({ continue: encodeURIComponent(redirectUrl), popup: isPopup });
//     passport.authenticate('google', { scope: ['profile', 'email'], state })(req, res, next);
// });
//
// // GET /auth/google/callback
// router.get(
//     '/google/callback',
//     passport.authenticate('google', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
//     authController.loginSocial,
// );
//
// // GET /auth/facebook
// router.get('/facebook', (req, res, next) => {
//     const redirectUrl = req.query.continue;
//     const isPopup = !!req.query.popup;
//
//     const state = JSON.stringify({ continue: encodeURIComponent(redirectUrl), popup: isPopup });
//     passport.authenticate('facebook', { scope: ['email', 'public_profile'], state })(req, res, next);
// });
//
// // GET /auth/facebook/callback
// router.get(
//     '/facebook/callback',
//     passport.authenticate('facebook', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
//     authController.loginSocial,
// );
//
// // GET /auth/github
// router.get('/github', (req, res, next) => {
//     const redirectUrl = req.query.continue;
//     const isPopup = !!req.query.popup;
//
//     const state = JSON.stringify({ continue: encodeURIComponent(redirectUrl), popup: isPopup });
//     passport.authenticate('github', { scope: ['user:email'], state })(req, res, next);
// });
//
// // GET /auth/github/callback
// router.get(
//     '/github/callback',
//     passport.authenticate('github', { failureRedirect: process.env.BACKEND_SSO + '/login' }),
//     authController.loginSocial,
// );

export default router;
