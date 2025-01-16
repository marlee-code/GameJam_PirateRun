import StoneGroup from "./StoneGroup";
import PlatformGroup from "./PlatformGroup";

import KnightGroup from "./KnightGroup";
import Knight from "./Knight";
import Pirate from "./Pirate";
import Chicken from "./Chicken";

import Phaser from "phaser";

/**
 * Scène du deuxième niveau.
 */
export default class Level3 extends Phaser.Scene {
  constructor() {
    super({ key: "Level3" });
    this.stoneGroup = null; // Groupe de blocks de pierres
    this.player = null; // Instance du joueur
    this.chicken = null; // Instance du poulet
    this.keys = {}; // Stocke les touches
    this.background = null; // Arrière-plan
  }

  preload() {
    StoneGroup.preload(this); // Précharge l'image pour les pierres.
    Pirate.preload(this); // Charge l'image du pirate
    Chicken.preload(this); // Charge l'image du poulet
    Knight.preload(this); // Charge l'image du chevalier
    PlatformGroup.preload(this); // Charge l'image de la plateforme
    this.load.image("castle_wall", "img/castlewall.png"); // Charge l'image de fond
    this.load.image("wood", "img/wood.png"); // Charge l'image de fond du titre
    this.load.image("tutoriel", "img/tutoriel.png"); // Charge l'image du tutoriel
    this.load.audio("game-start", "sound/game-start.mp3"); // Charge la musique
  }

  create() {
    // Dimensions du niveau
    const levelWidth = 23 * 64 * 4; // 23*4 colonnes de 64 pixels (largeur totale du niveau)
    const levelHeight = 9 * 64; // 9 lignes de 64 pixels (hauteur totale du niveau)

    this.background = this.add
      .tileSprite(0, 0, 8000, 600, "castle_wall")
      .setOrigin(0, 0);
    // La largeur (8000) peut être adaptée à la taille totale du monde.

    // Ajouter l'image de fond pour le titre
    this.add.image(0, 10, "wood").setOrigin(0, 0).setScrollFactor(0);

    this.add
      .text(10, 25, "Level  3", {
        fontSize: "30px",
        fontStyle: "bold",
      })
      .setScrollFactor(0);

    // Ajouter l'image du tutoriel2 à côté de l'image du tutoriel
    const tutorielImage = this.add
      .image(this.cameras.main.width - 10, 10, "tutoriel")
      .setOrigin(1, 0)
      .setScrollFactor(0);

    // Animer l'image du tutoriel pour qu'elle disparaisse après 10 secondes
    this.tweens.add({
      targets: tutorielImage,
      alpha: 0,
      ease: "Power1",
      duration: 1000, // Durée de l'animation (1 seconde)
      delay: 10000, // Délai avant le début de l'animation (10 secondes)
    });

    // Définir les limites du monde physique
    this.physics.world.setBounds(0, 0, levelWidth, levelHeight);

    // Configurer le sol
    this.stoneGroup = new StoneGroup(this);
    this.stoneGroup.addTiles(0, 9, 100, 1); // Sol d'herbe (col 0-99, ligne 9)
    this.stoneGroup.addTiles(0, 8, 100, 1); // Sol de terre (col 0-99, ligne 8)

    //Ajout des blocs de platforme
    this.platformGroup = new PlatformGroup(this);
    this.platformGroup.addTiles(4, 6, 3, 1);
    this.platformGroup.addTiles(10, 5, 7, 1);
    this.platformGroup.addTiles(20, 6, 6, 1);
    this.platformGroup.addTiles(40, 6, 7, 1);
    this.platformGroup.addTiles(40, 4, 7, 1);
    this.platformGroup.addTiles(55, 6, 8, 1);
    this.platformGroup.addTiles(65, 4, 6, 1);

    // Configurer la caméra
    this.cameras.main.setBounds(0, 0, levelWidth, levelHeight); // Limites de la caméra
    this.cameras.main.setZoom(1);

    // Créer les animations pour le pirate
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("pirate", { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    });

    // Ajouter un joueur
    this.player = new Pirate(this, 1, 4); // Position initiale : (1, 4), ajusté pour être sur la plateforme
    this.physics.add.collider(this.player, this.stoneGroup); // Gestion des collisions
    this.physics.add.collider(this.player, this.platformGroup); // Gestion des collisions

    this.sound.add("game-start").play();

    // Créer les animations pour le poulet
    this.anims.create({
      key: "chicken_walk",
      frames: this.anims.generateFrameNumbers("chicken", { start: 0, end: 2 }),
      frameRate: 3,
      repeat: -1,
    });

    // Ajouter un poulet
    this.chicken = new Chicken(this, 10, 4); // Position initiale : (1, 10), ajusté pour être sur la plateforme
    this.physics.add.collider(this.chicken, this.stoneGroup); // Gestion des collisions

    // Créer l'animation pour le chevalier
    this.anims.create({
      key: "knight_walk",
      frames: this.anims.generateFrameNumbers("knight", { start: 0, end: 5 }),
      frameRate: 3,
      repeat: -1,
    });

    // Ajouter des chevaliers
    this.knightGroup = new KnightGroup(this);
    this.knightGroup.addKnight(5, 6);
    this.knightGroup.addKnight(13, 5);
    this.knightGroup.addKnight(15, 4);
    this.knightGroup.addKnight(16, 5);
    this.knightGroup.addKnight(25, 5);
    this.knightGroup.addKnight(30, 6);
    this.knightGroup.addKnight(46, 5);
    this.knightGroup.addKnight(46, 6);
    this.knightGroup.addKnight(55, 4);
    this.knightGroup.addKnight(62, 6);
    this.knightGroup.addKnight(65, 6);
    this.knightGroup.addKnight(70, 6);
    this.knightGroup.addKnight(70, 3);
    this.knightGroup.addKnight(80, 6);
    this.knightGroup.addKnight(80.5, 6);

    // Jouer l'animation pour chaque chevalier
    this.knightGroup.children.iterate((knight) => {
      knight.anims.play("knight_walk");
    });

    // Gestion des collisions entre le joueur et les chevaliers
    this.physics.add.collider(this.player, this.knightGroup, () => {
      this.resetPlayerPositionWithDelay();
    });

    // Gestion des collisions entre le sol et les chevaliers
    this.physics.add.collider(this.knightGroup, this.stoneGroup);
    this.physics.add.collider(this.knightGroup, this.platformGroup);

    this.physics.add.overlap(
      this.player,
      this.chicken,
      this.nextLevel,
      null,
      this,
    );

    // Faire suivre la caméra au joueur
    this.cameras.main.startFollow(this.player);

    this.keys.SPACE = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );

    this.keys.SPACE.on("down", () => {
      this.player.jump();
    });

    this.#handleMove();
  }

  nextLevel() {
    this.scene.start("End");
    this.scene.stop("Level3");
  }

  #handleMove() {
    this.player.moveRight(); // Se déplace à droite
    this.chicken.moveRight(); // Le poulet se déplace à droite
  }

  resetPlayerPositionWithDelay() {
    this.player.setPosition(1 * 64, 6 * 64); // Position initiale : (1, 6)
    this.time.delayedCall(200, () => {
      this.#handleMove();
    });
  }
}
