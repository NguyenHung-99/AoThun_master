import mongoose from 'mongoose'

const CategoriesSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    categoryDescription: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})

let Dataset = mongoose.models.categories || mongoose.model('categories', CategoriesSchema)
export default Dataset