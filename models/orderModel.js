import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    address: {
        type: mongoose.Types.ObjectId,
        ref: 'address'
    },
    mobile: String,
    cart: Array,
    total: Number,
    paymentId: String,
    method: String,
    delivered: {
        type: String,
        default: 'Chờ xác nhận'
    },
    paid: {
        type: Boolean,
        default: false
    },
    dateOfPayment: Date
}, {
    timestamps: true
})

let Dataset = mongoose.models.order || mongoose.model('order', orderSchema)
export default Dataset