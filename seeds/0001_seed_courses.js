export default async function seedCourses(db) {
  const courses = [
    { title: "JS in plain", description: "lorem ipsum" },
    { title: "How to write js", description: null },
  ];

  for (const c of courses) {
    await db.query(`INSERT INTO courses (title, description) VALUES (?, ?)`, [
      c.title,
      c.description,
    ]);
  }
  console.log("Success seed to courses table");
}
