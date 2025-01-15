import Phaser from "phaser";

/**
 * Player class.
 */
export default class Player extends Phaser.GameObjects.Sprite {
  static key = "player";

  constructor(scene, x, y) {
    super(scene, 64 * x, 64 * y - 40, Player.key);
    scene.add.existing(this); // Ajoute l'objet à la scène
    scene.physics.add.existing(this); // Ajoute un corps physique
    this.setOrigin(0, 0); // Définit l'origine en haut à gauche

    // Configurer le corps physique
    this.body.setGravityY(1000); // Applique la gravité au joueur
    this.body.setCollideWorldBounds(true); // Empêche de sortir des limites

    this.currentTween = null; // Stocke le tween actif
  }

  static preload(scene) {
    scene.load.spritesheet(Player.key, "img/temp_pirate.png", {
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
    this.#move(300);
    return this;
  }

  jump() {
    if (this.body.blocked.down) {
      // Vérifie que le joueur touche le sol
      this.body.setVelocityY(-700); // Applique une force vers le haut
    }
    return this;
  }
}
