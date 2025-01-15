import Phaser from "phaser";
import config from "./config";
import Level1 from "./Level1";
import Title from "./Title";

/**
 * Configuration Phaser.
 */
const game = new Phaser.Game(config);

game.scene.add("Title", Title, true);
game.scene.add("Level1", Level1);
