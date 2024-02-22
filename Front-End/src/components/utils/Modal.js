import { useEffect } from "react";

const Modal = (props) => {

    useEffect(() => {
        document.body.style.overflow="hidden";
        document.body.style.paddingRight = "16px";

        return () => {
            document.body.style.paddingRight = "0";
            document.body.style.overflow="visible";
        }
    }, [])

    return (
        <div className="modal-me" style={{"paddingTop": `calc(20vh + ${window.scrollY}px)`}} onClick={props.close}>
            {props.render()}
        </div>
    )
}

export default Modal; 