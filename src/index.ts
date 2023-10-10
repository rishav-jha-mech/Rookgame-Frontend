import * as io from "socket.io-client";

const gameArea = document.getElementById("game-area");
const form = document.getElementById("game-start");
const input = document.getElementById("name") as HTMLInputElement;
const submitButton = document.getElementById("submit-btn");
const formCard = document.getElementById("form-card");
const gameOver = document.getElementById("game-over");
const errorName = document.getElementById("error-name");
const reason = document.getElementById("reason");
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
  console.log("Connected to server");
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
  gameArea.style.display = "none";
  gameOver.style.display = "block";
  reason.innerHTML = "Disconnected from server";
});

socket.on("game-started", () => {
  console.log("game-started");
  gameDetails.style.display = "none";
  gameArea.style.display = "block";
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
      gameDetails.style.display = "block";
      gameIdInput.value = data.game._id;
    })
    .catch((error) => {
      errorName.innerHTML = "Server Error";
      reason.innerText = `Please refresh the page or try again later`;
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
