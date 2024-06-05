const express  = require('express');
const { addQuiz, getAllQuiz, getQuizByID, searchQuiz, updateQuiz, deleteQuiz, createBulkQuiz, deleteBulkQuiz } = require('../../controllers/quiz/quiz');

const router = express.Router();

router.post('/addQuiz', addQuiz);
router.post('/createBulkQuiz', createBulkQuiz);
router.get('/getAllQuiz', getAllQuiz);
router.get('/:id', getQuizByID);
router.put('/search', searchQuiz);
router.put('/update/:id', updateQuiz);
router.delete('/delete/:id', deleteQuiz);
router.post('/delete/BulkDeleteQuiz', deleteBulkQuiz);

module.exports = router;