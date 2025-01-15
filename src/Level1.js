import StoneGroup from "./StoneGroup";
import Player from "./Player";
// eslint-disable-next-line no-unused-vars -- use later
import TileGroup from "./TileGroup";

import Phaser from "phaser";

/**
 * Scène du premier niveau.
 */
export default class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.stoneGroup = null; // Groupe de pierres
    this.player = null; // Instance du joueur
    this.keys = {}; // Stocke les touches
    this.background = null; // Arrière-plan
  }

  preload() {
    StoneGroup.preload(this); // Précharge l'image pour les pierres.
    Player.preload(this); // Charge l'image du joueur
    this.load.image("tropicalBackground", "img/tropic.webp");
  }

  create() {
    // Dimensions du niveau
    const levelWidth = 23 * 64; // 24 colonnes de 64 pixels (largeur totale du niveau)
    const levelHeight = 9 * 64; // 9 lignes de 64 pixels (hauteur totale du niveau)

    this.background = this.add
      .tileSprite(0, 0, 8000, 600, "tropicalBackground")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    this.add
      .text(levelWidth / 6, levelHeight / 7, "Level1")
      .setOrigin(0.5, 1)
      .setStyle({
        fontSize: 30,
        fontStyle: "bold",
      });

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

    // Configurer les blocs de pierre
    this.stoneGroup = new StoneGroup(this);
    this.stoneGroup.addTiles(0, 8, 21, 1); // Sol de pierres (col 0-6, ligne 8)

    // Configurer la caméra
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Limites de la caméra
    this.cameras.main.setZoom(1);

    // Ajouter un joueur
    this.player = new Player(this, 1, 7); // Position initiale : (1, 7), ajusté pour être sur la plateforme
    this.physics.add.collider(this.player, this.stoneGroup); // Gestion des collisions

    // Faire suivre la caméra au joueur
    this.cameras.main.startFollow(this.player);

    // Configuration des touches
    this.keys.left = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );
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
    this.keys.left.on("down", () => this.#handleMove());
    this.keys.left.on("up", () => this.#handleMove());
    this.keys.right.on("down", () => this.#handleMove());
    this.keys.right.on("up", () => this.#handleMove());
  }

  #handleMove() {
    const left = this.keys.left.isDown;
    const right = this.keys.right.isDown;

    if (left && right) {
      this.player.halt(); // Les deux touches pressées
    } else if (left) {
      this.player.moveLeft(); // Se déplace à gauche
    } else if (right) {
      this.player.moveRight(); // Se déplace à droite
    } else {
      this.player.halt(); // Arrêt
    }
  }
}
