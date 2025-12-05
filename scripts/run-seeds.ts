import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import "dotenv/config";

async function main() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_NAME as string,
  });

  const seedDir = path.join(process.cwd(), "seeds");
  const files = fs.readdirSync(seedDir).sort();

  for (const file of files) {
    if (!file.endsWith(".js")) continue;

    console.log(`Running seed ${file}...`);
    const module = await import(path.join(seedDir, file));
    const seedFn = module.default;

    await seedFn(db);
  }

  console.log("Seeding done.");
  process.exit();
}

main().catch(console.error);
