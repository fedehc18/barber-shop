import React, { useContext, useEffect, useState } from 'react'
import { TYPES, DEFAULT_MESSAGES } from '../components/Alert'
import Order from '../components/Order'
import Page from '../components/Page'
import '../css/style-pedidos.css'
import { CartContext } from '../providers/cart'
import axios from "axios"
import Loading from "../components/Loading"

function Orders() {

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { setAlert, jwt } = useContext(CartContext)

    useEffect(() => {
        setAlert({ text: "Los pedidos pueden ser cancelados un dia antes de ser despachados", type: TYPES.WARNING, timeout: 5000 })

        fetchData()

        return (() => { setAlert(null) })
    }, [])

    const fetchData = async () => {
        setIsLoading(true)
        try {
            axios.defaults.headers.common["Authorization"] = jwt;
            const response = await axios.get("https://barbershop-ui.herokuapp.com/orders")
            setOrders(response.data.data)
        } catch (error) {
            console.log(error)
            setAlert({ text: DEFAULT_MESSAGES.SERVER_ERROR, type: TYPES.ERROR, timeout: 5000 })
        }
        setIsLoading(false)
    }

    const handleCancel = async (id) => {
        setIsLoading(true)
        try {
            axios.defaults.headers.common["Authorization"] = jwt;
            await axios.delete("https://barbershop-ui.herokuapp.com/orders/" + id)
        } catch (error) {
            console.log(error)
            setAlert({ text: DEFAULT_MESSAGES.SERVER_ERROR, type: TYPES.ERROR, timeout: 5000 })
        }
        setIsLoading(false)

        fetchData()
    }

    return (
        <Page>
            <main>
                <h1 className="titulo-pedidos">Pedidos pendientes</h1>
                <div className="container1">

                    {orders.filter(order => order.isCancelable).map(order =>
                        <Order id={order.id}
                            products={order.products}
                            price={order.price}
                            date={order.date}
                            isCancelable={order.isCancelable}
                            handleCancel={handleCancel}>
                        </Order>
                    )}
                </div>

                <h1 className="titulo-pedidos">Pedidos despachados</h1>
                <div className="container2">
                    {orders.filter(order => !order.isCancelable).map(order =>
                        <Order id={order.id}
                            products={order.products}
                            price={order.price}
                            date={order.date}
                            isCancelable={order.isCancelable}>
                        </Order>
                    )}
                </div>
            </main>
            <Loading show={isLoading}></Loading>
        </Page>
    )
}

export default Orders