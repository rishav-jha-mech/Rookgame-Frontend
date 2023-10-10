import React from 'react'
import '../assets/css/game.css'
import { IonPhaser } from '@ion-phaser/react';
import { config } from '../game/index'

const game = {
  ...config
}

const Game = () => {
  return (
    <>
      <div className='game-area'>
        <IonPhaser game={game} />
      </div>
    </>
  );
}

export default Game