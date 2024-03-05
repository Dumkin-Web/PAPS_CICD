const Router = require('express');
const router = new Router();
const {userService, validation} = require('../service/UserService');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/signIn', validationMiddleware(validation.login), userService.login);
router.post('/signUp', validationMiddleware(validation.registration), userService.registration);
router.get('/auth', authMiddleware, userService.checkJWT);
router.put('/updateUserInfo', authMiddleware, validationMiddleware(validation.changeInfo), userService.changeInfo);
router.delete('/deleteAccount', authMiddleware, userService.deleteAccount);
router.get('/getUser/:userId', authMiddleware, validationMiddleware(validation.getUser), userService.getUser);

module.exports = router;