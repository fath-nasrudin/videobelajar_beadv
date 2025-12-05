import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
import "dotenv/config";

async function main() {
  const DB_NAME = process.env.DB_NAME as string;
  const db = await mysql.createConnection({
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
  });

  // CREATE DATABASE
  await db.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  console.log("Database created or already exists");

  // set the created db
  await db.changeUser({ database: DB_NAME });

  const ddlDir = path.join(process.cwd(), "ddl");
  const files = fs.readdirSync(ddlDir).sort();

  for (const file of files) {
    if (!file.endsWith(".sql")) continue;
    const sql = fs.readFileSync(path.join(ddlDir, file), "utf8");
    console.log(`Running ${file}...`);
    await db.query(sql);
  }

  console.log("Done.");
  process.exit();
}

main().catch(console.error);
