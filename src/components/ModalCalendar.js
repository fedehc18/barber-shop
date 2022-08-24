import React, { useContext, useEffect, useState } from 'react'
import Modal from "./Modal"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../css/style-date.css'
import moment from "moment"
import { CartContext } from '../providers/cart';
import axios from "axios"
import { DEFAULT_MESSAGES, TYPES } from "./Alert"
import Spinner from './Spinner';

function ModalCalendar(props) {

    const [startDate, setStartDate] = useState(moment().add(1, "days").toDate());
    const [selectedTime, setSelectedTime] = useState()
    const [timeAvailable, setTimeAvailable] = useState([])
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { jwt, setAlert } = useContext(CartContext)

    useEffect(() => {
        async function getTime() {
            setIsLoadingData(true)

            axios.defaults.headers.common['Authorization'] = jwt;
            const response = await axios.get(`http://localhost:5001/reservation/hours?date=${startDate.toISOString()}&barberId=${props.barberId}`)
            setTimeAvailable(response.data.data)
            setIsLoadingData(false)
        }

        getTime()
    }, [startDate])


    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        try {
            axios.defaults.headers.common['Authorization'] = jwt;
            const response = await axios.post("https://barbershop-ui.herokuapp.com/reservation/", {
                date: startDate,
                time: selectedTime,
                barberId: props.barberId
            })
            setAlert({ text: "La reserva se creo correctamente", type: TYPES.SUCCESS })
            props.closeModal()
        } catch (error) {
            console.log(error)
            setAlert({ text: DEFAULT_MESSAGES.SERVER_ERROR, type: TYPES.ERROR })
        }
        setIsSubmitting(false)
        props.getReservations()
    }

    return (
        <Modal show={props.show} closeModal={props.closeModal}>
            <div className='date-picker' style={{ background: "linear-gradient(180deg, white 20%, rgb(224, 126, 13) 80%)" }}>
                <h1 className='title'>Agende su cita con {props.barberName}</h1>
                <div >
                    <p className='date-title'>Fecha:</p>
                    <DatePicker className='calendar' selected={startDate} onChange={(date) => setStartDate(date)} />
                </div>
                <div className='time-picker'>
                    <p className='time-title'>{"Hora(10am - 5pm):"}</p>
                    <div className='times'>
                        {timeAvailable.map(time => <button className='time-buttons' style={{ background: time === selectedTime && "gray" }} onClick={() => { setSelectedTime(time) }}>{`${time}:00`}</button>)}
                    </div>
                    {
                        isSubmitting
                            ? <Spinner></Spinner>
                            : <button className={isLoadingData ? "reserve-button-disabled" : "reserve-button"} onClick={(event) => handleSubmit(event)} disabled={isLoadingData ? true : false}>Reservar</button>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default ModalCalendar