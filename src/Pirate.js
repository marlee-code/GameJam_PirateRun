import Phaser from "phaser";

/**
 * Player class.
 */
export default class Pirate extends Phaser.GameObjects.Sprite {
  static key = "pirate";

  constructor(scene, x, y) {
    super(scene, 64 * x, 64 * y - 40, Pirate.key);
    scene.add.existing(this); // Ajoute l'objet à la scène
    scene.physics.add.existing(this); // Ajoute un corps physique
    this.setOrigin(0, 0); // Définit l'origine en haut à gauche

    // Configurer le corps physique
    this.body.setGravityY(1000); // Applique la gravité au joueur
    this.body.setCollideWorldBounds(true); // Empêche de sortir des limites

    this.currentTween = null; // Stocke le tween actif

    //Définir la frame initiale
    this.setFrame(0);
  }

  static preload(scene) {
    scene.load.spritesheet(Pirate.key, "img/pirate.png", {
      frameWidth: 75,
      frameHeight: 100,
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
    this.anims.play("walk", true);
    return this;
  }

  jump() {
    if (this.body.blocked.down) {
      // Vérifie que le joueur touche le sol
      this.body.setVelocityY(-800); // Applique une force vers le haut
      this.setFrame(0); // Change la frame
    }
    return this;
  }
}
