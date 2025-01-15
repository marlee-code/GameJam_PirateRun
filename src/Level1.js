import SandGroup from "./SandGroup";

import Pirate from "./Pirate";
import Chicken from "./Chicken";

import Phaser from "phaser";

/**
 * Scène du premier niveau.
 */
export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.floorGroup = null; // Groupe de sol
    this.player = null; // Instance du joueur
    this.chicken = null; // Instance du poulet
    this.keys = {}; // Stocke les touches
    this.background = null; // Arrière-plan
  }

  preload() {
    SandGroup.preload(this); // Précharge l'image pour les pierres.
    Pirate.preload(this); // Charge l'image du joueur
    Chicken.preload(this); // Charge l'image du poulet
    this.load.image("tropicalBackground", "img/tropic.webp");
    this.load.image("wood", "img/wood.png");
  }

  create() {
    // Dimensions du niveau
    const levelWidth = 23 * 64 * 4; // 24 colonnes de 64 pixels (largeur totale du niveau)
    const levelHeight = 9 * 64; // 9 lignes de 64 pixels (hauteur totale du niveau)

    this.background = this.add
      .tileSprite(0, 0, 8000, 600, "tropicalBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    // Ajouter l'image de fond pour le titre
    this.add.image(0, 10, "wood").setOrigin(0, 0).setScrollFactor(0);

    this.add
      .text(10, 25, "Level  1", {
        fontSize: "30px",
        fontStyle: "bold",
      })
      .setScrollFactor(0);

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

    // Configurer les blocs de sable
    this.floorGroup = new SandGroup(this);
    this.floorGroup.addTiles(0, 9, 100, 1); // Sol de pierres (col 0-99, ligne 9)
    this.floorGroup.addTiles(0, 8, 100, 1); // Sol de pierres (col 0-99, ligne 8)

    // Configurer la caméra
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Limites de la caméra
    this.cameras.main.setZoom(1);

    // Ajouter un joueur
    this.player = new Pirate(this, 1, 4); // Position initiale : (1, 4), ajusté pour être sur la plateforme
    this.physics.add.collider(this.player, this.floorGroup); // Gestion des collisions

    // Ajouter un poulet
    this.chicken = new Chicken(this, 10, 4); // Position initiale : (1, 10), ajusté pour être sur la plateforme
    this.physics.add.collider(this.chicken, this.floorGroup); // Gestion des collisions

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
    this.keys.up = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.UP,
    );

    this.keys.up.on("down", () => {
      this.player.jump();
    });

    this.#handleInput();
  }

  nextLevel() {
    this.scene.start("Level2");
    this.scene.stop("Level1");
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
