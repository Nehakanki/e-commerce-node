const express = require("express");
const router = express.Router();

const {auth,isAdmin,isCustomer} = require('../middleware/auth')
const {createProduct, updateProduct,getProduct,getAdminProducts,deleteProduct,getAllProducts} = require("../controllers/product")

router.post('/createProduct',auth,isAdmin,createProduct);
router.put('/updateProducts/:productId',auth,isAdmin,updateProduct)
router.get('/getProduct/:productId',auth,isAdmin,getProduct);
router.get('/getAllAdminProduct',auth,isAdmin,getAdminProducts);
router.delete('/deleteProduct/:productId',auth,isAdmin,deleteProduct);
router.get('/getAllProduct',auth,isCustomer,getAllProducts)




module.exports = router;