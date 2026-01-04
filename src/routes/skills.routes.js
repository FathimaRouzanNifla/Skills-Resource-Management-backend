const express = require('express');
const router = express.Router();
const skillsController = require('../controllers/skills.controller');
const validation = require('../middlewares/validation.middleware');

router.post('/', validation.validateSkill, skillsController.createSkill);
router.get('/', skillsController.getAllSkills);
router.put('/:id', validation.validateSkill, skillsController.updateSkill);
router.delete('/:id', skillsController.deleteSkill);

module.exports = router;