import React from 'react';
import PropTypes from 'prop-types';

class Modal extends React.Component {

    componentDidMount = () => {
        document.body.style.overflow="hidden";
        document.body.style.paddingRight = "16px";
    }

    componentWillUnmount = () => {
        document.body.style.paddingRight = "0";
        document.body.style.overflow="visible";
    }

    render() {        
        return (
            <div className="modal-me" style={{"paddingTop": `calc(20vh + ${window.scrollY}px)`}} onClick={this.props.close}>
                {this.props.render()}
            </div>
        )
    }
}

Modal.propTypes = {
    render:PropTypes.func.isRequired,
    close:PropTypes.func.isRequired
}

export default Modal; 