import TileGroup from "./TileGroup";

/**
 * Groupe de pierres.
 */
export default class StoneGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("stone", "img/stone.png");
  }

  constructor(scene) {
    super(scene, "stone", 64, 64);
  }
}
