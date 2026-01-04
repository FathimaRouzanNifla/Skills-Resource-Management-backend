const db = require('../config/db');

const personnelController = {

    // CREATE
    createPersonnel: async (req, res) => {
        try {
            const { name, email, role_title, experience_level } = req.body;

            if (!name || !email || !experience_level) {
                return res.status(400).json({
                    error: "name, email, and experience_level are required"
                });
            }

            const [result] = await db.execute(
                `INSERT INTO personnel (name, email, role_title, experience_level)
                 VALUES (?, ?, ?, ?)`,
                [name, email, role_title || null, experience_level]
            );

            const [created] = await db.execute(
                `SELECT * FROM personnel WHERE id = ?`,
                [result.insertId]
            );

            res.status(201).json({
                message: "Personnel created successfully",
                data: created[0]
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET ALL
    getAllPersonnel: async (req, res) => {
        try {
            const [rows] = await db.execute(`
                SELECT 
                    p.*,
                    COALESCE(
                        JSON_ARRAYAGG(
                            IF(s.id IS NULL, NULL,
                                JSON_OBJECT(
                                    'skill_id', s.id,
                                    'skill_name', s.skill_name,
                                    'proficiency', ps.proficiency
                                )
                            )
                        ),
                        JSON_ARRAY()
                    ) AS skills
                FROM personnel p
                LEFT JOIN personnel_skills ps ON p.id = ps.personnel_id
                LEFT JOIN skills s ON ps.skill_id = s.id
                GROUP BY p.id
            `);

            const data = rows.map(r => ({
                ...r,
                skills: r.skills.filter(Boolean)
            }));

            res.json({ data });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET BY ID
    getPersonnelById: async (req, res) => {
        try {
            const { id } = req.params;

            const [personnel] = await db.execute(
                `SELECT * FROM personnel WHERE id = ?`,
                [id]
            );

            if (!personnel.length) {
                return res.status(404).json({ error: 'Personnel not found' });
            }

            const [skills] = await db.execute(
                `SELECT s.id, s.skill_name, ps.proficiency
                 FROM personnel_skills ps
                 JOIN skills s ON ps.skill_id = s.id
                 WHERE ps.personnel_id = ?`,
                [id]
            );

            res.json({
                data: { ...personnel[0], skills }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // UPDATE
    updatePersonnel: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, role_title, experience_level } = req.body;

            const [result] = await db.execute(
                `UPDATE personnel
                 SET name=?, email=?, role_title=?, experience_level=?
                 WHERE id=?`,
                [name, email, role_title || null, experience_level, id]
            );

            if (!result.affectedRows) {
                return res.status(404).json({ error: 'Personnel not found' });
            }

            res.json({ message: "Personnel updated successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // DELETE
    deletePersonnel: async (req, res) => {
        try {
            const { id } = req.params;

            const [result] = await db.execute(
                `DELETE FROM personnel WHERE id = ?`,
                [id]
            );

            if (!result.affectedRows) {
                return res.status(404).json({ error: 'Personnel not found' });
            }

            res.json({ message: "Personnel deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // ✅ ASSIGN SKILL (THIS WAS MISSING)
    assignSkillToPersonnel: async (req, res) => {
        try {
            const { id } = req.params;
            const { skill_id, proficiency } = req.body;

            await db.execute(
                `INSERT INTO personnel_skills (personnel_id, skill_id, proficiency)
                 VALUES (?, ?, ?)`,
                [id, skill_id, proficiency || 'Beginner']
            );

            res.status(201).json({ message: "Skill assigned successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = personnelController;
