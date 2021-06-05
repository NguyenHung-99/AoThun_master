import connectDB from '../../../utils/connectDB'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req,res) => {
    switch(req.method){
      case 'GET':
        await getProduct(req,res)
        break;
      case "PUT":
        await updateProduct(req, res)
        break;
      case "DELETE":
        await deleteProduct(req, res)
        break;
    }
}
const getProduct = async (req,res) => {
  try{
      const {id} = req.query;
      const product = await Products.findById(id);
      if(!product) return res.status(400).json({err: 'Sản Phẩm không tồn tại'})
      res.json({product})
  }catch(err){
      return res.status(500).json({err: err.mesage})
  }
}
const updateProduct = async (req, res) => {
  try {
      const result = await auth(req, res)
      if(result.role !== 'admin') 
      return res.status(400).json({err: 'Tài khoản không hợp lệ.'})

      const {id} = req.query
      const {title, price, inStock, size, description, content, category, images} = req.body

      if(!title || !price || size.length === 0 || !description || !content || category === 'all' || images.length === 0)
      return res.status(400).json({err: 'Vui lòng nhập đủ thông tin.'})

      await Products.findOneAndUpdate({_id: id}, {
          title: title.toLowerCase(), price, inStock, size, description, content, category, images
      })

      res.json({msg: 'Cập nhật sản phẩm thành công'})
  } catch (err) {
      return res.status(500).json({err: err.message})
  }
}

const deleteProduct = async(req, res) => {
  try {
      const result = await auth(req, res)
      
      if(result.role !== 'admin') 
      return res.status(400).json({err: 'Tài khoản không hợp lệ.'})

      const {id} = req.query

      await Products.findByIdAndDelete(id)
      res.json({msg: 'Xóa sản phẩm thành công.'})

  } catch (err) {
      return res.status(500).json({err: err.message})
  }
}