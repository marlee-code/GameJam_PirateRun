import Phaser from "phaser";

/**
 * Player class.
 */
export default class Knight extends Phaser.GameObjects.Sprite {
  static key = "knight";

  constructor(scene, x, y) {
    super(scene, 64 * x, 64 * y - 40, Knight.key);
    scene.add.existing(this); // Ajoute l'objet à la scène
    scene.physics.add.existing(this); // Ajoute un corps physique
    this.setOrigin(0, 0); // Définit l'origine en haut à gauche

    // Configurer le corps physique
    this.body.setGravityY(1000); // Applique la gravité au joueur
    this.body.setCollideWorldBounds(true); // Empêche de sortir des limites

    this.currentTween = null; // Stocke le tween actif
  }

  static preload(scene) {
    scene.load.spritesheet(Knight.key, "img/knight.png", {
      frameWidth: 256,
      frameHeight: 256,
    });
  }
}
