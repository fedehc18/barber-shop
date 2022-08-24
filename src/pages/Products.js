import React, { useContext, useEffect, useState } from 'react'
import Page from '../components/Page'
import '../css/style-productos.css'
import axios from "axios"
import Product from '../components/Product'
import { CartContext } from '../providers/cart'
import { DEFAULT_MESSAGES, TYPES } from '../components/Alert'
import Loading from '../components/Loading'

function Products() {
    const [isLoading, setIsLoading] = useState(false)
    const [products, setProducts] = useState([])
    const { setAlert } = useContext(CartContext)

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("https://barbershop-ui.herokuapp.com/products")
                setProducts(response.data.data)
            } catch (error) {
                console.log(error)
                setAlert({ text: DEFAULT_MESSAGES.SERVER_ERROR, type: TYPES.ERROR, timeout: 5000 })
            }
        }

        setIsLoading(true)
        fetchData();
        setIsLoading(false)

        return (() => { setAlert() })
    }, [])

    return (
        <Page>
            <main>
                <ul className="productos">
                    {products.map(product =>
                        <Product name={product.name} imageUrl={product.imageUrl} description={product.description} price={product.price} id={product.id}></Product>
                    )}
                </ul>
            </main>
            <Loading show={isLoading}></Loading>
        </Page>
    )
}

export default Products