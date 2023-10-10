import React, { useEffect, useState } from 'react'
import '../assets/css/game.css'
import { IonPhaser } from '@ion-phaser/react';
import { config } from '../game/index'
import useGameState, { GameStateType } from '../hooks/game';
import * as io from "socket.io-client";
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Spinner, FormControl, FormLabel } from 'react-bootstrap'
import Swal from 'sweetalert2';
import { updateGameState } from '../Redux/gameSlice';
import { kPrettyPrint } from '../chalk';


const game = {
  ...config
}

const Game = () => {
  const {
    formModal,
    waitingForOtherPlayerModal,
    updateWaitingModal,
    updateFormModal
  } = useGameState();

  const gameState = useSelector((state: { game: GameStateType }) => state.game);
  const dispatch = useDispatch();
  const urlParams = new URLSearchParams(window.location.search);
  const gameIdParam = urlParams.get("gameId");
  const player2NameParam = urlParams.get("player2Name");
  const [gameId, setGameId] = useState(gameIdParam);
  const [socketId, setSocketId] = useState("");
  function sendToHome() {
    window.location.href = "/";
  }

  // To deal with form modal changes
  useEffect(() => {
    if (!gameId) {
      updateFormModal({
        ...formModal,
        show: true,
      })
    }
  }, [])

  // Game state changes
  useEffect(() => {

    return () => {
    }
  }, [gameState])


  // Socket useEffect
  useEffect(() => {

    // Connect to socketio server
    const socket = io.connect("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server with socketid : ", socket.id);
      setSocketId(socket.id);
      // For the 2nd player
      if (gameId && player2NameParam) {
        console.log(gameId, player2NameParam);

        dispatch(updateGameState({
          ...gameState,
          player2: {
            playerName: player2NameParam,
            socketId: socket.id
          }
        }))
        console.log("emittingSocketWvent");
        socket.emit("join-game", JSON.stringify({ gameId, player2Name: player2NameParam, socketId: socket.id }));
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      if (gameState.isGameStarted) {
        Swal.fire('Game Over', 'Disconnected from server', 'error').then(() => sendToHome())
      } else {
        Swal.fire('Network Disconnected', 'Disconnected from server', 'error').then(() => sendToHome())
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
      // Update game state
      dispatch(updateGameState({
        ...gameState,
        isGameStarted: true,
      }))
    });

    socket.on("game-ended", (data) => {
      console.log("game-ended");
      console.log(data);
      Swal.fire('Game has ended', `Winner : ${data?.gameState?.winner ?? ""}\nResults : ${data?.gameState?.reason ?? ""}`, 'error').then(() => sendToHome())
    });

    socket.on("game-not-found", () => {
      console.log("game-not-found");
      Swal.fire('Game not found', 'Please check the game id', 'error').then(() => sendToHome())
    });

    socket.on("already-busy", () => {
      console.log("already-busy");
      Swal.fire('Game is busy', 'Already two players have joined, join/create another game instead', 'warning').then(() => sendToHome())
    });

    return () => {
      socket.disconnect();
      kPrettyPrint("Socket disconnected useEffect");
    }
  }, []);

  const submitForm = () => {
    const name = formModal.inputText;
    if (name.length === 0) {
      Swal.fire('Empty name', 'Please enter a name before proceeding', 'warning')
      return;
    }
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
        setGameId(data.game._id);
        // This is player1
        dispatch(updateGameState({
          ...gameState,
          player1: {
            playerName: name,
            socketId
          }
        }))
        Swal.fire(
          'Game created successfully',
          'Please wait for the other player to join...',
          'success'
        ).then((result: any) => {
          if (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel) {
            updateFormModal({
              ...formModal,
              show: false,
            })
            updateWaitingModal(true);
          }
        })
      })
      .catch((error) => {
        Swal.fire('Server Error', 'Please refresh the page or try again later', 'error').then(() => sendToHome())
        console.log(error);
      });
  }

  return (
    <>
      <div className="game">
        {waitingForOtherPlayerModal.show &&
          <Card>
            <Card.Header>
              <h4>Waiting for other player to join</h4>
            </Card.Header>
            <Card.Body>
              <p>Wating for other player to join you can share your gameId with others if you want to</p>
              {/* Spinner */}
              <div>
                <Spinner className='mx-auto my-4 d-block' />
              </div>
              <div className='position-relative'>
                <FormControl
                  placeholder='Game Id'
                  defaultValue={gameId ?? ''}
                  readOnly
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(`${gameId}`);
                    Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: 'Game Id copied to clipboard',
                      showConfirmButton: false,
                      timer: 1500
                    })
                  }}
                  className='position-absolute top-0 end-0 d-block'
                >
                  Copy
                </Button>
              </div>
            </Card.Body>
          </Card>
        }
        {formModal.show &&
          <Card>
            <Card.Header>
              <h4>Create a Game</h4>
            </Card.Header>
            <Card.Body>
              <FormLabel className='mb-2'>Enter name</FormLabel>
              <FormControl
                placeholder='Enter name'
                onChange={(e: any) => {
                  updateFormModal({
                    ...formModal,
                    inputText: e.target.value
                  })
                }}
              />
              <div>
                <Button
                  onClick={() => submitForm()}
                  className='ms-auto mt-3 d-block'
                >
                  Start Game
                </Button>

              </div>
            </Card.Body>
          </Card>
        }
        {gameState.isGameStarted &&
          <div className='game-area'>
            <img className="profileIcon" src={`https://api.dicebear.com/7.x/bottts/svg?seed=${gameIdParam ? gameState.player1.playerName : gameState.player2.playerName}`} alt="" />
            <IonPhaser game={game} />
            <img className="profileIcon" src={`https://api.dicebear.com/7.x/bottts/svg?seed=${gameIdParam ? gameState.player2.playerName : gameState.player1.playerName}`} alt="" />
          </div>
        }
      </div>
    </>
  );
}

export default Game