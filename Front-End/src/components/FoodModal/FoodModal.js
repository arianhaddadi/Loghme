import { useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import configs from '../../configs';

import {connect} from 'react-redux';
import {fetchAndStoreCart} from '../../actions';

const FoodModal = (props) => {

    const [numOfAvailableFood, setNumOfAvailableFood] = useState(props.item.food.count)
    const [numOfFoodToOrder, setNumOfFoodToOrder] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [notification, setNotification] = useState(null)

    const renderOldPrice = (food) => {
        if(props.isFoodParty) {
            return (
                <div className="food-modal-old-price">
                    {food.oldPrice}
                </div>
            )
        }
    }

    const renderNumOfAvailableFood = () => {
        if(props.isFoodParty) {
            return (
                <div className="food-modal-available-quantity">
                    {numOfAvailableFood === 0 ? "Not Available" : `Number of Remaining Items: ${numOfAvailableFood}`}
                </div>
            )
        }
    }

    const increaseFoodQuantity = () => {
        if(props.isFoodParty && numOfFoodToOrder >= numOfAvailableFood) {
            setNotification({
                status: "error",
                message: "Not available!"
            })
        }
        else {
            setNotification(null)
            setNumOfFoodToOrder(numOfFoodToOrder + 1)
        }
    }

    const decreaseFoodQuantity = () => {
        if(numOfFoodToOrder > 1) {
            setNotification(null)
            setNumOfFoodToOrder(numOfFoodToOrder - 1)
        } 
    }

    const addToCart = () => {
        axios.put(`${configs.server_url}/carts?foodName=${props.item.food.name}&restaurantId=${props.item.restaurant.id}&quantity=${numOfFoodToOrder}&isFoodPartyFood=${props.isFoodParty}`, {},
                 { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            if(response.data.successful) {
                props.fetchAndStoreCart();
                setNotification({
                    status: "success",
                    message: "Added To Cart!"
                })
                if (props.isFoodParty) setNumOfAvailableFood(numOfAvailableFood - numOfFoodToOrder)
            }
            else {
                setNotification({
                    status: "error",
                    message:response.data.message
                })
            }
            setIsLoading(false)
        })
        .catch(error => {
            console.log("Adding Items to Cart Failed.", error)
        });
        setIsLoading(true)
    }

    const renderSpinner = () => {
        if(isLoading) {
            return (
                <Spinner additionalClassName="food-modal-spinner" />
            )
        }
    }

    const renderContent = () => {
        const {food, restaurant} = props.item;
        return (
            <>
                <div className="food-modal-restaurant-name">
                    {restaurant.name}
                </div>
                <div className="food-modal-image-info">
                    <img className="food-modal-image" src={food.image} alt=""/>
                    <div className="food-modal-info">
                        <div className="food-modal-food-name-star">
                            <div className="food-modal-food-name">
                                {food.name}
                            </div>
                            <div className="food-modal-star-popularity">
                                <i className="fas fa-star food-modal-star"></i>
                                <div className="food-modal-popularity">
                                    {food.popularity * 5}       
                                </div>    
                            </div>
                        </div>
                        <div className="food-modal-food-description">
                            {food.description}
                        </div>
                        <div className="food-modal-prices">
                            {renderOldPrice(food)}
                            <div className="food-modal-price">
                                {food.price} Dollars
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`food-modal-quantity-order ${props.isFoodParty ? "" : "ordinaryFood"}`}>
                    {renderNumOfAvailableFood()}
                    <div className="food-modal-order">
                        <div className="food-modal-order-quantity">
                            <i onClick={increaseFoodQuantity} className="flaticon-plus plus-logo"></i>
                            <div className="food-modal-order-quantity-num">{numOfFoodToOrder}</div>
                            <i onClick={decreaseFoodQuantity} className="flaticon-minus minus-logo"></i>
                        </div>
                        <button onClick={addToCart} type="button" className="btn btn-primary submit-button">Add To Cart</button>
                    </div>
                </div>
                {renderSpinner()}
            </>
        )
    }

    const renderNotification = () => {
        if(notification) {
            return (
                <div className={`food-modal-notification ${notification.status}`}>
                    {notification.message}
                </div>
            )
        }
    }


    return (
        <div onClick={(event) => event.stopPropagation()}  className="food-modal-container">
            {renderContent()}
            {renderNotification()}
        </div>
    )
}

export default connect(null, {fetchAndStoreCart})(FoodModal);