import { Request, Response, Router, Router as RouterType } from "express";
import {
  Category,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";
import * as categoryService from "./category.service";

const router: RouterType = Router();

router.get("/", async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();
  res.json({
    ok: true,
    message: "Success",
    data: categories,
    error: null,
  });
});

router.post("/", async (req: Request, res: Response) => {
  const body = req.body;

  //validate and sanitize
  const data = await createCategorySchema.parseAsync(body);

  // create category
  const status = await categoryService.createCategory(data);

  res.status(201).json({
    ok: true,
    message: "Success",
    data: status,
    error: null,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  if (!categoryId) throw new Error("Id not provided");

  const category = await categoryService.getCategoryById(categoryId);

  res.json({
    ok: true,
    message: "success",
    data: category,
    error: null,
  });
});

router.patch("/:id", async (req: Request, res: Response) => {
  const body = req.body;
  const categoryId = req.params.id;

  if (!categoryId) throw new Error("Id not provided");

  //validate and sanitize
  const data = await updateCategorySchema.parseAsync(body);

  const status = await categoryService.updateCategoryById(categoryId, data);

  res.json({
    ok: true,
    message: "Success",
    data: status,
    error: null,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  if (!categoryId) throw new Error("Id not provided");

  const data = await categoryService.deleteCategoryById(categoryId);

  res.json({
    ok: true,
    message: "success",
    data: data,
    error: null,
  });
});
export const categoryRouter = router;
