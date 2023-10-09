const asyncHandler = require('express-async-handler');
const cateconfig = require('../Models/cateconfig');
const objoptions = require('../Models/obj_options');

//set category and subcategory
const setfields = asyncHandler(async (req, res) => {
    const {heading, subheading} = req.body;
    const cateconfig1 = await cateconfig.findOne({});

    if(cateconfig1 != null){
        cateconfig1.category.push({heading, 
            subheading: subheading?.map(name =>  (name) ),
        });
        
        await cateconfig1.save();
        return res.status(200).json({message: 'heading and subheading added'});
    }
    else{
        const cateconfig2 = new cateconfig({category: [ {heading, 
            subheading: subheading?.map(name => (name) ),
        }]});
        console.log(cateconfig2);
        await cateconfig2.save();
        return res.status(200).json({message: 'heading and subheading added'});
    }
});

//get fields
const getData = asyncHandler(async(req,res)=>{
    const data = await cateconfig.findOne({});
    const actualdata = data.category;
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: actualdata
    });
}
)

//set options
const setoptions = asyncHandler(async (req, res) => {
    const option = req.body.option;
    const options = await objoptions.findOne({option});
    if(options){
        return res.status(200).json({
            Status:0,
            Message: 'Option already exists',
        });
    }
    else{
        const newoption = new objoptions({
           option
        });
        const createdOption = await newoption.save();
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


const getObjOptions = asyncHandler(async(req,res)=>{
    const data = await objoptions.find({});
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: data
    });
}
)

//delete obj options
const deleteObjOptions = asyncHandler(async(req,res)=>{
    const option = req.body.option;
    const data = await objoptions.findOneAndDelete({option});
    return res.status(200).json({
        Status:1,
        Message:'Deleted successfully',
        info: data
    });
}
)


module.exports = {setfields,getData,setoptions,getObjOptions,deleteObjOptions};