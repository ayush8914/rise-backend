const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Project = require('../Models/project');   

const {Observation}  = require("../Models/observations")
const Lift = require('../Models/lifts');
const Ioption = require('../Models/ioptions');
const Ireason = require('../Models/ireason');

//get all inspections
const getInspections = asyncHandler(async (req, res) => {
   const inspections = await Inspection.find({}); 
   return res.status(200).json({
    Status:1,
    Message:'Inspections fetched successfully',
    info:inspections
});
});

const getInspectionById = asyncHandler(async (req, res) => {
    try {
        const inspection = await Inspection.findById(req.params.id);
        if (inspection) {
            
            const isoDate = inspection.Date.toISOString().split('T')[0];
            
            const [year, month, day] = isoDate.split('-');
            const formattedDate = `${day}/${month}/${year}`;

            return res.status(200).json({
                Status: 1,
                Message: 'Inspection fetched successfully',
                info: {
                    ...inspection.toObject(),
                    Date: formattedDate,
                },
            });
        } else {
            return res.status(200).json({ 
                Status:0,
                Message: 'Inspection not found' });
        }
    } catch (error) {
        return res.status(200).json({ 
            Status:0,
            Message: 'Internal server error' });
    }
});

const temp={}


//get all inspections
const shortdetails = asyncHandler(async (req, res) => {
    const userid = req.user._id;

    const inspections = await Inspection.find({userid:userid}).sort({  createdAt: -1 });

    if(inspections){
        return res.status(200).json({
            Status:1,
            Message:'Inspections fetched successfully',
            info:inspections
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message:'Inspections not found',
        });
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
            Foundations: Foundations?.isissue ? Foundations : undefined,
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
    cb(null,    Date.now() + file.originalname);
  },
});



// Create multer instance with storage options
const upload = multer({ storage: storage });

//create inspection
const createInspection = asyncHandler(async (req, res) => {
    const userid = req.user._id;
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
           
            const {
                userid,
                Date ,
                starttime,
                reference,
                inspector_name,
                inspector_role,
                scaffold_description,
                option,
                statutory_inspection = false,
                reason_for_inspection = null,
                inspection_date = null} = req.body;


                //also can be done from the frontend
                if(!Date || !starttime || !reference  || !inspector_name || !inspector_role || !scaffold_description || !option ){
                    const params = [];
                    if(!Date){
                        params.push('Date');
                    }
                    if(!starttime){
                        params.push('starttime');
                    }
                    if(!reference){
                        params.push('reference');
                    }
                    if(!inspector_name){
                        params.push('inspector_name');
                    }
                    if(!inspector_role){
                        params.push('inspector_role');
                    }
                    if(!scaffold_description){
                        params.push('scaffold_description');
                    }
                    if(!option){
                        params.push('option');
                    }

                    if(statutory_inspection == true){
                        if(!reason_for_inspection){
                            params.push('reason_for_inspection');
                        }
                        if(!inspection_date){
                            params.push('inspection_date');
                        }
                    } 

                    return res.status(200).json(
                        {   
                            Status:0,
                            Message: 'Inspection data missing',
                            params: params
                        }
                        );
                    }

            const referenceImages = req.files['referenceImages'];
            const bespokedesigns = req.files['bespokedesigns'];
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            var imageurl;
            
            var createdInspection; 
            if(statutory_inspection == true){
            const inspection = new Inspection({
                userid,
                projectid,
                Date ,
                starttime ,
                reference,
                inspector_name ,
                inspector_role ,
                scaffold_description ,
                referenceImages : referenceImages?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ),
                option,
                bespokedesigns : bespokedesigns?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename),
                statutory_inspection,
                reason_for_inspection,
                inspection_date,
            });
        
            createdInspection   = await inspection.save();
        }else{
            const inspection = new Inspection({
                // userid,
                projectid,
                Date ,
                starttime ,
                reference,
                inspector_name ,
                inspector_role ,
                scaffold_description ,
                referenceImages : referenceImages?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ),
                option,
                bespokedesigns : bespokedesigns?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename),
                statutory_inspection,
                reason_for_inspection,
                inspection_date,
            });
            createdInspection = await inspection.save();
        }
         
        console.log(createdInspection);
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
    console.time('start');
    const inspection = await Inspection.findById(req.params.id);
    const userid = req.user._id;
    if(userid != inspection.userid){
        return res.status(200).json(
            {   
                Status:0,
                Message: 'You are not authorized to update this inspection'
            }
            );
    }

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
     const parts = req.body.Date.split("/");
     const formattedDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;

