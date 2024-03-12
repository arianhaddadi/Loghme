import React from "react";
import { Restaurant } from "../../utils/types";

interface RestaurantItemProps {
    item: Restaurant,
    viewRestaurantPage: (restaurantId: string) => void
}

const RestaurantItem = (props: RestaurantItemProps) => {
    const item = props.item;
    return (
        <div className="restaurant-item">
            <img src={item.logo} className="restaurant-item-logo" alt=""/>
            <div className="restaurant-item-name">
                {item.name}
            </div>
            <button onClick={() => {props.viewRestaurantPage(item.id)}} type="button" className="btn btn-warning restaurant-item-view-button">View Menu</button>
        </div>
    )
}

export default RestaurantItem;