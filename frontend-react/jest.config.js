module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Transforma arquivos JS/TS usando Babel
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)/", // Transforma o módulo `axios` e outros ESMs
  ],
};
