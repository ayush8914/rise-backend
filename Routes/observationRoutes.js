const experss = require('express');
const router = experss.Router();
const { createObservation } = require('../Controllers/observations');

//create observation   -- inspection id is passed in url
router.post('/:id', createObservation);



module.exports = router;