const db = require('../config/db');

const projectsController = {
    // Create project
    createProject: async (req, res) => {
        try {
            const { project_name, description, start_date, end_date, status } = req.body;
            
            const [result] = await db.execute(
                'INSERT INTO projects (project_name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
                [project_name, description, start_date, end_date, status || 'Planning']
            );
            
            const [newProject] = await db.execute(
                'SELECT * FROM projects WHERE id = ?',
                [result.insertId]
            );
            
            res.status(201).json({
                message: 'Project created successfully',
                data: newProject[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Get all projects with required skills
    getAllProjects: async (req, res) => {
        try {
            const [projects] = await db.execute(`
                SELECT p.*,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'skill_id', prs.skill_id,
                        'skill_name', s.skill_name,
                        'min_proficiency', prs.min_proficiency
                    )
                ) as required_skills
                FROM projects p
                LEFT JOIN project_required_skills prs ON p.id = prs.project_id
                LEFT JOIN skills s ON prs.skill_id = s.id
                GROUP BY p.id
                ORDER BY p.created_at DESC
            `);
            
            // Parse JSON required skills
            const projectsWithSkills = projects.map(p => ({
                ...p,
                required_skills: p.required_skills[0] ? JSON.parse(p.required_skills) : []
            }));
            
            res.json({ data: projectsWithSkills });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Update project
    updateProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { project_name, description, start_date, end_date, status } = req.body;
            
            const [result] = await db.execute(
                'UPDATE projects SET project_name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
                [project_name, description, start_date, end_date, status, id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            const [updatedProject] = await db.execute(
                'SELECT * FROM projects WHERE id = ?',
                [id]
            );
            
            res.json({
                message: 'Project updated successfully',
                data: updatedProject[0]
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Delete project
    deleteProject: async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await db.execute(
                'DELETE FROM projects WHERE id = ?',
                [id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            res.json({ message: 'Project deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    // Assign required skill to project
    assignSkillToProject: async (req, res) => {
        try {
            const { id } = req.params;
            const { skill_id, min_proficiency } = req.body;
            
            // Check if project exists
            const [project] = await db.execute(
                'SELECT id FROM projects WHERE id = ?',
                [id]
            );
            
            if (project.length === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            
            // Check if skill exists
            const [skill] = await db.execute(
                'SELECT id FROM skills WHERE id = ?',
                [skill_id]
            );
            
            if (skill.length === 0) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            
            try {
                const [result] = await db.execute(
                    'INSERT INTO project_required_skills (project_id, skill_id, min_proficiency) VALUES (?, ?, ?)',
                    [id, skill_id, min_proficiency]
                );
                
                const [assignment] = await db.execute(`
                    SELECT prs.*, s.skill_name, p.project_name
                    FROM project_required_skills prs
                    JOIN skills s ON prs.skill_id = s.id
                    JOIN projects p ON prs.project_id = p.id
                    WHERE prs.id = ?
                `, [result.insertId]);
                
                res.status(201).json({
                    message: 'Required skill assigned successfully',
                    data: assignment[0]
                });
            } catch (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Skill already assigned to this project' });
                }
                throw error;
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = projectsController;