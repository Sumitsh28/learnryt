const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// This tells Metro exactly where your global CSS file will live
module.exports = withNativeWind(config, { input: "./src/global.css" });
