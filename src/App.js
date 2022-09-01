import React from 'react';
import {Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Favorite from './pages/Favorite';
import Drawer from './components/Drawer/index';
import Header from './components/Header';
import Home from './pages/Home';
import {Orders} from './pages/orders';

export const AppContext = React.createContext({});

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [cartOpened, setCartOpened] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        try {
            async function fetchData() {
                const [resItems, resCart, resFavorites] = await Promise.all([
                    axios.get('https://63049c5794b8c58fd72110dc.mockapi.io/items'),
                    axios.get('https://63049c5794b8c58fd72110dc.mockapi.io/cart'),
                    axios.get('https://63049c5794b8c58fd72110dc.mockapi.io/favorites')]);

                setIsLoading(false);
                setCartItems(resCart.data);
                setFavorites(resFavorites.data);
                setItems(resItems.data);
            }

            fetchData();
        } catch (error) {
            alert(`Ошибка при загрузки данных с сервера`);
            console.log(error);
        }
    }, []);

    const onAddToCart = async (obj) => {
        try {
            if (!cartItems.find(item => item.imageUrl === obj.imageUrl)) {
                const resPost = await axios.post(
                    'https://63049c5794b8c58fd72110dc.mockapi.io/cart',
                    obj
                );
                setCartItems(prev => [
                    ...prev,
                    resPost.data
                ]);
            } else {
                onRemoveItem(
                    cartItems.filter(forDelete => forDelete.imageUrl === obj.imageUrl).at(0)
                );
            }
        } catch (error) {
            alert(`Ошибка при добавлении элемента в корзину или при удалении с нее`);
            console.log(error);
        }
    }

    const onAddToFavorite = async (obj) => {
        try {
            if (favorites.find(favObj => favObj.imageUrl === obj.imageUrl)) {
                await axios.delete(
                    `https://63049c5794b8c58fd72110dc.mockapi.io/favorites/
                ${favorites.filter(favObj => obj.imageUrl === favObj.imageUrl).at(0).id}`
                );
                setFavorites((prev) => prev.filter(fav => fav.imageUrl !== obj.imageUrl));
            } else {
                const resp = await axios.post(
                    'https://63049c5794b8c58fd72110dc.mockapi.io/favorites',
                    obj
                );
                setFavorites(prev => [
                    ...prev,
                    resp.data
                ]);
            }
        } catch (error) {
            alert(`Ошибка при добавлении элемента в избранное или при удалении`);
            console.log(error);
        }
    }

    const onRemoveItem = (obj) => {
        try {
            setCartItems((prev) => prev.filter(item => item.id !== obj.id));
            axios.delete(`https://63049c5794b8c58fd72110dc.mockapi.io/cart/${obj.id}`);
        } catch (error) {
            alert('Ошибка при удалении с корзины');
            console.log(error)
        }
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    const isItemAdded = (imageUrl) => {
        return cartItems.some(obj => obj.imageUrl === imageUrl);
    }

    const isItemFavorite = (imageUrl) => {
        return favorites.some(obj => obj.imageUrl === imageUrl);
    }

    return (
        <AppContext.Provider
            value={{
                items,
                cartItems,
                favorites,
                isItemAdded,
                setCartItems,
                setCartOpened,
                isItemFavorite
            }}>
            <div className="wrapper clear">
                <Drawer onRemove={onRemoveItem} onClose={() => setCartOpened(false)} opened={cartOpened}/>
                <Header onClickCart={() => setCartOpened(true)}/>
                <Routes>
                    <Route path="/"
                        element={
                        <Home searchValue={searchValue}
                              setSearchValue={setSearchValue}
                              onChangeSearchInput={onChangeSearchInput}
                              isLoading={isLoading}
                              onAddToFavorite={onAddToFavorite}
                              onAddToCart={onAddToCart}/>
                        }/>
                    <Route path="/favorites"
                        element={
                         <Favorite onAddToCart={onAddToCart} 
                                   onAddToFavorite={onAddToFavorite}/>
                        }/>
                    <Route path='/orders' element={<Orders/>}/>
                </Routes>
            </div>
        </AppContext.Provider>
    );
}
export default App;