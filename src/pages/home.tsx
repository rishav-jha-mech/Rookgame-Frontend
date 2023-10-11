import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/home.css";
import { SERVER_URL } from "../constants";

const Home = () => {
  const [show, setShow] = React.useState(false);
  const [gameCode, setGameCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [isBtnLoading, setIsBtnLoading] = React.useState(false);
  const navigate = useNavigate();

  const checkGameAndJoin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (gameCode === "") {
      Swal.fire("Error", "Game code cannot be empty", "error");
      return;
    }
    if (name === "") {
      Swal.fire("Error", "Name cannot be empty", "error");
      return;
    }
    if (name.length >= 50) {
      Swal.fire("Error", "Name cannot be more than 50 characters", "error");
      return;
    }
    setIsBtnLoading(true);
    fetch(`${SERVER_URL}/api/games/gameExists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId: gameCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsBtnLoading(false);
        if (data.error) {
          Swal.fire("Error", `${data?.error}`, "error");
          return;
        }
        Swal.fire(`${data?.message}`, "Click Ok to join the game", "success").then(
          () => {
            window.location.href = `/game?gameId=${gameCode}&player2Name=${name}`;
          }
        );
      })
      .catch((error: any) => {
        setIsBtnLoading(false);
        Swal.fire("Error", `${error?.error}`, "error");
        console.error({ error });
      });
  };
  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Join Game</Modal.Title>
        </Modal.Header>
        <Form onSubmit={(e) => checkGameAndJoin(e)}>
          <Modal.Body>
            <Form.Label className="fw-medium ">Game Code</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              placeholder="Enter Game Code"
              onChange={(e) => setGameCode(e.target.value)}
              required
            />
            <Form.Label className="fw-medium mt-3">Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button variant="info" type="submit" disabled={isBtnLoading}>
              {isBtnLoading ? <Spinner variant="white" size="sm" /> : "Join Game"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div className="home">
        <div className="row content-area">
          <div className="col-12 col-lg-4">
            <div className="card" id="game">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center border-bottom mb-3">
                  <img src="./assets/rook.svg" alt="rook" className="rook" />
                  <h3>Rook Move</h3>
                </div>
                <p className="text-center mt-4">
                  You can join a game using a <strong>"Game code"</strong> or{" "}
                  <strong>"Create a new game"</strong> and invite your friends.
                </p>
                <p className="text-center">
                  Join the Thrilling Rook Race or Forge Your Path to Victory!
                  Conquer the Chessboard and Emerge as the Ultimate Rook Master
                </p>
                <div className="d-flex align-items-center justify-content-center flex-column flex-sm-row mt-5">
                  <Button
                    className="me-0 mb-2 mb-sm-0 w-100 w-sm-unset me-sm-3 aqua-btn"
                    onClick={() => setShow(true)}
                    variant="info"
                  >
                    Join a game
                  </Button>
                  <Button
                    className="aqua-btn w-100 w-sm-unset"
                    onClick={() => navigate("/game")}
                    variant="info"
                  >
                    Create new game
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4" id="rules">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-center border-bottom mb-3">
                  <img
                    src="./assets/rules-icon.svg"
                    alt="rook"
                    className="rules"
                  />
                  <h3>Game Rules</h3>
                </div>
                <ul>
                  <li>The game will be played on an 8x8 chessboard.</li>
                  <li>
                    {" "}
                    There will be two players, and they will take turns to move
                    the rook. Rooks starts from the top right square.
                  </li>
                  <li>
                    {" "}
                    On each turn, a player can move the rook any number of steps
                    to the left or down, but not up, right or diagonally.
                  </li>
                  <li>
                    {" "}
                    The player who reaches the bottom-left corner of the board
                    first wins the game.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-dark py-3">
        <p className="mb-0 text-center text-info">
          Made with 💜 by{" "}
          <a
            href="https://rishav-jha-mech.github.io/devraj"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rishav Jha
          </a>{" "}
        </p>
      </footer>
    </>
  );
};

export default Home;
