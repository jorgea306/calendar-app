import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";


const eventAddNew = ( event ) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = ( event ) => ({
    type: types.eventSetActive,
    payload: event
});

export const eventClearActiveEvent = () => ({
    type: types.eventClearActiveEvent
});

const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event
})

const eventDeleted = () => ({
    type: types.eventDeleted
});

//Eventos con base de datos
export const eventStartAddNew = (event) => {

    return async(dispatch, getState) => {

        const {uid, name} = getState().auth;

        try {
            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();

            if (body.ok) {
                event.id = body.evento.id;
                event.user = {
                    _id: uid,
                    name: name
                }
                console.log(event);
                dispatch(eventAddNew(event));
            }
            
        } catch (error) {
            console.log(error);
        }
    }
}

export const eventStartLoading = () => {
    return async(dispatch) => {
        
        try {
            
            const resp = await fetchConToken('events');
            const body = await resp.json();

            const events = prepareEvents(body.eventos);

            dispatch(eventLoaded(events))

        } catch (error) {
            console.log(error);
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
})

export const eventStartUpdate = (event) => {
    return async(dispatch) => {
        
        try {
            
            const resp = await fetchConToken(`events/${event.id}`, event, 'PUT');
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventUpdated(event));
            } else {
                Swal.fire('Erro', body.msg, 'error');
            }

       

        } catch (error) {
            console.log(error);
        }
    }
}

export const eventStartDelete = () => {
    return async(dispatch, getState) => {

        const {id} = getState().calendar.activeEvent;
        
        try {
            
            const resp = await fetchConToken(`events/${id}`, {}, 'DELETE');
            const body = await resp.json();

            if (body.ok) {
                dispatch(eventDeleted());
            } else {
                Swal.fire('Erro', body.msg, 'error');
            }

       

        } catch (error) {
            console.log(error);
        }
    }
}

export const eventLogout = () => ({type: types.eventLogout});




