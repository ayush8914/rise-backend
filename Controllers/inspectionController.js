const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Project = require('../Models/project');   

const {Observation}  = require("../Models/observations")
const Lift = require('../Models/lifts');
const Ioption = require('../Models/ioptions');


//get all inspections
const getInspections = asyncHandler(async (req, res) => {
   const inspections = await Inspection.find({}); 
   return res.status(200).json({
    Status:1,
    Message:'Inspections fetched successfully',
    info:inspections
});
});

//get inspection by id
// const getInspectionById = asyncHandler(async (req, res) => {
//     var inspection = await Inspection.findById(req.params.id);
//     if(inspection != null){
//         console.log(inspection.Date.toISOString().split('T')[0]);
//         inspection.Date = inspection.Date.toISOString().split('T')[0];
//        return res.status(200).json({
//         Status:1,
//         Message:'Inspection fetched successfully',
//         info:inspection,
//        }
//         );
//     }
//     else{
//         return res.status(404).json({error: 'Inspection not found'});
//     }
// });

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
const upload = multer({ storage: storage });

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
                reference,
                contractor_name,
                inspector_name,
                inspector_role,
                scaffold_description,
                option,
                statutory_inspection = false,
                reason_for_inspection = undefined,
                inspection_date = undefined} = req.body;


                //also can be done from the frontend
                if(!Date || !starttime || !reference || !contractor_name || !inspector_name || !inspector_role || !scaffold_description || !option || !statutory_inspection || !reason_for_inspection || !inspection_date ){
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
                    if(!contractor_name){
                        params.push('contractor_name');
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
                    if(!statutory_inspection){
                        params.push('statutory_inspection');
                    }
                    if(!reason_for_inspection){
                        params.push('reason_for_inspection');
                    }
                    if(!inspection_date){
                        params.push('inspection_date');
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
            const inspection = new Inspection({
                projectid,
                Date ,
                contractor_name,
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
    console.time('start');
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
const parts = req.body.Date.split("/");
const formattedDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;

console.log(formattedDateStr); // Output: "09/29/2023"

        inspection.Date = req.body.Date || inspection.Date;
        inspection.starttime = req.body.starttime || inspection.starttime;
        inspection.reference = req.body.reference || inspection.reference;
        inspection.inspector_name = req.body.inspector_name || inspection.inspector_name;
        inspection.inspector_role = req.body.inspector_role || inspection.inspector_role;
        inspection.contractor_name = req.body.contractor_name || inspection.contractor_name;
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
    // res.status(200).json(inspection);
});



//add options to inspection
const addOptions = asyncHandler(async (req, res) => {
    try{
    const option = req.body.option;
    // const ops = req.body.options;
    if(!option ){
        return res.status(200).json(
            {   
                Status:0,
                Message: 'Option not found'
            }
            );
    }

    // if(ops){
    //     const ioptions = await Ioption.findOne({});
    //     const cnt = await Ioption.countDocuments();
    
    //     if(cnt){
    //         ioptions.options.push(...ops);
    //         await ioptions.save();
    //        return res.status(200).json({
    //             Status:1,
    //             Message: 'Options added successfully',
    //             info: ioptions
    //         });
    //     }
    //     else{
    //         const ioptions = new Ioption({
    //             options : options
    //         });
    //         await ioptions.save();
    //        return res.status(200).json({
    //             Status:1,
    //             Message: 'Options added successfully',
    //             info: ioptions
    //         });
    //     }
    // }
    if(option){
        const ioptions = await Ioption.findOne({});
        const cnt = await Ioption.countDocuments();
    
        if(cnt){
            ioptions.options.push(option);
            await ioptions.save();
           return res.status(200).json({
                Status:1,
                Message: 'Option added successfully',
                info: ioptions
            });
        }
        else{
            var temp = [];
            temp.push(option);
            const ioptions = new Ioption({
                options : temp
            });
            await ioptions.save();
            return res.status(200).json({
                Status:1,
                Message: 'Option added successfully',
                info: ioptions
            });
        }

    }
    }catch(err){
    console.log(err);
    return res.status(200).json(
        {   
            Status:0,
            Message: 'Something went wrong'
        }
        ); 
    }
});


//get options
const getOptions = asyncHandler(async (req, res) => {
    const ioptions = await Ioption.findOne({});
    const cnt = await Ioption.countDocuments();
    if(cnt){
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
    try{
    const option = req.body.option;
    const ioptions = await Ioption.findOne({});
    const cnt = await Ioption.countDocuments();
    if(cnt){
        const index = ioptions.options.indexOf(option);
        if(index > -1){
            ioptions.options.splice(index, 1);
            await ioptions.save();
            return res.status(200).json({
                Status:1,
                Message: 'Option deleted successfully',
                info: ioptions
            });
        }
        else{
            return res.status(200).json({
                Status:0,
                Message: 'Option not found',
            });
        }
    }
    else{
        return res.status(200).json({
            Status:0,
            Message: 'Options not found',
        });
    }
    }catch(err){
    console.log(err);
    return res.status(200).json(
        {   
            Status:0,
            Message: 'Something went wrong'
        }
        ); 
    }
}
);

const abx={};

module.exports={getInspections, getInspectionById, createInspection,updateInspectionById,getInspection,addOptions,getOptions,deleteOption}