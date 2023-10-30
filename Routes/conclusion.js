const experss = require('express');

const router = experss.Router();

const {addConclusion,getConclusionById,updateConclusion} = require('../Controllers/conclusion');
router.get('/getconclusion/:id',getConclusionById);


router.post('/addconclusion/:id',addConclusion);

//update conclusion
router.put('/updateconclusion/:id',updateConclusion);

module.exports = router;
