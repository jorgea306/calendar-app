import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { useSelector, useDispatch } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../actions/events';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1,'hours');
const endd = now.clone().add(1,'hours');

const initEvent = {
    title:'',
    notes:'',
    start:now.toDate(),
    end:endd.toDate()
}

export const CalendarModal = () => {

    const {modalOpen} = useSelector(state => state.ui);
    const {activeEvent} = useSelector(state => state.calendar);

    const dispatch = useDispatch();

    const [dateStart, setdateStart] = useState(now.toDate());
    const [dateEnd, setdateEnd] = useState(endd.toDate());
    const [titleValid, settitleValid] = useState(true);
    const [formValues, setFormValues] = useState(initEvent);

    const {title, notes, start, end } = formValues;

    useEffect(() => {
        if (activeEvent) {
            setFormValues(activeEvent)
        } else {
            setFormValues(initEvent)
        }        
    }, [activeEvent,setFormValues])

    const handleInpoutChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        dispatch(uiCloseModal());
        dispatch(eventClearActiveEvent());
        setFormValues(initEvent);
    }

    const handleStarDateChange = (e) => {
        setdateStart(e);
        setFormValues({
            ...formValues,
            start:e
        })
    }

    const handleEndDateChange = (e) => {
        setdateEnd(e);
        setFormValues({
            ...formValues,
            end:e
        })
    }

    const handleSubmitForm = (e) => {

        e.preventDefault();

        const momentStart = moment(start);
        const momentEnd = moment(end);

        // console.log('comienzo',momentStart);
        // console.log(momentEnd);

        if ( momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire('Error', 'La Fecha Fin debe ser mayor que la fecha de Inicio', 'error');
        }

        if (title.trim().length < 2 ) {
            return settitleValid(false);
        }

        if (activeEvent) {
            dispatch(eventStartUpdate(formValues));
        } else {
            dispatch(eventStartAddNew(formValues))
        }

       

        settitleValid(true);
        closeModal();
        
    }


    return (
        <Modal
          isOpen={modalOpen}
        //   onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          closeTimeoutMS={200}
          className="modal"
          overlayClassName="modal-fondo"
        >
        <h1> { (activeEvent) ?'Editar Evento' :'Nuevo evento'} </h1>
        <hr />
        <form 
            className="container"
            onSubmit={handleSubmitForm}
        >
        
            <div className="form-group">
                <label>Fecha y hora inicio</label>
                <DateTimePicker
                    onChange={handleStarDateChange}
                    value={dateStart}
                    className="form-control"
                />
            </div>
        
            <div className="form-group">
                <label>Fecha y hora fin</label>
                <DateTimePicker
                    onChange={handleEndDateChange}
                    value={dateEnd}
                    minDate={dateStart}
                    className="form-control"
                />
            </div>
        
            <hr />
            <div className="form-group">
                <label>Titulo y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${!titleValid && 'is-invalid'}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={title}
                    onChange={handleInpoutChange}
                />
                <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
            </div>
        
            <div className="form-group">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={notes}
                    onChange={handleInpoutChange}
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">Información adicional</small>
            </div>
        
            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>
        
        </form>
        
        </Modal>
    )
}
