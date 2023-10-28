import React, { useEffect, useState } from 'react';

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext';
import { signupService } from '../services/auth';
import { registerSchema } from "../schemas/auth";

const RegisterPage = () => {
    const [error, setError] = useState();
    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const onSubmit = async (values) => {
        setError(null);
        let response = await signupService(values);
        if (response.status === 201) {
            navigate("/activate-account");
          }
        else{
            setError(response.data.message);
        }
      };
    
    useEffect(() => {
        if (isAuthenticated) navigate("/");
      }, [isAuthenticated]);

    return (
        <div className="container">
            <form
                onSubmit={handleSubmit(async (values) => {
                    onSubmit(values);
                })}
            >
                <div className='form-group row'>
                    <legend>Crear cuenta</legend>
                    <fieldset>
                        {error ? (
                            <div className="alert alert-dismissible alert-danger">
                                {error}
                            </div>
                        ) : null}
                        <label className="col-sm-2 col-form-label">Nombre Completo</label>
                        <div className='col-sm-10'>
                            <input
                                type="text"
                                {...register("full_name", { required: true })}
                                className="form-control"
                                placeholder='Nombre Completo'
                            />
                            {errors.full_name?.message && (<p className="text-danger">{errors.full_name?.message}</p>)}
                        </div>
                        <label className="col-sm-2 col-form-label">Email</label>
                        <div className='col-sm-10'>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                className="form-control"
                                placeholder='Email'
                            />
                            {errors.email?.message && (<p className="text-danger">{errors.email?.message}</p>)}
                        </div>
                        <label className="col-sm-2 col-form-label">Contraseña</label>
                        <div className='col-sm-10'>
                            <input
                                type="password"
                                {...register("password", { required: true })}
                                className="form-control"
                                placeholder='Contraseña'
                            />
                            {errors.password?.message && (<p className="text-danger">{errors.password?.message}</p>)}
                        </div>
                        <label className="col-sm-2 col-form-label">Confirmar Contraseña</label>
                        <div className='col-sm-10'>
                            <input
                                type="password"
                                {...register("confirmPassword", { required: true })}
                                className="form-control"
                                placeholder='Repetir Contraseña'
                            />
                            {errors.confirmPassword?.message && (<p className="text-danger">{errors.confirmPassword?.message}</p>)}
                        </div>
                        <div className='col-sm-10 p-3'>
                            <button type='submit' className='btn btn-secondary'>
                                Crear cuenta
                            </button>
                        </div>
                    </fieldset>
                </div>
            </form>
        </div>        
    );
}

export default RegisterPage