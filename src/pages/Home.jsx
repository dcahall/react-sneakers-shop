import Card from '../components/Card';
import React, { useContext } from 'react';
import {AppContext} from '../App';

function Home({
    searchValue,
    setSearchValue,
    onChangeSearchInput,
    isLoading,
    onAddToCart,
    onAddToFavorite
}) {
const {items} = useContext(AppContext);

const renderItems = () => {
    const filtredItems = items.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));
    return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => (
            <Card
                key={index}
                onAddToCart={onAddToCart}
                {...item}
                loading={isLoading}
                onAddToFavorite={onAddToFavorite}/>
        ));
    }

    return (
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
                {renderItems()}
            </div>
        </div>
    );
}

export default Home;