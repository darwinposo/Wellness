const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// LANDMINE 1 FIX: Supabase + Expo SDK 55 metro crash
// Supabase's ws module imports Node stdlib — incompatible with Metro package exports
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './global.css' });
