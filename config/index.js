const config = {
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: process.env.MONGODB_DB,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
  mitre: {
    apiUrl: 'https://api.mitre.org/att&ck/v1',
  },
};

module.exports = config;
