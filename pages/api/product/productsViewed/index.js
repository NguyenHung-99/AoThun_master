import connectDB from '../../../../utils/connectDB'
import Products from '../../../../models/productModel'
import auth from '../../../../middleware/auth'

connectDB()

export default async (req,res) => {
    switch(req.method){
      case 'GET':
        await getProductsViewed(req,res)
        break;
      
    }
}
const getProductsViewed = async (req,res) => {
  try{
    
    const user = await auth(req,res)
    let result = await Products.find({ idUserDaXem: user.id})
    
    res.json({status: 'Success', data: result}) 

  }catch(err){
      return res.status(500).json({err: err.mesage})
  }
}