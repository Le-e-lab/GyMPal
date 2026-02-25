export const motivationalQuotes = [
  // Dragon Ball Z
  { quote: "Push through the pain, giving up hurts more.", author: "Vegeta", intensity: "High" },
  { quote: "Power comes in response to a need, not a desire.", author: "Goku", intensity: "High" },
  { quote: "It’s not over when you lose. It’s over when you quit.", author: "Vegeta", intensity: "Extreme" },
  { quote: "There's only one certainty in life. A strong man stands above and conquers all!", author: "Vegeta", intensity: "Extreme" },
  { quote: "I would rather be a brainless monkey than a heartless monster.", author: "Goku", intensity: "Medium" },
  
  // Batman
  { quote: "Why do we fall? So that we can learn to pick ourselves up.", author: "Batman", intensity: "Medium" },
  { quote: "It’s not who I am underneath, but what I do that defines me.", author: "Batman", intensity: "High" },
  { quote: "A hero can be anyone. Even a man doing something as simple and reassuring as putting a coat around a young boy's shoulders.", author: "Batman", intensity: "Medium" },
  { quote: "Sometimes it's only madness that makes us what we are.", author: "Batman", intensity: "Extreme" },
  { quote: "I have one power. I never give up.", author: "Batman", intensity: "High" },

  // Spiderman
  { quote: "With great power comes great responsibility.", author: "Uncle Ben (Spiderman)", intensity: "Medium" },
  { quote: "You can't be a friendly neighborhood Spider-Man if there's no neighborhood.", author: "Spiderman", intensity: "High" },
  { quote: "No matter how many hits I take, I always find a way to come back.", author: "Spiderman", intensity: "High" },
  { quote: "I will always be Spider-Man. You can't take that away from me.", author: "Spiderman", intensity: "Extreme" },
  
  // Mixed / Existing Highlights
  { quote: "If you don't take risks, you can't create a future.", author: "Monkey D. Luffy", intensity: "Medium" },
  { quote: "A dropout will beat a genius through hard work.", author: "Rock Lee", intensity: "High" },
  { quote: "It’s not about how much you can lift. It’s about how many times you get back up when the skipping rope hits your shins at 18:15.", author: "GyMPal Anime Coach", intensity: "Medium" },
  { quote: "I can do this all day.", author: "Captain America", intensity: "High" }
];

export const getRandomQuote = (intensity) => {
  const filtered = motivationalQuotes.filter(q => !intensity || q.intensity === intensity);
  if (filtered.length === 0) return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  return filtered[Math.floor(Math.random() * filtered.length)];
};
