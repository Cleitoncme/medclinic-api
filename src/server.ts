import 'dotenv/config';

import { app } from './app';
import { env } from './config/env';
import { appDataSource } from './database/data-source';

async function startServer(): Promise<void> {
  await appDataSource.initialize();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
}

void startServer().catch((error: unknown) => {
  console.error('Unable to start MedClinic API.', error);
  process.exit(1);
});
