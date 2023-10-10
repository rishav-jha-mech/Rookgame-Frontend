import * as io from "socket.io-client";

const gameArea = document.getElementById("game-area");
const form = document.getElementById("game-start");
const input = document.getElementById("name") as HTMLInputElement;
const submitButton = document.getElementById("submit-btn");
const formCard = document.getElementById("form-card");
const infoCard = document.getElementById("info-card");
const gameDetails = document.getElementById("game-details");
const copyGameIdBtn = document.getElementById("copy-game-id-btn");
const gameIdInput = document.getElementById(
  "game-id-input"
) as HTMLInputElement;
let socketId = "";
let player1Name = "";
let player2Name = "";

// get url params
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");
const player2NameParam = urlParams.get("player2Name");

// Connect to socketio server
const socket = io.connect("http://localhost:5000");

socket.on("connect", () => {
  console.log("Connected to server with socketid : ", socket.id);
  socketId = socket.id;
  // For the 2nd player
  if (gameId && player2NameParam) {
    player2Name = player2NameParam;
    console.log("emittingSocketWvent");
    socket.emit("join-game", JSON.stringify({ gameId, player2Name, socketId }));
  }
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
  alert("Disconnected from server");
  gameArea.remove();
  formCard.remove();
  gameDetails.remove();
  infoCard.style.display = "flex";
  infoCard.innerHTML = `
  <h1 class="text-danger">GAME OVER</h1>
  <h3 class="text-secondary"> Disconnected From Server</h3>
  `;
});

socket.on("start-game", () => {
  console.log("start-game");
  formCard.remove();
  gameDetails.remove();
  gameArea.style.display = "block";
});

socket.on("game-ended", (data) => {
  console.log("game-ended");
  formCard.remove();
  gameDetails.remove();
  gameArea.remove();

  infoCard.style.display = "flex";
  infoCard.innerHTML = `
  <h1 class="text-danger">Game ended</h1>
  <p class="text-secondary">Play another game instead</p>
  <h4 class="text-success"> Winner : ${data?.gameState?.winner ?? ""} </h4>
  <h6 class="text-secondary"> Results : ${data?.gameState?.reason ?? ""} </h6>
  `;
});

socket.on("game-not-found", () => {
  console.log("game-not-found");
  formCard.remove();

  infoCard.style.display = "flex";
  infoCard.innerHTML = `
  <h1 class="text-danger">Game not found</h1>
  <h3 class="text-secondary"> Please check the game id</h3>
  `;
});

socket.on("already-busy", () => {
  console.log("already-busy");
  alert("Game already started !");
  window.location.href = "http://localhost:5501/";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = input.value;
  // fetch request to create a new game
  fetch("http://localhost:5000/api/games/createNewGame", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerName: name, socketId }),
  })
    .then((response) => response.json())
    .then((data) => {
      formCard.remove();
      gameDetails.classList.remove("d-none");
      gameIdInput.value = data.game._id;
    })
    .catch((error) => {
      infoCard.style.display = "flex";
      infoCard.innerHTML = `
  <h1 class="text-danger">Server Error</h1>
  <h3 class="text-secondary">Please refresh the page or try again later</h3>
  `;
      console.log(error);
    });
});

copyGameIdBtn.addEventListener("click", () => {
  gameIdInput.select();

  gameIdInput.select();
  gameIdInput.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(gameIdInput.value);
  document.execCommand(gameIdInput.value);
});
