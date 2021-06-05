import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoriesModel'
import Products from '../../../models/productModel'
import auth from '../../../middleware/auth'

connectDB()

export default async (req, res) => {
    switch(req.method){
        case "PUT":
            await updateCategory(req, res)
            break;
        case "DELETE":
            await deleteCategory(req, res)
            break;
        case "GET":
            await getCategoryID(req, res)
            break;
    }
}
const getCategoryID = async(req, res) => {
    try {
        const {id} = req.query
        const category = await Categories.findById({_id: id})
        res.json({category})
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}
const updateCategory = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin')
        return res.status(400).json({err: "Tài khoản không được cấp quyền."})

        const {id} = req.query
        const {categoryName, categoryDescription} = req.body
       


        const newCategory = await Categories.findOneAndUpdate({_id: id}, {categoryName,categoryDescription})
        res.json({
            msg: "Cập nhật loại sản phẩm thành công",
            category: {...newCategory, categoryName, categoryDescription}
            
        })
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}
const deleteCategory = async (req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin')
        return res.status(400).json({err: "Tài khoản không được cấp quyền."})

        const {id} = req.query

        const products = await Products.findOne({category: id})
        if(products) return res.status(400).json({
            err: "Vui lòng xóa tất cả các sản phẩm có thuộc loại sản phẩm này."
        })

        await Categories.findByIdAndDelete(id)
        
        res.json({msg: "Xóa loại sản phẩm thành công."})
    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}