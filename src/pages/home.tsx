import React from "react";
import "../assets/css/home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
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
            <a className="btn btn-info btn-lg me-3">Join a game</a>
            <Link className="btn btn-info btn-lg" to="/game">
              Create new game
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
