const mongoose = require('mongoose')
const urlModel = require('../model/urlModel')


const createUrl = async (req, res) => {
    let url = await urlModel.findOne({original: req.body.url})

    if (url) {
        res.status(403).json({success:false,message:"Original Link is already found"})    
        return
    }

    url = new urlModel({
        original: req.body.url,
    })

    const savedUrl = await url.save()

    res.json(savedUrl)
    
}

const getUrl = async (req, res) => {

    const urls = await urlModel.find().sort({_id:-1})
    res.json(urls);

}


const redirectHandler = async (req,res) => {
    const id = req.params.id
    try {
        const url = await urlModel.findOne({shorten:id})
        if (url == null) res.redirect("/")
        await urlModel.findOneAndUpdate({shorten:id},{$inc:{clicks:1}})
        res.redirect(url.original)  
    } catch (error) {
        console.log(error);
    }


}

module.exports = {createUrl, getUrl, redirectHandler};