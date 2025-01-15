import Phaser from "phaser";

/**
 * Scène de fin.
 */
export default class End extends Phaser.Scene {
  constructor() {
    super({ key: "End" });
    this.background = null; // Arrière-plan
  }

  preload() {
    this.load.image("tropicalBackground", "img/tropic.webp");
  }

  create() {
    const { width, height } = this.scale;

    this.background = this.add
      .tileSprite(0, 0, width, height, "tropicalBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    // Ajouter le titre
    const title = this.add
      .text(width / 2, -50, "Fin du Jeu", {
        fontSize: "60px",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0)
      .setColor("black");

    // Ajouter un remerciement
    const thanks = this.add
      .text(width / 2, -10, "Merci d'avoir joué !", {
        fontSize: "40px",
        fontStyle: "bold",
      })
      .setOrigin(0.5, 0)
      .setColor("black");

    // Ajouter le nom des auteurs
    const authors = this.add
      .text(width / 2, -10, "COLLARD Marion - CADALEN Adrien", {
        fontSize: "20px",
      })
      .setOrigin(0.5, 0)
      .setColor("black");

    // Ajouter le texte des copyrights
    const copyright = this.add
      .text(width / 2, -15, "© Gamejam 2025 - Crée par NO_DATA_STUDIO", {
        fontSize: "20px",
      })
      .setOrigin(0.5, 0)
      .setColor("black");

    // Animer les nom pour qu'il défile du haut vers le bas
    this.tweens.add({
      targets: thanks,
      y: height / 2 + 40,
      ease: "Power1",
      duration: 3200,
      delay: 500,
    });

    // Animer les nom pour qu'il défile du haut vers le bas
    this.tweens.add({
      targets: authors,
      y: height - 60,
      ease: "Power1",
      duration: 3200,
      delay: 500,
    });

    // Animer le titre pour qu'il défile du haut vers le bas
    this.tweens.add({
      targets: title,
      y: height / 2 - 40,
      ease: "Power1",
      duration: 4000,
      delay: 500,
    });

    // Animer le texte des copyrights pour qu'il défile du haut vers le bas
    this.tweens.add({
      targets: copyright,
      y: height - 30,
      ease: "Power1",
      duration: 3000,
      delay: 500,
    });
  }

  update() {
    // Faire défiler le fond du haut vers le bas
    if (this.background.tilePositionY < 256) {
      this.background.tilePositionY += 0.1; // Ajuster la vitesse si nécessaire
    }
  }
}
