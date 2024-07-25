import { Scene } from "phaser";
import { backbroundMap } from "../mapped/map-1";
import { key } from "../constants";
import { Player } from "../sprites/Player";
import { Bat } from "../sprites/Bat";

export class Game extends Scene {
  private player: Player;
  private bat: Bat;
  floor: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super(key.scene.Game);
  }

  preload() {
    this.load.spritesheet(
      key.spritesheet.characters,
      "assets/Tilemap/tilemap-characters.png",
      {
        frameWidth: 24,
        frameHeight: 24,
        spacing: 1,
      }
    );

    this.load.spritesheet(
      key.tilemap.platformer,
      "assets/Tilemap/tilemap.png",
      {
        frameWidth: 18,
        frameHeight: 18,
        spacing: 1,
      }
    );

    this.load.spritesheet(
      key.tilemap.background,
      "assets/Tilemap/tilemap-backgrounds.png",
      {
        frameWidth: 24,
        frameHeight: 24,
        spacing: 1,
      }
    );
  }

  create() {
    // enviroment
    this.floor = this.physics.add.staticGroup();

    const numColumns = 30;
    const numRows = 20;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
        // Calcular el índice del tile en el array
        const index = row * numColumns + col;
        const tileIndex = backbroundMap[index] - 1;

        // Calcular las coordenadas x e y para cada tile
        const x = col * 24;
        const y = row * 24;

        // Agregar el sprite del tile en la posición calculada
        this.add.sprite(x, y, "background", tileIndex);
      }
    }

    for (let i = 0; i < 50; i++) {
      this.floor.create(i * 18, 350, "tilemap", 0);
    }

    this.floor.refresh();

    this.player = new Player(this, 200, 200);

    this.bat = new Bat(this, 200, 260);

    // colliders
    this.physics.add.collider(this.player, this.floor);
  }

  update(time: number, delta: number): void {
    this.player.update();
    this.bat.update();
  }
}
