import { Response, Request } from 'express';
import { get } from 'lodash';
import {
  createCategory,
  deleteCategoryWithSlug,
  findCategoryWithSlug,
  getAllCategories,
  updateCategoryWithSlug,
} from '../services/category.service';

export const createCategoryHandler = async (req: Request, res: Response) => {
  const category = await createCategory(req.body);
  res.status(201).json({ category });
};

export const findCategoryHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  const category = await findCategoryWithSlug(slug);
  res.json({ category });
};

export const deleteCategoryHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  await deleteCategoryWithSlug(slug);
  res.status(204).json({ msg: 'Category Deleted' });
};

export const getAllCategoryHandler = async (req: Request, res: Response) => {
  const categorys = await getAllCategories();
  res.json({ categorys });
};

export const updateCategoryHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  const category = await updateCategoryWithSlug(slug, req.body);
  res.json({ category });
};
