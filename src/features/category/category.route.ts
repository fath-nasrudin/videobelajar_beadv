import { Request, Response, Router, Router as RouterType } from "express";
import {
  Category,
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema";

let categories: Category[] = [
  {
    id: "cat1",
    name: "web dev",
  },
  {
    id: "cat2",
    name: "finance",
  },
  {
    id: "cat3",
    name: "psychology",
  },
];

const router: RouterType = Router();

router.get("/", (req: Request, res: Response) => {
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
  const newCategory: Category = {
    id: Date.now().toString(),
    ...data,
  };
  categories.push(newCategory);

  res.json({
    ok: true,
    message: "Success",
    data: newCategory,
    error: null,
  });
});

router.get("/:id", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    res.status(404).json({
      ok: false,
      message: `category with id: "${categoryId}" not found`,
      data: null,
      error: {
        message: `category with id: "${categoryId}" not found`,
      },
    });
    return;
  }

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

  //validate and sanitize
  const data = await updateCategorySchema.parseAsync(body);

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    res.status(404).json({
      ok: false,
      message: `category with id: "${categoryId}" not found`,
      data: null,
      error: {
        message: `category with id: "${categoryId}" not found`,
      },
    });
    return;
  }

  const updatedCategory: Category = {
    ...category,
    name: data.name ? data.name : category.name,
  };
  categories = categories.map((c) => {
    if (c.id === categoryId) {
      c = updatedCategory;
    }
    return c;
  });

  res.json({
    ok: true,
    message: "Success",
    data: updatedCategory,
    error: null,
  });
});

router.delete("/:id", async (req: Request, res: Response) => {
  const categoryId = req.params.id;

  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    res.status(404).json({
      ok: false,
      message: `category with id: "${categoryId}" not found`,
      data: null,
      error: {
        message: `category with id: "${categoryId}" not found`,
      },
    });
    return;
  }

  categories = categories.filter((c) => c.id !== categoryId);

  res.json({
    ok: true,
    message: "success",
    data: {
      id: category.id,
    },
    error: null,
  });
});
export const categoryRouter = router;
