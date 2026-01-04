const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePersonnel = (req, res, next) => {
    const { name, email, experience_level } = req.body;
    
    if (!name || !email || !experience_level) {
        return res.status(400).json({ error: 'Name, email, and experience level are required' });
    }
    
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    
    const validLevels = ['Junior', 'Mid-Level', 'Senior'];
    if (!validLevels.includes(experience_level)) {
        return res.status(400).json({ error: 'Invalid experience level' });
    }
    
    next();
};

const validateSkill = (req, res, next) => {
    const { skill_name, category } = req.body;
    const validCategories = ['Programming Language', 'Framework', 'Tool', 'Soft Skill'];
    
    if (!skill_name || !category) {
        return res.status(400).json({ error: 'Skill name and category are required' });
    }
    
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
    }
    
    next();
};

const validateProject = (req, res, next) => {
    const { project_name, status } = req.body;
    const validStatuses = ['Planning', 'Active', 'Completed'];
    
    if (!project_name) {
        return res.status(400).json({ error: 'Project name is required' });
    }
    
    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    next();
};

const validateSkillAssignment = (req, res, next) => {
    const { skill_id, proficiency } = req.body;
    const validProficiencies = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    
    if (!skill_id || !proficiency) {
        return res.status(400).json({ error: 'Skill ID and proficiency are required' });
    }
    
    if (!validProficiencies.includes(proficiency)) {
        return res.status(400).json({ error: 'Invalid proficiency level' });
    }
    
    next();
};

module.exports = {
    validatePersonnel,
    validateSkill,
    validateProject,
    validateSkillAssignment
};