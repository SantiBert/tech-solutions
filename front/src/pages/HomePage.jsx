import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { searchFilmographyService } from '../services/filmography';


const HomePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const [data, setData] = useState([]);

  const onSubmit = async (data) => {
    const res = await searchFilmographyService(data.search);
    if (Array.isArray(res)) {
      setData(res);
    }
  }

  return (
    <main className='container'>
      <div className='bg-body-tertiary p-5 rounded mt-3'>
        <form
          className="d-flex"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input className="form-control me-sm-2"
            {...register("search", { required: true })}
            type="search"
            placeholder="Buscar" />
          <button className="btn btn-secondary my-2 my-sm-0" type="submit">Buscar</button>
        </form>
        {errors.search && (<p className="text-danger">Valor es requerido</p>)}
      </div>
      <div>
      {data && (
        <div>
          <h2>Resultados:{data.length}</h2>
          <div className='row'>
            {data.map((item, index) => (
              <div className="col-md-4 p-2">
                <div className="card text-white bg-primary">
                <div class="card-header">{item.type}</div>
                <div className="card-body">
                  <h4 className="card-title">{item.title}</h4>
                  <ul>
                  {item.actors.map((actor, index) => (
                  <li key={index}>{actor}</li>
                  ))}
                  </ul>
                </div>
                {item.director ? (
                  <div class="card-footer">
                    Director: {item.director}
                  </div>
                ):null}
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </main>
  )
};

export default HomePage