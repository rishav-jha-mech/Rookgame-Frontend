import React, { useEffect, useState } from "react";
import "../assets/css/game.css";
import { IonPhaser } from "@ion-phaser/react";
import { config } from "../game/index";
import useGameState, { GameStateType } from "../hooks/game";
import * as io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Spinner, FormControl, FormLabel } from "react-bootstrap";
import Swal from "sweetalert2";
import { updateGameState } from "../Redux/gameSlice";
import { kPrettyPrint } from "../chalk";
import { CircularProgressbar } from "react-circular-progressbar";

const game = {
  ...config,
};

// Connect to socketio server
const socket = io.connect("http://localhost:5000");

const Game = () => {
  const {
    formModal,
    waitingForOtherPlayerModal,
    updateWaitingModal,
    updateFormModal,
  } = useGameState();

  const gameState = useSelector((state: { game: GameStateType }) => state.game);
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const gameIdParam = urlParams.get("gameId");
  const player2NameParam = urlParams.get("player2Name");
  const [gameId, setGameId] = useState(gameIdParam);
  const [timerSelf, setTimerSelf] = useState(30);
  const [timerOther, setTimerOther] = useState(30);
  function sendToHome() {
    window.location.href = "/";
  }

  // To deal with form modal changes
  useEffect(() => {
    if (!gameId) {
      updateFormModal({
        ...formModal,
        show: true,
      });
    }
  }, []);

  // Game state changes
  useEffect(() => {
    return () => {};
  }, [gameState]);

  // Movement of rook socket
  useEffect(() => {
    if (gameState.isGameStarted) {
      console.log("rook-moved");
      socket.emit(
        "rook-moved",
        JSON.stringify({
          gameId,
          rookRow: gameState.rookRow,
          rookCol: gameState.rookCol,
          socketId: socket.id,
        })
      );
    }
  }, [gameState.playerTurn]);

  // Socket useEffect
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with socketid : ", socket.id);
      // For the 2nd player
      if (gameId && player2NameParam) {
        dispatch(
          updateGameState({
            player2: {
              playerName: player2NameParam,
              socketId: socket.id,
            },
          })
        );
        console.log("emittingSocketWvent");
        socket.emit(
          "join-game",
          JSON.stringify({
            gameId,
            player2Name: player2NameParam,
            socketId: socket.id,
          })
        );
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      if (gameState.isGameStarted) {
        Swal.fire("Game Over", "Disconnected from server", "error").then(() =>
          sendToHome()
        );
      } else {
        Swal.fire(
          "Network Disconnected",
          "Disconnected from server",
          "error"
        ).then(() => sendToHome());
      }
    });

    socket.on("start-game", (data) => {
      console.log("start-game");
      console.log(data);
      updateWaitingModal(false);
      updateFormModal({
        ...formModal,
        show: false,
      });
      let players: { _id: string; playerName: string; socketId: string }[] =
        data.players;
      // Set data for player 1
      if (player2NameParam) {
        players.map((item) => {
          if (item.playerName !== player2NameParam) {
            dispatch(
              updateGameState({
                player1: {
                  playerName: item.playerName,
                  socketId: item.socketId,
                },
              })
            );
          }
        });
      } else {
        // Set data for player 2
        players.map((item) => {
          if (item.playerName !== formModal.inputText) {
            dispatch(
              updateGameState({
                player2: {
                  playerName: item.playerName,
                  socketId: item.socketId,
                },
              })
            );
          }
        });
      }
      // If the player is the one who has created the game is here
      // He will get to make the first move
      if (gameIdParam && player2NameParam) {
        dispatch(
          updateGameState({
            playerTurn: false,
          })
        );
      } else {
        dispatch(
          updateGameState({
            playerTurn: true,
          })
        );
      }
      dispatch(
        updateGameState({
          isGameStarted: true,
        })
      );
    });

    socket.on("game-ended", (data) => {
      console.log("game-ended");
      console.log(data);
      Swal.fire(
        "Game has ended",
        `Winner : ${data?.gameState?.winner ?? ""}\nResults : ${
          data?.gameState?.reason ?? ""
        }`,
        "error"
      ).then(() => sendToHome());
    });

    socket.on("game-not-found", () => {
      console.log("game-not-found");
      Swal.fire("Game not found", "Please check the game id", "error").then(
        () => sendToHome()
      );
    });

    socket.on("already-busy", () => {
      console.log("already-busy");
      Swal.fire(
        "Game is busy",
        "Already two players have joined, join/create another game instead",
        "warning"
      ).then(() => sendToHome());
    });

    socket.on("update-rook-position", (data) => {
      console.log("update-rook-position");
      console.log({
        data,
        rookRow: gameState.rookRow,
        rookCol: gameState.rookCol,
      });
      if (
        data.rookRow !== gameState.rookRow ||
        data.rookCol !== gameState.rookCol
      ) {
        dispatch(
          updateGameState({
            rookRow: data.rookRow,
            rookCol: data.rookCol,
            playerTurn: true,
          })
        );
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("start-game");
      socket.off("game-ended");
      socket.off("game-not-found");
      socket.off("already-busy");
      socket.off("update-rook-position");
      kPrettyPrint("Socket disconnected useEffect");
    };
  }, [gameState.rookCol, gameState.rookRow, gameState.playerTurn]);

  const submitForm = () => {
    const name = formModal.inputText;
    if (name.length === 0) {
      Swal.fire(
        "Empty name",
        "Please enter a name before proceeding",
        "warning"
      );
      return;
    }
    // fetch request to create a new game
    fetch("http://localhost:5000/api/games/createNewGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerName: name, socketId: socket.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        setGameId(data.game._id);
        dispatch(
          updateGameState({
            player1: {
              playerName: name,
              socketId: socket.id,
            },
          })
        );
        Swal.fire(
          "Game created successfully",
          "Please wait for the other player to join...",
          "success"
        ).then((result: any) => {
          if (
            result.isConfirmed ||
            result.dismiss === Swal.DismissReason.cancel
          ) {
            updateFormModal({
              ...formModal,
              show: false,
            });
            updateWaitingModal(true);
          }
        });
      })
      .catch((error) => {
        Swal.fire(
          "Server Error",
          "Please refresh the page or try again later",
          "error"
        ).then(() => sendToHome());
        console.log(error);
      });
  };

  return (
    <>
      <div className="game">
        <div className="card">
          <pre>{JSON.stringify(gameState, null, 4)}</pre>
        </div>
        {waitingForOtherPlayerModal.show && (
          <Card>
            <Card.Header>
              <h4>Waiting for other player to join</h4>
            </Card.Header>
            <Card.Body>
              <p>
                Wating for other player to join you can share your gameId with
                others if you want to
              </p>
              {/* Spinner */}
              <div>
                <Spinner className="mx-auto my-4 d-block" />
              </div>
              <div className="position-relative">
                <FormControl
                  placeholder="Game Id"
                  defaultValue={gameId ?? ""}
                  readOnly
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`${gameId}`);
                    Swal.fire({
                      position: "top-end",
                      icon: "success",
                      title: "Game Id copied to clipboard",
                      showConfirmButton: false,
                      timer: 1500,
                    });
                  }}
                  className="position-absolute top-0 end-0 d-block"
                >
                  Copy
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
        {formModal.show && (
          <Card>
            <Card.Header>
              <h4>Create a Game</h4>
            </Card.Header>
            <Card.Body>
              <FormLabel className="mb-2">Enter name</FormLabel>
              <FormControl
                placeholder="Enter name"
                onChange={(e: any) => {
                  updateFormModal({
                    ...formModal,
                    inputText: e.target.value,
                  });
                }}
              />
              <div>
                <Button
                  onClick={() => submitForm()}
                  className="ms-auto mt-3 d-block"
                >
                  Start Game
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
        {gameState.isGameStarted && (
          <div className="game-area">
            <div className="playerSection">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgressbar
                  styles={{
                    root: {
                      height: "78px",
                      width: "78px",
                      position: "absolute",
                      top: "20px",
                      zIndex: "1",
                    },
                    path: {
                      stroke: "#3DD771",
                    },
                    trail: {
                      stroke: "#2B2B2B",
                    },
                  }}
                  value={timerOther / 30}
                  maxValue={1}
                  counterClockwise
                />
              </div>
              <img
                className="profileIcon"
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${
                  gameIdParam
                    ? gameState.player1.playerName
                    : gameState.player2.playerName
                }`}
                alt=""
              />
              <div className="text top">
                {`${
                  gameIdParam
                    ? gameState.player1.playerName
                    : gameState.player2.playerName
                }`}{" "}
              </div>
              <div className="turn text-white position-absolute start-0 bottom-0">
                {gameState.playerTurn ? "" : "Opponents Turn"}
              </div>
            </div>

            <IonPhaser game={game} />
            <div className="playerSection">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgressbar
                  styles={{
                    root: {
                      height: "78px",
                      width: "78px",
                      position: "absolute",
                      top: "20px",
                      zIndex: "1",
                    },
                    path: {
                      stroke: "#3DD771",
                    },
                    trail: {
                      stroke: "#2B2B2B",
                    },
                  }}
                  value={timerSelf / 30}
                  maxValue={1}
                  counterClockwise
                />
              </div>
              <img
                className="profileIcon z-100"
                src={`https://api.dicebear.com/7.x/bottts/svg?seed=${
                  gameIdParam
                    ? gameState.player2.playerName
                    : gameState.player1.playerName
                }`}
                alt=""
              />
              <div className="text bottom">{`${
                gameIdParam
                  ? gameState.player2.playerName
                  : gameState.player1.playerName
              } (You)`}</div>
              <div className="turn text-white position-absolute end-0 bottom-0">
                {gameState.playerTurn ? "Your Turn" : ""}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Game;
