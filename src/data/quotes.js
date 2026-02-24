export const motivationalQuotes = [
  // Anime & Manga
  { quote: "Push through the pain, giving up hurts more.", author: "Vegeta", intensity: "High" },
  { quote: "If you don't take risks, you can't create a future.", author: "Monkey D. Luffy", intensity: "Medium" },
  { quote: "Hard work betrays none, but dreams betray many.", author: "Hachiman Hikigaya", intensity: "Medium" },
  { quote: "There's no shame in falling down! True shame is to not stand up again!", author: "Shintaro Midorima", intensity: "High" },
  { quote: "I am not gonna be your worthless punching bag anymore! I am going to be the champion!", author: "Ippo Makunouchi", intensity: "High" },
  { quote: "It’s not about how much you can lift. It’s about how many times you get back up when the skipping rope hits your shins at 18:15.", author: "GyMPal Anime Coach", intensity: "Medium" },
  { quote: "You have to work harder than anyone else to make it.", author: "Rock Lee", intensity: "Extreme" },
  { quote: "A dropout will beat a genius through hard work.", author: "Rock Lee", intensity: "High" },
  { quote: "To defeat a monster, you have to be willing to throw aside your humanity.", author: "Armin Arlert", intensity: "Extreme" },
  
  // DC/Marvel & Comics
  { quote: "Why do we fall, sir? So that we can learn to pick ourselves up.", author: "Alfred Pennyworth", intensity: "Medium" },
  { quote: "A hero can be anyone.", author: "Batman", intensity: "Medium" },
  { quote: "You’re much stronger than you think you are. Trust me.", author: "Superman", intensity: "Medium" },
  { quote: "It’s not who I am underneath, but what I do that defines me.", author: "Batman", intensity: "High" },
  { quote: "I can do this all day.", author: "Captain America", intensity: "High" },
  { quote: "Whatever it takes.", author: "Captain America", intensity: "Extreme" },
  { quote: "Pain is a choice.", author: "Bane", intensity: "Extreme" },
  { quote: "I am inevitable.", author: "Thanos", intensity: "Extreme" }
];

export const getRandomQuote = (intensity) => {
  const filtered = motivationalQuotes.filter(q => !intensity || q.intensity === intensity);
  if (filtered.length === 0) return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
};
