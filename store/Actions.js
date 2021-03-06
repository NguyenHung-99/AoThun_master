export const ACTIONS = {
    NOTIFY: 'NOTIFY',
    AUTH: 'AUTH',
    ADD_CART: 'ADD_CART',
    ADD_MODAL: 'ADD_MODAL',
    ADD_ORDERS: 'ADD_ORDERS',
    ADD_USERS: 'ADD_USERS',
    ADD_CATEGORIES: 'ADD_CATEGORIES'
}

export const addToCart = (product, cart, sizeSelection) => {

    if(product.inStock === 0){
        return ({type: 'NOTIFY', payload: {error: 'Sản phẩm này đã outStock.'}})
    }
    
    const result = product.size.filter(item => item.Size === sizeSelection)
   
    if(result[0].InStock_Size === 0){
        
        return ({type: 'NOTIFY', payload: {error: 'Size được chọn đã hết hàng.'}})
    }
    //check sản phẩm được thêm vào cart chưa
    const check = cart.every(item => {
        if(item._id !== product._id) return item._id !== product._id
        if(item._id === product._id) return item.sizeSelection !== sizeSelection
    })
   
    //sản phẩm đã có trong giỏ hàng: check === false
    if(!check) return ({ type: 'NOTIFY', payload: {error: 'Sản phẩm đã có trong giỏ hàng của bạn.'} })
   
    //check === true => sp chưa có trong cart
    return ({ type: 'ADD_CART', payload: [...cart, {...product, quantity: 1, sizeSelection: sizeSelection}] })    
    
}

//giảm bớt số lượng sp trong cart
export const decrease = (data, id, sizeSelection) => {
    const newData = [...data]
    newData.forEach(item => {
        if(item._id === id && item.sizeSelection === sizeSelection) item.quantity -=1
    })
    return ({type: 'ADD_CART', payload: newData})
}
//tăng số lượng sp trong cart
export const increase = (data, id, sizeSelection) => {
    
    const newData = [...data]
    newData.forEach(item => {
        if(item._id === id && item.sizeSelection === sizeSelection) item.quantity +=1
    })
    return ({type: 'ADD_CART', payload: newData})
}
export const deleteItemCart = (data, id, sizeSelection, type) => {
    const newData = data.filter(item => item._id !== id || item._id === id && item.sizeSelection !== sizeSelection)
    return ({ type, payload: newData})
}
export const deleteItem = (data, id, type) => {
    const newData = data.filter(item => item._id !== id )
    return ({ type, payload: newData})
}
export const Notified = () =>{
    return ({ type: 'NOTIFY', payload: {success: 'Thêm sản phẩm thành công'} }) 
}
export const updateItem = (data, id, post, type) => {
    const newData = data.map(item => (item._id === id ? post : item))
    return ({ type, payload: newData})
}

