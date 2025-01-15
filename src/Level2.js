import GrassGroup from "./GrassGroup";
import DirtGroup from "./DirtGroup";

import Player from "./Player";
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
    Player.preload(this); // Charge l'image du joueur
    Chicken.preload(this); // Charge l'image du poulet
    this.load.image("tropicalForestBackground", "img/tropical_forest.webp");
    this.load.image("wood", "img/wood.png");
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

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

    // Configurer le sol
    this.dirtGroup = new DirtGroup(this);
    this.grassGroup = new GrassGroup(this);
    this.dirtGroup.addTiles(0, 9, 100, 1); // Sol d'herbe (col 0-99, ligne 9)
    this.grassGroup.addTiles(0, 8, 100, 1); // Sol de terre (col 0-99, ligne 8)

    // Configurer la caméra
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Limites de la caméra
    this.cameras.main.setZoom(1);

    // Ajouter un joueur
    this.player = new Player(this, 1, 4); // Position initiale : (1, 4), ajusté pour être sur la plateforme
    this.physics.add.collider(this.player, this.grassGroup); // Gestion des collisions

    // Ajouter un poulet
    this.chicken = new Chicken(this, 10, 4); // Position initiale : (1, 10), ajusté pour être sur la plateforme
    this.physics.add.collider(this.chicken, this.grassGroup); // Gestion des collisions

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
