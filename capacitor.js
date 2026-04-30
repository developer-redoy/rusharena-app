/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: "com.rusharena.app",
  appName: "Rush Arena",
  webDir: "out", // or .next depending on your build
  plugins: {
    GoogleAuth: {
      serverClientId:
        "564606184768-ddn0l8ddakps89pmqraiccsjfo2v5j82.apps.googleusercontent.com",
      forceCodeForRefreshToken: true,
    },
  },
};

module.exports = config;
