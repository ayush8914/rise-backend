const experss = require('express');
const router = experss.Router();
const { createInspection, getInspectionById, getInspections } = require('../Controllers/inspectionController');
const {upload} = require('../middlewares/imageupload');

router.post('/addimage',upload.single('image'), (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const des_folder = 'inspections/';
    res.status(200).json({success: 1, image: baseUrl+des_folder+req.file.filename});
});
//get short details of all inspections
router.get('/', getInspections);


//get inspection by id
router.get('/:id', getInspectionById);


//create inspection   -- project id is passed in url
router.post('/:id', createInspection);


module.exports = router;