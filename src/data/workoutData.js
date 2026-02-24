// 6-month progression (180 days)
// Phased approach:
// Month 1-2 (Days 1-60): Foundation - High Volume
// Month 3-4 (Days 61-120): Strength - Explosive
// Month 5-6 (Days 121-180): Lean/Stamina - HIIT

export const getWorkoutForDay = (day, isWeekendFlag = false) => {
  // Base routine is always 30m skipping
  const base = "30m Skipping Rope";
  
  let workout = {};
  
  // Phase 1: Foundation (Days 1-60)
  if (day <= 60) {
    workout = {
      phase: 1,
      title: "Foundation",
      description: "Building the base with high volume calisthenics.",
      routine: [
        base,
        "4x15 Standard Push-ups",
        "4x20 Bodyweight Squats",
        "3x8 Pull-ups (or negatives)",
        "3x10 Chair Dips"
      ],
      intensity: "Medium"
    };
  } else if (day <= 120) {
    // Phase 2: Strength (Days 61-120)
    workout = {
      phase: 2,
      title: "Strength",
      description: "Developing explosive power.",
      routine: [
        base,
        "4x10 Clap Push-ups",
        "4x15 Jumping Lunges (per leg)",
        "4x8 Explosive Pull-ups",
        "4x10 Straight Bar Dips"
      ],
      intensity: "High"
    };
  } else {
    // Phase 3: Lean/Stamina (Days 121-180)
    workout = {
      phase: 3,
      title: "Lean/Stamina",
      description: "High-Intensity Interval Training (HIIT) Calisthenics.",
      routine: [
        base,
        "5x20 Spiderman Push-ups",
        "5x20 Pistol Squat Progressions",
        "4x10 Muscle-up Progressions",
        "4x15 Ring Dips / Deep Dips"
      ],
      intensity: "Extreme"
    };
  }
  
  // On weekends, prepend a Night Run
  if (isWeekendFlag) {
    workout.title = workout.title + " + Night Run";
    workout.description = "Weekend Special: " + workout.description;
    workout.routine = ["Night Run (3-5km)", ...workout.routine];
    workout.intensity = "Extreme"; // Weekends are harder now
  }
  
  return workout;
};

// Check if a day is a weekday
export const isWeekday = (date) => {
  const day = date.getDay();
  // We'll treat Sunday (0) natively as the main rest day, while 1-6 are active.
  // Although weekend logic treats Saturday (6) special.
  return day !== 0; 
};

// Generate a random punishment for snacking
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
