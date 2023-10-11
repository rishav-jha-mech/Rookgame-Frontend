## Rook Game Frontend

<p align="center">
  <img src="./doc/images/rook.svg" alt="rook" width="100"/>
</p>

<p align="center">
  <i> This Rook ain't no rookie </i>
</p>


<p align="center">
  <a href="https://cue-math-hiring.vercel.app/" rel="noopener">Play Rook Game</a>
</p>

## Table of Contents

- [Rook Game Frontend](#rook-game-frontend)
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Game Rules](#game-rules)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Install dependencies](#2-install-dependencies)
    - [3. Start the server](#3-start-the-server)
- [Folder Structure](#folder-structure)
- [Project Motivation](#project-motivation)
- [Key Objectives](#key-objectives)
- [Learning Outcomes](#learning-outcomes)
- [Future Enhancements](#future-enhancements)


## Introduction

Welcome to the Rook Move Game, a thrilling 1v1 chess-inspired challenge where strategic thinking and quick decision-making are the keys to victory! In this fast-paced game, players navigate an 8x8 chessboard, guiding their rook pieces to race to the bottom-left corner before their opponent does. Let the battle of wits begin!

## Game Rules

1. **Objective:** The goal of the game is to reach the bottom-left corner of the 8x8 chessboard before your opponent.

2. **Starting Position:** Players begin with their rook pieces at the top-right corner of the chessboard.

3. **Moves:** On each turn, a player can move their rook any number of steps to the left or down. Diagonal moves and movements in other directions are not allowed.

4. **Multiplayer Gameplay:** This game supports real-time multiplayer functionality. Players can connect and compete against each other in real-time matches.

5. **Turn Timer:** Each player has 30 seconds to make their move. If a player fails to make a move within the allocated time, the game ends, and their opponent wins.

6. **Victory:** The first player to reach the bottom-left corner of the chessboard wins the game and is declared the ultimate Rook Move champion!

Are you ready to outmaneuver your opponent, plan your moves wisely, and claim victory in the Rook Move Game? Let the race to the finish line begin!


## Tech Stack

- React - Initially started with DOM manipulation, but then switched to React because of complexity of the project
- Redux - For state management
- Socket.io - For real time communication between players
- Bootstrap - Design library
- Swal - Alert library

## Installation

#### 1. Clone the repository

```
git clone https://github.com/rishav-jha-mech/Rookgame-Frontend.git
```

#### 2. Install dependencies

```
npm i --legacy-peer-deps
```

#### 3. Start the server

```
npm start
```

## Folder Structure

```
- src:
  - assets: Contains all the assets used in the project
  - game: Contains all the game logic and assets
  - hooks: Contains all the custom hooks
  - pages: Contains all the pages
  - Redux: Contains all the redux logic
  - App.tsx: Contains the main app component
  - constants.ts: Contains all the constants used in the project
  - index.tsx: Contains the main index file
```

## Project Motivation

The motivation behind this project was driven by a unique opportunity presented by the Cuemath team. Tasked with the challenge as part of Cuemath's game developer hiring process, the project served as a practical assessment of my skills and creativity. Success in this endeavor not only represented a chance to showcase my abilities but also the prospect of joining a forward-thinking team at Cuemath. The project, therefore, became a compelling avenue to prove my expertise, passion, and suitability for the role, motivating me to deliver an exceptional and innovative game development experience.

## Key Objectives

1. **Enhancing Problem-Solving Skills:**
Designing the game logic, implementing the rules, and handling real-time interactions challenged my problem-solving abilities. I delved into the intricacies of chess movements and multiplayer synchronization, fostering my analytical thinking and logical reasoning skills.

2. **Mastering Socket.io for Real-Time Interaction:**
Implementing Socket.io for real-time multiplayer functionality was a significant learning curve. Understanding how to synchronize player moves, handle disconnections, and ensure seamless gameplay experiences deepened my knowledge of websockets and real-time communication.

3. **User-Centric Design:**
I prioritized creating an intuitive and visually appealing user interface to enhance the gaming experience. Utilizing Phaser for rendering the game elements and integrating the provided assets allowed me to focus on enhancing the user experience, ensuring players could easily navigate the game.

## Learning Outcomes
- **Skill Advancements:**
Advanced JavaScript and TypeScript: Writing complex logic for the game rules and backend functionality improved my proficiency in JavaScript and TypeScript.
- **Game Development with Phaser:** Developing a game using Phaser honed my game development skills, from rendering graphics to handling user interactions.
- **Backend Development with Express.js:** Creating a robust backend using Express.js and MongoDB enriched my backend development capabilities.

## Future Enhancements

- **User Authentication:** Implementing user authentication to allow users to create accounts and track their game history.
- **Leaderboard:** Creating a leaderboard to display the top players and their rankings.
- **Game listing:** Creating a game listing page where users can view the ongoing games and join a game of their choice.
- **Tournament Mode:** Implementing a tournament feature where players can compete in structured tournaments.
- **AI Opponent:** Developing an AI opponent for single-player mode, allowing users to practice and enhance their skills.

Creating this project not only enhanced my technical skills but also provided a platform for chess enthusiasts to enjoy a strategic and engaging game. The journey from conceptualization to implementation has been a rewarding experience, encouraging continuous growth in my software development expertise.

<p align="center">
  <img src="./doc/images/micdrop.gif" alt="micdrop" width="500"/>
</p>
<p align="center">
    <i>Mic Drop!</i>
</p>
<p align="center">
    <i>Thank you for your time!</i>
</p>