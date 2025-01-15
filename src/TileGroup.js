import Phaser from "phaser";

/**
 * Groupe de tuiles générique.
 */
export default class TileGroup extends Phaser.Physics.Arcade.StaticGroup {
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
        // Désactiver les collisions sur les côtés et en dessous
        tile.body.checkCollision.left = false;
        tile.body.checkCollision.right = false;
        tile.body.checkCollision.down = false;
      }
    }
    return this;
  }
}
