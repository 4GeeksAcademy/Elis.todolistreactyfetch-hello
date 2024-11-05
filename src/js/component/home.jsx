import React, { useRef, useState, useEffect } from "react";
import rigoImage from "../../img/rigo-baby.jpg";

function TodoList() {
    const [tareas, setTareas] = useState([]);
    const nuevaTareaRef = useRef(null);

    // Refrescar Tareas desde el Servidor
    const refrescarTareas = () => {
        fetch('https://playground.4geeks.com/todo/users/Elis-gomez')
            .then(response => response.json())
            .then(data => {
                setTareas(data.todos);
            })
            .catch(error => console.error('Error al cargar tareas:', error));
    };

    useEffect(() => {
        refrescarTareas();
    }, []);

    // Agregar Nueva Tarea
    const agregarTarea = (e) => {
        if (e.key === "Enter") {
            const nuevaTarea = nuevaTareaRef.current.value.trim();
            if (nuevaTarea !== "") {
                fetch('https://playground.4geeks.com/todo/todos/Elis-gomez', {
                    method: 'POST',
                    body: JSON.stringify({ label: nuevaTarea, is_done: false }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    setTareas((tareas) => [...tareas, data]);
                    nuevaTareaRef.current.value = "";
                })
                .catch(error => console.error('Error al agregar la tarea:', error));
            }
        }
    };

    // Borrar Tarea Específica
    const borrarTarea = (index) => {
        const tareaABorrar = tareas[index];
        fetch(`https://playground.4geeks.com/todo/todos/${tareaABorrar.id}`, {
			method: 'DELETE'
			
        })
        .then(() => refrescarTareas())
        .catch(error => console.error('Error deleting task:', error));
    };

    // Borrar Todas las Tareas
    const borrarTodo = () => {
        for (let i = 0; i < tareas.length; i++) {
            borrarTarea(i);
        }
        refrescarTareas();
    };

    // Renderizado
    return (
        <div className="container">
            <h1 className="text-center">📋 Mi Lista de Tareas</h1>
            <input
                type="text"
                ref={nuevaTareaRef}
                placeholder="Escribe una nueva tarea y presiona Enter"
                onKeyDown={agregarTarea}
            />
            {Array.isArray(tareas) && tareas.length === 0 ? (
                <p className="text-center">No hay tareas, ¡agrega una nueva!</p>
            ) : (
                <ul>
                    {Array.isArray(tareas) && tareas.map((tarea, index) => (
                        <li key={index}>
                            <span>{tarea.label}</span>
                            <button onClick={() => borrarTarea(index)}>
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="d-flex justify-content-center align-items-center w-100 mt-4">
                <button type="button" onClick={borrarTodo}>
                    Finalizar todas las tareas
                </button>
            </div>
            <div className="text-center mt-3">{tareas.length} tareas en total</div>
        </div>
    );
}

export default TodoList;
