import React from 'react';
import axios from 'axios';

import Info from '../Info';
import {useCart} from '../../hooks/useCart';

import styles from './Drawer.module.scss'

function Drawer({onRemove, onClose, opened}) {
    const [isOrderCompleted, setIsOrderCompleted] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [orderId, setOrderId] = React.useState(null);
    const {cartItems, setCartItems, totalPrice} = useCart();

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
        <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
            <div className={styles.drawer}>
                <h2 className="mb-30 d-flex justify-between">Корзина
                    <img
                        onClick={onClose}
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
                                            <span>Cумма:</span>
                                            <div></div>
                                            <b>{totalPrice} руб.</b>
                                        </li>
                                        <li>
                                            <span>Налог 5%</span>
                                            <div></div>
                                            <b>{Math.round(totalPrice * 0.05)} руб.</b>
                                        </li>
                                        <li>
                                        <span>C учетом налога:</span>
                                            <div></div>
                                            <b>{Math.round(totalPrice * 0.05) + totalPrice} руб.</b>
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