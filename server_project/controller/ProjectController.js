const Router = require('express');
const router = new Router();
const {projectService, validation} = require('../service/ProjectService');
const authMiddleware = require('../middleware/authMiddleware');
const validationMiddleware = require('../middleware/validationMiddleware');

router.post('/project', authMiddleware, validationMiddleware(validation.createProject), projectService.createProject);
router.get('/project/:id', authMiddleware, validationMiddleware(validation.getProject),  projectService.getProject);

module.exports = router;