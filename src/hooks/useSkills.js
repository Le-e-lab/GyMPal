// Skill branch definitions
export const SKILL_BRANCHES = {
  pullingStrength: {
    name: 'Pulling Strength',
    description: 'Vertical and horizontal pulling power',
    icon: '💪',
    color: '#4CAF50'
  },
  pushingPower: {
    name: 'Pushing Power',
    description: 'Horizontal and vertical pushing strength',
    icon: '🚀',
    color: '#2196F3'
  },
  legStrength: {
    name: 'Leg Strength',
    description: 'Lower body power and explosiveness',
    icon: '🦵',
    color: '#FF9800'
  },
  coreStability: {
    name: 'Core Stability',
    description: 'Midline strength and control',
    icon: '⚖️',
    color: '#9C27B0'
  },
  explosivePower: {
    name: 'Explosive Power',
    description: 'Fast-twitch muscle activation',
    icon: '⚡',
    color: '#F44336'
  },
  cardio: {
    name: 'Cardiovascular Endurance',
    description: 'Heart and lung capacity',
    icon: '❤️',
    color: '#E91E63'
  },
  gripStrength: {
    name: 'Grip Strength',
    description: 'Hand and forearm strength',
    icon: '✊',
    color: '#795548'
  },
  shoulderStability: {
    name: 'Shoulder Stability',
    description: 'Joint integrity and mobility',
    icon: '🔄',
    color: '#00BCD4'
  },
  discipline: {
    name: 'Discipline',
    description: 'Consistency in habits and daily routines',
    icon: '⚔️',
    color: '#10b981'
  }
};

// XP required per level (can be adjusted for progression curve)
export const getXPForLevel = (level) => {
  // Exponential growth: 100, 150, 225, 338, 507, etc.
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate current level and progress for a skill
export const calculateSkillProgress = (currentXP) => {
  let level = 0;
  let xpInLevel = 0;
  let xpForNextLevel = getXPForLevel(1);
  
  while (currentXP >= xpForNextLevel) {
    level++;
    xpInLevel = currentXP - getXPForLevel(level);
    xpForNextLevel = getXPForLevel(level + 1);
  }
  
  // If we're at level 0, calculate progress toward level 1
  if (level === 0) {
    xpInLevel = currentXP;
    xpForNextLevel = getXPForLevel(1);
  }
  
  const progressPercent = xpForNextLevel > 0 ? (xpInLevel / xpForNextLevel) * 100 : 0;
  
  return {
    level,
    xpInLevel,
    xpForNextLevel: getXPForLevel(level + 1),
    progressPercent: Math.min(progressPercent, 100)
  };
};

// Load skills from localStorage
export const loadSkills = () => {
  try {
    const saved = localStorage.getItem('gympal_skills');
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to load skills:', error);
    return {};
  }
};

// Save skills to localStorage
export const saveSkills = (skills) => {
  try {
    localStorage.setItem('gympal_skills', JSON.stringify(skills));
    return true;
  } catch (error) {
    console.error('Failed to save skills:', error);
    return false;
  }
};

// Add XP to skills and return updated skills object
export const addSkillXP = (currentSkills, skillXP) => {
  const updatedSkills = { ...currentSkills };
  
  for (const [skill, xpAmount] of Object.entries(skillXP)) {
    if (!updatedSkills[skill]) {
      updatedSkills[skill] = { xp: 0 };
    }
    
    updatedSkills[skill].xp += xpAmount;
    
    // Calculate level progress
    const progress = calculateSkillProgress(updatedSkills[skill].xp);
    updatedSkills[skill].level = progress.level;
    updatedSkills[skill].progressPercent = progress.progressPercent;
  }
  
  return updatedSkills;
};

// Calculate XP earned from completing a habit
export const calculateHabitXP = (habitCategory, isAllComplete = false) => {
  const baseXP = 15;
  const categoryMultiplier = habitCategory === 'work' ? 1.2 : 1.0;
  const allCompleteBonus = isAllComplete ? 25 : 0;
  return Math.floor(baseXP * categoryMultiplier + allCompleteBonus);
};

// Award habit XP to the Discipline skill branch
export const awardHabitXP = (habitCategory, isAllComplete = false) => {
  const skills = loadSkills();
  const xpAmount = calculateHabitXP(habitCategory, isAllComplete);
  const skillXP = { discipline: xpAmount };
  const updatedSkills = addSkillXP(skills, skillXP);
  saveSkills(updatedSkills);
  return { xpAmount, level: updatedSkills.discipline?.level || 0 };
};

// Get skill branch info
export const getSkillBranchInfo = (skillKey) => {
  return SKILL_BRANCHES[skillKey] || {
    name: skillKey,
    description: 'Unknown skill branch',
    icon: '❓',
    color: '#9E9E9E'
  };
};

// Get all skill branches
export const getAllSkillBranches = () => {
  return SKILL_BRANCHES;
};

// Calculate suggested workout based on weakest skills
export const suggestWorkoutFocus = (currentSkills) => {
  const skillEntries = Object.entries(SKILL_BRANCHES).map(([key, info]) => {
    const skillData = currentSkills[key] || { xp: 0, level: 0, progressPercent: 0 };
    return {
      key,
      name: info.name,
      weakness: 100 - (skillData.progressPercent || 0), // Higher = weaker
      level: skillData.level,
      progress: skillData.progressPercent || 0
    };
  });
  
  // Sort by weakness (highest first)
  skillEntries.sort((a, b) => b.weakness - a.weakness);
  
  // Return top 3 weakest skills
  return skillEntries.slice(0, 3);
};