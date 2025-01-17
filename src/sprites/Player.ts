import Phaser from "phaser";
import { key } from "../constants";

enum Animation {
  Walk = "player-walk",
  Idle = "player-idle",
  Jump = "player-jump",
}

type Cursors = Record<
  "w" | "a" | "s" | "d" | "space" | "up" | "left" | "down" | "right",
  Phaser.Input.Keyboard.Key
>;

export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  private cursors: Cursors;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture = key.spritesheet.player,
    frame = 0
  ) {
    super(scene, x, y, texture, frame);

    // Add cursor keys
    this.cursors = this.createCursorKeys();

    // Create sprite animations
    this.createAnimations();

    // Enable sprite physics
    this.enablePhysics();
  }

  private enablePhysics() {
    // Enable physics for the sprite
    this.scene.physics.world.enable(this);

    // Create the physics-based sprite that we will move around and animate
    this.setOrigin(0, 0).setMaxVelocity(300, 400);

    // Add the sprite to the scene
    this.scene.add.existing(this);
  }

  private createCursorKeys() {
    return this.scene.input.keyboard!.addKeys(
      "w,a,s,d,up,left,down,right"
    ) as Cursors;
  }

  private createAnimations() {
    // Create the animations we need from the player spritesheet
    const anims = this.scene.anims;

    if (!anims.exists(Animation.Idle)) {
      anims.create({
        key: Animation.Idle,
        frames: anims.generateFrameNumbers(key.spritesheet.player, {
          start: 0,
          end: 0,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Jump)) {
      anims.create({
        key: Animation.Jump,
        frames: anims.generateFrameNumbers(key.spritesheet.player, {
          start: 1,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    if (!anims.exists(Animation.Walk)) {
      anims.create({
        key: Animation.Walk,
        frames: anims.generateFrameNumbers(key.spritesheet.player, {
          start: 0,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  freeze() {
    this.body.moves = false;
  }

  update() {
    const speed = 200

    // Apply horizontal speed when left or right are applied
    switch (true) {
      case this.cursors.left.isDown:
      case this.cursors.a.isDown:
        // No need to have a separate set of graphics for running to the left & to the right
        // Instead we can just mirror the sprite
        this.setFlipX(false);
        this.setVelocityX(-speed);
        break;

      case this.cursors.right.isDown:
      case this.cursors.d.isDown:
        this.setFlipX(true);
        this.setVelocityX(speed);
        break;

      default:
        this.setVelocityX(0);
    }

    // Only allow the player to jump if they are on the ground
    if (
      this.body.blocked.down &&
      (this.cursors.up.isDown || this.cursors.w.isDown)
    ) {
      this.setVelocityY(-500);
    }

    // Update the animation/texture based on the state of the player
    if (!this.body.blocked.down) {
      this.anims.play(
        this.body.velocity.y ? Animation.Jump : Animation.Idle,
        true
      );
    } else if (this.body.blocked.down) {
      this.anims.play(
        this.body.velocity.x ? Animation.Walk : Animation.Idle,
        true
      );
    } else {
      this.anims.stop();
      this.setTexture(key.spritesheet.player, 0);
    }
  }
}
