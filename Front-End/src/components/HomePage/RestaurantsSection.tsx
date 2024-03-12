import {useState, useEffect} from 'react';
import RestaurantItem from './RestaurantItem.tsx';
import configs from '../../app/configs.ts';
import Spinner from "../utils/Spinner.tsx";
import { sendRequest, RequestMethods } from '../../utils/request.ts';
import { redirect } from '../../utils/redirect.ts';
import {RequestArguments, Restaurant} from '../../utils/types';

interface RestaurantsSectionProps {
    isSearching: boolean,
    searchedRestaurants: Restaurant[],
    searchMore: () => void
}


const RestaurantsSection = (props: RestaurantsSectionProps) => {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [numOfPages, setNumOfPages] = useState<number>(1)
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
    const [noMoreResults, setNoMoreResults] = useState<boolean>(false)

    useEffect(() => {
        document.title = "Home";
        fetchRestaurants(1);
    }, [])

    const fetchRestaurants = (pageNum: number) => {
        const requestArgs: RequestArguments =  {
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

    const viewRestaurantPage = (restaurantId: string) => {
        redirect(`/restaurants/${restaurantId}`);
    }

    const renderLoadingMoreSpinner = () => {
        if (isLoadingMore || props.isSearching) {
            return (
                <Spinner additionalClassName="loading-more-spinner" />
            )
        }
    }

    const loadMore = () => {
        if (props.searchedRestaurants.length === 0) {
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
        const restaurantsToRender: Restaurant[] = props.searchedRestaurants.length === 0 ? restaurants : props.searchedRestaurants;
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
            (props.isSearching && props.searchedRestaurants.length === 0)) {
            
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
