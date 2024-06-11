const express  = require('express');
const { addOrder, createBulkOrder, getAllOrder, getOrderByID, searchOrder, updateOrder, deleteOrder, deleteBulkOrder } = require('../../controllers/order/order');

const router = express.Router();

router.post('/addOrder', addOrder);
router.post('/createBulkOrder', createBulkOrder);
router.get('/getAllOrder', getAllOrder);
router.get('/:id', getOrderByID);
router.put('/search', searchOrder);
router.put('/update/:id', updateOrder);
router.delete('/delete/:id', deleteOrder);
router.post('/delete/BulkDeleteOrder', deleteBulkOrder);

module.exports = router;