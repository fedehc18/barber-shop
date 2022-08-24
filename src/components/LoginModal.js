import React, { useContext, useState } from 'react'
import Modal from './Modal'
import { TYPES } from "../components/Alert"
import axios from "axios"
import '../css/components/loginModal.css'
import Spinner from './Spinner'
import { CartContext } from '../providers/cart'

function LoginModal(props) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState("")

    const { setJwt, setAlert } = useContext(CartContext)

    const handleRegister = () => {
        props.closeModal();
        props.openRegister();
    }

    const handleLogin = async () => {
        if (email.length == 0) {
            setAlert({ text: "Ingrese el email", type: TYPES.ERROR })
            return
        }

        if (password.length == 0) {
            setAlert({ text: "Ingrese el password", type: TYPES.ERROR })
            return
        }

        let jwt
        setIsLoading(true)
        try {
            const response = await axios.post("https://barbershop-ui.herokuapp.com/auth/login", { email, password })
            jwt = response.data.data.JWT
            localStorage.setItem("JWT", jwt);
            setJwt(jwt)
            props.closeModal()
        } catch (error) {
            console.log(error)
            setAlert({ text: "Contraseña o Email incorrectos", type: TYPES.ERROR })
        }

        setIsLoading(false)
    }

    return (
        <Modal show={props.show} closeModal={props.closeModal}>
            <div id="dialog_login">
                <form action="">
                    <h1>Sign In</h1>
                    <p className="texto-inicial">Ingresa tu usuario y contraseña</p>
                    <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    {
                        isLoading
                            ? <Spinner></Spinner>
                            : <>
                                <button className="botones" onClick={() => handleLogin()}>Sign in</button>
                                <p className="parrafo-registro">¿Aún no tienes una cuenta?</p>
                                <a href=""><button className="botones" onClick={() => handleRegister()}>Registro</button></a>
                            </>
                    }
                </form>
            </div>
        </Modal>
    )
}

export default LoginModal