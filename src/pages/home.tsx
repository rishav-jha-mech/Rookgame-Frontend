import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../assets/css/home.css";

const Home = () => {
  const [show, setShow] = React.useState(false);
  const [gameCode, setGameCode] = React.useState("");
  const [name, setName] = React.useState("");

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

    fetch(`http://localhost:5000/api/games/gameExists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId: gameCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          Swal.fire("Error", `${data?.error}`, "error");
          return;
        }
        Swal.fire("Game exists", "Click Ok to join the game", "success").then(
          () => {
            window.location.href = `/game?gameId=${gameCode}&player2Name=${name}`;
          }
        );
      })
      .catch((error: any) => {
        Swal.fire("Error", `${error?.error}`, "error");
        console.error({ error });
      });
  };
  return (
    <>
      <Modal show={show}>
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
            <Button className="btn btn-primary" onClick={() => setShow(false)}>
              Close
            </Button>
            <Button className="btn btn-primary" type="submit">
              Join Game
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <div className="home">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-center border-bottom mb-3">
              <img src="./assets/rook.svg" alt="rook" className="rook" />
              <h1>Rook Move</h1>
            </div>
            <h4 className="text-center mt-4">
              You can join a game using a game code or create a new game and
              invite your friends.
            </h4>
            <br />
            <br />
            <br />
            <div className="d-flex align-items-center justify-content-center mt-5">
              <Button
                className="btn btn-info btn-lg me-3"
                onClick={() => setShow(true)}
              >
                Join a game
              </Button>
              <Link className="btn btn-info btn-lg" to="/game">
                Create new game
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
