import styles from './card.module.scss'
import ContentLoader from 'react-content-loader';
import React from 'react'
import {AppContext} from '../../App';


function Card({
    id,
    title,
    imageUrl,
    price,
	favorited,
    loading = false
}) {
	const {isItemAdded, onAddToCart, onAddToFavorite} = React.useContext(AppContext);
	const [isFavorited, setIsFavorited] = React.useState(favorited);

    const onClickPlus = () => {
        onAddToCart({id, title, imageUrl, price});
    }
	
    const onClickFavorite = () => {
		onAddToFavorite({
			id,
            title,
            imageUrl,
            price
        });
		setIsFavorited(!isFavorited);
    }

    return (
        <div className={styles.card}>
            {loading ? 
				<ContentLoader
					speed={2}
					width={160}
					height={250}
					viewBox="0 0 155 265"
					backgroundColor="#f3f3f3"
					foregroundColor="#ecebeb">
					<rect x="1" y="0" rx="10" ry="10" width="155" height="155"/>
					<rect x="0" y="167" rx="5" ry="5" width="155" height="15"/>
					<rect x="0" y="187" rx="5" ry="5" width="100" height="15"/>
					<rect x="1" y="234" rx="5" ry="5" width="80" height="25"/>
					<rect x="124" y="230" rx="10" ry="10" width="32" height="32"/>
				</ContentLoader>
                :
				<>
					<div className = {styles.favorite} onClick = {onClickFavorite}>
						<img src={isFavorited ? "img/liked.svg" : "img/unliked.svg"}
                        	 alt={"Liked/Unliked"}/>
            	    </div>
                	<img width='100%' height={135} src={imageUrl} alt="Sneakers"/>
                	<h5>{title}</h5>
                <div className="d-flex justify-between align-center">
                    <div className="d-flex flex-column">
                        <span>Цена:
                        </span>
                        <b>{price}
                            руб.</b>
                </div>
                    <img
                        className={styles.plus}
                        onClick={onClickPlus}
                        src={isItemAdded(imageUrl)
                            ? "img/btn-checked.svg"
                            : "img/btn-plus.svg"}
                        alt="Plus"/>
                </div>
            </>
            }
        </div>
    );
}

export default Card;