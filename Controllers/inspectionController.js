const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Project = require('../Models/project');   

//get all inspections
const getInspections = asyncHandler(async (req, res) => {
    const inspections = await Inspection.find({});
    
    res.status(200).json(inspections);
});

//get inspection by id
const getInspectionById = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findById(req.params.id);
    if(inspection){
        res.status(200).json(inspection);
    }
    else{
        res.status(404).json({error: 'Inspection not found'});
    }
});


const multer = require('multer');

// Define storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/inspections'); // Store files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};


// Create multer instance with storage options
const upload = multer({ storage: storage , fileFilter: fileFilter});

//create inspection
const createInspection = asyncHandler(async (req, res) => {
    const projectid = req.params.id;
    const project = await Project.findById(projectid);
    if(!project){

        return res.status(404).json({error: 'Project not found'});
    }
      
        upload.fields([
            { name: 'referenceImages', maxCount: 5 }, // You can specify the maximum number of files allowed
            { name: 'bespokedesigns', maxCount: 5 },
        ])(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'File upload error' });
            }else{
                console.log(req.files);
            }
            
            const {Date ,
                starttime,
                inspector_name,
                inspector_role,
                scaffold_description,
                statutory_inspection = false,
                reason_for_inspection = undefined,
                inspection_date = undefined} = req.body;

            const referenceImages = req.files['referenceImages'];
            const bespokedesigns = req.files['bespokedesigns'];
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            var imageurl;
            const inspection = new Inspection({
                projectid,
                Date ,
                starttime ,
                inspector_name ,
                inspector_role ,
                scaffold_description ,
                referenceImages : referenceImages.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ),
                bespokedesigns : bespokedesigns.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename),
                statutory_inspection,
                reason_for_inspection,
                inspection_date,
            });
            console.log(inspection);

            const createdInspection = await inspection.save();
         
    if(createdInspection){
    return res.status(200).json({
        Status:1,
        Message:"New Inspection Added",
        info:createdInspection
    });
    }
    else{
        return res.status(200).json(
            {   
                Status:0,
                Message: 'Invalid inspection data'
            }
            );
    }
          });
});



//get inspection
// const getInspections

module.exports={getInspections, getInspectionById, createInspection}