export default async function seedCategories(db) {
  const categories = [
    { name: "programming" },
    { name: "finance" },
    { name: "biology" },
  ];

  for (const c of categories) {
    await db.query(`INSERT INTO categories (name) VALUES (?)`, [c.name]);
  }
  console.log("Success seed to categories table");
}
