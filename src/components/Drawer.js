import Info from './Info'
import React from 'react'
import { AppContext } from '../App';
import axios from 'axios';

function Drawer({onRemove}) {
	const [isOrderCompleted, setIsOrderCompleted] = React.useState(false);
	const {cartItems, setCartOpened, setCartItems} = React.useContext(AppContext);
	const [isLoading, setIsLoading] = React.useState(false);
	const [orderId, setOrderId] = React.useState(null);

	const delayMs = (ms) => new Promise(resolve => setTimeout(resolve, ms))
	const onClickOrder = async () => {
		try {
			setIsLoading(true);
			const {data} = await axios.post("https://63049c5794b8c58fd72110dc.mockapi.io/orders", {items: cartItems});
			
			for (let i = 0; i < cartItems.length; i++) {
				await axios.delete(`https://63049c5794b8c58fd72110dc.mockapi.io/cart/${cartItems[i].id}`);
				delayMs(1000);				
			}

			setOrderId(data.id);
			setIsOrderCompleted(true);
			setCartItems([]);
		} catch (error) {
			alert('Ошибка при создании заказа!'); 
		}
		setIsLoading(false);
	}

    return (
        <div className="overlay">
            <div className="drawer">
                <h2 className="mb-30 d-flex justify-between">Корзина
                    <img
                        onClick={() => setCartOpened(false)}
                        className="removeBtn cu-p"
                        src="img/btn-remove.svg"
                        alt="Remove"/>
                </h2>
                {
                    cartItems.length > 0
                        ? (
                            <>
                                <div className="items flex">
                                    {
                                        cartItems.map((obj) => {
                                            return (
                                                <div key={obj.id} className="cartItem d-flex align-center">
                                                    <div
                                                        style={{
                                                            backgroundImage: `url(${obj.imageUrl})`
                                                        }}
                                                        className="cartItemImg"></div>
                                                    <div className="mr-20 flex">
                                                        <p className="mb-5">{obj.title}</p>
                                                        <b>{obj.price}руб.</b>
                                                    </div>
                                                    <img
                                                        onClick={() => onRemove(obj)}
                                                        className="removeBtn"
                                                        src="img/btn-remove.svg"
                                                        alt="Remove"/>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <div className="cartTotalBlock">
                                    <ul>
                                        <li>
                                            <span>Итого:</span>
                                            <div></div>
                                            <b>21 498 руб.</b>
                                        </li>
                                        <li>
                                            <span>Налог 5%</span>
                                            <div></div>
                                            <b>1074 руб.</b>
                                        </li>
                                    </ul>
                                    <button disabled={isLoading} onClick={onClickOrder} className="greenButton">Оформить заказ<img src="/img/arrow.svg" alt="Arrow"/></button>
                                </div>
                            </>
                        )
                        : 
						<Info
							title={isOrderCompleted ? "Заказ оформлен!" :"Корзина пустая"}
							description={isOrderCompleted 
										? `Ваш заказ #${orderId} скоро будет передан курьерской доставке` 
										: "Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."}
							image={isOrderCompleted ? "/img/complete-order.jpg" : "/img/empty-cart.jpg"}/>            
				}
            </div>
        </div>
    );
}

export default Drawer;