import { RowDataPacket } from "mysql2";
import { db } from "../../lib/db";
import {
  Category,
  CreateCategoryInputSchema,
  UpdateCategoryInputSchema,
} from "../category/category.schema";

interface CategoryDB extends Category, RowDataPacket {}

export async function getCategories(): Promise<Category[]> {
  const [rows] = await db.query<CategoryDB[]>("SELECT * from categories");
  return rows;
}

export async function createCategory(data: CreateCategoryInputSchema) {
  const [rows] = await db.execute("INSERT INTO categories (name) VALUES (?)", [
    data.name,
  ]);
  return rows;
}

export async function getCategoryById(id: Category["id"]): Promise<Category> {
  const [[category]] = await db.execute<CategoryDB[]>(
    "SELECT * from categories where id = ?",
    [id]
  );

  // @todo should fetch categories for the category
  // const thisCategoryCategories =

  if (!category) {
    throw new Error(`Category with id: "${id}" not found`);
  }

  return category;
}

export async function updateCategoryById(
  id: Category["id"],
  data: UpdateCategoryInputSchema
) {
  const fields: string[] = [];
  const values = [];

  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return Promise.resolve();

  values.push(id);
  const [rows] = await db.execute(
    `UPDATE categories SET ${fields.join(",")}  WHERE id = ?`,
    values
  );
  return rows;
}

export async function deleteCategoryById(id: Category["id"]) {
  const [rows] = await db.execute("DELETE FROM categories WHERE id = ?", [id]);
  return rows;
}
