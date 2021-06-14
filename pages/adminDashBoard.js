import React, { useContext, useState, useEffect } from 'react'
import {DataContext} from '../store/GlobalState'
import $ from 'jquery';
import ThongKe from '../components/ThongKe'
import DoanhThuChart from '../components/DoanhThuChart';
import OrderChart from '../components/OrderChart';
import ProductChart from '../components/ProductChart';
import BestSeller from '../components/BestSeller';
import Head from 'next/head';


const dashBoard = () => {
    const [state, dispatch] = useContext(DataContext)
    const {auth} = state
    const [showDashBoard, setShowDashBoard] = useState(true)
    const [showOrder, setShowOrder] = useState(false)
    const [showDoanhThu, setShowDoanhThu] = useState(false)
    const [showProduct, setShowProduct] = useState(false)
    const [showBestSeller, setShowBestSeller] = useState(false)

    
    const handleClick = () => {
      setShowDashBoard(true)
      setShowDoanhThu(false)
      setShowOrder(false)
      setShowProduct(false)
      setShowBestSeller(false)
    }
    
    const handleProductChart = () => {
      setShowProduct(true)
      setShowDoanhThu(false)
      setShowOrder(false)
      setShowDashBoard(false)
      setShowBestSeller(false)
    }
    const handleDoanhThuChart = () => {
      setShowDoanhThu(true)
      setShowOrder(false)
      setShowDashBoard(false)
      setShowProduct(false)
      setShowBestSeller(false)
    }
    const handleOrderChart = () => {
      setShowOrder(true)
      setShowDoanhThu(false)
      setShowDashBoard(false)
      setShowProduct(false)
      setShowBestSeller(false)
    }
    const handleBestSeller = () => {
      setShowBestSeller(true)
      setShowOrder(false)
      setShowDoanhThu(false)
      setShowDashBoard(false)
      setShowProduct(false)
    }
    
    useEffect(() => {
      $(".sidebar-dropdown > a").click(function() {
        $(".sidebar-submenu").slideUp(200);
        if (
          $(this)
            .parent()
            .hasClass("active")
        ) {
          $(".sidebar-dropdown").removeClass("active");
          $(this)
            .parent()
            .removeClass("active");
        } else {
          $(".sidebar-dropdown").removeClass("active");
          $(this)
            .next(".sidebar-submenu")
            .slideDown(200);
          $(this)
            .parent()
            .addClass("active");
        }
      });
      
      $("#close-sidebar").click(function() {
        $(".page-wrapper").removeClass("toggled");
      });
      $("#show-sidebar").click(function() {
        $(".page-wrapper").addClass("toggled");
      });
    
    }, [auth.user]);
    if(!auth.user || auth.user.role !== "admin") return null

    return(
 
      <div className="page-wrapper chiller-theme toggled">
       <Head>
            <title>DASHBOARD</title>
        </Head>
        <a id="show-sidebar" className="btn btn-sm btn-dark" href="#">
          <i className="fas fa-bars"></i>
         
        </a>
    <nav id="sidebar" className="sidebar-wrapper">
      <div className="sidebar-content">
        <div className="sidebar-brand">
          <a href="#">ht store</a>
          <div id="close-sidebar">
            <i className="fas fa-times"></i>
          </div>
        </div>
        <div className="sidebar-header">
          <div className="user-pic">
            <img className="img-responsive img-rounded" src={auth.user.avata} alt="User picture"/>
          </div>
          <div className="user-info">
            <span className="user-name">
              <strong>{auth.user.name}</strong>
            </span>
            <span className="user-role">{auth.user.role === 'admin' && 'Administrator'}</span>
            <span className="user-status">
              <i className="fa fa-circle"></i>
              <span>Online</span>
            </span>
          </div>
        </div>
   
        <div className="sidebar-search">
          <div>
            <div className="input-group">
              <input type="text" className="form-control search-menu" placeholder="Tìm kiếm..."/>
              <div className="input-group-append">
                <span className="input-group-text">
                  <i className="fa fa-search" aria-hidden="true"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
    
        <div className="sidebar-menu">
          <ul>
            <li className="header-menu">
              <span>Chung</span>
            </li>
            
            <li>
              <a onClick={handleClick} >
                <i className="fa fa-tachometer-alt"></i>
                <span >Dashboard</span>
                <span className="badge badge-pill badge-warning">New</span>
              </a>
              
            </li>
            <li>
              <a href='/users' >
                <i className="fa fa-tachometer-alt"></i>
                <span >Quản lý người dùng</span>
              </a>
              
            </li>
            <li className="sidebar-dropdown">
              <a href="#">
                <i className="fa fa-shopping-cart"></i>
                <span>Cửa hàng</span>
                <span className="badge badge-pill badge-danger">3</span>
              </a>
              <div className="sidebar-submenu">
                <ul>
                  <li>
                    <a href="/create">Thêm sản phẩm
  
                    </a>
                  </li>
                  <li>
                    <a href="/categories">Quản lý loại sản phẩm
  
                    </a>
                  </li>
                  <li>
                    <a href="/orderManager">Quản lý đơn hàng</a>
                  </li>
                 
                </ul>
              </div>
            </li>
            <li className="sidebar-dropdown">
              <a href="#">
                <i className="fa fa-chart-line"></i>
                <span>Thống kê</span>
              </a>
              <div className="sidebar-submenu">
                <ul>
                  <li>
                    <a onClick={handleDoanhThuChart}>Doanh Thu</a>
                  </li>
                  <li>
                    <a onClick={handleOrderChart}>Đơn Hàng</a>
                  </li>
                  <li>
                    <a onClick={handleProductChart}>Sản Phẩm</a>
                  </li>
            
                </ul>
              </div>
            </li>
            <li className="sidebar-dropdown">
              <a href="#">
                <i className="fa fa-globe"></i>
                <span>Bản đồ</span>
              </a>
              <div className="sidebar-submenu">
                <ul>
                  <li>
                    <a href="#">Google maps</a>
                  </li>
                  <li>
                    <a href="#">Open street map</a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="header-menu">
              <span>Thêm</span>
            </li>
            <li>
              <a onClick={handleBestSeller}>
                <i className="fa fa-book"></i>
                <span>Bán chạy nhất</span>
                <span className="badge badge-pill badge-primary">Seller</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-calendar"></i>
                <span>Lịch</span>
              </a>
            </li>
            
          </ul>
        </div>
       
      </div>
  
      <div className="sidebar-footer">
        <a href="#">
          <i className="fa fa-bell"></i>
          <span className="badge badge-pill badge-warning notification">3</span>
        </a>
        <a href="#">
          <i className="fa fa-envelope"></i>
          <span className="badge badge-pill badge-success notification">7</span>
        </a>
        <a href="#">
          <i className="fa fa-cog"></i>
          <span className="badge-sonar"></span>
        </a>
        <a href="#">
          <i className="fa fa-power-off"></i>
        </a>
      </div>
    </nav>
    <main className="page-content">
    <div className="container-fluid">
      
      {showDashBoard ? <ThongKe/>: null}
      {showDoanhThu ? <DoanhThuChart/> : null}
      {showOrder ? <OrderChart/> : null}
      {showProduct ? <ProductChart/> : null}
      {showBestSeller ? <BestSeller/> : null}
 
    </div>
  </main>
  </div>
    )
  }
	
	

export default dashBoard;