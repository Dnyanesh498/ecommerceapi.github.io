const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');


//middleware

app.use(bodyParser.json());
app.use(morgan('tiny'));



const productSchema = mongoose.Schema({
    name:String,
    id:Number,
    countInStock:{
        type:Number,
        required:true,
    }
})
const Product = mongoose.model("Product",productSchema);

require("dotenv/config");

const api = process.env.API_URL;
//http://localhost:3000/api/v1/products
app.get(`${api}/products`, async(req,res)=>{
//    const product ={
//        id:1,
//        name:"hair dresser",
//        image:"some_url"
//    };
//    res.send(product);
const productList =await Product.find();

if(!productList){
    res.status(500).json({success:false})
}
res.send(productList);
});


app.post(`${api}/products`,(req,res)=>{
    const product = new Product({
        name:req.body.name,
        id:req.body.id,
        countInStock:req.body.countInStock,
    })
    product.save().then((createdProduct=>{
        res.status(201).json(createdProduct)
    })).catch((err)=>{
        res.status(500).json({
            error:true,
            success:false,
        });
    });
});

app.delete(`${api}/products/:id`,(req,res)=>{
    Product.findByIdAndRemove(req.params.id).then((product)=>{
        if(product){
            return res.status(200).json({success:true,message:"the product deleted"});
        }else{
            return res.status(404).json({success:false,message:"product not found"});

        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err});
    })
});

mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbname:"eshop-database",
})
.then(()=>{
    console.log("Database connection is ready")
})
.catch((err)=>{
    console.log(err);
});

app.listen(3000,()=>{
    console.log("Server is running http://localhost:3000");
});
