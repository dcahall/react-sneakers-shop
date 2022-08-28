import Card from '../components/Card';

function Favorite( {
    items,
    onAddToFavorite,
    onAddToCart
}) {
    return (
        <div className="content p-40">
            <div className="d-flex align-center justify-between mb-40">
                <h1>Избранное</h1>
            </div>
            <div className="d-flex flex-wrap">
                {
                    items
                        .map(item => (
                            <Card
                                key={item.imageUrl}
                                onFavorite={onAddToFavorite}
                                addItem={(obj, page) => onAddToCart(obj, page)}
								favorited={true}
								{...item}
								page={'Favorite'}/>
							))
                }
            </div>
        </div>
    );
}

export default Favorite;