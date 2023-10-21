import { Response, Request } from 'express';
import { get } from 'lodash';
import { log } from '../utils/logger';
import {
  createProduct,
  deleteImage,
  deleteProductBySlug,
  findProductBySlug,
  getAllProduct,
  getList,
  updateProductBySlug,
  uploadImage,
} from '../services/product.service';
import { User } from '../model/user.model';

const stripe = require('stripe')(process.env.STRIP_SECRET_KEY);

/*********************
 *   Create Product  *
 *********************/
export const createProductHandler = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);
    res.json({ product, msg: 'product is created' });
  } catch (err) {
    console.log(err);

    //@ts-ignore
    if (err.code == 11000) {
      //@ts-ignore
      const message = `Dublicate Field Enter at index ${err.index}`;
      res.status(400).json({
        success: false,
        data: message,
      });
    }
    res.status(400).json({
      success: false,
      data: {},
    });
  }
};

/*********************
 *  Delete Product   *
 *********************/
export const deleteProductHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  const product = await deleteProductBySlug(slug);
  res.sendStatus(200);
};

/*********************
*    Find Product    *
/*********************/
export const findProductHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  const product = await findProductBySlug(slug);
  res.json({ product });
};

/*********************
*   Get All Product  *
/*********************/
export const getAllProductHandler = async (req: Request, res: Response) => {
  const products = await getAllProduct();
  res.json({ products });
};

/*********************
 *   Update Product  *
 *********************/
export const updateProductHandler = async (req: Request, res: Response) => {
  const slug = get(req.params, 'slug');
  const data = req.body; // get the data from the request body
  const product = await updateProductBySlug(slug, data);
  res.status(200).json({ product, msg: 'product Updated....' });
};
/*********************
 *    List Product   *
 *********************/
export const list = async (req: Request, res: Response) => {
  const { sort, order, page } = req.body;
  const product = await getList(sort, order, page);
  res.json({ product });
};

/*********************
 *   Upload Image  *
 *********************/

export const upload = async (req: Request, res: Response) => {
  const { image } = req.body;
  const result = await uploadImage(image);
  res.json({ result });
};

/*********************
 *    Remove Image   *
 *********************/
export const remove = async (req: Request, res: Response) => {
  const { public_id } = req.body;
  const result = await deleteImage(public_id);
  res.json({
    success: true,
    data: 'Deleted Successful',
  });
};

export const stripIntent = async (req: Request, res: Response) => {
  try {
    //applu coupon
    const { cartTotal } = req.body;

    //get user
    // const user = await User.findOne({ email: email }).exec();

    //get the total ammount
    // const { cartTotal, cartTotalAfterDiscount } = await Cart.findOne({
    //   OrderBy: user._id,
    // }).exec();

    // console.log("cart total==>", cartTotal, "AFter discount ==>", cartTotalAfterDiscount);
    // check if we have coupon then charge the price after discount other wise the total ammount

    let finalAmount = cartTotal;
    // if (couponApplied && cartTotalAfterDiscount) {
    //   finalAmount = cartTotalAfterDiscount * 100;
    // } else {
    //   finalAmount = cartTotal * 100;
    // }

    //create a payment intent base on ordered amount cartTotal and currency
    const paymentIntent = await stripe.paymentIntents.create({
      description: 'DigiTech E-Shop',
      amount: finalAmount * 100, //as 100 =1$
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
      cartTotal,
      payable: finalAmount,
    });
  } catch (err) {
    console.log(err);
  }
};
