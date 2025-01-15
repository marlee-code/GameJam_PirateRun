import Phaser from "phaser";
import Knight from "./Knight";

/**
 * Groupe de knights.
 */
export default class KnightGroup extends Phaser.Physics.Arcade.Group {
  constructor(scene) {
    super(scene.physics.world, scene);

    this.scene = scene;
  }

  preload() {
    Knight.preload(this.scene);
  }

  addKnight(x, y) {
    // Ajouter un sprite knight à la position spécifiée
    const knight = new Knight(this.scene, x, y);
    this.add(knight);
  }
}
