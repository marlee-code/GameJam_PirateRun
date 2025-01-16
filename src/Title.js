import Phaser from "phaser";

/**
 * Scène d'accueil.
 */
export default class Title extends Phaser.Scene {
  constructor() {
    super({ key: "Title" });
    this.background = null; // Arrière-plan
    this.backgroundMusic = null; // Musique de fond
  }

  preload() {
    this.load.image("tropicalBackground", "img/tropic.webp");
    this.load.audio("music_fond", "sound/music_fond.mp3");
  }

  create() {
    // Récupérer la taille de la scène via la caméra
    const width = this.cameras.main.width; // Largeur de la scène
    const height = this.cameras.main.height; // Hauteur de la scène

    this.background = this.add
      .tileSprite(0, 0, 800, 1024, "tropicalBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    // Jouer la musique de fond en boucle
    this.backgroundMusic = this.sound.add("music_fond", { loop: true });
    this.backgroundMusic.play();

    const title = this.add
      .text(width / 2, height / 3, "Pirate Run")
      .setOrigin(0.5, 1)
      .setStyle({
        fontSize: 40,
        fontStyle: "bold",
      })
      .setColor("black");

    this.tweens.add({
      targets: title,
      fontSize: { start: 40, to: 80 },
      ease: "elastic",
      duration: 5000,
      onUpdate(tween, target) {
        title.setStyle(target);
      },
    });

    this.add
      .text(
        width / 2,
        2 * (height / 3),
        "Pressez la barre espace pour commencer",
      )

      .setOrigin(0.5, 1)
      .setStyle({
        fontSize: 20,
      })
      .setColor("black");

    this.add
      .text(width / 2, height - 15, "© Gamejam 2025 - Crée par NO_DATA_STUDIO")
      .setOrigin(0.5, 1)
      .setStyle({
        fontSize: 15,
      })
      .setColor("black");

    this.keys = {};

    this.keys.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.keys.SPACE.on("down", () => {
      this.nextLevel();
    });
  }

  nextLevel() {
    this.backgroundMusic.stop();
    this.scene.start("Level1");
    this.scene.stop("Title");
  }

  update() {
    // Faire défiler le fond du haut vers le bas
    if (this.background.tilePositionY < 256) {
      this.background.tilePositionY += 0.1; // Ajuster la vitesse si nécessaire
    }
  }
}
