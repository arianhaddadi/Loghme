import {useState, useEffect} from 'react';
import axios from 'axios';
import FoodPartyItem from './FoodPartyItem';
import Modal from '../utils/Modal';
import FoodModal from '../FoodModal/FoodModal';
import Spinner from "../utils/Spinner";
import configs from '../../configs';



const FoodParty = () => {
    const [visibleFoodItem, setVisibleFoodItem] = useState(null)
    const [foodPartyRestaurants, setFoodPartyRestaurants] = useState(null)
    const [foodPartyMinutesRemaining, setFoodPartyMinutesRemaining] = useState(0)
    const [foodPartySecondsRemaining, setFoodPartySecondsRemaining] = useState(0)

    useEffect(() => {
        fetchFoodPartyInformation();
    }, [])

    useEffect(() => {
        if (foodPartyMinutesRemaining === 0 && foodPartySecondsRemaining === 0) return;
        setTimeout(downCountTimer, 1000)
    }, [foodPartySecondsRemaining, foodPartyMinutesRemaining])

    const styleTime = (time) => {
        time = time.toString();
        if(time.length === 1) time = "0" + time;
        return time;
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

    const orderFoodPartyFood = (restaurant, food) => {
        setVisibleFoodItem({
            restaurant: restaurant,
            food: food
        });
    }

    const fetchFoodPartyInformation = () => {
        axios.get(`${configs.server_url}/foodparties`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            setFoodPartyRestaurants(response.data.payload.restaurants);
            setFoodPartyMinutesRemaining(response.data.payload.remainingMinutes)
            setFoodPartySecondsRemaining(response.data.payload.remainingSeconds)
        })
        .catch(error => {
            console.log("Fetching Food Party Information Failed", error);
        });
    }

    const closeFoodPartyModal = () => {
        fetchFoodPartyInformation();
        setVisibleFoodItem(null)
    }

    const showFoodPartyModal = () => {
        return (
            <FoodModal isFoodParty item={visibleFoodItem} />
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
                let foodpartyItems = [];
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
