const experss = require('express');
const router = experss.Router();
const {setfields,getData,setoptions,getObjOptions,deleteObjOptions} = require('../Controllers/adminController');

router.post('/setfields',setfields);

router.get('/getfields',getData);


router.post('/objoptions',setoptions);

router.get('/objoptions',getObjOptions);

router.delete('/objoptions',deleteObjOptions);
module.exports = router;