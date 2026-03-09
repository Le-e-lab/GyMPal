export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday are rest days
};

const getCardio = (dayIndex) => {
  if (dayIndex <= 60) return "Skipping: 10x 60s Work / 30s Rest (Steady Pace)";
  if (dayIndex <= 120) return "Skipping: 15x 45s High-Knees / 15s Rest (High Intensity)";
  return "Skipping: 20 Minutes Max Speed / Double Under Practice";
};

export const getWorkoutForDay = (dayIndex) => {
  let phase, titleSuffix, description, intensity, pushVariation, backVariation, legVariation, coreVariation;

  // Phase Logic with specific Fixed-Rep progressions
  if (dayIndex <= 60) {
    phase = 1;
    titleSuffix = "Foundation";
    description = "Building joint durability and form. Aim for 70kg-80kg maintenance/cut. Focus on 130g protein today.";
    intensity = "Medium";
    pushVariation = "4x12 Standard Push-ups";
    backVariation = "3x10 Prone Y-T-W Raises";
    legVariation = "4x20 Bodyweight Squats";
    coreVariation = "3x45s Plank";
  } else if (dayIndex <= 120) {
    phase = 2;
    titleSuffix = "Hypertrophy";
    description = "Increasing mechanical tension for muscle size. Target: 74kg. Focus on 130g protein today.";
    intensity = "High";
    pushVariation = "4x10 Diamond Push-ups";
    backVariation = "3x12 Weighted Y-T-W (Use water bottles)";
    legVariation = "3x12 Bulgarian Split Squats (Per leg)";
    coreVariation = "3x40s Hollow Body Hold";
  } else {
    phase = 3;
    titleSuffix = "Mastery & Cut";
    description = "FINAL SHRED: Keep rest periods short (30s) to keep heart rate in the fat-burning zone. Goal: 70kg.";
    intensity = "Extreme";
    pushVariation = "4x12 Decline Push-ups (Feet on bed)";
    backVariation = "4x10 Floor Sliders (Pulling with elbows)";
    legVariation = "4x15 Jump Squats";
    coreVariation = "3x15 V-Ups";
  }

  const cardioChoice = getCardio(dayIndex);

  // Upper Body (Mon/Thu)
  const upperBodyRoutine = [
    cardioChoice,
    backVariation,
    "3x45s Superman Holds",
    pushVariation,
    "3x10 Pike Push-ups (Shoulder Focus)"
  ];

  // Skipping & Core (Tue)
  const skippingCoreRoutine = [
    cardioChoice,
    coreVariation,
    "3x45s Plank",
    "4x25 Crunches"
  ];

  // Lower Body (Wed)
  const lowerBodyRoutine = [
    cardioChoice,
    legVariation,
    "3x20 Glute Bridges",
    coreVariation
  ];

  // Full Body Burn (Fri)
  const fullBodyBurnRoutine = [
    cardioChoice,
    pushVariation,
    backVariation,
    legVariation,
    "3x45s Superman Holds"
  ];

  const cycleDay = dayIndex % 5;
  let routine, type;

  // Rotation: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 0=Fri
  if (cycleDay === 1 || cycleDay === 4) {
    routine = upperBodyRoutine;
    type = "Upper Body";
  } else if (cycleDay === 2) {
    routine = skippingCoreRoutine;
    type = "Skipping & Core";
  } else if (cycleDay === 3) {
    routine = lowerBodyRoutine;
    type = "Lower Body";
  } else { 
    routine = fullBodyBurnRoutine;
    type = "Full Body Burn";
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
