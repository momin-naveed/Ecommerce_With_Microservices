import slugify from 'slugify';
import Product, { ProductDocument } from './../model/product.model';
import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  RootQuerySelector,
  SortOrder,
} from 'mongoose';

import cloudinary from 'cloudinary';

/*********************
 *   Create Product   *
 *********************/
export const createProduct = async (
  input: DocumentDefinition<Omit<ProductDocument, 'createdAt,updatedAt'>>
) => {
  console.log('============>', input);

  const product = await Product.create(input);
  if (!product) {
    throw new Error('Something wrong! product create failed');
  }
  return product;
};

/*********************
 *    Find Product   *
 *********************/
export const findProductBySlug = async (slug: ProductDocument['slug']) => {
  const product = await Product.findOne({ slug });
  if (!product) {
    throw new Error('Something wrong! product create failed');
  }
  return product;
};

/*********************
 *   Update Product  *
 *********************/
export const updateProductBySlug = async (
  slug: String,
  data: Partial<ProductDocument>
) => {
  if (data.title) {
    const slug = slugify(data.slug!);
    data.slug = slug;
  }
  const product = await Product.findOneAndUpdate({ slug }, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error('Something wrong! product update failed');
  }
  return product;
};

/*********************
 *  Delete Product   *
 *********************/
export const deleteProductBySlug = async (slug: string) => {
  try {
    return await Product.findOneAndDelete({ slug });
  } catch (err) {
    console.log('err====>>>>', err);
  }
};

/*********************
 *     Get Products  *
 *********************/
export const getAllProduct = async () => {
  try {
    const products = await Product.find({});
    return products;
  } catch (err) {
    console.log('Errorrr=====>', err);
  }
};

/*********************
 *     Get List      *
 *********************/
export const getList = async (sort: string, order: SortOrder, page: number) => {
  const currentPage = page || 1;
  const perPage = 3;

  const products = await Product.find({})
    .skip((currentPage - 1) * perPage)
    .populate('category')
    .sort([[sort, order]])
    .limit(perPage)
    .exec();
  return products;
};

/*********************
 *    Upload Image   *
 *********************/

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (imageData: any) => {
  try {
    const result = await cloudinary.v2.uploader.upload(imageData, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error uploading image');
  }
};

/*********************
 *    Remove Image   *
 *********************/

export const deleteImage = async (public_id: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Error deleting image');
  }
};
