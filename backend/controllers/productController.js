import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // pagination - how many products per page being set as static number
  // const pageSize =10;
  // setting to 2 for testing
  const pageSize = 10;
  // the requested page number coming in from front end
  // cast as number page number or 1
  const page = Number(req.query.pageNumber) || 1;
  // for keyword search functionality need to decide if this is going to be
  // empty or get all products.
  const keyword = req.query.keyword
    ? {
        // match the keyword to the name of the product
        name: {
          // using regex here case insensitive
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};
  // for pagination will need total products- can use .countDocuments() , spread in keyword
  const count = await Product.countDocuments({ ...keyword });
  // for search functionality spread keyword ( this is going to be the keyword or empty)
  // for patination adding a limit to the page size and skip method
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    // . skip here page is either 1 or req.query.pageNumber result
    .skip(pageSize * (page - 1));
  // will also need to return page and total number of pages so making this object
  // passing in pages using ceil so nearest whole number greater than
  // res.json(products);
  // now that this is an object need to account for that on front end.
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // get the id that is in the URL
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // res.status(404).json({ message: "Product not found" });
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
//TODO this should actually be setting a flag isDeleted rather than deleting from the DB
// deleting from DB messes up orders and any order history for user and likely seller too
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
// when admin clicks create new product,create a sample with dummy data
// then take admin to screen to edit that data
//TODO this is a bit of a wonkey workflow is this the best way to solve ?
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  //var to hold new product , send to db
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  // from body get
  const { name, price, description, image, brand, category, countInStock } =
    req.body;
  // Product model,id in URL
  const product = await Product.findById(req.params.id);
  // check for product
  if (product) {
    // set feilds
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews - since adding resource this is a post
// @access  Private
//TODO only be able to review if you purchased the product
const createProductReview = asyncHandler(async (req, res) => {
  // for the particular review get
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // has this user already submitted a review? this const will
    // be true if it has
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }
    // user has not reviewed product so create a review object
    const review = {
      // logged in user name
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // push the new review onto the array
    product.reviews.push(review);
    // get number of reviews from array
    product.numReviews = product.reviews.length;
    //calculate overall rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save the review to the db
    await product.save();
    // 201 new resource created- send message to front end
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
// note this could have been done by adding to the get products route
const getTopProducts = asyncHandler(async (req, res) => {
  // get all the products, sort the returned object assending
  // .sort()  method and .limit() to get the top 3
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  // respond back to front end with the products
  res.json(products);
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
};
