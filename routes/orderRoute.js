const express = require("express");
const router = express.Router();

const {auth,isAdmin,isCustomer} = require('../middleware/auth')

const  {createOrder,getAllOrders,updateOrderStatus,cancelOrder}= require('../controllers/Order')

router.post('/createOrder',auth,isCustomer,createOrder);
router.get('/getAllOrder',auth,getAllOrders);
// router.get('/getCustomerOrder',auth,isCustomer,getCustomerOrders);
router.put('/updateOrderStatus/:orderId',auth,isAdmin,updateOrderStatus);
router.put('/cancelOrder/:orderId',auth,isCustomer,cancelOrder);


module.exports = router;