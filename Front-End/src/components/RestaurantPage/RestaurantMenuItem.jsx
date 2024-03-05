const RestaurantMenuItem = (props) => {
    const item = props.item;
    return (
        <div onClick={() => props.orderFood(item, props.restaurant)} className="menu-item">
            <img src={item.image} className="menu-item-image" alt="" />
            <div className="menu-item-name">
                <div className="menu-item-rating">
                    <i className="fas fa-star menu-item-star"></i> 
                    <div>{item.popularity * 5}</div>
                </div>
                {item.name}
            </div>
            <div className="menu-item-price">
                {item.price} Dollars
            </div>
            <button className="btn warning-btn add-to-cart-button">
                Add To Cart
            </button>
        </div>
    )
}

export default RestaurantMenuItem;