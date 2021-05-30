import { useEffect, useState } from "react"

const Toast = ({msg, handleShow, bgColor}) => {
    const [showSentMessage, setShowSentMessage] = useState(true)
    useEffect(() => {
       setTimeout(() => {
        setShowSentMessage(false)
       }, 3000);
    }, []);
    
    return(
        <div>
            {
                // showSentMessage && 
                <div className={`toast show position-fixed text-light ${bgColor}`}
                    style={{ bottom: '5px', right: '5px', zIndex: 9999, minWidth: '280px' }}>

                    <div className={`toast-header ${bgColor} text-light`}>
                        <strong className="mr-auto text-light">{msg.title}</strong>

                        <button type="button" className="ml-2 mb-1 close text-light" data-dismiss="toast" style={{ outline: 'none'}}
                            onClick={handleShow}>x</button>
                    </div>

                    <div className="toast-body">{msg.msg}</div>

                </div>
            }
        </div>
        

    )

}

export default Toast