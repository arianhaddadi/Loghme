import PropTypes from 'prop-types';

const Modal = (props) => {

    const componentDidMount = () => {
        document.body.style.overflow="hidden";
        document.body.style.paddingRight = "16px";
    }

    const componentWillUnmount = () => {
        document.body.style.paddingRight = "0";
        document.body.style.overflow="visible";
    }

    return (
        <div className="modal-me" style={{"paddingTop": `calc(20vh + ${window.scrollY}px)`}} onClick={props.close}>
            {props.render()}
        </div>
    )
}

Modal.propTypes = {
    render:PropTypes.func.isRequired,
    close:PropTypes.func.isRequired
}

export default Modal; 