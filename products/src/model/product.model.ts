import mongoose from 'mongoose';
import slugify from 'slugify';

export interface ProductDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  richDescription: string;
  images: Array<string>;
  price: number;
  quantity: number;
  sold: number;
  shipping: string;
  colors: Array<string>;
  brand: Array<string>;
  ratings: Array<object>;
  tags: Array<string>;
  warranty: number;
  category: any;
  createdAt?: string;
  updatedAt?: string;
}

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      // required: [true, 'product title is required'],
      maxLength: [200, 'Title must shorter then 100 charcters'],
      minLength: [10, 'Title must greater then 10 charcters'],
      text: true,
    },
    slug: {
      type: String,
      text: true,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      // required: [true, 'description is required'],
    },

    richDescription: {
      type: String,
    },

    images: {
      type: Array,
      // required: [true, 'product image is required'],
      min: [1, 'Product must have one picture'],
      max: [6, 'Product must have less them 6 pictures'],
    },

    price: {
      type: Number,
      // required: [true, 'Product price is required'],
      trim: true,
      maxLength: 32,
    },

    quantity: {
      type: Number,
      // required: [true, 'product quantity is required'],
    },

    sold: Number,

    shipping: {
      type: String,
      enum: ['yes', 'no'],
      default: 'no',
    },

    colors: {
      type: Array,
    },

    brand: {
      type: Array,
    },

    ratings: [
      {
        starts: Number,
        postedBy: mongoose.Schema.Types.ObjectId,
      },
    ],

    tags: {
      type: Array,
    },

    warranty: {
      type: Number,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },

    // subCategories: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'SubCategory',
    //   },
    // ],
  },

  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

productSchema.set('autoIndex', false);

productSchema.pre('save', async function (done) {
  const product = this as ProductDocument;
  const slug = slugify(product.title, { lower: true });
  product.slug = slug;
  done();
});

const Product = mongoose.model<ProductDocument>('Product', productSchema);

export default Product;

//  {
// "title": "product title",
// "slug":"item",
// "description": "Product description",
// "richDescription": "Product rich description",
// "images": [
// "https://example.com/image1.jpg",
// "https://example.com/image2.jpg"
// ],
// "price": 99.99,
// "quantity": 100,
// "shipping": "yes",
// "colors": [
// "red",
// "green",
// "blue"
// ],
// "brand": [
// "Brand 1",
// "Brand 2"
// ],
// "tags": [
// "tag1",
// "tag2"
// ],
// "warranty": 1,
// "category": "61700e940a44910c7e6d64b7",
// "subCategories": [
// "61700e940a44910c7e6d64b8",
// "61700e940a44910c7e6d64b9"
// ]
// }
