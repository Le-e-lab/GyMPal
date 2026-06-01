import { exerciseLibrary } from '../data/exerciseLibrary';

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
  }
};

// XP required per level (can be adjusted for progression curve)
export const getXPForLevel = (level) => {
  // Exponential growth: 100, 150, 225, 338, 507, etc.
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// Calculate XP earned from completing an exercise
export const calculateExerciseXP = (exerciseId, sets, reps, weight = 0, difficultyModifier = 1) => {
  const exercise = exerciseLibrary.find(ex => ex.id === exerciseId);
  if (!exercise) return 0;
  
  // Base XP per rep
  let baseXP = 10;
  
  // Adjust for exercise difficulty
  const difficultyMultiplier = {
    Beginner: 1.0,
    Intermediate: 1.5,
    Advanced: 2.0
  }[exercise.difficulty] || 1.0;
  
  // Adjust for sets/reps volume
  const volume = sets * reps;
  const volumeMultiplier = Math.min(volume / 10, 5); // Cap at 5x for very high volume
  
  // Weight modifier (if applicable)
  const weightMultiplier = 1 + Math.min(weight / 50, 1); // 50kg max adds 100%
  
  // Total XP calculation
  const totalXP = baseXP * difficultyMultiplier * volumeMultiplier * weightMultiplier * difficultyModifier;
  
  return Math.floor(totalXP);
};

// Distribute XP to skill branches based on exercise mapping
export const distributeSkillXP = (exerciseId, totalXP) => {
  const exercise = exerciseLibrary.find(ex => ex.id === exerciseId);
  if (!exercise || !exercise.skills) return {};
  
  const skillXP = {};
  const totalSkillValue = Object.values(exercise.skills).reduce((sum, value) => sum + value, 0);
  
  // Avoid division by zero
  if (totalSkillValue === 0) return {};
  
  // Distribute XP proportionally to skill contributions
  for (const [skill, value] of Object.entries(exercise.skills)) {
    const proportion = value / totalSkillValue;
    skillXP[skill] = Math.floor(totalXP * proportion);
  }
  
  return skillXP;
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