import connectDB from '../../../utils/connectDB'
import Categories from '../../../models/categoriesModel'
import auth from '../../../middleware/auth'


connectDB()

export default async (req, res) => {
    switch(req.method){
        case "POST":
            await createCategory(req, res)
            break;
        case "GET":
            await getCategories(req, res)
            break;
    }
}

const getCategories = async(req, res) => {
    try {
        
        const categories = await Categories.find()
        
        res.json({categories})
        
    } catch (error) {
        return res.status(500).json({err: error.message})
    }
    
}
const createCategory = async(req, res) => {
    try {
        const result = await auth(req, res)
        if(result.role !== 'admin')
        return res.status(400).json({err: "Tài khoản không hợp lệ."})

        const { categoryName } = req.body
        const { categoryDescription } = req.body
        if(!categoryName) return res.status(400).json({err: "Tên loại sản phẩm không được để trống."})
        if(!categoryDescription) return res.status(400).json({err: "Mô tả loại sản phẩm không được để trống."})

        const newCategory = new Categories({categoryName,categoryDescription})

        await newCategory.save()
        res.json({
            msg: 'Success! Created a new category.',
            newCategory
        })

    } catch (err) {
        return res.status(500).json({err: err.message})
    }
}