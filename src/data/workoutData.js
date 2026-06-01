export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0; // Sunday only = full rest + recovery
};

const getCardio = (dayIndex, cycleDay) => {
  const isLongRunDay = cycleDay === 6; // Saturday
  const isRunDay = cycleDay === 2 || cycleDay === 4 || isLongRunDay; // Tue/Thu + long run Sat

  if (dayIndex <= 28) {
    if (isLongRunDay) return "Long Run: 4-6km Easy + Walk Breaks";
    if (isRunDay) return "Run/Walk: 2-3km Easy (3 min run / 2 min walk)";
    return "Skipping: 8x 45s Work / 30s Rest (Steady)";
  }

  if (dayIndex <= 56) {
    if (isLongRunDay) return "Long Run: 6-8km Easy";
    if (isRunDay) return "Jog: 3-4km Easy + 4x 20s Strides";
    return "Skipping: 10x 60s Work / 30s Rest (Steady)";
  }

  if (dayIndex <= 84) {
    if (isLongRunDay) return "Long Run: 8-10km Easy (Cap)";
    if (isRunDay) return "Jog: 4-5km Easy OR 6x 200m Fast / 200m Walk";
    return "Skipping: 12x 45s High-Knees / 15s Rest (Intensity)";
  }

  if (dayIndex <= 120) {
    if (isLongRunDay) return "Long Run: 8-10km Easy (Cap)";
    if (isRunDay) return "Jog: 5-6km Moderate OR 8x 200m Fast / 200m Walk";
    return "Skipping: 15x 45s High-Knees / 15s Rest (Intensity)";
  }

  if (isLongRunDay) return "Long Run: 8-10km Easy (Cap)";
  if (isRunDay) return "Jog: 6-8km Easy + 4x 30s Strides";
  return "Skipping: 20 Minutes Mixed Pace (Speed + Endurance)";
};

export const getWorkoutForDay = (dayIndex) => {
  let phase, titleSuffix, description, intensity;
  let pushVar, backVar, legVar, shoulderVar, coreVar;

  const cycleDay = new Date().getDay();

  // Global Phase Logic
  if (dayIndex <= 28) {
    phase = 1;
    titleSuffix = "Reboot & Form";
    description = "Starting: 85kg | Goal: 75kg. Focus on consistency, form, and controlled volume. Protein 130g+ daily, hydrate well.";
    intensity = "Medium";
    pushVar = "3x8 Incline or Knee Push-ups (controlled)";
    backVar = "3x10 One-Arm Dumbbell Rows (light/moderate)";
    legVar = "3x10 Goblet Squats (controlled)";
    shoulderVar = "2x8 Pike Push-ups or DB Press (light)";
    coreVar = "3x30s Plank + Dead Bug";
  } else if (dayIndex <= 84) {
    phase = 2;
    titleSuffix = "Base Build & Fat Loss";
    description = "Build volume + stamina. Add weight gradually. Keep runs easy, fuel recovery.";
    intensity = "High";
    pushVar = "4x10 Standard Push-ups or DB Floor Press";
    backVar = "4x10 Dumbbell Rows (20kg if solid form)";
    legVar = "4x12 Goblet Squats + Reverse Lunges";
    shoulderVar = "3x10 Pike Push-ups / DB Overhead Press";
    coreVar = "3x40s Plank + 3x12 Russian Twists";
  } else if (dayIndex <= 140) {
    phase = 3;
    titleSuffix = "Strength + Endurance";
    description = "Push strength while building long-run capacity. Maintain protein, sleep, hydration.";
    intensity = "High";
    pushVar = "4x12 Decline Push-ups or DB Press";
    backVar = "4x12 Dumbbell Rows + Pullovers";
    legVar = "4x12 DB Lunges + RDLs";
    shoulderVar = "3x12 DB Overhead Press / Pike Push-ups";
    coreVar = "3x45s Hollow Hold + 3x12 V-Ups";
  } else {
    phase = 4;
    titleSuffix = "Half-Marathon Peak";
    description = "Peak endurance block. Long runs are priority. Keep strength concise but consistent.";
    intensity = "Extreme";
    pushVar = "3x12 Explosive Push-ups";
    backVar = "3x10 Renegade Rows (20kg)";
    legVar = "3x12 DB Squats + RDLs";
    shoulderVar = "3x10 Handstand Push-up negatives / DB Press";
    coreVar = "3x15 V-Ups + 3x30s L-Sits";
  }

  const cardio = getCardio(dayIndex, cycleDay);
  const superman = "3x45s Superman Holds (Lower Back)";

  // Weekly split tuned for run endurance + strength
  let routine, type;

  if (cycleDay === 1) { // Monday
    type = "Strength A (Full Body)";
    routine = [pushVar, backVar, legVar, shoulderVar, coreVar, superman];
  } else if (cycleDay === 2) { // Tuesday
    type = "Run Day (Easy)";
    routine = [cardio, "10 min mobility flow", coreVar];
  } else if (cycleDay === 3) { // Wednesday
    type = "Strength B (Lower + Core)";
    routine = [legVar, "3x12 Dumbbell RDLs", backVar, coreVar, superman];
  } else if (cycleDay === 4) { // Thursday
    type = "Run Day (Easy/Intervals)";
    routine = [cardio, "8 min stretch + breathing", coreVar];
  } else if (cycleDay === 5) { // Friday
    type = "Strength C (Upper + Conditioning)";
    routine = [pushVar, backVar, shoulderVar, "3x12 Farmers Walk (20kg DBs)", coreVar];
  } else if (cycleDay === 6) { // Saturday
    type = "Long Run Day";
    routine = [cardio, "10 min walk cooldown", "5 min stretch"];
  } else { // Sunday
    type = "Recovery Day";
    routine = ["20-30 min walk", "Mobility: hips + shoulders", "Hydration + meal prep"];
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
