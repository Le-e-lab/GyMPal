export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Saturday (6) and Sunday (0) are total rest
};

const getCardio = (dayIndex, cycleDay) => {
  // Alternate between Skipping and Jogging
  const isJogDay = cycleDay % 2 === 0; 
  if (dayIndex <= 60) {
    return isJogDay ? "Jogging: 2-3km Easy Pace" : "Skipping: 10x 60s Work / 30s Rest (Steady Pace)";
  }
  if (dayIndex <= 120) {
    return isJogDay ? "Jogging: 4km Moderate Pace or Intervals" : "Skipping: 15x 45s High-Knees / 15s Rest (Intensity)";
  }
  return isJogDay ? "Jogging: 5km Fast Pace / Fartlek" : "Skipping: 20 Minutes Max Speed / Double Under Practice (Shred)";
};

export const getWorkoutForDay = (dayIndex) => {
  let phase, titleSuffix, description, intensity;
  let pushVar, backVar, legVar, shoulderVar, coreVar;

  const cycleDay = new Date().getDay();

  // Global Phase Logic
  if (dayIndex <= 60) {
    phase = 1;
    titleSuffix = "Foundation & Conditioning";
    description = "Starting: 85kg | Goal: 75kg. Natural Regimen: Green tea morning, 150g protein (eggs, chicken, beans). Caloric deficit. Hydrate well.";
    intensity = "Medium";
    pushVar = "4x12 Standard Push-ups (Calisthenics)";
    backVar = "4x10 Dumbbell Rows (using 20kg DB)";
    legVar = "4x12 Dumbbell Goblet Squats (using 20kg DB)";
    shoulderVar = "3x10 Pike Push-ups";
    coreVar = "3x45s Plank";
  } else if (dayIndex <= 120) {
    phase = 2;
    titleSuffix = "Hypertrophy & Fat Loss";
    description = "Phase 2 | Goal: 75kg. Natural Regimen: Apple cider vinegar pre-meals, black coffee pre-workout. High protein, complex carbs.";
    intensity = "High";
    pushVar = "4x10 Decline Push-ups or Dumbbell Floor Press";
    backVar = "3x12 Dumbbell Pullover & Rows";
    legVar = "3x12 Dumbbell Lunges (Per leg, 20kg)";
    shoulderVar = "3x10 Dumbbell Overhead Press / Pike Push-ups";
    coreVar = "3x40s Hollow Body Hold & Russian Twists";
  } else {
    phase = 3;
    titleSuffix = "Mastery & Final Cut";
    description = "Final Phase | Goal: 75kg. Natural Regimen: High water intake, ginger/lemon tea, strict portion control. High protein.";
    intensity = "Extreme";
    pushVar = "4x12 Explosive Push-ups";
    backVar = "4x10 Renegade Rows (using 20kg DB)";
    legVar = "4x15 Jump Squats & Dumbbell Romanian Deadlifts";
    shoulderVar = "4x10 Handstand Push-up negatives / DB Press";
    coreVar = "3x15 V-Ups & L-Sits";
  }

  const cardio = getCardio(dayIndex, cycleDay);
  const superman = "3x45s Superman Holds (Lower Back)";

  // Compound Rotation Logic
  let routine, type;

  if (cycleDay === 1 || cycleDay === 4) { // Monday & Thursday
    type = "Full Body (Push & DB Focus)";
    routine = [cardio, pushVar, backVar, legVar, shoulderVar, coreVar, superman];
  } else if (cycleDay === 2) { // Tuesday
    type = "Calisthenics & Core Mastery";
    routine = [cardio, coreVar, "3x40s Mountain Climbers", pushVar, backVar, legVar, superman];
  } else if (cycleDay === 3) { // Wednesday
    type = "Lower Body & DB Power";
    routine = [cardio, legVar, "3x15 Dumbbell RDLs (using 20kg)", pushVar, backVar, shoulderVar, coreVar, superman];
  } else { // 5 (Friday)
    type = "The Friday Burn (Mixed)";
    routine = [cardio, pushVar, backVar, legVar, shoulderVar, coreVar, "Farmers Walk (20kg DBs)", superman];
  }

  return {
    phase,
    title: `${type} - ${titleSuffix}`,
    description,
    routine,
    intensity
  };
};

export const getSnackPunishment = () => {
  const punishments = [
    "🔥 Snack Penalty: 50 Burpees",
    "🔥 Snack Penalty: 100 Jumping Jacks",
    "🔥 Snack Penalty: 2 Minute Plank",
    "🔥 Snack Penalty: 50 Mountain Climbers",
    "🔥 Snack Penalty: 30 Jump Squats"
  ];
  return punishments[Math.floor(Math.random() * punishments.length)];
};
