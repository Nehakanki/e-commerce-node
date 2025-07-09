const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require('../models/User');
const mongoose = require("mongoose")

// exports.createOrder = async (req, res) => {
//   try {
//     const customerId = req.user.id;
//     const { products } = req.body;

//     let totalAmount = 0;
//     const orderProducts = []; 

//     for (let item of products) {
//       const product = await Product.findById(item.product);

//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           message: `Product with ID ${item.product} not found.`,
//         });
//       }

   
//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({
//           success: false,
//           message: `Insufficient stock for product: ${product.name}. Available stock: ${product.stockQuantity}`,
//         });
//       }

//       const productTotal = item.quantity * product.price;
//       totalAmount += productTotal;

//       // Reduce product stock quantity
//       product.stockQuantity -= item.quantity;
//       await product.save();

//       orderProducts.push({
//         product: product._id,
//         name: product.name,
//         price: product.price,
//         quantity: item.quantity,
//         description: product.description,
//         productTotal,
    
//       });
//     }

//     const order = await Order.create({
//       customer: customerId,
//       products: orderProducts.map((item) => ({
//         product: item.product,
//         quantity: item.quantity,
//       })),
//       totalAmount,
//       status: "pending", 
//     });

//     res.status(201).json({
//       success: true,
//       message: "Order created successfully!",
//       orderDetails: {
//         orderId: order._id,
//         customer: customerId,
//         totalAmount,
//         status: order.status,
//         products: orderProducts,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error while creating the order.",
//       error: error.message,
//     });
//   }
// };


