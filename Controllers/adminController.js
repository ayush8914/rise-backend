const asyncHandler = require('express-async-handler');
const cateconfig = require('../Models/cateconfig');


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
        info: actualdata
    });
}
)

module.exports = {setfields,getData};