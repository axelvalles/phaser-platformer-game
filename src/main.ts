// import { Boot } from './scenes/Boot';
import { Game as MainGame } from "./scenes/Game";
// import { GameOver } from './scenes/GameOver';
// import { MainMenu } from './scenes/MainMenu';
// import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 540,
  height: 360,
  parent: "game-container",
  title: "Phaser Platformer",
  backgroundColor: "#028af8",
  disableContextMenu: true,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        x: 0,
        y: 1000,
      },
      //debug: import.meta.env.DEV,
    },
  },
  scene: [
    // Boot,
    // Preloader,
    // MainMenu,
    MainGame,
    // GameOver
  ],
};

export default new Game(config);
