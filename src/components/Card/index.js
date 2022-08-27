import styles from './card.module.scss'
import React from 'react'

function Card({id, onFavorite, title, imageUrl, price, addItem, favorited = false}) {
    const [isAdded, setIsAdded] = React.useState(false);
	const [isFavorite, setIsFavorite] = React.useState(favorited);

    const onClickPlus = () => {
    	addItem({id, title, imageUrl, price});
        setIsAdded(!isAdded);
    }

	const onClickFavorite = () => {
		onFavorite({id, title, imageUrl, price})
		setIsFavorite(!isFavorite);
	}

    return (
        <div className={styles.card}>
            <div className={styles.favorite} onClick={onClickFavorite}>
                <img src={isFavorite ? "img/liked.svg" : "img/unliked.svg"} alt={isFavorite ? "Liked" : "Unliked"}/>
            </div>
            <img width={133} height={112} src={imageUrl} alt="Sneakers"/>
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
                    src={isAdded
                        ? "img/btn-checked.svg"
                        : "img/btn-plus.svg"}
                    alt="Plus"/>
            </div>
        </div>
    );
}

export default Card;