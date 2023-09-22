const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Project = require('../Models/project');   

const {Observation}  = require("../Models/observations")
const Lift = require('../Models/lifts');


//get all inspections
const getInspections = asyncHandler(async (req, res) => {
    const inspections = await Inspection.find({});
    
   return res.status(200).json(inspections);
});

//get inspection by id
const getInspectionById = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findById(req.params.id);
    if(inspection){
       return res.status(200).json(inspection);
    }
    else{
        return res.status(404).json({error: 'Inspection not found'});
    }
});


//get all details of inspection by id
const getInspection = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findById(req.params.id);
    if(inspection){
        
        const Foundations = await Observation.findOne({inspectionid: req.params.id, category: 'foundations'});
        const Sole_boards = await Observation.findOne({inspectionid: req.params.id, category: 'sole_boards'});
        const Kicker_lifts = await Observation.findOne({inspectionid: req.params.id, category: 'kicker_lifts'});
        const lifts = await Lift.findOne({inspectionid: req.params.id, category: 'lifts'});

        return res.status(200).json({
            Status:1,
            Message: 'Inspection details',
            info: inspection,
            Foundations: Foundations.isissue ? Foundations : undefined,
            Sole_boards: Sole_boards?.isissue ? Sole_boards : undefined,
            Kicker_lifts: Kicker_lifts?.isissue ? Kicker_lifts : undefined,
            lifts: lifts?.isissue ? lifts : undefined,
        });
    }
    else{
        return res.status(200).json(
            {
                Status:0,
                Message: 'Inspection not found'
            }
            );
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
const upload = multer({ storage: storage 
    // fileFilter: fileFilter
});

//create inspection
const createInspection = asyncHandler(async (req, res) => {
    const projectid = req.params.id;
    const project = await Project.findById(projectid);
    if(!project){

        return res.status(200).json(
            {   Status :0,
                Message: 'Project not found'
            }
            );
    }
        
        upload.fields([
            { name: 'referenceImages', maxCount: 10 }, // You can specify the maximum number of files allowed
            { name: 'bespokedesigns', maxCount: 10 },
        ])(req, res, async (err) => {
            if (err) {
                return res.status(200).json(
                    {   Status :0,
                        Message: 'File upload error'
                     }
                    );
            }else{
                console.log(req.files,1);
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
                referenceImages : referenceImages?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ),
                bespokedesigns : bespokedesigns?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename),
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

//update inspection by id
const updateInspectionById = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findById(req.params.id);
    
    if(!inspection){
        return res.status(200).json(
            {   
                Status:0,
                Message: 'Inspection not found'
            }
            );
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    var imageurl;
    upload.fields([
        { name: 'referenceImages', maxCount: 10 }, // You can specify the maximum number of files allowed
        { name: 'bespokedesigns', maxCount: 10 },
    ])(req, res, async (err) => {
        
        inspection.Date = req.body.Date || inspection.Date;
        inspection.starttime = req.body.starttime || inspection.starttime;
        inspection.inspector_name = req.body.inspector_name || inspection.inspector_name;
        inspection.inspector_role = req.body.inspector_role || inspection.inspector_role;
        inspection.scaffold_description = req.body.scaffold_description || inspection.scaffold_description;
        const existingImages = inspection.referenceImages || [];
        inspection.referenceImages = req.files['referenceImages']?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ) || [];
        inspection.referenceImages = existingImages.concat(inspection.referenceImages);
        const existingBespokeDesigns = inspection.bespokedesigns || [];
        inspection.bespokedesigns = req.files['bespokedesigns']?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ) || [];
        inspection.bespokedesigns = existingBespokeDesigns.concat(inspection.bespokedesigns);

        inspection.statutory_inspection = req.body.statutory_inspection || inspection.statutory_inspection;
        inspection.reason_for_inspection = req.body.reason_for_inspection || inspection.reason_for_inspection;
        inspection.inspection_date = req.body.inspection_date || inspection.inspection_date;
        const updatedInspection = await inspection.save();
       return res.status(200).json(
           {
            Status:1,
            Message: 'Inspection updated successfully',
           info: updatedInspection
           }
            );
    }
    );
    // res.status(200).json(inspection);
});

module.exports={getInspections, getInspectionById, createInspection,updateInspectionById,getInspection}