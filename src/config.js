const config = {
  // eslint-disable-next-line no-undef -- Phaser is defined in index.js
  type: Phaser.AUTO,
  width: 800, // Largeur de la fenêtre (correspondant à la largeur du niveau)
  height: 600, // Hauteur de la fenêtre (correspondant à la hauteur du niveau)
  physics: {
    default: "arcade",
    arcade: {
      debug: true, // Activer le débogage pour visualiser les corps physiques
      gravity: { y: 1000 }, // Ajouter de la gravité si nécessaire
    },
  },
};

export default config;
