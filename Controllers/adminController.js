const asyncHandler = require('express-async-handler');
const cateconfig = require('../Models/cateconfig');


//set category and subcategory
const setfields = asyncHandler(async (req, res) => {
    const {category, subcategory} = req.body;

    const cateconfig1 = await cateconfig.findOne({});

    if(cateconfig1 != null){
        cateconfig1.cate.push({category, subcategory});
  
        await cateconfig1.save();
        return res.status(200).json({message: 'category and subcategory added'});
    }
    else{
        const cateconfig2 = new cateconfig({cate: [ {category, subcategory}]});
        console.log(cateconfig2);
        await cateconfig2.save();
        return res.status(200).json({message: 'category and subcategory added'});
    }
});

//get fields
const getData = asyncHandler(async(req,res)=>{
    const data = await cateconfig.findOne({});
    const actualdata = data.cate;
    return res.status(200).json({
        Status:1,
        info: actualdata
    });
}
)

module.exports = {setfields,getData};