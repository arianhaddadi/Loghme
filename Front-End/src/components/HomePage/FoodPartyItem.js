import React from 'react';
import PropTypes from 'prop-types';


const FoodPartyItem = (props) => {
    const item = props.item;
    return (
        <div className="food-party-item">
            <div className="food-party-item-image-name">
                <img src={item.image} className="food-party-item-image" alt=""/>
                <div className="food-party-item-name-star">
                    <div className="food-party-item-name">
                        {item.name}
                    </div>
                    <i className="fas fa-star food-party-item-star">
                        <p className="food-party-item-popularity">
                            {item.popularity * 5}       
                        </p>
                    </i> 
                </div>
            </div>
            <div className="food-party-item-prices">
                <div className="food-party-item-old-price">
                    {item.oldPrice} Dollars
                </div>
                <div className="food-party-item-new-price">
                    {item.price} Dollars
                </div>
            </div>
            <div className="food-party-item-buttons">
                <div className="food-party-item-remaining">
                    {item.count === 0 ? "Not Available" : `Number of Remaining Items: ${item.count}`}
                    </div>
                <div onClick={() => props.orderFood(props.restaurant, item)} className="food-party-item-buy-button">Purchase</div>
            </div>
            <div className="food-party-restaurant-name">
                {props.restaurant.name}
            </div>
        </div>
    )
}

FoodPartyItem.propTypes = {
    restaurant:PropTypes.object.isRequired,
    item:PropTypes.object.isRequired,
    orderFood:PropTypes.func.isRequired
}

export default FoodPartyItem;