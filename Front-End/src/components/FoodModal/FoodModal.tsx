import React, { useState } from 'react';
import Spinner from '../utils/Spinner.tsx';
import { sendRequest, RequestMethods } from '../../utils/request.ts';
import { Notification, Nullable, RequestArguments, Restaurant, Food, Optional, ActionCreator, Cart } from '../../utils/types';
import {connect} from 'react-redux';
import {fetchCart} from '../../actions/index.ts';

export interface FoodModalFood {
    restaurant: Restaurant,
    food: Food
}

interface FoodModalProps {
    fetchCart: ActionCreator<Cart>,
    item: FoodModalFood
}


const FoodModal = (props: FoodModalProps) => {

    const [numOfAvailableFood, setNumOfAvailableFood] = useState<Optional<number>>(props.item.food.count)
    const [numOfFoodToOrder, setNumOfFoodToOrder] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [notification, setNotification] = useState<Nullable<Notification>>(null)

    const renderOldPrice = (food: Food) => {
        if(props.item.food.oldPrice) {
            return (
                <div className="food-modal-old-price">
                    {food.oldPrice}
                </div>
            )
        }
    }

    const renderNumOfAvailableFood = () => {
        if(props.item.food.count) {
            return (
                <div className="food-modal-available-quantity">
                    {numOfAvailableFood === 0 ? "Not Available" : `Number of Remaining Items: ${numOfAvailableFood}`}
                </div>
            )
        }
    }

    const increaseFoodQuantity = () => {
        if(numOfAvailableFood !== undefined && numOfFoodToOrder >= numOfAvailableFood) {
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
        const requestArgs: RequestArguments =  {
            method: RequestMethods.PUT,
            url: `/carts?foodName=${props.item.food.name}&restaurantId=${props.item.restaurant.id}&quantity=${numOfFoodToOrder}&isFoodPartyFood=${props.item.food.count !== undefined}`,
            errorHandler: (error) => console.log("Adding Items to Cart Failed.", error),
            successHandler: (response) => {
                if(response.data.successful) {
                    props.fetchCart();
                    setNotification({
                        status: "success",
                        message: "Added To Cart!"
                    })
                    if (numOfAvailableFood !== undefined) setNumOfAvailableFood(numOfAvailableFood - numOfFoodToOrder)
                }
                else {
                    setNotification({
                        status: "error",
                        message: response.data.message
                    })
                }
                setIsLoading(false)
            }    
        }
        sendRequest(requestArgs)
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
                <div className={`food-modal-quantity-order ${numOfAvailableFood !== undefined ? "" : "ordinaryFood"}`}>
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

export default connect(null, {fetchCart})(FoodModal);