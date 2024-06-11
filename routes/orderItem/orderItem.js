const express  = require('express');
const { addOrderItem, createBulkOrderItem, getAllOrderItem, getOrderItemByID, searchOrderItem, updateOrderItem, deleteOrderItem, deleteBulkOrderItem } = require('../../controllers/oderItem/orderItems');

const router = express.Router();

router.post('/addOrderItem', addOrderItem);
router.post('/createBulkOrderItem', createBulkOrderItem);
router.get('/getAllOrderItem', getAllOrderItem);
router.get('/:id', getOrderItemByID);
router.put('/search', searchOrderItem);
router.put('/update/:id', updateOrderItem);
router.delete('/delete/:id', deleteOrderItem);
router.post('/delete/BulkDeleteOrderItem', deleteBulkOrderItem);

module.exports = router;