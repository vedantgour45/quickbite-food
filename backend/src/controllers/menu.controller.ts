import { Request, Response } from "express";
import { menuItems, findMenuItem } from "../data/menuItems";
import { HttpError } from "../middleware/errorHandler";
import type { MenuCategory } from "../types";

const VALID_CATEGORIES: MenuCategory[] = [
  "pizza",
  "burger",
  "pasta",
  "salad",
  "drinks",
  "chicken",
];

const isValidCategory = (value: string): value is MenuCategory =>
  (VALID_CATEGORIES as string[]).includes(value);

export const listMenu = (req: Request, res: Response): void => {
  const { category } = req.query;

  if (typeof category === "string" && category.length > 0) {
    if (!isValidCategory(category)) {
      // Per spec: invalid category returns empty array, not an error.
      res.json([]);
      return;
    }
    res.json(menuItems.filter((item) => item.category === category));
    return;
  }

  res.json(menuItems);
};

export const getMenuItem = (req: Request, res: Response): void => {
  const item = findMenuItem(req.params.id);
  if (!item) {
    throw new HttpError(404, "Menu item not found");
  }
  res.json(item);
};
