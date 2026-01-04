const matchingService = require('../services/matching.service');

const matchingController = {
    getMatchingPersonnel: async (req, res) => {
        try {
            const { projectId } = req.params;
            
            const result = await matchingService.getMatchingPersonnel(projectId);
            
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = matchingController;