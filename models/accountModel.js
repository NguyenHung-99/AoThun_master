const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    
    phanQuyen: {
        type: String,
        default: 'user',
    },
    password: {
        type: String,
    },
    root: {
        type: Boolean,
        default: false
    },
    trangThai: {
        type: Boolean,
        default: false
    }
    }, {

        timestamps: true
})
let Dataset = mongoose.models.account || mongoose.model('account', accountSchema)
export default Dataset