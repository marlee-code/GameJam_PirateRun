import TileGroup from "./TileGroup";

/**
 * Groupe de terre.
 */
export default class GrassGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("grass", "img/grass.png");
  }

  constructor(scene) {
    super(scene, "grass", 64, 64);
  }
}
