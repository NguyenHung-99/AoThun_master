import Head from 'next/head'

const contact = () => {

return (
<div className="page-wrapper font-poppins" style={{backgroundColor:'whitesmoke'}}>

    <Head>
        <title>Liên Hệ</title>
    </Head>
    <div className="wrapper wrapper--w750">
        <div className="card card-4">
            <div className="card-body">
                <center>
                    <h1 style={{color:'black'}}>THÔNG TIN HỆ THỐNG CỬA HÀNG HT STORE</h1>
                </center>
                <br/>
                <hr style={{backgroundColor:'gray'}}/>
                <br/><br/>
                <div className="col-sm-12">

                    <center><h3 style={{color:'black', fontWeight:'bold'}}>HỆ THỐNG CỬA HÀNG</h3></center>
                    <br/>
                    <center>
                        <h5 style={{color:'black', fontWeight:'bold'}}>CHI NHÁNH HỒ CHÍ MINH:</h5>
                        <p>561 Sư Vạn Hạnh , Phường 13, Quận 10</p>
                        <p>136 Nguyễn Hồng Đào , Phường 14, Quận Tân Bình</p>
                        <p>132 Nguyễn Sơn, Phường Phú Thọ Hòa, Quận Tân Phú</p>
                        <p>7 Huỳnh Khương Ninh, Phường Đakao, Quận 1</p>
                        <p>26 Lý Tự Trọng, Phường Bến Nghé, Quận 1</p>
                        <p>Central Market Lê Lai, Phường Phạm Ngũ Lão, Quận 1</p>
                        <p>41 Quang Trung, Phường 10, Quận Gò Vấp</p>
                        
                        <br/>
                        ----
                        <br/><br/>
                        <h5 style={{color:'black', fontWeight:'bold'}}>CHI NHÁNH HÀ NỘI:</h5>
                        <p>49-51 Hồ Đắc Di, Nam Đồng, Đống Đa</p>
                        <p>121 Phố Huế, Hai Bà Trưng</p>
                        <p>Tầng 7 Vincom Bà Triệu, Hai Bà Trưng</p>
                        <p>28 Khúc Thừa Dụ, Dịch Vọng, Cầu Giấy</p>

                        <br/>
                        ----
                        <br/><br/>
                        <h5 style={{color:'black', fontWeight:'bold'}}>CHI NHÁNH BIÊN HÒA:</h5>
                        <p>151A Phan Trung, Phường Tân Mai, TP. Biên Hòa, Đồng Nai</p>
                        
                        <br/>
                        ----
                        <br/><br/>
                        <h5 style={{color:'black', fontWeight:'bold'}}>CHI NHÁNH CẦN THƠ:</h5>
                        <p>52 Mậu Thân Ninh Kiều, Phương Tân Mai.</p>

                        <br/><br/>
                        033 4551 135 - 090 3930 892
                        <br/><br/>
                        <a href="mailto:hungrau.store@gmail.com">hungrau.store@gmail.com</a>
                    </center>                

                </div>
            </div>
        </div>
    </div>
</div>




)
}
export default contact