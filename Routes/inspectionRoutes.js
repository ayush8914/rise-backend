const experss = require('express');
const router = experss.Router();

//get short details of all inspections
router.get('/', (req, res) => {
    res.send('get short details of all inspections');
});


//get inspection by id
router.get('/:id', (req, res) => {
    res.send('get inspection by id');
});


//create inspection   -- project id is passed in url
router.post('/:id', (req, res) => {
    res.send('create inspection');
});


module.exports = router;