const experss = require('express');
const router = experss.Router();
const { createInspection, shortdetails,getInspectionById,addReason, getInspections,updateInspectionById,getInspection, getInspectionDetails,addOptions,getOptions,deleteOption } = require('../Controllers/inspectionController');
const {upload} = require('../middlewares/imageupload');
const Inspection = require('../Models/inspection');
const fs = require('fs');
const path = require('path');
const {protect} = require('../middlewares/auth');

router.post('/addimage',upload.single('image'), (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const des_folder = 'inspections/';
    res.status(200).json({Status: 1,
        Message:"image saved",
        image: baseUrl+des_folder+req.file.filename});
});

router.delete('/deleteimage/:id', async (req, res) => {
    const inspectionid = req.params.id;
    const inspection = await Inspection.findById(inspectionid);
    if(!inspection){
        res.status(200).json({Status: 0, message: 'Inspection not found'});
    }
    const flag = req.body.img_flag;
    if(flag == 0){
        inspection.referenceImages = inspection.referenceImages.filter((img) => img != req.body.imageurl);
    }
    const img = path.basename(req.body.imageurl);
    const parentDirectory = path.dirname(__dirname);
    const previousImagePath = path.join(parentDirectory, 'public/inspections', img);
    // console.log(previousImagePath);
    fs.unlink(previousImagePath, async(err) => {
        if(err){    
            res.status(200).json({Status: 0, message: 'Failed to delete image'});
        }else{
            if(flag == 0){
                inspection.referenceImages = inspection.referenceImages.filter((img) => img != req.body.imageurl);
            }else{
                inspection.bespokedesigns = inspection.bespokedesigns.filter((img) => img != req.body.imageurl);
            }
           const insp = await inspection.save();
            res.status(200).json({Status: 1, message: 'Image deleted successfully',info: insp});
        }
    });
});

router.delete('/deleteimages/:id', (req, res) => {
    const images = req.body.images; 
    const parentDirectory = path.dirname(__dirname);
    // console.log(images);
    images.forEach(img => {
        const previousImagePath = path.join(parentDirectory, 'public/inspections', path.basename(img));
        fs.unlink(previousImagePath, (err) => {
            if(err){
                res.status(200).json({Status: 0, message: 'Failed to delete image'});
            }
        });
    });
    res.status(200).json({Status: 1, message: 'Images deleted successfully'});
});

router.get('/shortdetails',protect, shortdetails);

//get inspection details by id
router.get('/combinedetails', getInspectionDetails);

//add reason to inspection
router.post('/addreason', addReason);

//add options to inspection
router.post('/addoptions', addOptions);

//get options to inspection
router.get('/getoptions',getOptions)

//delete options from the inspection
router.delete('/deleteoptions',deleteOption);

router.post('/:id',protect,createInspection);   //
//get short details of all inspections
router.get('/', getInspections);




//get inspection by id
router.get('/:id', getInspectionById);

//get all details of inspection by id
router.get('/details/:id', getInspection);

//get short details of all inspections


//update inspection by id
router.put('/:id',protect, updateInspectionById);  //





module.exports = router;