import connectDB from '../../../utils/connectDB'
import Orders from '../../../models/orderModel'
import auth from '../../../middleware/auth'
import Products from '../../../models/productModel'
import Addresss from '../../../models/addressModel'
import Users from '../../../models/userModel'
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
        
        //c???p nh???t s??? l?????ng s???n ph???m c??n trong kho v?? ???? b??n

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

        var htmlData = '<h1>DANH S??CH S???N PH???M</h1>';
        for(var i = 0; i < newOrders.cart.length; i++){
            htmlData += `
            <img src="${newOrders.cart[i].images[0].url}" alt="???nh" width="150" height="160">
            <p><b>T??n s???n ph???m: </b>${newOrders.cart[i].title}</p>
            <p><b>S??? l?????ng: </b>${newOrders.cart[i].quantity}</p>
            <p><b>Gi??: </b>${newOrders.cart[i].price}??</p>
            <p><b>Size: </b>${newOrders.cart[i].sizeSelection}</p>
            <p><b>Th??nh ti???n: </b>${(newOrders.cart[i].quantity * newOrders.cart[i].price).toString()}??</p>
            <br></br>`
        }
        
        htmlData += `
                <h2>????N H??NG ???????C GIAO ?????N</h2>
                <p><b>T??n : </b>${users.ten} </p>
                <p><b>?????a Ch??? : </b>${users.diaChi.diaChi} ${users.diaChi.phuongXa} ${users.diaChi.quanHuyen} ${users.diaChi.tinhThanhPho}</p>
                <p><b>??i???n tho???i: </b>${users.sdt}</p>
                <p><b>Email: </b>${users.email}</p>
                <br></br>
                <h3>C??m ??n b???n ???? mua h??ng t???i HT_Store.</h3>`;

        const emailData = {
            to: users.email,
            from: process.env.SEND_MAIL_USER,
            subject: `HT_Store ???? nh???n ????n h??ng ${newOrders._id}`,
            html: htmlData
        }

         transporter.sendMail(emailData, function (err, info) {
            if(err)
                console.log(err)
            else{
                res.json({
                    msg: `Order th??nh c??ng! Ch??ng t??i s??? li??n h??? v???i b???n ????? x??c nh???n ????n h??ng. Email ???? ???????c g???i ?????n ${users.email}`,
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

//C???p nh??t instock, old v?? instock, old t???ng size

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