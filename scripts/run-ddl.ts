import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";

async function main() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123123123",
    database: "test123",
  });

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
