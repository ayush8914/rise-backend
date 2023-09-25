const experss = require('express');
const router = experss.Router();
const {setfields,getData} = require('../Controllers/adminController');

router.post('/setfields',setfields);

router.get('/getfields',getData);

module.exports = router;