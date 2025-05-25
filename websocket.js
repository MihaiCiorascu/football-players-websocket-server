import { Server } from 'socket.io';

let io;
let allPlayers = []; // Shared state for all players

// Player generator function
function generateRandomPlayer() {
  const positions = ["ST", "CF", "LW", "RW", "LM", "RM", "CAM", "CM", "CDM", "LB", "RB", "CB", "GK"];
  const firstNames = ["Alex", "James", "John", "Michael", "David", "Robert", "William", "Richard", "Joseph", "Thomas", "Charles", "Daniel", "Matthew", "Anthony", "Donald", "Mark", "Paul", "Steven", "Andrew", "Kenneth"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const position = positions[Math.floor(Math.random() * positions.length)];
  const rating = (Math.random() * 4.9 + 5).toFixed(1); // Random rating between 5.0 and 9.9
  const number = Math.floor(Math.random() * 99) + 1;
  const age = Math.floor(Math.random() * 23) + 18; // Random age between 18 and 40
  const goals = position === "GK" ? 0 : Math.floor(Math.random() * 500);

  let ratingColor;
  if (parseFloat(rating) >= 8.0) ratingColor = 'green';
  else if (parseFloat(rating) >= 6.0) ratingColor = 'yellow';
  else ratingColor = 'red';

  const id = Date.now();
  
  return {
    id,
    name: `${firstName} ${lastName}`,
    position,
    rating,
    ratingColor,
    number: number.toString(),
    age: age.toString(),
    goals: goals.toString(),
    image: "https://cdn.builder.io/api/v1/image/assets%2F6c19a84570cc4b7ebcefc63534859305%2Fb17a7bfed461553f6be1a921288e1c35c2749b1db9c45baf0fb5107350e5fee1",
    image1: "/newPlayer1.png",
    image2: "/newPlayer2.png"
  };
}

function initWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*", // Use env variable in production, fallback to * for local/dev
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    // Send current state to new client
    socket.emit('initialPlayers', allPlayers);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Start generating players more frequently
  // setInterval(() => {
  //   const newPlayer = generateRandomPlayer();
  //   allPlayers.push(newPlayer); // Add to shared state
  //   io.emit('newPlayer', newPlayer); // Broadcast to all clients
  // }, 2000);
}

export { initWebSocket }; 