import Card from './components/Card'
import Header from './components/Header'
import Drawer from './components/Drawer'
import React from 'react'

function App() {
    const [items, setItems] = React.useState([]);
    const [cartItems, setCartItems] = React.useState([]);
    const [cartOpened, setCartOpened] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    React.useEffect(() => {
        fetch('https://63049c5794b8c58fd72110dc.mockapi.io/items')
            .then(
                res => res.json()
            )
            .then(json => setItems(json));
    }, []);

    const onAddToCart = (obj) => {
        setCartItems(prev => [
            ...prev,
            obj
        ]);
    }

    const onDeleteFromCart = (obj) => {
        setCartItems(prev => {
            const modifiedArr = prev.filter(elem => {
                if (elem.imageUrl !== obj.imageUrl) 
                    return elem;
                return null;
            });
            return modifiedArr;
        })
    }

    const onChangeSearchInput = (event) => {
        setSearchValue(event.target.value);
    }

    return (
        <div className="wrapper clear">
            {cartOpened && <Drawer items={cartItems} onClose={() => setCartOpened(false)}/>}
            <Header onClickCart={() => setCartOpened(true)}/>
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
                                    onFavorite={() => console.log('Добавили закладки')}
                                    addItem={(obj) => onAddToCart(obj)}
                                    deleteItem={(obj) => onDeleteFromCart(obj)}/>
                            ))
                    }
                </div>
            </div>
        </div>
    );
}

export default App;
