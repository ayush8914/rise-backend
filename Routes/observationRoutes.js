const experss = require('express');
const router = experss.Router();
const { createObservation } = require('../Controllers/observations');
const {addLift} = require('../Controllers/liftController');
const multer = require('multer');
const path = require('path');


//create observation   -- inspection id is passed in url

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/observations'); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + file.originalname);
    },
  });

const upload = multer({ storage: storage});
router.post('/addimage',upload.single('image'), (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const des_folder = 'observations/';
    res.status(200).json({success: 1, image: baseUrl+des_folder+req.file.filename});
});

const fs = require('fs');
router.delete('/deleteimage', async (req, res) => {
    const img = path.basename(req.body.imageurl);
    console.log(img);
    const parentDirectory = path.dirname(__dirname);
    const previousImagePath = path.join(parentDirectory, 'public/observations', img);
    // console.log(previousImagePath);
    fs.unlink(previousImagePath, async(err) => {
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
    if(!images  || images.length == 0){
        return res.status(200).json({success: 0, message: 'No images to delete'});
    }
    var notfound = [];
    images.forEach(img => {
        const previousImagePath = path.join(parentDirectory, 'public/observations', path.basename(img));
  
        fs.unlink(previousImagePath, (err) => {
            if(err){
                console.log('image not found');
                notfound.push(err);
            }
        });
    });
    res.status(200).json({success: 1, message: 'Images deleted successfully', notfound: notfound});
});

router.post('/:id', createObservation);

router.post('/lifts/:id', addLift);
// "http://localhost:5000/observations/1695392713553Screenshot 2023-09-15 194044.png"

module.exports = router;    