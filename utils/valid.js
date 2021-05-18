const valid = (name , sdt, email, ngaySinh, gioiTinh, password, cf_password ) => {
    if(!name || !email || !password || !sdt || !ngaySinh)
    return 'Vui lòng điền vào đủ ô trống!.'

    if(!validateEmail(email))
    return 'Địa chỉ Email không hợp lệ!.'

    if(!validatePhone(sdt))
    return 'Vui lòng nhập đúng số điện thoại!'

    if(password.length < 6)
    return 'Mật khẩu có ít nhất 6 kí tự!.'

    
    if(password !== cf_password)
    return 'Mật khẩu không khớp vui lòng nhập lại!'

    
}

export function validatePhone(sdt){
    const re =/(09|01[2|6|8|9]|03)+([0-9]{8})\b/;
    return re.test(sdt)
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

export default valid
