const express = require('express');
const router = express.Router();
const personnelController = require('../controllers/personnel.controller');

router.post('/', personnelController.createPersonnel);
router.get('/', personnelController.getAllPersonnel);
router.get('/:id', personnelController.getPersonnelById);
router.put('/:id', personnelController.updatePersonnel);
router.delete('/:id', personnelController.deletePersonnel);

// assign skill
router.post('/:id/skills', personnelController.assignSkillToPersonnel);

module.exports = router;
