import GrassGroup from "./GrassGroup";
import DirtGroup from "./DirtGroup";
import PlatformGroup from "./PlatformGroup";

import Pirate from "./Pirate";
import Chicken from "./Chicken";

import Phaser from "phaser";

/**
 * Scène du deuxième niveau.
 */
export default class Level2 extends Phaser.Scene {
  constructor() {
    super({ key: "Level2" });
    this.grassGroup = null; // Groupe de terres
    this.dirtGroup = null; // Groupe de terres
    this.player = null; // Instance du joueur
    this.chicken = null; // Instance du poulet
    this.keys = {}; // Stocke les touches
    this.background = null; // Arrière-plan
  }

  preload() {
    GrassGroup.preload(this); // Précharge l'image pour la terre.
    DirtGroup.preload(this); // Précharge l'image pour l'herbe.
    Pirate.preload(this); // Charge l'image du joueur
    Chicken.preload(this); // Charge l'image du poulet
    this.load.image("tropicalForestBackground", "img/tropical_forest.webp");
    this.load.image("wood", "img/wood.png");
    this.load.image("tutoriel", "img/tutoriel.png"); // Charge l'image du tutoriel
    this.load.image("tutoriel2", "img/tutoriel2.png"); // Charge l'image du tutoriel2
  }

  create() {
    // Dimensions du niveau
    const levelWidth = 23 * 64 * 4; // 24 colonnes de 64 pixels (largeur totale du niveau)
    const levelHeight = 9 * 64; // 9 lignes de 64 pixels (hauteur totale du niveau)

    this.background = this.add
      .tileSprite(0, 0, 8000, 600, "tropicalForestBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    // Ajouter l'image de fond pour le titre
    this.add.image(0, 10, "wood").setOrigin(0, 0).setScrollFactor(0);

    this.add
      .text(10, 25, "Level  2", {
        fontSize: "30px",
        fontStyle: "bold",
      })
      .setScrollFactor(0);

    // Ajouter l'image du tutoriel2 à côté de l'image du tutoriel
    const tutoriel2Image = this.add
      .image(this.cameras.main.width - 10, 10, "tutoriel2")
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // Ajouter l'image du tutoriel en haut à droite de l'écran
    const tutorielImage = this.add
      .image(
        this.cameras.main.width - 20 - tutoriel2Image.width,
        10,
        "tutoriel",
      )
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // Animer l'image du tutoriel pour qu'elle disparaisse après 5 secondes
    this.tweens.add({
      targets: tutorielImage,
      alpha: 0,
      ease: "Power1",
      duration: 1000, // Durée de l'animation (1 seconde)
      delay: 5000, // Délai avant le début de l'animation (5 secondes)
    });

    // Animer l'image du tutoriel2 pour qu'elle disparaisse après 17 secondes
    this.tweens.add({
      targets: tutoriel2Image,
      alpha: 0,
      ease: "Power1",
      duration: 1000, // Durée de l'animation (1 seconde)
      delay: 17000, // Délai avant le début de l'animation (17 secondes)
    });

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

    // Configurer le sol
    this.dirtGroup = new DirtGroup(this);
    this.grassGroup = new GrassGroup(this);
    this.dirtGroup.addTiles(0, 9, 100, 1); // Sol d'herbe (col 0-99, ligne 9)
    this.grassGroup.addTiles(0, 8, 100, 1); // Sol de terre (col 0-99, ligne 8)

    //Ajout des blocs de platforme
    this.platformGroup = new PlatformGroup(this);
    this.platformGroup.addTiles(4, 6, 3, 1); // Sol de pierres (col 4-6, ligne 7)
    this.platformGroup.addTiles(10, 5, 7, 1); // Sol de pierres (col 10-16, ligne 6)
    this.platformGroup.addTiles(20, 6, 6, 1); // Sol de pierres (col 20-25, ligne 7)
    this.platformGroup.addTiles(40, 6, 3, 1); // Sol de pierres (col 40-42, ligne 7)
    this.platformGroup.addTiles(45, 4, 10, 1); // Sol de pierres (col 40-49, ligne 5)
    this.platformGroup.addTiles(60, 6, 8, 1); // Sol de pierres (col 60-65, ligne 7)
    this.platformGroup.addTiles(70, 4, 6, 1); // Sol de pierres (col 70-75, ligne 5)

    // Configurer la caméra
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Limites de la caméra
    this.cameras.main.setZoom(1);

    // Ajouter un joueur
    this.player = new Pirate(this, 1, 4); // Position initiale : (1, 4), ajusté pour être sur la plateforme
    this.physics.add.collider(this.player, this.grassGroup); // Gestion des collisions
    this.physics.add.collider(this.player, this.platformGroup); // Gestion des collisions

    // Ajouter un poulet
    this.chicken = new Chicken(this, 10, 4); // Position initiale : (1, 10), ajusté pour être sur la plateforme
    this.physics.add.collider(this.chicken, this.grassGroup); // Gestion des collisions

    this.physics.add.overlap(
      this.player,
      this.chicken,
      this.nextLevel,
      null,
      this,
    );

    // Faire suivre la caméra au joueur
    this.cameras.main.startFollow(this.player);

    // Configuration des touches
    this.keys.right = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );
    this.keys.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.keys.SPACE.on("down", () => {
      this.player.jump();
    });

    this.#handleInput();
  }

  nextLevel() {
    this.scene.start("Level3");
    this.scene.stop("Level2");
  }

  #handleInput() {
    this.keys.right.on("down", () => this.#handleMove());
    this.keys.right.on("up", () => this.#handleMove());
  }

  #handleMove() {
    const right = this.keys.right.isDown;

    if (right) {
      this.player.moveRight(); // Se déplace à droite
      this.chicken.moveRight(); // Le poulet se déplace à droite
    }
  }
}
