import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'
import Products from '../../../models/productModel'
import Addresss from '../../../models/addressModel'
import Users from '../../../models/userModel'
import sgMail from '@sendgrid/mail'


var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');


connectDB()



export default async (req, res) => {
    switch (req.method) {
        case 'POST':
            await createOrder(req, res)
            break;
        case 'GET':
            await getOrders(req, res)
            break;
    }
}
const getOrders = async (req, res) => {
    try {
        const result = await auth(req, res)
        let orders;

        //user => get all oders by users
        if (result.role !== 'admin') {
            orders = await Orders.find({
                user: result.id
            }).populate("user", "-diaChi")
        } else {
            //get all order in db
            orders = await Orders.find().populate("user", "-diaChi")

        }
        res.json({
            orders,
            totalOrd: orders.length
        })
    } catch (err) {
        return res.status(500).json({
            err: err.message
        })
    }
}

const createOrder = async (req, res) => {
    try {
        const result = await auth(req, res)
        const {
            name,
            email,
            sdt,
            diachi,
            phuongxa,
            quanhuyen,
            tinhtp,
            total,
            cart
        } = req.body
        
        const users = await Users.findById({
            _id: result.id
        }).populate('diaChi')
       
        const address = await Addresss.findById(users.diaChi)
        
        if (diachi !== address.diaChi || phuongxa !== address.phuongXa || quanhuyen !== address.quanHuyen || tinhtp !== address.tinhThanhPho) {
            console.log('vo if')
            await Addresss.findByIdAndUpdate({
                _id: users.diaChi._id
            }, {
                diaChi: diachi,
                phuongXa: phuongxa,
                quanHuyen: quanhuyen,
                tinhThanhPho: tinhtp
            })
        }
        
        const newOrders = new Orders({
            user: result.id,
            address: address._id,
            mobile: sdt,
            cart,
            total

        })
        
        //cập nhật số lượng sản phẩm còn trong kho và đã bán

        cart.filter(item => {
            const sizeSelect = item.size.filter(itemSize => itemSize.Size === item.sizeSelection)
            sizeSelect[0].InStock_Size = sizeSelect[0].InStock_Size - item.quantity
            sizeSelect[0].sold = sizeSelect[0].sold + item.quantity
            return sold(item._id, item.quantity, sizeSelect[0], item.sizeSelection)
        })

        newOrders.save()

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SEND_MAIL_USER,
                pass: process.env.SEND_MAIL_PASSWORD
            }
        });

        var htmlData = '<h1>DANH SÁCH SẢN PHẨM</h1>';
        for(var i = 0; i < newOrders.cart.length; i++){
            htmlData += `
            <img src="${newOrders.cart[i].images[0].url}" alt="ảnh" width="150" height="160">
            <p><b>Tên sản phẩm: </b>${newOrders.cart[i].title}</p>
            <p><b>Số lượng: </b>${newOrders.cart[i].quantity}</p>
            <p><b>Giá: </b>${newOrders.cart[i].price}đ</p>
            <p><b>Size: </b>${newOrders.cart[i].sizeSelection}</p>
            <p><b>Thành tiền: </b>${(newOrders.cart[i].quantity * newOrders.cart[i].price).toString()}đ</p>
            <br></br>`
        }
        
        htmlData += `
                <h2>ĐƠN HÀNG ĐƯỢC GIAO ĐẾN</h2>
                <p><b>Tên : </b>${users.ten} </p>
                <p><b>Địa Chỉ : </b>${users.diaChi.diaChi} ${users.diaChi.phuongXa} ${users.diaChi.quanHuyen} ${users.diaChi.tinhThanhPho}</p>
                <p><b>Điện thoại: </b>${users.sdt}</p>
                <p><b>Email: </b>${users.email}</p>
                <br></br>
                <h3>Cám ơn bạn đã mua hàng tại HT_Store.</h3>`;

        const emailData = {
            to: users.email,
            from: process.env.EMAIL_FROM,
            subject: `HT_Store đã nhận đơn hàng ${newOrders._id}`,
            html: htmlData
        }

         transporter.sendMail(emailData, function (err, info) {
            if(err)
                console.log(err)
            else{
                res.json({
                    msg: `Order thành công! Chúng tôi sẻ liên hệ với bạn để xác nhận đơn hàng. Email đã được gửi đến ${users.email}`,
                    newOrders,
    
                })
            }
            
        })



    } catch (err) {
        return res.status(500).json({
            err: err.message
        })
    }
}

//Cập nhât instock, old và instock, old từng size

const sold = async (id, quantity, sizeUpdate, sizeSelection) => {
    await Products.findOneAndUpdate({
        _id: id
    }, {
        $inc: {
            inStock: -quantity,
            sold: +quantity
        }
    });
    await Products.findOneAndUpdate({
        _id: id
    }, {
        $set: {
            "size.$[el].InStock_Size": sizeUpdate.InStock_Size,
            "size.$[el].sold": sizeUpdate.sold
        }
    }, {
        arrayFilters: [{
            "el.Size": sizeSelection
        }]
    })

}