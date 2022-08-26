import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Card from './components/Card';
import Header from './components/Header';
import Drawer from './components/Drawer';
import axios from 'axios';

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
	
    const onAddToCart = (obj) => {
		axios.post('https://63049c5794b8c58fd72110dc.mockapi.io/cart', obj);
        setCartItems(prev => [...prev, obj]);
    }

	const onAddToFavorite = (obj) => {
		axios.post('https://63049c5794b8c58fd72110dc.mockapi.io/favorites', obj);
		setFavorites(prev => [...prev, obj]);
	}
	
    const onRemoveItem = (obj) => {
		setCartItems((prev) => prev.filter(item => item.id !== obj.id))
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
				<Route path="/123" exact element={<Header/>}/>
			</Routes>
        
		    <div className="content p-40">
                <div className="d-flex align-center justify-between mb-40">
                    <h1>{
                            searchValue
                                ? `Поиск по запросу "${searchValue}"`
                                : 'Все кроссовки'
                        }</h1>
                    <div className="search-block d-flex">
                        <img src="img/search.svg" alt="Search"></img>
                        {
                            searchValue && <img
                                    onClick={() => setSearchValue('')}
                                    className="clear cu-p"
                                    src="img/btn-remove.svg"
                                    alt="Close"/>
                        }
                        <input
                            value={searchValue}
                            onChange={onChangeSearchInput}
                            placeholder="Поиск ..."></input>
                    </div>
                </div>
                <div className="d-flex flex-wrap">
                    {
                        items
                            .filter(
                                item => item.title.toLowerCase().includes(searchValue.toLowerCase())
                            )
                            .map(item => (
                                <Card
                                    key={item.imageUrl}
                                    title={item.title}
                                    price={item.price}
                                    imageUrl={item.imageUrl}
                                    onFavorite={onAddToFavorite}
                                    addItem={(obj) => onAddToCart(obj)}/>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
