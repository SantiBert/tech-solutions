import React from 'react'
import { Link } from "react-router-dom";
import { useAuth } from '../context/authContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand">Home</Link>
                <button  className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarColor01">
                    <ul className="navbar-nav me-auto">
                        {isAuthenticated ? (
                            <>
                            <li className="nav-item">
                                <Link to="/movie-create" className="nav-link" >Crear Película</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/" onClick={() => logout()} className="nav-link" >Cerrar sesion</Link>
                            </li>
                            </>
                        ) :(
                            <>
                            <li className="nav-item">
                                <Link to="/register" className="nav-link" >Crear Cuenta</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/login" className="nav-link" >Iniciar sesion</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/activate-account" className="nav-link" >Activar Cuenta</Link>
                            </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar