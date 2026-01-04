const db = require('../config/db');

const skillsController = {
    // Create skill
    createSkill: async (req, res) => {
        try {
            const { skill_name, category, description } = req.body;
            
            const [result] = await db.execute(
                'INSERT INTO skills (skill_name, category, description) VALUES (?, ?, ?)',
                [skill_name, category, description]
            );
            
            const [newSkill] = await db.execute(
                'SELECT * FROM skills WHERE id = ?',
                [result.insertId]
            );
            
            res.status(201).json({
                message: 'Skill created successfully',
                data: newSkill[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get all skills
    getAllSkills: async (req, res) => {
        try {
            const [skills] = await db.execute(`
                SELECT s.*, 
                COUNT(ps.personnel_id) as personnel_count
                FROM skills s
                LEFT JOIN personnel_skills ps ON s.id = ps.skill_id
                GROUP BY s.id
                ORDER BY s.skill_name
            `);
            
            res.json({ data: skills });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update skill
    updateSkill: async (req, res) => {
        try {
            const { id } = req.params;
            const { skill_name, category, description } = req.body;
            
            const [result] = await db.execute(
                'UPDATE skills SET skill_name = ?, category = ?, description = ? WHERE id = ?',
                [skill_name, category, description, id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            
            const [updatedSkill] = await db.execute(
                'SELECT * FROM skills WHERE id = ?',
                [id]
            );
            
            res.json({
                message: 'Skill updated successfully',
                data: updatedSkill[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Delete skill
    deleteSkill: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await db.execute(
                'DELETE FROM skills WHERE id = ?',
                [id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            
            res.json({ message: 'Skill deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = skillsController;