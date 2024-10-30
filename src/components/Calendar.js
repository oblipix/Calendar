import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';
import { FaTrash, FaEdit, FaCheck } from 'react-icons/fa';

function MyCalendar() {
    const [date, setDate] = useState(new Date());
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventDescription, setEventDescription] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        setEvents(storedEvents);
    }, []);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setEventDescription('');
        setIsAddEventModalOpen(true);
        setEditingIndex(null);
    };

    const handleCloseAddEventModal = () => {
        setIsAddEventModalOpen(false);
        setEventDescription('');
        setEditingIndex(null);
    };

    const handleAddEvent = () => {
        const newEvent = {
            date: date.toDateString(),
            description: eventDescription,
            completed: false,
        };

        if (editingIndex !== null) {
            const updatedEvents = [...events];
            updatedEvents[editingIndex] = newEvent;
            setEvents(updatedEvents);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
        } else {
            const updatedEvents = [...events, newEvent];
            setEvents(updatedEvents);
            localStorage.setItem('events', JSON.stringify(updatedEvents));
        }

        setIsAddEventModalOpen(false);
    };

    const handleDeleteEvent = (index) => {
        const updatedEvents = events.filter((_, i) => i !== index);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const handleEditEvent = (index) => {
        setEventDescription(events[index].description);
        setEditingIndex(index);
        setIsAddEventModalOpen(true);
    };

    const handleCompleteEvent = (index) => {
        const updatedEvents = [...events];
        updatedEvents[index] = {
            ...updatedEvents[index],
            completed: !updatedEvents[index].completed,
        };
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const hasEvent = (date) => {
        return events.some(event => event.date === date.toDateString());
    };

    return (
        <div>
            <Calendar 
                onChange={handleDateChange} 
                value={date} 
                tileContent={({ date }) => hasEvent(date) ? <div className="event-marker"></div> : null} 
            />
            
            {isAddEventModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseAddEventModal}>&times;</span>
                        <h2>{editingIndex !== null ? 'Editar Evento' : 'Adicionar Evento'}</h2>
                        <p>{editingIndex !== null ? 'Editar evento para:' : 'Adicionar um evento para:'} {date.toDateString()}</p>
                        <textarea
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            placeholder="Descrição do evento"
                        />
                        <button 
                            className="button" 
                            onClick={handleAddEvent} 
                            disabled={!eventDescription.trim()}
                        >
                            {editingIndex !== null ? 'Salvar Evento' : 'Adicionar Evento'}
                        </button>
                    </div>
                </div>
            )}

            <div className="event-list">
                <h3>Eventos para {date.toDateString()}:</h3>
                {events.filter(event => event.date === date.toDateString()).map((event, index) => (
                    <div key={index} className={`event-item ${event.completed ? 'completed' : ''}`}>
                        <span>{event.description}</span>
                        <div className="icon-container">
                            <FaCheck 
                                className="complete-icon" 
                                onClick={() => handleCompleteEvent(index)} 
                                title={event.completed ? "Marcar como não concluído" : "Marcar como concluído"} 
                            />
                            <FaEdit className="edit-icon" onClick={() => handleEditEvent(index)} />
                            <FaTrash className="delete-icon" onClick={() => handleDeleteEvent(index)} />


                           
                        </div>
                        




                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyCalendar;
