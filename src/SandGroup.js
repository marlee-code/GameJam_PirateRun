import TileGroup from "./TileGroup";

/**
 * Groupe de sable.
 */
export default class SandGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("sand", "img/sand.png");
  }

  constructor(scene) {
    super(scene, "sand", 64, 64);
  }
}
