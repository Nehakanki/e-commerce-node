const Product = require('../models/Product');



exports.createProduct = async (req, res,next) => {
    try {
      // Extracting product details from the request body
      const { name, description, price, stockQuantity, category } = req.body;
      if (!name ) {
        return res.status(400).json({ error: 'Product name is required' });
    }
    if (!description) {
        return res.status(400).json({ error: 'Product description is required' });
    }
    if (!price || price <= 0.01) {
        return res.status(400).json({ error: 'Price must be greater than 0' });
    }
    if (stockQuantity === undefined || stockQuantity < 0) {
        return res.status(400).json({ error: 'Stock quantity cannot be negative' });
    }
    if (!category) {
        return res.status(400).json({ error: 'Product category is required' });
    }

  
      const adminId = req.user.id;
  
    
      const product = await Product.create({
        name,
        description,
        price,
        stockQuantity,
        category,
        admin: adminId, 
      });
  
    
      res.status(200).json({
        success: true,
        message: "Product created successfully!",
        product,
      });
    } catch (error) {
    
      // res.status(500).json({
      //   success: false,
      //   message: "Error while creating product. Please try again later.",
      // });
     return next(error)
    }
  };



  exports.updateProduct = async (req, res,next) => {
    try {
      const { productId } = req.params; 
      const adminId = req.user.id; 
  
      const product = await Product.findOne({ _id: productId, admin: adminId });
      if (!product) {
        // return res.status(404).json({
        //   success: false,
        //   message: "Only Admin that created the product can update it.",
        // });
        const error = new Error("Only Amdin that created the product can update.");
        error.statusCode = 404;
        return next(error);
      }
  
    
      const updatedFields = {
        name: req.body.name || product.name,
        description: req.body.description || product.description,
        price: req.body.price || product.price,
        stockQuantity: req.body.stockQuantity || product.stockQuantity,
        category: req.body.category || product.category,
      };
  
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updatedFields,
        { new: true, runValidators: true } 
      );
  
      res.status(200).json({
        success: true,
        message: "Product updated successfully!",
        product: updatedProduct,
      });
    } catch (error) {
      // res.status(500).json({
      //   success: false,
      //   message: "Error while updating product.",
      //   error: error.message,
      // });
     return next(error)
    }
  };
  

  exports.getProduct = async (req, res,next) => {
    try {
      const { productId } = req.params;
      const adminId = req.user.id; 
  
      const product = await Product.findOne({ _id: productId, admin: adminId });
  
      if (!product) {
        // return res.status(404).json({
        //   success: false,
        //   message: "Product not found for the particular User.",
        // });
        const error = new Error("Product not found for the particular User");
        error.statusCode = 404;
        return next(error);
      }
  
      res.status(200).json({
        success: true,
        message: "Product retrieved successfully",
        product,
      });
    } catch (error) {
      // res.status(500).json({
      //   success: false,
      //   message: "Error while fetching product",
      //   error: error.message,
      // });
     return next(error)
    }
  };


  exports.getAdminProducts = async (req, res,next) => {
    try {
      const adminId = req.user.id; // Extract admin ID from the authenticated user
  
      // Find all products created by this admin
      const products = await Product.find({ admin: adminId });
  
      // If no products are found
      if (products.length === 0) {
        // return res.status(404).json({
        //   success: false,
        //   message: "No products found for this admin.",
        // });
        const error = new Error("No product for this admin ")
        error.statusCode = 404;
        return next(error)
      }
  
      // Return the list of products
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        products,
      });
    } catch (error) {
      // res.status(500).json({
      //   success: false,
      //   message: "Error while fetching products.",
      //   error: error.message,
      // });
   return   next(error);
    }
  };
  
  
exports.deleteProduct = async (req, res,next) => {
    try {
      const { productId } = req.params; 
      const adminId = req.user.id; 
  
      const product = await Product.findOne({ _id: productId, admin: adminId });
  
      if (!product) {
        // return res.status(404).json({
        //   success: false,
        //   message: "Product not found or you do not have permission to delete it.",
        // });

        const error = new Error("Product not found or you do not have permission to delete it.");
        error.statusCode =404;
        return next(error);
      }
  
      await Product.findByIdAndDelete(productId);
  
      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
   
      // res.status(500).json({
      //   success: false,
      //   message: "Error while deleting product.",
      //   error: error.message,
      // });
     return next(error)
    }
};
  
//for customer
exports.getAllProducts = async (req, res,next) => {
    try {
     
      const products = await Product.find();
  
      // If no products are found
      if (products.length === 0) {
        // return res.status(404).json({
        //   success: false,
        //   message: "No products available in the database.",
        // });
        const error =  new Error("No products available in the database");
        error.statusCode=404;
        return next(error)
      }
  
    
      res.status(200).json({
        success: true,
        message: "Products retrieved successfully.",
        products,
      });
    } catch (error) {
      // res.status(500).json({
      //   success: false,
      //   message: "Error while fetching products.",
      //   error: error.message,
      // });
     return next(error);
    }
  };
  