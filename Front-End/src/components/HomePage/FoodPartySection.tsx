import React, {useState, useEffect} from 'react';
import FoodPartyItem from './FoodPartyItem.tsx';
import Modal from '../utils/Modal.tsx';
import FoodModal, { FoodModalFood } from '../FoodModal/FoodModal.tsx';
import Spinner from "../utils/Spinner.tsx";
import { sendRequest, RequestMethods } from '../../utils/request.ts';
import { Nullable, RequestArguments, Restaurant, Food } from '../../utils/types';


const FoodParty = () => {
    const [visibleFoodItem, setVisibleFoodItem] = useState<Nullable<FoodModalFood>>(null)
    const [foodPartyRestaurants, setFoodPartyRestaurants] = useState<Nullable<Restaurant[]>>(null)
    const [foodPartyMinutesRemaining, setFoodPartyMinutesRemaining] = useState<number>(0)
    const [foodPartySecondsRemaining, setFoodPartySecondsRemaining] = useState<number>(0)

    useEffect(() => {
        fetchFoodPartyInformation();
    }, [])

    useEffect(() => {
        if (foodPartyMinutesRemaining === 0 && foodPartySecondsRemaining === 0) return;
        setTimeout(downCountTimer, 1000)
    }, [foodPartySecondsRemaining, foodPartyMinutesRemaining])

    const styleTime = (time: number) => {
        if(time.toString().length === 1) return  "0" + time.toString();
        else return time.toString();
    }

    const downCountTimer = () => {
        if(foodPartyMinutesRemaining !== 0 || foodPartySecondsRemaining !== 0) {
            if(foodPartySecondsRemaining === 0) {
                setFoodPartySecondsRemaining(59)
                setFoodPartyMinutesRemaining(foodPartyMinutesRemaining - 1)
            }
            else {
                setFoodPartySecondsRemaining(foodPartySecondsRemaining - 1)
            }
        }
        else {
            fetchFoodPartyInformation();
        }
    }

    const orderFoodPartyFood = (restaurant: Restaurant, food: Food) => {
        setVisibleFoodItem({
            restaurant: restaurant,
            food: food
        });
    }

    const fetchFoodPartyInformation = () => {
        const requestArgs: RequestArguments =  {
            method: RequestMethods.GET,
            url: "/foodparties",
            errorHandler: (error) => console.log("Fetching Food Party Information Failed", error),
            successHandler: (response) => {
                setFoodPartyRestaurants(response.data.payload.restaurants);
                setFoodPartyMinutesRemaining(response.data.payload.remainingMinutes)
                setFoodPartySecondsRemaining(response.data.payload.remainingSeconds)
            }
        }
        sendRequest(requestArgs)
    }

    const closeFoodPartyModal = () => {
        fetchFoodPartyInformation();
        setVisibleFoodItem(null)
    }

    const showFoodPartyModal = () => {
        return (
            <FoodModal item={visibleFoodItem!} />
        )
    }

    const renderFoodPartyFoodModal = () => {
        if(visibleFoodItem) {
            return (
                <Modal close={closeFoodPartyModal} render={showFoodPartyModal} />
            )
        }
    }

    const renderFoodPartyItems = () => {
        if(foodPartyRestaurants) {
            if(foodPartyRestaurants.length === 0) {
                return (
                    <div className="no-food-party-restaurants-notification">
                        No restaurants are currently in food party.
                    </div>
                );
            }
            else {
                let foodpartyItems: React.JSX.Element[] = [];
                for (let i = 0; i < foodPartyRestaurants.length; i++) {
                    foodpartyItems = foodpartyItems.concat(foodPartyRestaurants[i].foodPartyMenu.map(
                    (elem, index) => {
                        return (
                            <FoodPartyItem key={`${i}` + index} orderFood={orderFoodPartyFood} restaurant={foodPartyRestaurants[i]} item={elem} />
                        )
                    }))
                }
                return foodpartyItems;
            }
        }
        else {
            return (
                <Spinner additionalClassName="food-party-spinner"/>
            )
        }
    }

    const renderFoodPartyTimer = () => {
        if(foodPartyRestaurants) {
            const minutesRemainingStyled = styleTime(foodPartyMinutesRemaining);
            const secondsRemainingStyled = styleTime(foodPartySecondsRemaining);
            return (
                <div className="food-party-home-timer">
                    Remaining Time: {minutesRemainingStyled}:{secondsRemainingStyled}
                </div>
            )
        }
    }

    return (
        <div className="food-party-home">
            <div className="home-title">
                Food Party
            </div>
            <hr className="home-title-hr"/>
            {renderFoodPartyTimer()}
            <div className="food-party-home-items">
                {renderFoodPartyItems()}
            </div>
            {renderFoodPartyFoodModal()}
        </div>
    )
};

export default FoodParty;
