import React, { useContext, useState } from 'react'
import Modal from './Modal'
import { TYPES, DEFAULT_MESSAGES } from "../components/Alert"
import { CartContext } from "../providers/cart"
import axios from "axios"
import '../css/components/registerModal.css'
import Spinner from './Spinner'

function RegisterModal(props) {

    const { setAlert } = useContext(CartContext)

    const [name, setName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")

    const [isLoading, setIsLoading] = useState("")

    const handleRegistration = async (event) => {
        event.preventDefault()
        debugger
        if (validateData()) {
            const body = {
                fullName: `${name} ${lastName}`,
                email,
                password
            }

            setIsLoading(true)
            try {
                const response = await axios.post("https://barbershop-ui.herokuapp.com/users/", body)
                const user = response.data.data
                setAlert({ text: `Bienvenido ${user.fullName}. Por favor inicia sesión para continuar.`, type: TYPES.SUCCESS })
                resetState()
                props.closeModal()
            } catch (error) {
                console.log(error)
                setAlert({ text: DEFAULT_MESSAGES.SERVER_ERROR, type: TYPES.ERROR })
            }
            setIsLoading(false)
        }
    }

    const validateData = () => {
        if (!name || name === "") return createErrorAlert("Ingrese el nombre")
        if (!lastName || lastName === "") return createErrorAlert("Ingrese el apellido")
        if (!email || email === "") return createErrorAlert("Ingrese el correo electrónico")
        if (!validateEmail()) return createErrorAlert("El correo electrónico no es valido")
        if (!password || password === "") return createErrorAlert("Ingrese una contraseña")
        if (!password2 || password !== password2) return createErrorAlert("Las contraseñas no coinciden")

        return true
    }

    const createErrorAlert = (text) => {
        setAlert({ text, type: TYPES.ERROR })
        return false
    }

    const validateEmail = () => {
        const pattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
        return pattern.test(email)
    };

    const resetState = () => {
        setName("")
        setLastName("")
        setEmail("")
        setPassword("")
        setPassword2("")
    }

    return (
        <Modal show={props.show} closeModal={props.closeModal}>
            <div id="dialog_login">
                <form action="">
                    <h1>Registro</h1>
                    <p className="texto-inicial">Rellena el formulario para crear tu cuenta</p>
                    <input type="text" placeholder="Nombre" value={name} onChange={(event) => setName(event.target.value)} required />
                    <input type="text" placeholder="Apellido" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
                    <input type="password" placeholder="Confirm password" value={password2} onChange={(event) => setPassword2(event.target.value)} required />
                    {isLoading
                        ? <Spinner></Spinner>
                        : <button className="botones" onClick={(event) => handleRegistration(event)}>Completar</button>
                    }
                </form>
            </div>
        </Modal>
    )
}

export default RegisterModal