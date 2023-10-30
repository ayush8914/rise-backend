const asyncHandler =   require('express-async-handler');
const Inspection = require('../Models/inspection');
const conclusions = require('../Models/conclusion');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const resultsofinspecitons = require('../Models/resultsofinspecitons');


//add conclusion


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/signatures'); // Store files in the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null,    Date.now() + file.originalname);
    },


  });

  const upload = multer({ storage: storage });

const addConclusion = asyncHandler(async (req, res) => {
    try {

        var params =[];

      
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        var imageurl;
        upload.single('signature')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(200).json(
                    {   Status:0,
                        Message: 'File upload error'
                    }
                    );
            } else if (err) {
                return res.status(200).json(
                    {   
                        Status:0,
                        // error : err,
                        Message: 'Internal server error'
                     }
                    );
            }
        
        if(req.file){
            const inspectionid = req.params.id;
            
            if(!inspectionid){
                params.push("inspectionid");
            } 


            const inspection = await Inspection.findById(inspectionid);
            if(!inspection){
                return res.status.json({
                    Status : 0,
                    Message : 'inspection not found'
                });
            }
           
            const {
                result_of_inspection,
                further_action,
                report_Communicated_to,
                Time_inspection_finished,
          
            }  = req.body;
            
            if(!result_of_inspection){
                params.push("result_of_inspection");
            }
            if(!further_action){
                params.push("further_action");
            }

            if(!report_Communicated_to){
                params.push("report_Communicated_to");
            }

            if(!Time_inspection_finished){
                params.push("Time_inspection_finished");
            }

            if(params.length > 0){
                return res.status(200).json({
                    Status:0,
                    Message: 'Please provide '+params.join(', ')+' value',
                    Params: params
                });
            }
            
            const resultsofinspeciton = await resultsofinspecitons.findOne({inspectionid: inspectionid});
            if(!resultsofinspeciton){
                return res.status(200).json({
                    Status:0,
                    Message: 'result of inspection not found'
                });
            }



            const conclusion = new conclusions({
                inspectionid: inspectionid,
                result_of_inspection: result_of_inspection,
                result_of_inspection_data: resultsofinspeciton.result,
                further_action: further_action,
                report_Communicated_to: report_Communicated_to,
                Time_inspection_finished: Time_inspection_finished,
                inspector_signature: baseUrl+ "/signatures/"+ req.file.filename
            });

            const createdConclusion = await conclusion.save();

            if(createdConclusion){
                return res.status(200).json(
                    {   
                        Status:1,
                        Message: 'Conclusion added successfully',
                        info: createdConclusion
                     }
                    );
            }
            else{
                return res.status(200).json(
                    {   
                        Status:0,
                        Message: 'Something went wrong try to create again'
                     }
                    );
            }
        }   
        else{
            res.status(200).json(
                {   
                    Status:0,
                    Message: 'signature not found'
                 }
                );
        }     
        
        });

    } catch (error) {
        res.status(200).json(
            {
                Status:0,
                Message: 'Something went wrong try to create again'
            }
        );
     }
});

//get conclusion by id

const getConclusionById = asyncHandler(async(req,res)=>{
    const inspectionid = req.params.id;
    
    const conclusion = await conclusions.findOne({inspectionid: inspectionid});
    if(conclusion){
        return res.status(200).json({
            Status:1,
            Message:'Fetched successfully',
            info: conclusion
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message:'Conclusion not found',
        });
    }
}
)


//update conclusion
const updateConclusion = asyncHandler(async (req, res) => {

   try{
    
    const inspectionid = req.params.id;
    const conclusion = await conclusions.findOne({inspectionid: inspectionid});

    if (!conclusion) {
       return res.status(200).json({
          Status: 0,
          Message: 'Conclusion not found'
       });
    }
    
    

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    var imageurl;
    const previousSignature = conclusion.inspector_signature;
    upload.single('signature')(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(200).json(
                {   Status:0,
                    Message: 'File upload error'
                }
                );
        } else if (err) {
            return res.status(200).json(
                {   
                    Status:0,
                    // error : err,
                    Message: 'Internal server error'
                 }
                );
        }

        
        if (req.file) {
            conclusion.inspector_signature = baseUrl+ "/signatures/"+ req.file.filename;

            if (previousSignature != null) {
                const parentDirectory = path.dirname(__dirname);
                const previousImagePath = path.join(parentDirectory, 'public/signatures', previousSignature);
                console.log(previousImagePath);
                fs.access(previousImagePath, fs.constants.F_OK, (err) => {
                    if (err) {
                        console.error(`Error deleting previous image: File does not exist`);
                    } else {
                        fs.unlink(previousImagePath, (err) => {
                            if (err) {
                                console.error(`Error deleting previous image: ${err}`);
                            } else {
                                console.log(`Previous image deleted successfully`);
                            }
                        });
                    }
                });
            }

        }

        const { result_of_inspection, further_action, report_Communicated_to, Time_inspection_finished } = req.body;
        
        conclusion.result_of_inspection = result_of_inspection || conclusion.result_of_inspection;
         
        const resultsofinspeciton = await resultsofinspecitons.findOne({inspectionid: inspectionid});
        if(!resultsofinspeciton){
            return res.status(200).json({
                Status:0,
                Message: 'result of inspection not found'
            });  
        }
 
        conclusion.result_of_inspection_data = resultsofinspeciton.result || conclusion.result_of_inspection_data;

        conclusion.further_action = further_action || conclusion.further_action;
        conclusion.report_Communicated_to = report_Communicated_to || conclusion.report_Communicated_to;
        conclusion.Time_inspection_finished = Time_inspection_finished || conclusion.Time_inspection_finished;
       
        const updatedConclusion = await conclusion.save();
        if (updatedConclusion) {
            return res.status(200).json({
                Status: 1,
                Message: 'Conclusion updated successfully',
                info: updatedConclusion
            });
        }
        else {
            return res.status(200).json({
                Status: 0,
                Message: 'Something went wrong try to update again'
            });
        }
    });
} catch (error) {
    res.status(200).json(
        {
            Status:0,
            Message: 'Something went wrong try to create again'
        }
    );
}
});


module.exports = { addConclusion ,getConclusionById,updateConclusion}