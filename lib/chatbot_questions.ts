type Question = {
  text: string;
  type: "input" | "select";
  options?: string[];
}

export const QUESTIONS: Question[] = [
  {
    text: "Great! Let’s start with your budget. What price range are you looking for?",
    type: "input"
  },
  {
    text: "Got it. Which location or area would you like the property to be in?",
    type: "select",
    options: []
  },
  {
    text: "How many bedrooms do you need?",
    type: "input"
  },
  {
    text: "And how many bathrooms would you prefer?",
    type: "input"
  },
  {
    text: "What minimum or approximate size (in square feet) are you looking for?",
    type: "input"
  },
  {
    text: "Lastly, are there any specific amenities you'd like?",
    type: "select",
    options: [
      "Gym",
      "Swimming Pool",
      "Parking",
      "Beach Access",
      "Security",
      "Balcony",
      "Private Garden",
      "Smart Home",
      "Garage",
      "Laundry",
      "Rooftop Terrace",
      "Smart Security",
      "Private Elevator",
      "Park View",
      "24/7 Concierge",
      "Fitness Center",
      "Private Dock",
      "Boat Parking",
      "BBQ Area",
      "Backyard",
      "Community Pool",
      "Pet Friendly",
      "Home Office",
      "Solar Panels",
      "Two-Car Garage",
      "Minimalist Design",
      "Smart Appliances",
      "Energy Efficient"
    ]
  }
];