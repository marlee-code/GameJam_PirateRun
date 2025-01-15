import TileGroup from "./TileGroup";

/**
 * Groupe de terre.
 */
export default class DirtGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("dirt", "img/dirt.png");
  }

  constructor(scene) {
    super(scene, "dirt", 64, 64);
  }
}
