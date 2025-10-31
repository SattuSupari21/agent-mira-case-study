# Agent Mira Chat Bot

A simple chatbot that helps users find homes based on their preferences.

### Tech Stack
- Next.js
- shadcn
- Tailwind CSS
- uuid
- Typescript
- MongoDB - Mongoose

### Features
- User can enter budget, locations, and other preferences.
- Merges data from different data sources (JSON files).
- Filters properties based on user input.
- Simple and interactive chat bot UI.
- Stores user responses in a Mongodb collection.

### Approach
- Created simple chatbot UI using shadcn and tailwind CSS.
- Chatbot renders text from "messages" array.
- User responses are saved in "responses" array.
- The first response that user enters (budget) is used to fetch properties. the function getAvailablePropertyLocations() accepts a price argument and uses it to filter properties that has 'price' less then or equal to the argument.
- When the size of "reponses" array is equal to the number of questions, it means that the user has provided us all the reponses.
- Now function fetchProperties() is called that gets all the properties based on user filters. This result is saved in browser's local storage.

### Challenges Faced
- When user entered budget that was less then the minimum priced property in our dataset, the chatbot was continuing with other questions, their is no point of asking more questions if the properties are no in user's budget. So I implemented a solution that makes chatbot not ask more questions until user enters a min price.