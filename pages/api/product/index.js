import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req,res) => {
    switch(req.method){
      case 'GET':
        await getProducts(req,res)
        break;
      case "POST":
        await createProduct(req, res)
        break;
      case "PUT":
        await updateUserView(req, res)
        break;
    }
}

class APIfeatures {
  constructor(query, queryString){
    this.query = query
    this.queryString = queryString
  }
  filtering(){
    const queryObj = {...this.queryString}
    
    const excludeFields = ['page', 'sort', 'limit']
    excludeFields.forEach(el => delete(queryObj[el]))
    if(queryObj.category !== 'all')
      this.query.find({category: queryObj.category})
    if(queryObj.title !== 'all')
      this.query.find({title: {$regex: queryObj.title}})

    this.query.find()
    return this;
  }
  sorting(){
    if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join('')
        this.query = this.query.sort(sortBy)
    }else{
        this.query = this.query.sort('-createdAt')
    }

    return this;
  }

  paginating(){
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 8
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit)
      return this;
  }
}

const getProducts = async (req,res) => {
  try{
    const features = new APIfeatures(Products.find().populate("category"), req.query).filtering().sorting().paginating()
  
      const products = await features.query
      const amountProducts = await Products.find().populate("category")
      res.json({
        status: 'success',
        result: products.length,
        amount: amountProducts.length,
        products
      })
  }catch(err){
      return res.status(500).json({err: err.mesage})
  }
}
const createProduct = async (req, res) => {
  try {
      const result = await auth(req, res)
      if(result.role !== 'admin') return res.status(400).json({err: 'Tài khoản không hợp lệ.'})

      const {title, price, inStock, size, description, content, category, images} = req.body

      if(!title || !price || size.length === 0 || !description || !content || category === 'all' || images.length === 0)
      return res.status(400).json({err: 'Vui lòng nhập đủ thông tin.'})


      const newProduct = new Products({
          title: title.toLowerCase(), price, inStock, size, description, content, category, images
      })

      await newProduct.save()

      res.json({msg: 'Tạo sản phẩm mới thành công'})

  } catch (err) {
      return res.status(500).json({err: err.message})
  }
}
const updateUserView = async (req, res) => {
  try{
    const result = await auth(req, res)
    const idUser = result.id
    const idProduct = req.body.idProduct;
    let result2 = await Products.findOne({ _id: idProduct, idUserDaXem: idUser });
        if (result2 === null) {
            let result = await Products.updateOne({ _id: idProduct }, { $push: { idUserDaXem: idUser } });
            
            res.status(200).json({
                status: 'success',
                message: 'Cập nhật thành công'
            });
        } else {
            
            res.status(200).json({
                status: 'success',
                message: 'Đã cập nhật user này!'
            });
        }
  }catch (err) {
    return res.status(500).json({err: err.message})
  }
}