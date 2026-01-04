const db = require('../config/db');

// Proficiency level weights for matching percentage
const PROFICIENCY_WEIGHTS = {
    'Beginner': 1,
    'Intermediate': 2,
    'Advanced': 3,
    'Expert': 4
};

const getProficiencyScore = (proficiency) => PROFICIENCY_WEIGHTS[proficiency] || 0;

const matchingService = {
    getMatchingPersonnel: async (projectId) => {
        try {
            // Get project required skills
            const [requiredSkills] = await db.execute(`
                SELECT prs.*, s.skill_name
                FROM project_required_skills prs
                JOIN skills s ON prs.skill_id = s.id
                WHERE prs.project_id = ?
            `, [projectId]);
            
            if (requiredSkills.length === 0) {
                return { matches: [], message: 'No required skills defined for this project' };
            }
            
            // Get all personnel with their skills
            const [allPersonnel] = await db.execute(`
                SELECT p.*, 
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'skill_id', ps.skill_id,
                        'skill_name', s.skill_name,
                        'proficiency', ps.proficiency
                    )
                ) as skills
                FROM personnel p
                LEFT JOIN personnel_skills ps ON p.id = ps.personnel_id
                LEFT JOIN skills s ON ps.skill_id = s.id
                GROUP BY p.id
            `);
            
            const matches = [];
            
            // Check each personnel against required skills
            for (const personnel of allPersonnel) {
                const personnelSkills = personnel.skills[0] ? JSON.parse(personnel.skills) : [];
                const personnelSkillsMap = new Map();
                
                // Create map of personnel skills for quick lookup
                personnelSkills.forEach(skill => {
                    personnelSkillsMap.set(skill.skill_id, skill);
                });
                
                let hasAllSkills = true;
                const matchingSkills = [];
                let totalMatchScore = 0;
                let maxPossibleScore = 0;
                
                // Check each required skill
                for (const requiredSkill of requiredSkills) {
                    const personnelSkill = personnelSkillsMap.get(requiredSkill.skill_id);
                    
                    if (!personnelSkill) {
                        hasAllSkills = false;
                        break;
                    }
                    
                    const requiredScore = getProficiencyScore(requiredSkill.min_proficiency);
                    const personnelScore = getProficiencyScore(personnelSkill.proficiency);
                    
                    if (personnelScore >= requiredScore) {
                        matchingSkills.push({
                            skill_name: requiredSkill.skill_name,
                            required_proficiency: requiredSkill.min_proficiency,
                            personnel_proficiency: personnelSkill.proficiency,
                            meets_requirement: true
                        });
                        totalMatchScore += requiredScore; // Full score for meeting requirement
                    } else {
                        matchingSkills.push({
                            skill_name: requiredSkill.skill_name,
                            required_proficiency: requiredSkill.min_proficiency,
                            personnel_proficiency: personnelSkill.proficiency,
                            meets_requirement: false
                        });
                        hasAllSkills = false;
                    }
                    
                    maxPossibleScore += requiredScore;
                }
                
                if (hasAllSkills) {
                    const matchPercentage = maxPossibleScore > 0 
                        ? Math.round((totalMatchScore / maxPossibleScore) * 100) 
                        : 100;
                    
                    matches.push({
                        personnel_id: personnel.id,
                        name: personnel.name,
                        email: personnel.email,
                        role_title: personnel.role_title,
                        experience_level: personnel.experience_level,
                        matching_skills: matchingSkills,
                        match_percentage: matchPercentage,
                        total_required_skills: requiredSkills.length,
                        matched_skills: matchingSkills.filter(skill => skill.meets_requirement).length
                    });
                }
            }
            
            // Sort by match percentage (descending)
            matches.sort((a, b) => b.match_percentage - a.match_percentage);
            
            return {
                project_id: parseInt(projectId),
                required_skills_count: requiredSkills.length,
                matches_found: matches.length,
                matches
            };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = matchingService;