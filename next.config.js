module.exports = {
  reactStrictMode: true,
  experimental: {
    runtime: 'experimental-edge',
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};
