import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import {connect} from 'react-redux';
import Cart from '../Cart/Cart';
import Modal from '../utils/Modal';
import FoodModal from '../FoodModal/FoodModal';
import RestaurantMenuItem from '../RestaurantPage/RestaurantMenuItem';
import {fetchAndStoreCart} from '../../actions';
import { sendRequest, RequestMethods } from '../../utils';


const RestaurantPage = (props) => {
    const [foodToShow, setFoodToShow] = useState(null)
    const [restaurant, setRestaurant] = useState(null)

    const {id} = useParams()

    useEffect(() => {
        document.title = "Restaurant";
        fetchRestaurant(id);
    }, [])

    const fetchRestaurant = (restaurantId) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: `/restaurants/${restaurantId}`,
            errorHandler: (error) => console.error('Error fetching restaurant:', error),
            successHandler: (response) => {
                setRestaurant(response.data);
            }
        }
        sendRequest(requestArgs)
    }

    const orderFood = (food, restaurant) => {
        setFoodToShow({
            food: food,
            restaurant: restaurant
        })
    }

    const renderMenuItems = () => {
        const menu = restaurant.menu;
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
                    <RestaurantMenuItem key={index} item={elem} orderFood={orderFood} restaurant={restaurant} />
                )
            })
        }
    }

    const renderContent = () => {
        if(restaurant === null || restaurant.id !== id) return;
        return (
            <>
                <div className="rest-title-logo">
                    <img src={restaurant.logo} className="rest-logo" alt="" />
                    <div className="rest-title"> <b>{restaurant.name}</b> </div>
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
            <div className="restaurant-container">
                <div className="head-bar"></div>
                {renderContent()}
            </div>
            {renderFoodModal()}
        </>
    )
    
}


export default connect(undefined, {fetchAndStoreCart})(RestaurantPage);