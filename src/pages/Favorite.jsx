import Card from '../components/Card';
import React from 'react';
import {AppContext} from '../App';

function Favorite() {
	const {favorites} = React.useContext(AppContext);

    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Избранное</h1>
            </div>
            <div className="d-flex flex-wrap">
                {
                    favorites.map(item => (
						<Card
							key={item.imageUrl}
							{...item}
							favorited={true}/>
						))
                }
            </div>
        </div>
    );
}

export default Favorite;