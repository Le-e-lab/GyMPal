// 6-month progression (180 days)
// Phased approach:
// Month 1-2 (Days 1-60): Foundation - High Volume
// Month 3-4 (Days 61-120): Strength - Explosive
// Month 5-6 (Days 121-180): Lean/Stamina - HIIT

export const getWorkoutForDay = (day, isWeekendFlag = false) => {
  // Base routine lets the user choose between Jogging and Skipping
  const cardioChoice = "Jog (3-5km) OR Skip (30m)";
  
  let workout = {};
  
  // Phase 1: Foundation (Days 1-60)
  if (day <= 60) {
    workout = {
      phase: 1,
      title: "Foundation",
      description: "Building a lean, strong base for an 80kg frame.",
      routine: [
        cardioChoice,
        "4x15 Standard Push-ups (Chest/Tris)",
        "4x20 Bodyweight Squats (Quads/Glutes)",
        "3x8 Pull-ups or Negatives (Lats/Biceps)",
        "3x10 Chair Dips (Triceps/Shoulders)"
      ],
      intensity: "Medium"
    };
  } else if (day <= 120) {
    // Phase 2: Strength (Days 61-120)
    workout = {
      phase: 2,
      title: "Strength & Control",
      description: "Developing explosive power and body control.",
      routine: [
        cardioChoice,
        "4x12 Diamond Push-ups (Tris/Inner Chest)",
        "4x15 Jumping Lunges per leg (Explosive Legs)",
        "4x8 Explosive/Clapping Pull-ups (Back power)",
        "4x10 Straight Bar Dips (Chest/Tris)"
      ],
      intensity: "High"
    };
  } else {
    // Phase 3: Lean/Stamina (Days 121-180)
    workout = {
      phase: 3,
      title: "Lean & Mastery",
      description: "High-Intensity Calisthenics to shred down the 80kg frame.",
      routine: [
        cardioChoice,
        "5x20 Spiderman Push-ups (Core & Chest)",
        "5x10 Pistol Squats per leg (Leg Mastery)",
        "4x10 Muscle-up Progressions (Pulling Power)",
        "4x15 Ring Dips or Deep Dips (Shoulder Stability)"
      ],
      intensity: "Extreme"
    };
  }
  
  // On weekends, prepend a Night Run
  if (isWeekendFlag) {
      workout.title = workout.title + " + Weekend Grind";
      workout.description = "Weekend Special: Push harder. " + workout.description;
      // Note: We don't need to inject another run since cardioChoice is already the first item.
      // But we can add a core finisher for weekends.
      workout.routine = [...workout.routine, "3x60s Plank (Core Finisher)", "4x25 Crunches"];
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
