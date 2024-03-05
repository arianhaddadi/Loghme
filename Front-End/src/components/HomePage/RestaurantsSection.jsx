import {useState, useEffect} from 'react';
import RestaurantItem from './RestaurantItem';
import {useNavigate} from 'react-router-dom';
import configs from '../../configs';
import Spinner from "../utils/Spinner";
import { sendRequest, RequestMethods } from '../../utils';



const RestaurantsSection = (props) => {
    const [restaurants, setRestaurants] = useState([])
    const [numOfPages, setNumOfPages] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [noMoreResults, setNoMoreResults] = useState(false)


    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Home";
        fetchRestaurants(1);
    }, [])

    const fetchRestaurants = (pageNum) => {
        const requestArgs = {
            method: RequestMethods.GET,
            url: `/restaurants?pageSize=${configs.home_page_size}&pageNum=${pageNum}`,
            errorHandler: (error) => console.log("Fetching Restaurants Failed", error),
            successHandler: (response) => {
                setRestaurants(restaurants.concat(response.data.payload))
                setIsLoadingMore(false)
                if (response.data.payload.length < configs.home_page_size) setNoMoreResults(true)
            }
        }
        sendRequest(requestArgs)
        setIsLoadingMore(true)
    }

    const viewRestaurantPage = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    }

    const renderLoadingMoreSpinner = () => {
        if (isLoadingMore || props.isSearching) {
            return (
                <Spinner additionalClassName="loading-more-spinner" />
            )
        }
    }

    const loadMore = () => {
        if (props.searchedRestaurants === null) {
            fetchRestaurants(numOfPages + 1);
            setNumOfPages(numOfPages + 1);
        }
        else {
            props.searchMore()
        }
    }

    const renderShowMoreButton = () => {
        if (noMoreResults) return;
        return (
            <>
                <button onClick={loadMore} className="submit-button btn show-more-button">Show More</button>
                {renderLoadingMoreSpinner()}
            </>
        )
    }

    const renderRestaurantItems = () => {
        const restaurantsToRender = props.searchedRestaurants === null ? restaurants : props.searchedRestaurants;
        if (restaurantsToRender.length === 0) {
            return (
                <div className='no-restaurant-items'>
                    No Restaurants To Show
                </div>
            )
        }
        return restaurantsToRender.map((elem, index) => {
            return (
                <RestaurantItem key={index} item={elem} viewRestaurantPage={viewRestaurantPage} />
            )}
        )
    }

    const renderRestaurants = () => {
        if (restaurants.length === 0 ||
            (props.isSearching && props.searchedRestaurants === null)) {
            
            return (
                <Spinner additionalClassName="" />
            )
        }
        else {
            return (
                <>
                    <div className="restaurants-home-items">
                        {renderRestaurantItems()}
                    </div>
                    {renderShowMoreButton()}
                </>
            )
        }
    }


    return (
        <div className="restaurants-home">
            <div className="home-title">
                Restaurants
            </div>
            <hr className="home-title-hr"/>
            {renderRestaurants()}
        </div>
    )
};

export default RestaurantsSection;
