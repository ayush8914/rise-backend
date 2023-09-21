const experss = require('express');
const router = experss.Router();
const { createInspection, getInspectionById, getInspections } = require('../Controllers/inspectionController');
const {upload} = require('../middlewares/imageupload');
const fs = require('fs');
const path = require('path');

router.post('/addimage',upload.single('image'), (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const des_folder = 'inspections/';
    res.status(200).json({success: 1, image: baseUrl+des_folder+req.file.filename});
});

router.delete('/deleteimage', (req, res) => {
    const img = path.basename(req.body.imageurl);
    const parentDirectory = path.dirname(__dirname);
    const previousImagePath = path.join(parentDirectory, 'public/inspections', img);
    // console.log(previousImagePath);
    fs.unlink(previousImagePath, (err) => {
        if(err){
            res.status(200).json({success: 0, message: 'Failed to delete image'});
        }else{
            res.status(200).json({success: 1, message: 'Image deleted successfully'});
        }
    });
});

router.delete('/deleteimages', (req, res) => {
    const images = req.body.images; 
    const parentDirectory = path.dirname(__dirname);
    // console.log(images);
    images.forEach(img => {
        const previousImagePath = path.join(parentDirectory, 'public/inspections', path.basename(img));
        fs.unlink(previousImagePath, (err) => {
            if(err){
                res.status(200).json({success: 0, message: 'Failed to delete image'});
            }
        });
    });
    res.status(200).json({success: 1, message: 'Images deleted successfully'});
});

router.post('/:id', createInspection);
//get short details of all inspections
router.get('/', getInspections);


//get inspection by id
router.get('/:id', getInspectionById);


//create inspection   -- project id is passed in url



module.exports = router;