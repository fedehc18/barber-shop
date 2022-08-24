import React, { useContext, useEffect } from 'react'
import Page from '../components/Page'
import '../css/style-cart.css'
import { CartContext } from '../providers/cart'
import CartProduct from '../components/CartProduct'
import CartDescription from '../components/CartDescription'
import { TYPES } from "../components/Alert"
import axios from "axios"

function Cart() {

    const { addedProducts, total, resetCart, setAlert, jwt, setIsOpenLogin } = useContext(CartContext)

    const handlePay = async () => {
        if (jwt && jwt != "") {
            try {
                const body = {
                    price: total
                }

                body.products = addedProducts.map(product => {
                    return { productId: product.id, quantity: product.quantity }
                })

                axios.defaults.headers.common["Authorization"] = jwt;
                const response = await axios.post("https://barbershop-ui.herokuapp.com/orders", body)
                setAlert({ text: `Se realizo la compra exitosamente! con un total de $${total}`, type: TYPES.SUCCESS })
                resetCart()
            } catch (error) {
                setAlert({ text: `Tuvimos inconvenientes en realizar su compra. Por favor intente de nuevo`, type: TYPES.ERROR })
            }
        } else {
            setAlert({ text: "Debe iniciar sesión para poder realizar compras", type: TYPES.WARNING })
            setIsOpenLogin(true)
        }
    }

    //remove alert when component is going to be unmount
    useEffect(() => {
        return () => setAlert(null)
    }, [])

    return (
        <Page>
            <main>
                <h1 className="titulo-carrito">Tu carrito</h1>
                <div className="containers">
                    <div className="productos-carrito">
                        <h2 className="titulo-productos-cart">Productos:
                        </h2>
                        <ul className="productos-cart">
                            {addedProducts.map(product =>
                                <CartProduct
                                    name={product.name}
                                    quantity={product.quantity}
                                    imageUrl={product.imageUrl}
                                    id={product.id}
                                    price={product.price}>
                                </CartProduct>
                            )}
                        </ul>

                    </div>
                    <div className="descripcion">
                        <h2 className="titulo-descripcion">Descripción:</h2>
                        <ul className="lista-descripcion">
                            {addedProducts.map(product =>
                                <CartDescription name={product.name} quantity={product.quantity} ></CartDescription>
                            )}

                        </ul>
                        <div className="pago">
                            <div className="container-pago">
                                <h3 className="titulo-pago">Total: ${total}</h3>
                                <button className={total == 0 ? "boton-pago-disabled" : "boton-pago"} onClick={() => handlePay()} disabled={total == 0 ? true : false}>Pagar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Page >

    )
}

export default Cart