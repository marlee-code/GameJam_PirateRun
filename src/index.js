import Phaser from "phaser";
import config from "./config";
import Level1 from "./Level1";
import Level2 from "./Level2";
import Level3 from "./Level3";
import Title from "./Title";

/**
 * Configuration Phaser.
 */
const game = new Phaser.Game(config);

game.scene.add("Title", Title, true);
game.scene.add("Level1", Level1);
game.scene.add("Level2", Level2);
game.scene.add("Level3", Level3);

