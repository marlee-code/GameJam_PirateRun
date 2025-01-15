import Phaser from "phaser";

/**
 * Chicken class.
 */
export default class Chicken extends Phaser.GameObjects.Sprite {
  static key = "chicken";

  constructor(scene, x, y) {
    super(scene, 64 * x, 64 * y - 40, Chicken.key);
    scene.add.existing(this); // Ajoute l'objet à la scène
    scene.physics.add.existing(this); // Ajoute un corps physique
    this.setOrigin(0, 0); // Définit l'origine en haut à gauche

    // Configurer le corps physique
    this.body.setGravityY(1000); // Applique la gravité au joueur
    this.body.setCollideWorldBounds(true); // Empêche de sortir des limites

    this.currentTween = null; // Stocke le tween actif
  }

  static preload(scene) {
    scene.load.spritesheet(Chicken.key, "img/chicken.png", {
      frameWidth: 256,
      frameHeight: 256,
    });
  }

  #move(velocity) {
    // Annule le tween précédent
    if (this.currentTween) {
      this.currentTween.stop();
    }
    // Crée un nouveau tween
    this.currentTween = this.scene.tweens.add({
      targets: this.body.velocity,
      x: velocity,
      ease: "Cubic.easeOut",
      duration: 300,
    });
  }

  moveRight() {
    this.#move(500);
    return this;
  }
}
