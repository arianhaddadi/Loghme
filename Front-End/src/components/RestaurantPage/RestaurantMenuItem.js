import React from 'react';
import PropTypes from 'prop-types';
import { convertEnglishNumbersToPersian } from '../../utilities';


const RestaurantMenuItem = (props) => {
    const item = props.item;
    return (
        <div onClick={() => props.orderFood(item, props.restaurant)} className="menu-item">
            <img src={item.image} className="menu-item-image" alt="" />
            <div className="menu-item-name">
                <div className="menu-item-rating">
                    <i className="fas fa-star menu-item-star"></i> 
                    <div>{convertEnglishNumbersToPersian(item.popularity * 5)}</div>
                </div>
                {item.name}
            </div>
            <div className="menu-item-price">
                {convertEnglishNumbersToPersian(item.price)} تومان
            </div>
            <button className="btn warning-btn add-to-cart-button">
                افزودن به سبد خرید
            </button>
        </div>
    )
}

RestaurantMenuItem.propTypes = {
    item:PropTypes.object.isRequired,
    restaurant:PropTypes.object.isRequired
}

export default RestaurantMenuItem;