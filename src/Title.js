import Phaser from "phaser";

/**
 * Scène d'accueil.
 */
export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: "Title" });
    this.background = null; // Arrière-plan
  }

  preload() {
    this.load.image("tropicalBackground", "img/tropic.webp");
  }

  create() {
    // Récupérer la taille de la scène via la caméra
    const width = this.cameras.main.width; // Largeur de la scène
    const height = this.cameras.main.height; // Hauteur de la scène

    this.background = this.add
      .tileSprite(0, 0, 800, 1024, "tropicalBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    const title = this.add
      .text(width / 2, height / 2, "pirateRun")
      .setOrigin(0.5, 1)
      .setStyle({
        fontSize: 40,
        fontStyle: "bold",
      });

    this.tweens.add({
      targets: title,
      fontSize: { start: 40, to: 80 },
      ease: "elastic",
      duration: 5000,
      onUpdate(tween, target) {
        title.setStyle(target);
      },
    });

    this.input.once(
      "pointerdown",
      () => {
        this.scene.start("Level1");
        this.scene.stop("Title");
      },
      this,
    );
  }

  update() {
    // Faire défiler le fond du haut vers le bas
    if (this.background.tilePositionY < 256) {
      this.background.tilePositionY += 0.1; // Ajuster la vitesse si nécessaire
    }
  }
}
