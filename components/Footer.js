const Footer = () => {
return (
<footer className="site-footer">
    <div className="container">
        <div className="row">
            <div className="col-sm-12 col-md-6">
                <h6>Giới thiệu</h6>
                <br />
                <p className="text-justify" style={{color:'#737373'}}>Chúng tôi - đội ngũ HT Store luôn tin vào giấc mơ đem giá trị sản phẩm của
                    người Việt đi khắp năm châu khiến họ tự hào về sản phẩm mình tạo ra, trên đất nước mình. Hơn thế
                    nữa, chúng tôi muốn truyền niềm tin này cho tất cả anh em, để chúng ta cùng thực hiện hóa giấc mơ
                    ấy. Để mỗi người anh em cầm trên tay sản phẩm của HT Store đều có thể cảm nhận được niềm kiêu hãnh
                    “người Việt Nam có thể đi khắp thế giới, tin dùng và tự hào về sản phẩm do chính người Việt Nam làm
                    ra.”</p>
            </div>

            <div className="col-xs-6 col-md-3">
                <h6>Địa chỉ cửa hàng</h6>
                <br />
                <ul className="footer-links">
                    <li><a href="#">Quận 10 - 561 Sư Vạn Hạnh, Phường 13</a></li>
                    <li><a href="#">Quận Tân Bình - 136 Nguyễn Hồng Đào, Phường 14.</a></li>
                    <li><a href="#">Quận 1 - 26 Lý Tự Trọng, Phường Bến Nghé.</a></li>
                    
            
                </ul>
            </div>

            <div className="col-xs-6 col-md-3">
                <h6>Liên kết nhanh</h6>
                <br />
                <ul className="footer-links">
                    <li><a href="/about">Giới thiệu</a></li>
                    <li><a href="/contact">Liên hệ</a></li>
                    <li><a href="/bestSeller">Sản phẩm bán chạy nhất</a></li>
                    <li><a href="/findOrder">Tìm đơn hàng</a></li>
                   
                </ul>
            </div>
        </div>
        <br/>
        <hr />
    </div>
    <br />
    <div className="container">
        <div className="row">
            <div className="col-md-8 col-sm-6 col-xs-12">
                <p className="copyright-text" style={{color:'white'}}>Copyright &copy; 2021 All Rights Reserved by 
                    <a href="#"  style={{color:'white'}}> HT-Store</a>.
                </p>
            </div>

            <div className="col-md-4 col-sm-6 col-xs-12">
                <ul className="social-icons">
                    <li><a className="facebook" href="#"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
                    </li>
                    <li><a className="twitter" href="#"><i className="fab fa-twitter" aria-hidden="true"></i></a></li>
                    <li><a className="dribbble" href="#"><i className="fab fa-dribbble" aria-hidden="true"></i></a></li>
                    <li><a className="linkedin" href="#"><i className="fab fa-linkedin" aria-hidden="true"></i></a></li>
                </ul>
            </div>
        </div>
    </div>
</footer>

)
}
export default Footer