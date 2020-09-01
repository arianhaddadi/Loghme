import React from 'react';
import PropTypes from 'prop-types';


const RestaurantItem = (props) => {
    const item = props.item;
    return (
        <div className="restaurant-item">
            <img src={item.logo} className="restaurant-item-logo" alt=""/>
            <div className="restaurant-item-name">
                {item.name}
            </div>
            <button onClick={() => {props.viewRestaurantPage(item.id)}} type="button" className="btn btn-warning restaurant-item-view-button">نمایش منو</button>
        </div>
    )
}

RestaurantItem.propTypes = {
    item:PropTypes.object.isRequired,
    viewRestaurantPage:PropTypes.func.isRequired
}

export default RestaurantItem;