import React from 'react';

const Spinner = (props) => {
    return (
        <div className={`d-flex justify-content-center ${props.additionalClassName}`}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

export default Spinner;