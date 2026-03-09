export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Saturday (6) and Sunday (0) are total rest
};

const getCardio = (dayIndex) => {
  if (dayIndex <= 60) return "Skipping: 10x 60s Work / 30s Rest (Steady Pace)";
  if (dayIndex <= 120) return "Skipping: 15x 45s High-Knees / 15s Rest (Intensity)";
  return "Skipping: 20 Minutes Max Speed / Double Under Practice (Shred)";
};

export const getWorkoutForDay = (dayIndex) => {
  let phase, titleSuffix, description, intensity;
  let pushVar, backVar, legVar, shoulderVar, coreVar;

  // Global Phase Logic
  if (dayIndex <= 60) {
    phase = 1;
    titleSuffix = "Foundation & Neural Priming";
    description = "Building joint durability. Focus on 130g protein and perfect form. Goal: 77kg.";
    intensity = "Medium";
    pushVar = "4x12 Standard Push-ups";
    backVar = "3x10 Prone Y-T-W Raises";
    legVar = "4x20 Bodyweight Squats";
    shoulderVar = "3x10 Pike Push-ups";
    coreVar = "3x45s Plank";
  } else if (dayIndex <= 120) {
    phase = 2;
    titleSuffix = "Hypertrophy & Density";
    description = "Mechanical tension for muscle size. Stay at a 300kcal deficit. Goal: 74kg.";
    intensity = "High";
    pushVar = "4x10 Diamond Push-ups";
    backVar = "3x12 Weighted Y-T-W (Use water bottles)";
    legVar = "3x12 Bulgarian Split Squats (Per leg)";
    shoulderVar = "3x12 Pike Push-ups (Slow tempo)";
    coreVar = "3x40s Hollow Body Hold";
  } else {
    phase = 3;
    titleSuffix = "Mastery & Final Cut";
    description = "FINAL SHRED: 30s rest between sets. High intensity only. Goal: 70kg.";
    intensity = "Extreme";
    pushVar = "4x12 Decline Push-ups (Feet on bed)";
    backVar = "4x10 Floor Sliders (Pulling with elbows)";
    legVar = "4x15 Jump Squats (Explosive)";
    shoulderVar = "3x5 Wall Walks (Into partial handstand)";
    coreVar = "3x15 V-Ups";
  }

  const cardio = getCardio(dayIndex);
  const superman = "3x45s Superman Holds (Lower Back)";

  // Compound Rotation Logic
  // Every day hits the whole body, but the "Focus" shifts to keep it fresh
  const cycleDay = dayIndex % 5;
  let routine, type;

  if (cycleDay === 1 || cycleDay === 4) {
    type = "Full Body (Push Focus)";
    routine = [cardio, pushVar, backVar, legVar, shoulderVar, coreVar, superman];
  } else if (cycleDay === 2) {
    type = "Full Body (Core & Stamina)";
    routine = [cardio, coreVar, "3x40s Mountain Climbers", pushVar, backVar, legVar, superman];
  } else if (cycleDay === 3) {
    type = "Full Body (Leg Mastery)";
    routine = [cardio, legVar, "3x20 Glute Bridges", pushVar, backVar, shoulderVar, coreVar, superman];
  } else { // 0 (Friday)
    type = "The Friday Burn (All Compounds)";
    routine = [cardio, pushVar, backVar, legVar, shoulderVar, coreVar, superman, "4x20 Jumping Jacks"];
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
