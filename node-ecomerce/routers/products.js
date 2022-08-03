const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
   'image/png': 'png',
   'image/jpg': 'jpg',
   'image/jpeg': 'jpeg',
}

//? multer 
const storage = multer.diskStorage({
   destination: function (req, res, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      let uploadErr = new Error('invalid image type');

      if(isValid){
         uploadErr = null
   }
      cb(uploadErr, 'public/uploads')
   }, 
   filename: function(req, file, cb) {

      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype]
      cb(null, `${fileName}-${Date.now()}.$(extension)` )

   }
})
   const uploadOptions = multer({storage: storage})

//? get 
router.get(`/`, async (req, res) => {
   let filter = {}
   if(req.query.categories) {
      filter = {category : req.query.categories.split(',')}
   }
   const productList = await Product.find({filter}).populate('category');

   if(!productList){
      res.status(500).json({success: false})
   }
   res.send(productList)
})

//? get by id
router.get(`/:id`, async (req, res) => {
   const product = await Product.findById(req.params.id).populate('category');

   if(!product){
      res.status(500).json({success: false})
   }
   res.send(product)
})

//? post
router.post('/', uploadOptions.single('image'), async (req, res) => {
   const category = await Category.findById(req.body.category);
   if(!category) return res.status(400).send('Invalid Category')

   const file = req.file;
   if(!file) return res.status(400).send('No image in the request!')

   const fileName = req.file.filename
   const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

   let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: `${basePath}${fileName}`, //?"http://localhost:2000/public/upload/image-21212"
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
   })
   product = await product.save();
   
   if(!product)
   return res.status(500).send('The product cannot be created')

   res.send(product) 
})

//? put by id

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
   if(!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).send('Invalid Product id')
   }
   const category = await Category.findById(req.body.category);
   if(!category) return res.status(400).send('Invalid Category')

   const product = await Product.findById(req.params.id); 
   if(!product) return res.status(400).send('Invalid product')

   const file = req.file;
   let imagespath;

   if(file){
      const fileName = file.filename
      const basePath = `${req.protocol}://${req.get('host')}/public/uploads`;
      imagespath = `${basePath}${fileName}`
   } else {
      imagespath = product.image
   }

   const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: imagespath,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
   }, {new: true})
   if(!updateProduct)
   return res.status(500).send('the product cannot be update')
   res.send(updateProduct);
})

//? deleted by id
router.delete(`/:id`, async (req, res) => {
   Product.findByIdAndRemove(req.params.id).then(product => {
      if(product){
            return res.status(200).json({
               success: true,
               message: 'the product is deleted'
            })
      } else {
            return res.status(404).json({
               succes: false,
               message: 'product not found'
            })
      }
   }).catch(err => {
      return res.status(400).json({
            succes: false, 
            error: err
      })
   })
})

//? get count
router.get(`/get/count`, async (req, res) => {
   const productCount = await Product.countDocuments((count) => count)

   if(!productCount) {
      res.status(500).json({success: false})
   }
   res.send({
      productCount: productCount
   })

})

//? feature count
router.get(`/get/featured/:count`, async (req, res) => {
   const count = req.params.count ? req.params.count : 0
   const products = await Product.find({isFeatured: true}).limit(+count)

   if(!products) {
      res.status(500).json({success: false})
   }
   res.send(products)
})


router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
   if(!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).send('Invalid Product Id')
   }

   const files = req.files
   let imagesPaths = [];
   const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;
   if(files) {
      files.map(file => {
         imagesPaths.push(`${basePath}${file.fileName}`)
      })
   }
      const product = await Product.findByIdAndUpdate(req.params.id, {
            images: imagesPaths
         }, {new: true}
      )
      if(!product)
      return res.status(500).send('the product cannot be update')
      res.send(product);
})
module.exports = router;