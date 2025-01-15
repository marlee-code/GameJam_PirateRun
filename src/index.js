// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair -- disable no invalid this
/* eslint-disable no-invalid-this -- For the pointerdown on Level1 */
import Phaser from "phaser";
import config from "./config";

/**
 * Sprite de joueur
 */
class Player extends Phaser.GameObjects.Sprite {
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

  moveLeft() {
    this.#move(-300);
    return this;
  }

  halt() {
    this.#move(0);
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

/**
 * Groupe de tuiles générique.
 */
class TileGroup extends Phaser.Physics.Arcade.StaticGroup {
  constructor(scene, tileName, tileWidth, tileHeight) {
    super(scene.physics.world, scene);
    this.tileName = tileName;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
  }

  addTiles(x, y, width = 1, height = 1) {
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const tile = this.create(
          (x + col) * this.tileWidth,
          (y + row) * this.tileHeight,
          this.tileName,
        ).setOrigin(0, 0);
        tile.body.updateFromGameObject();
      }
    }
    return this;
  }
}

/**
 * Groupe de pierres.
 */
class StoneGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("stone", "img/stone.png");
  }

  constructor(scene) {
    super(scene, "stone", 64, 64);
  }
}

/**
 * Groupe de lave.
 */
class LavaGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("lava", "img/lava.png");
  }

  constructor(scene) {
    super(scene, "lava", 64, 64);
  }
}

/**
 * Scène du premier niveau.
 */
class Level1 extends Phaser.Scene {
  constructor() {
    super({ key: "Level1" });
    this.stoneGroup = null; // Groupe de pierres
    this.player = null; // Instance du joueur
    this.keys = {}; // Stocke les touches
    this.background = null; // Arrière-plan
  }

  preload() {
    StoneGroup.preload(this); // Précharge l'image pour les pierres.
    LavaGroup.preload(this); // Précharge l'image pour la lave.
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

/**
 * Scène d'accueil.
 */
class Title extends Phaser.Scene {
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
      function () {
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

/**
 * Configuration Phaser.
 */
const game = new Phaser.Game(config);

game.scene.add("Title", Title, true);
game.scene.add("Level1", Level1);