exports.createOrder = async (req, res,next) => {
  try {
    const customerId = req.user.id;
    const { products } = req.body;

    const createdOrders = []; 

    const productIds = products.map((product) => product.product); 
    const invalidIds = productIds.filter((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      // return res.status(400).json({
      //   success: false,
      //   message: `Invalid product ID(s): ${invalidIds.join(", ")}`,
      // });
      const error = new Error(`Invalid product ID(s): ${invalidIds.join(", ")}`);
      error.statusCode=400;
      return next(error)
    }
    const productsDB = await Product.find({ _id: { $in: productIds } }); 

    if (productsDB.length !== products.length) {
      return res.status(404).json({
        success: false,
        message: "One or more products not found in the database.",
      });
      // const error = new Error("One or more products not found in the database.");
      // error.statusCode =404;
      // return next(error);

    }

    for (let item of products) {
      const product = productsDB.find((productDB) => productDB._id.toString() === item.product);

      // if (!product) {
      //   return res.status(404).json({
      //     success: false,
      //     message: `Product with ID ${item.product} not found.`,
      //   });
      // }

      if (product.stockQuantity < item.quantity) {
        // return res.status(400).json({
        //   success: false,
        //   message: `Insufficient stock for product: ${product.name}. Available stock: ${product.stockQuantity}`,
        // });
        const error = new Error(`Insufficient stock for product: ${product.name}. Available stock: ${product.stockQuantity}`);
        error.statusCode=400;
        return next(error)
      }

      const productTotal = item.quantity * product.price;

    
      product.stockQuantity -= item.quantity;
      await product.save();

      const order = await Order.create({
        customer: customerId,
        products: [
          {
            product: product._id,
            quantity: item.quantity,
          },
        ],
        totalAmount: productTotal,
        status: "pending",
      });

      // Add the order details to the createdOrders array
      createdOrders.push({
        orderId: order._id,
        customer: customerId,
        totalAmount: productTotal,
        status: order.status,
        product: {
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          description: product.description,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Orders created successfully!",
      orders: createdOrders,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error while creating orders.",
    //   error: error.message,
    // });
   return next(error)
  }
};


// exports.getAllOrders = async (req, res) => {
//     try {
   
     
  
//       const orders = await Order.find()
//         .populate("customer", "name email") 
//         .populate("products.product", "name price");
  
//       if (orders.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No orders found.",
//         });
//       }
  
//       // Send response with all orders
//       res.status(200).json({
//         success: true,
//         message: "Orders retrieved successfully.",
//         orders,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Error while fetching orders.",
//         error: error.message,
//       });
//     }
//   };

exports.getAllOrders = async (req, res,next) => {
  try {  
    const userId = req.user.id; 
    const userRole = req.user.role; 

    let orders;

    if (userRole === "admin") {
      // fetch products created by the admin
      const adminProducts = await Product.find({ admin: userId }); 

      if (!adminProducts || adminProducts.length === 0) {
        // return res.status(404).json({
        //   success: false,
        //   message: "No products found for this admin.",
        // });
        const error = new Error("No products found for this admin.");
        error.statusCode(404);
        return next(error);
      }

      const adminProductIds = adminProducts.map((product) => product._id);

      orders = await Order.find({ "products.product": { $in: adminProductIds } })
        .populate("customer", "name email")
        .populate("products.product", "name price description"); 
    } else if (userRole === "customer") {
     
      orders = await Order.find({ customer: userId })
        .populate("customer", "name email")
        .populate("products.product", "name price description"); 
    } else {
      // Handle invalid user roles
      // return res.status(403).json({
      //   success: false,
      //   message: "Access denied. Invalid user role.",
      // });
      const error = new Error( "Access denied. Invalid user role.");
      error.statusCode=403;
      return next(error);

    }

    if (!orders || orders.length === 0) {
      // return res.status(404).json({
      //   success: false,
      //   message: "No orders found.",
      // });
      const error = new Error( "No orders found.");
      error.statusCode=404;
      return next(error);


    }

    // Return the orders
    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully.",
      orders,
    });
  } catch (error) {
    // res.status(500).json({
    //   success: false,
    //   message: "Error while fetching orders.",
    //   error: error.message,
    // });
    return next(error)
  }
};


  

  // exports.getCustomerOrders = async (req, res) => {
  //   try {
     
     
  //     const customerId = req.user.id;
  
  
  //     const orders = await Order.find({ customer: customerId })
  //       .populate("products.product", "name price description"); 
  
  //     if (orders.length === 0) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "No orders found for this customer.",
  //       });
  //     }
  
    
  //     res.status(200).json({
  //       success: true,
  //       message: "Customer orders retrieved successfully.",
  //       orders,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error while fetching customer orders.",
  //       error: error.message,
  //     });
  //   }
  // };
  

  // exports.updateOrderStatus = async (req, res) => {
  //   try {
  //     const { orderId } = req.params; 
  //     const { status } = req.body; 
  
  //     const validStatuses = ["outOfDelivery", "delivered"];
  //     if (!validStatuses.includes(status)) {
  //       return res.status(400).json({
  //         success: false,
  //         message: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}`,
  //       });
  //     }
  
    
  //     const order = await Order.findById(orderId);
  
  //     if (!order) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Order not found.",
  //       });
  //     }
  
  //     if (order.status !== "pending") {
  //       return res.status(400).json({
  //         success: false,
  //         message: `Cannot update status. Current status is '${order.status}', and it can only be updated from 'pending'.`,
  //       });
  //     }
  
  //     order.status = status;
  //     await order.save();
  
  //     res.status(200).json({
  //       success: true,
  //       message: `Order status updated to '${status}' successfully.`,
  //       updatedOrder: {
  //         orderId: order._id,
  //         status: order.status,
  //       },
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Error while updating order status.",
  //       error: error.message,
  //     });
  //   }
  // };

  exports.updateOrderStatus = async (req, res,next) => {
    try {
      const adminId = req.user.id;
      const { orderId } = req.params; 
      const { status } = req.body; 
  
      // Valid statuses that can be updated
      const validStatuses = ["outOfDelivery", "delivered"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed statuses are: ${validStatuses.join(", ")}`,
        });
      }
  
     
      const order = await Order.findById(orderId).populate("products.product", "name admin");
  
      if (!order) {
        // return res.status(404).json({
        //   success: false,
        //   message: "Order not found.",
        // });
        const error = new Error( "Order not found.");
        error.statusCode=404;
        return next(error);
  
      }
  
      /// if the logged-in admin is associated with any product in the order
      const isAdminAuthorized = order.products.some(
        (item) => item.product.admin?.toString() === adminId.toString()
      );
  
      if (!isAdminAuthorized) {
        // return res.status(403).json({
        //   success: false,
        //   message: "You are not authorized to update the status of this order.",
        // });
        const error = new Error("You are not authorized to update the status of this order." );
        error.statusCode=403;
        return next(error);
      }
  //update stauts of order
      order.status = status;
      order.updatedAt = Date.now(); // timestamp update
      await order.save();
  
      res.status(200).json({
        success: true,
        message: `Order status updated to '${status}' successfully.`,
        updatedOrder: {
          orderId: order._id,
          status: order.status,
        },
      });
    } catch (error) {
     return next(error);
    }
  };
  
  
  exports.cancelOrder = async (req, res,next) => {
    try {
      const customerId = req.user.id; 
      const { orderId } = req.params; 
  
      console.log("Authenticated Customer ID:", customerId);
      console.log("Order ID:", orderId);
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        const error = new Error("OrderID is invlaid order not found.");
        error.statusCode = 404;
        return next(error);
      }
  
      const order = await Order.findById(orderId).populate("products.product");
  
      if (!order) {
        // return res.status(404).json({
        //   success: false,
        //   message: "Order not found.",
        // });
        const error = new Error("order not found" );
        error.statusCode=404;
        return next(error);
        
      }
  
      console.log("Order Customer ID:", order.customer); 
      console.log("Authenticated Customer ID:", customerId); 
  
      if (!order.customer.equals(customerId)) {
        // return res.status(403).json({
        //   success: false,
        //   message: "Access denied. You can only cancel your own orders.",
        // });
        const error = new Error("Access denied. You can only cancel your own orders." );
        error.statusCode=403;
        return next(error);
      }
  
      if (order.status !== "pending") {
        // return res.status(400).json({
        //   success: false,
        //   message: `Cannot cancel the order. Current status is '${order.status}', and only 'pending' orders can be canceled.`,

        // });
        const error = new Error( `Cannot cancel the order. Current status is '${order.status}', and only 'pending' orders can be canceled.`);
        error.statusCode=403;
        return next(error);
      }
  
      for (let item of order.products) {
        const product = item.product;
        product.stockQuantity += item.quantity; 
        await product.save();
      }
  
      order.status = "cancelled";
      await order.save();
  
      res.status(200).json({
        success: true,
        message: "Order canceled successfully and stock quantities restored.",
        canceledOrder: {
          orderId: order._id,
          status: order.status,
          customer: order.customer,
        },
      });
    } catch (error) {
      // console.error("Error in cancelOrder:", error); 
      // res.status(500).json({
      //   success: false,
      //   message: "Error while canceling the order.",
      //   error: error.message,
      // });
      return next(error)
    }
  };
  