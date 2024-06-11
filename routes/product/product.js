const express  = require('express');
const { addProduct, createBulkProduct, getAllProduct, getProductByID, searchProduct, updateProduct, deleteProduct, deleteBulkProduct } = require('../../controllers/product/product');

const router = express.Router();

router.post('/addProduct', addProduct);
router.post('/createBulkProduct', createBulkProduct);
router.get('/getAllProduct', getAllProduct);
router.get('/:id', getProductByID);
router.put('/search', searchProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.post('/delete/BulkDeleteProduct', deleteBulkProduct);

module.exports = router;