console.log(formattedDateStr); // Output: "09/29/2023"
        inspection.Date = formattedDateStr || inspection.Date;
        inspection.starttime = req.body.starttime || inspection.starttime;
        inspection.reference = req.body.reference || inspection.reference;
        inspection.inspector_name = req.body.inspector_name || inspection.inspector_name;
        inspection.inspector_role = req.body.inspector_role || inspection.inspector_role;
        inspection.scaffold_description = req.body.scaffold_description || inspection.scaffold_description;
        const existingImages = inspection.referenceImages || [];
        inspection.referenceImages = req.files['referenceImages']?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ) || [];
        inspection.option = req.body.option || inspection.option;
        inspection.referenceImages = existingImages.concat(inspection.referenceImages);
        const existingBespokeDesigns = inspection.bespokedesigns || [];
        inspection.bespokedesigns = req.files['bespokedesigns']?.map((file) =>   imageurl = baseUrl+'/inspections/' + file.filename ) || [];
        inspection.bespokedesigns = existingBespokeDesigns.concat(inspection.bespokedesigns);

        inspection.statutory_inspection = req.body.statutory_inspection || inspection.statutory_inspection;
        inspection.reason_for_inspection = req.body.reason_for_inspection || inspection.reason_for_inspection;
        inspection.inspection_date = req.body.inspection_date || inspection.inspection_date;
        const updatedInspection = await inspection.save();
        console.timeEnd('end');
       return res.status(200).json(
           {
            Status:1,
            Message: 'Inspection updated successfully',
           info: updatedInspection
           }
            );
    }
    );
});


//add options to inspection
const addOptions = asyncHandler(async (req, res) => {
    const option = req.body.option;
    const ioptions = await Ioption.findOne({option});
    if(ioptions){
        return res.status(200).json({
            Status:0,
            Message: 'Option already exists',
        });
    }
    else{
        const ioption = new Ioption({
           option
        });
        const createdOption = await ioption.save();
        if(createdOption){
            return res.status(200).json({
                Status:1,
                Message: 'Option added successfully',
                info: createdOption
            });
        }
        else{
            return res.status(200).json({
                Status:0,
                Message: 'Something went wrong',
            });
        }
    }
});


//add reason
const addReason = asyncHandler(async (req, res) => {

    const reason = req.body.reason;
    const ireasons = await Ireason.findOne({reason});
    if(ireasons){
        return res.status(200).json({
            Status:0,
            Message: 'Reason already exists',
        });
    }
    else{
        const ireason = new Ireason({
           reason
        });
        const createdReason = await ireason.save();
        if(createdReason){
            return res.status(200).json({
                Status:1,
                Message: 'Reason added successfully',
                info: createdReason
            });
        }
        else{
            return res.status(200).json({
                Status:0,
                Message: 'Something went wrong',
            });
        }
    }

});

//get options, reason and short project details
const getInspectionDetails = asyncHandler(async (req, res) => {
    try {
      const projects = await Project.find({}, 'project_id contractor_name');
      const ioptions = await Ioption.find({});
      const ireasons = await Ireason.find({});
  
      return res.status(200).json({
        Status: 1,
        Message: 'Inspection details',
        info: {
        projects: projects,
        options: ioptions,
        reasons: ireasons
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(200).json({
        Status: 0,
         Message: 'An error occurred while fetching data' });
    }
  });
  

//get reasons
const getReasons = asyncHandler(async (req, res) => {
    const ireasons = await Ireason.find({});
    if(ireasons){
        return res.status(200).json({
            Status:1,
            Message: 'Reasons fetched successfully',
            info: ireasons
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message: 'Reasons not found',
        });
    }
});


//get options
const getOptions = asyncHandler(async (req, res) => {
    const ioptions = await Ioption.find({});
    if(ioptions){
        return res.status(200).json({
            Status:1,
            Message: 'Options fetched successfully',
            info: ioptions
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message: 'Options not found',
        });
    }
});


//delete options 
const deleteOption = asyncHandler(async (req, res) => {
    const optionid = req.body.optionid;
    const ioptions = await Ioption.findById(optionid);
    if(ioptions){
        const deletedOption = await ioptions.remove();
        return res.status(200).json({
            Status:1,
            Message: 'Option deleted successfully',
            info: deletedOption
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message: 'Option not found',
        });
    }

}
);




module.exports={getInspections,getReasons,getInspectionDetails, getInspectionById, addReason,createInspection,updateInspectionById,getInspection,addOptions,getOptions,deleteOption,shortdetails}