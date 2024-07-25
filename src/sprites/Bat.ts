import Phaser from "phaser";
import { key } from "../constants";

enum Animation {
  Move = "bat-move",
}

export class Bat extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private movingRight: boolean;
  private movingUp: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.spritesheet.characters,
    frame = 24
  ) {
    super(scene, x, y, texture, frame);

    // Definir los límites del movimiento
    this.minX = x - 100; // Límite izquierdo (punto inicial - 50)
    this.maxX = x + 100; // Límite derecho (punto inicial + 50)
    this.minY = y - 25; // Límite izquierdo (punto inicial - 50)
    this.maxY = y + 25; // Límite derecho (punto inicial + 50)
    this.movingRight = false; // Indicar la dirección inicial
    this.movingUp = true; // Indicar la dirección inicial

    // Create sprite animations
    this.createAnimations();

    // Enable sprite physics
    this.enablePhysics();
  }

  private enablePhysics() {
    // Enable physics for the sprite
    this.scene.physics.world.enable(this);

    // Create the physics-based sprite that we will move around and animate
    this.setOrigin(0, 0)
      .setMaxVelocity(60, 400)
      .setGravityY(-1000)
      .setDrag(1000);

    // Add the sprite to the scene
    this.scene.add.existing(this);
  }

  private createAnimations() {
    // Create the animations we need from the player spritesheet
    const anims = this.scene.anims;

    if (!anims.exists(Animation.Move)) {
      anims.create({
        key: Animation.Move,
        frames: anims.generateFrameNumbers(key.spritesheet.characters, {
          start: 24,
          end: 26,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  update() {
    const acceleration = 200;

    // Cambiar dirección al llegar a los límites
    if (this.x <= this.minX) {
      this.movingRight = true;
      this.flipX = true;
    } else if (this.x >= this.maxX) {
      this.movingRight = false;
      this.flipX = false;
    }

    if (this.y <= this.minY) {
      this.movingUp = true;
    } else if (this.y >= this.maxY) {
      this.movingUp = false;
    }

    // Establecer la aceleración según la dirección
    if (this.movingRight) {
      this.setAccelerationX(acceleration);
    } else {
      this.setAccelerationX(-acceleration);
    }

    if (this.movingUp) {
      this.setVelocityY(60);
    } else {
      this.setVelocityY(-60);
    }

    this.anims.play(Animation.Move, true);
  }
}
