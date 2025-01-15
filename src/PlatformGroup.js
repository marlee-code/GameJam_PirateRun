import TileGroup from "./TileGroup";

/**
 * Groupe de sable.
 */
export default class PlatformGroup extends TileGroup {
  static preload(scene) {
    scene.load.image("platform", "img/platform.png");
  }

  constructor(scene) {
    super(scene, "platform", 64, 64);
  }
}
