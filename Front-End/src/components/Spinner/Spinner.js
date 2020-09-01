import React from 'react';
import PropTypes from 'prop-types';

const Spinner = (props) => {
    return (
        <div className={`d-flex justify-content-center ${props.additionalClassName}`}>
            <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

Spinner.propTypes = {
    additionalClassName:PropTypes.string.isRequired
}

export default Spinner;