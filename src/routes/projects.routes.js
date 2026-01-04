const express = require('express');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const validation = require('../middlewares/validation.middleware');

router.post('/', validation.validateProject, projectsController.createProject);
router.get('/', projectsController.getAllProjects);
router.put('/:id', validation.validateProject, projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);
router.post('/:id/skills', validation.validateSkillAssignment, projectsController.assignSkillToProject);

module.exports = router;