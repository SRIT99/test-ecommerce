const app = require('./src/app');
const connectDB = require('./src/config/db');
const { port, mongoUri } = require('./src/config/env');

(async () => {
  await connectDB(mongoUri);
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
})();
