import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { activateAccountService } from '../services/auth';
import { useAuth } from '../context/authContext';


const ActivateAcount = () => {
    const [error, setError] = useState();
    const {
        register,
        handleSubmit,
        formState:{errors}
    } = useForm();

    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();

    const onSubmit = async (values) => {
        setError(null);
        let response = await activateAccountService(values);
        if (response.status === 200) {
            navigate("/");
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
        onSubmit={handleSubmit(async(values) =>{
            onSubmit(values); 
        })}
    >
        <div className='form-group row'>
            <legend>Activar cuenta</legend>
        <fieldset>
            {error ? (
            <div className="alert alert-dismissible alert-danger">
                <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                {error}
                </div>
            ) : null}
            <label className="col-sm-2 col-form-label">Hash</label>
            <div className='col-sm-10'>
                <textarea
                    {...register("hash", {required:true})}
                    className="form-control"
                    placeholder='Hash'
                    rows="3">
                </textarea>
                {errors.hash && ( <p className="text-danger">Hash es requerido</p> )}
            </div>
            <div className='col-sm-10 p-3'>
                <button type='submit' className='btn btn-secondary'>
                    Activar cuenta
                </button>
            </div>
        </fieldset>
        </div>
    </form>
        </div>        
    );
}

export default ActivateAcount