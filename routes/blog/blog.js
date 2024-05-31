const express  = require('express');
const { getAllBlog, addBlog, getBlogByID, updateBlog, deleteBlog, searchBlog } = require('../../controllers/blog/blog');

const router = express.Router();

router.post('/addBlog', addBlog);
router.get('/getAllBlog', getAllBlog);
router.get('/:id', getBlogByID);
router.put('/search', searchBlog);
router.put('/update/:id', updateBlog);
router.delete('/delete/:id', deleteBlog);

module.exports = router;