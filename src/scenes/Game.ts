import { Scene } from "phaser";
import { backbroundMap, floorMap } from "../mapped/map-1";

export class Game extends Scene {
  keys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  floor: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.spritesheet(
      "characters",
      "assets/Tilemap/tilemap-characters.png",
      {
        frameWidth: 24,
        frameHeight: 24,
        spacing: 1,
      }
    );

    this.load.spritesheet("tilemap", "assets/Tilemap/tilemap.png", {
      frameWidth: 18,
      frameHeight: 18,
      spacing: 1,
    });

    this.load.spritesheet(
      "background",
      "assets/Tilemap/tilemap-backgrounds.png",
      {
        frameWidth: 24,
        frameHeight: 24,
        spacing: 1,
      }
    );
  }

  create() {
    //config
    this.keys = this.input.keyboard?.createCursorKeys();

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

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numColumns; col++) {
        // Calcular el índice del tile en el array
        const index = row * numColumns + col;
        const tileIndex = floorMap[index] - 1;

        if (tileIndex > -1) {
          // Calcular las coordenadas x e y para cada tile
          const x = col * 18;
          const y = row * 18;

          this.floor.create(x, y, "tilemap", tileIndex);

          //   this.add.sprite(x, y, "tilemap", tileIndex);
        }
      }
    }

    this.floor.refresh();

    // entities
    this.player = this.physics.add
      .sprite(20, 100, "characters")
      .setOrigin(0, 0)
      .setCollideWorldBounds(true);
    this.player.flipX = true;

    // colliders
    this.physics.add.collider(this.player, this.floor);

    // animation
    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("characters", {
        start: 0,
        end: 1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("characters", {
        start: 0,
        end: 0,
      }),
      repeat: -1,
    });

    this.anims.create({
      key: "player-jump",
      frames: this.anims.generateFrameNumbers("characters", {
        start: 1,
        end: 1,
      }),
      repeat: -1,
    });
  }

  update(time: number, delta: number): void {
    if (this.keys?.left.isDown) {
      this.player.x -= 2;
      this.player.flipX = false;

      if (this.player.body.touching.down) {
        this.player.anims.play("player-walk", true);
      }
    } else if (this.keys?.right.isDown) {
      this.player.x += 2;
      this.player.flipX = true;

      if (this.player.body.touching.down) {
        this.player.anims.play("player-walk", true);
      }
    } else {
      if (this.player.body.touching.down) {
        this.player.anims.play("player-idle", true);
      }
    }

    if (this.keys?.up.isDown && this.player.body.touching.down) {
      this.player.anims.play("player-jump", true);
      this.player.setVelocityY(-250);
    }
  }
}
