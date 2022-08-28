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
        async function fetchData() {
            const resItems = await axios.get(
                'https://63049c5794b8c58fd72110dc.mockapi.io/items'
            );
            const resCart = await axios.get(
                'https://63049c5794b8c58fd72110dc.mockapi.io/cart'
            );
            const resFavorites = await axios.get(
                'https://63049c5794b8c58fd72110dc.mockapi.io/favorites'
            );

            setCartItems(resCart.data);
            setFavorites(resFavorites.data);
            setItems(resItems.data);
        }

        fetchData();
    }, []);

    const onAddToCart = async (obj) => {
        try {
            if (!cartItems.find(item => item.imageUrl === obj.imageUrl)) {
                const resPost = await axios.post(
                    'https://63049c5794b8c58fd72110dc.mockapi.io/cart',
                    obj
                );
                setCartItems(prev => [...prev, resPost.data]);
            } else {
                const resGet = await axios.get(
                    'https://63049c5794b8c58fd72110dc.mockapi.io/cart'
                );
                onRemoveItem(
                    resGet.data.filter(forDelete => forDelete.imageUrl === obj.imageUrl).at(0)
                );
            }
        } catch (error) {
            alert(`${error.message}`);
        }
    }

    const onAddToFavorite = async (obj, page) => {
        try {
            const {data} = await axios.get(
                'https://63049c5794b8c58fd72110dc.mockapi.io/favorites'
            );

            if (data.find(favObj => favObj.imageUrl === obj.imageUrl)) {
                axios.delete(
                    `https://63049c5794b8c58fd72110dc.mockapi.io/favorites/
				${data.filter(favObj => obj.imageUrl === favObj.imageUrl).at(0).id}`
                );
                if (page === 'Home') {
                    setFavorites((prev) => prev.filter(fav => fav.imageUrl !== obj.imageUrl));
                }
            } else {
                const resp = await axios.post(
                    'https://63049c5794b8c58fd72110dc.mockapi.io/favorites',
                    obj
                );
                if (!favorites.find(favObj => favObj.id === obj.id)) {
                    setFavorites(prev => [...prev, resp.data]);
                }
            }
        } catch (error) {
            alert(`${error.message}`);
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
            {cartOpened && <Drawer items={cartItems} onClose={() => {setCartOpened(false)}} onRemove={onRemoveItem}/>}
            <Header onClickCart={() => setCartOpened(true)}/>
            <Routes>
                <Route
                    path="/"
                    element={<Home
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    onChangeSearchInput={onChangeSearchInput}
                    items={items}
                    onAddToFavorite={onAddToFavorite}
                    onAddToCart={onAddToCart}
                    favorites={favorites}
                    cartItems={cartItems}/>
                    }/>
                <Route
                    path="/favorites"
                    element={<Favorite
                    items={favorites}
                    onAddToFavorite={onAddToFavorite}
                    onAddToCart={onAddToCart}/>
					}/>
            </Routes>
        </div>
    );
}

export default App;

// Когда убираем со страницы закладки айтем, то в items тоже должно убираться
// сердце

// import React from "react"
// import ContentLoader from "react-content-loader"

// const MyLoader = (props) => (
//   <ContentLoader 
//     speed={2}
//     width={150}
//     height={265}
//     viewBox="0 0 150 265"
//     backgroundColor="#f3f3f3"
//     foregroundColor="#ecebeb"
//     {...props}
//   >
//     <rect x="119" y="335" rx="0" ry="0" width="1" height="2" /> 
//     <rect x="0" y="0" rx="10" ry="10" width="150" height="90" /> 
//     <rect x="0" y="98" rx="5" ry="5" width="150" height="15" /> 
//     <rect x="0" y="121" rx="5" ry="5" width="100" height="15" /> 
//     <rect x="0" y="160" rx="5" ry="5" width="80" height="24" /> 
//     <rect x="126" y="160" rx="5" ry="5" width="24" height="24" />
//   </ContentLoader>
// )

// export default MyLoader