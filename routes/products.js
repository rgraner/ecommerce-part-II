const express = require('express');
const router = express.Router();
const dbProducts = require('../controllers/products');


router.get('/', dbProducts.getAllProducts);
router.get('/:id', dbProducts.getProductById);
router.post('/', dbProducts.createProduct);
router.put('/:id', dbProducts.updateProduct);
router.delete('/:id', dbProducts.deleteProduct);


module.exports = router;
