import React from 'react';
import {Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Favorite from './pages/Favorite';
import Drawer from './components/Drawer';
import Header from './components/Header';
import Home from './pages/Home';

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);
    const [cartOpened, setCartOpened] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    React.useEffect(() => {
        axios
            .get('https://63049c5794b8c58fd72110dc.mockapi.io/items')
            .then(res => setItems(res.data))
        axios
            .get('https://63049c5794b8c58fd72110dc.mockapi.io/cart')
            .then(res => setCartItems(res.data));

        axios
            .get('https://63049c5794b8c58fd72110dc.mockapi.io/favorites')
            .then(res => setFavorites(res.data));
    }, []);

    const onAddToCart = async (obj) => {
		if (!cartItems.find(item => item.imageUrl === obj.imageUrl)) {
			const resPost = await axios.post('https://63049c5794b8c58fd72110dc.mockapi.io/cart', obj);
			setCartItems(prev => [...prev, resPost.data]);
		} else {
			const resGet = await axios.get('https://63049c5794b8c58fd72110dc.mockapi.io/cart');
			onRemoveItem(resGet.data.filter(forDelete => forDelete.imageUrl === obj.imageUrl).at(0));
		}
    }

	const onAddToFavorite = async (obj) => {
		const {data} = await axios.get('https://63049c5794b8c58fd72110dc.mockapi.io/favorites');

		if (data.find(favObj => favObj.imageUrl === obj.imageUrl)) {
			axios.delete(`https://63049c5794b8c58fd72110dc.mockapi.io/favorites/ 
			${data.filter(favObj => obj.imageUrl === favObj.imageUrl).at(0).id}`); // Почти работает, осталось только допилить чтобы когда жали и отжимали сердечко с главной странице, то  favorites он удалялся, а если со странички favorite  то в favorite не должно удаляться 
		} else {
			const resp = await axios.post('https://63049c5794b8c58fd72110dc.mockapi.io/favorites', obj);
			if (!favorites.find(favObj => favObj.id === obj.id)) {
				setFavorites(prev => [...prev, resp.data]);
			}
		}
	}

    const onRemoveItem = (obj) => {
        setCartItems((prev) => prev.filter(item => item.id !== obj.id));
        axios.delete(`https://63049c5794b8c58fd72110dc.mockapi.io/cart/${obj.id}`);
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    return (
        <div className="wrapper clear">
            {
                cartOpened && <Drawer
                        items={cartItems}
                        onClose={() => setCartOpened(false)}
                        onRemove={onRemoveItem}/>
            }
            <Header onClickCart={() => setCartOpened(true)}/>
            <Routes>
                <Route
                    path="/"
                    element={
						<Home 
							searchValue={searchValue}
							setSearchValue={setSearchValue}
							onChangeSearchInput={onChangeSearchInput}
							items={items}
							onAddToFavorite={onAddToFavorite}
							onAddToCart={onAddToCart}
						/>
                    }
                />
                <Route 
					path="/favorites" 
					element={
						<Favorite 
							items={favorites}
							onAddToFavorite={onAddToFavorite}
							onAddToCart={onAddToCart}/>
				}/>
            </Routes>
        </div>
    );
}

export default App;

