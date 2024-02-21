import {useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Cart from '../Cart/Cart';
import Modal from '../utils/Modal';
import FoodModal from '../FoodModal/FoodModal';
import NavigationBar from '../NavigationBar/NavigationBar';
import RestaurantMenuItem from '../RestaurantPage/RestaurantMenuItem';
import {fetchAndStoreCart, fetchAndStoreRestaurant} from '../../actions';

const RestaurantPage = (props) => {
    const [foodToShow, setFoodToShow] = useState(null)


    const componentDidMount = () => {
        document.title = "Restaurant";
        props.fetchAndStoreRestaurant(props.match.params.id);
    }

    const orderFood = (food, restaurant) => {
        setFoodToShow({
            food:food,
            restaurant:restaurant
        })
    }

    const renderMenuItems = () => {
        const menu = props.restaurant.menu;
        if (menu === null || menu.length === 0) {
            return (
                <div className="no-restaurant-items">
                    Menu is Empty!
                </div>
            )
        }
        else {
            return menu.map((elem, index) => {
                return (
                    <RestaurantMenuItem key={index} item={elem} orderFood={orderFood} restaurant={props.restaurant} />
                )
            })
        }
    }

    const renderContent = () => {
        if(props.restaurant === null || props.restaurant.id !== props.match.params.id) return;
        return (
            <>
                <div className="rest-title-logo">
                    <img src={props.restaurant.logo} className="rest-logo" alt="" />
                    <div className="rest-title"> <b>{props.restaurant.name}</b> </div>
                </div>
                <div className="menu-title-container">
                    <div className="menu-title">
                        <b>
                            Menu
                        </b>
                    </div>
                    <hr />
                </div>
                <div className="menu-cart">
                    <div className="menu-list">
                        {renderMenuItems()}
                    </div>
                    <div className="dashed-border">
                        <div></div>
                    </div>
                    <Cart />
                </div>
            </>
        );
    }

    const closeFoodModal = () => {
        props.fetchAndStoreCart();
        setFoodToShow(null);
    }

    const showFoodModal = () => {
        return (
            <FoodModal isFoodParty={false} item={foodToShow} />
        );
    }

    const renderFoodModal = () => {
        if(foodToShow) {
            return (
                <Modal close={closeFoodModal} render={showFoodModal} />
            );
        }
    }

    return (
        <>
            <NavigationBar />
            <div className="restaurant-container">
                <div className="head-bar"></div>
                {renderContent()}
            </div>
            {renderFoodModal()}
        </>
    )
    
}

RestaurantPage.propTypes = {
    restaurant:PropTypes.object,
    location:PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
    return {
        restaurant:state.restaurant,
    }
}


export default connect(mapStateToProps, {fetchAndStoreCart, fetchAndStoreRestaurant})(RestaurantPage);