import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import Cart from '../Cart/Cart.tsx';
import Modal from '../utils/Modal.tsx';
import FoodModal, {FoodModalFood} from '../FoodModal/FoodModal.tsx';
import RestaurantMenuItem from './RestaurantMenuItem.tsx';
import {fetchCart} from '../../actions';
import {RequestMethods, sendRequest} from '../../utils/request.ts';
import {redirect} from '../../utils/redirect.ts';
import {ActionCreator, Cart as CartType, Food, Nullable, RequestArguments, Restaurant} from '../../utils/types';

interface RestaurantPageProps {
    fetchCart: ActionCreator<CartType>
}


const RestaurantPage = (props: RestaurantPageProps) => {
    const [foodToShow, setFoodToShow] = useState<Nullable<FoodModalFood>>(null)
    const [restaurant, setRestaurant] = useState<Nullable<Restaurant>>(null)

    const {id} = useParams<string>()

    useEffect(() => {
        document.title = "Restaurant";
        if (id === undefined) redirect("/");
        else fetchRestaurant(id);
    }, [])

    const fetchRestaurant = (restaurantId: string) => {
        const requestArgs: RequestArguments = {
            method: RequestMethods.GET,
            url: `/restaurants/${restaurantId}`,
            errorHandler: (error) => console.error('Error fetching restaurant:', error),
            successHandler: (response) => {
                setRestaurant(response.data);
            }
        }
        sendRequest(requestArgs)
    }

    const orderFood = (food: Food, restaurant: Restaurant) => {
        setFoodToShow({
            food: food,
            restaurant: restaurant
        })
    }

    const renderMenuItems = () => {
        const menu = restaurant!.menu;
        if (menu === null || menu.length === 0) {
            return (
                <div className="no-restaurant-items">
                    Menu is Empty!
                </div>
            )
        } else {
            return menu.map((elem, index) => {
                return (
                    <RestaurantMenuItem key={index} item={elem} orderFood={orderFood} restaurant={restaurant!}/>
                )
            })
        }
    }

    const renderContent = () => {
        if (restaurant === null || restaurant.id !== id) return;
        return (
            <>
                <div className="rest-title-logo">
                    <img src={restaurant.logo} className="rest-logo" alt=""/>
                    <div className="rest-title"><b>{restaurant.name}</b></div>
                </div>
                <div className="menu-title-container">
                    <div className="menu-title">
                        <b>
                            Menu
                        </b>
                    </div>
                    <hr/>
                </div>
                <div className="menu-cart">
                    <div className="menu-list">
                        {renderMenuItems()}
                    </div>
                    <div className="dashed-border">
                        <div></div>
                    </div>
                    <Cart/>
                </div>
            </>
        );
    }

    const closeFoodModal = () => {
        props.fetchCart();
        setFoodToShow(null);
    }

    const showFoodModal = () => {
        return (
            <FoodModal item={foodToShow!}/>
        );
    }

    const renderFoodModal = () => {
        if (foodToShow) {
            return (
                <Modal close={closeFoodModal} render={showFoodModal}/>
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


export default connect(undefined, {fetchCart})(RestaurantPage);