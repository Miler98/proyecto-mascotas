//IMPORT
import React, { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
import portada from '../images/adopta.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import MascotaCard from "./MascotaCard.js";
import className from "../estilos.css";


//CUERPO COMPONENTE
const MascotasComponent = () => {
  const url = "http://localhost:8000/mascotas";
  const [mascotas, setMascotas] = useState([]);
  const [id, setId] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [tipo_mascota, setTipo_mascota] = useState("");
  const [raza, setRaza] = useState("");
  const [operacion, setOperacion] = useState("");
  const [titulo,setTitulo]=useState("");

  useEffect(() => {
    getMascotas();
  }, []);

  const getMascotas = async () => {
    const respuesta = await axios.get(`${url}/buscar`);
    console.log(respuesta.data);
    setMascotas(respuesta.data);
  };

  const openModal =(opcion, id, nombre, edad, tipo_mascota, raza)=>{
    setId('');
    setNombre('');
    setEdad('');
    setTipo_mascota('');
    setRaza('');
    setOperacion(opcion);
    if(opcion === 1){
        setTitulo("Registrar Mascota");
    }
    else if(opcion===2){
        setTitulo("Editar Mascota");
        setId(id);
        setNombre(nombre);
        setEdad(edad);
        setTipo_mascota('');
        setRaza('');
    }
  };

  const validar = ()=>{
    let parametros;
    let metodo;
    if(nombre.trim()===''){
        console.log("Debe escribir un Nombre");
        mostrarAlerta("Debe escribir un Nombre");
    }
    else if(edad.trim()===''){
        console.log("Debe escribir una Edad");
        mostrarAlerta("Debe escribir una Edad");
    }else if(tipo_mascota.trim()===''){
      console.log("Debe escribir si es gato o perro");
      mostrarAlerta("Debe escribir si es gato o perro");
    }
    else{
        if(operacion===1){
            parametros={
                urlExt: `${url}/crear`,
                nombre: nombre.trim(),
                edad: edad.trim(),
                tipo_mascota: tipo_mascota.trim(),
                raza: raza.trim()
            };
            metodo="POST";
        }
        else{
            parametros={
                urlExt: `${url}/actualizar/${id}`,
                nombre: nombre.trim(),
                edad: edad.trim(),
                tipo_mascota: edad.trim(),
                raza: raza.trim()
            };
            metodo="PUT";
        }
        enviarSolicitud(metodo, parametros);      
    }
  };


  const enviarSolicitud = async (metodo, parametros)=>{
    await axios({method: metodo, url: parametros.urlExt, data: parametros })
    .then((respuesta)=>{
        let tipo= respuesta.data.tipo;
        let mensaje = respuesta.data.mensaje;
        mostrarAlerta(mensaje,tipo);
        if(tipo ==="success"){
            document.getElementById("btnCerrarModal").click();
            getMascotas();
        }
    })
    .catch((error)=>{
        mostrarAlerta(`Error en la solicitud`,error)
    });
  };
  
  const adoptarMascota=(id,nombre)=>{
    const MySwal = withReactContent(Swal);
    MySwal.fire({
        title: `Estas seguro de ADOPTAR la mascota ${nombre} ?`,
        icon: 'question',
        text: 'Se ADOPTARÁ Definitivamente',
        showCancelButton: true, 
        confirmButtonText: 'Si, ADOPTAR',
        cancelButtonText: 'Cancelar'
    }).then((result)=>{
        if(result.isConfirmed){
          mostrarAlerta("Mascota feliz","info");
        }
        else{
            mostrarAlerta("No se Adopto la mascota","info");
        }
    })
  }

  return (
    <div className="App">
      <img 
            src={portada} 
            alt="Portada de la página"
            style={{ height: '350px', width:'100%' }}
      />
        <div className="">
          <div className="">
            <div className="d-grid mx-auto">
             
             <header>
                <div className="buscar">
                    <input className="search-bar" type="text" placeholder="Buscar Mascota"></input>
                    <button className="btn btn-success">
                    <i className="fa-solid fa-circle-search"></i>Buscar
                    </button>  
                </div>
                <div className="container1 cont-boton">
                  <button className="este"><span class="fa-circle-plus lead mr-8">
                          account_circle</span></button>
                </div>
              </header>

            </div>
          </div>
        </div>
      <div className="container-fluid">
        

        <div className="container">
          <div className="row mt-5">
            {mascotas.map(mascota => (
            <div key={mascota.id} className="col-md-3 mb-3">
              <MascotaCard mascota={mascota}/>
              <div className="row mt-2">
                <div className="col-md-11 mb-11">
                    <button
                        onClick={()=>adoptarMascota(mascota.id,mascota.nombre)} 
                        className="btn btn-success col-md-5 mb-5">
                        <i className="fa-solid"></i>Adoptar
                      </button>
                      <button 
                          className="btn btn-warning col-md-5 mb-5"
                          ><i className="fa-solid"></i>Donar
                      </button>
                  </div>
              </div>
            </div>
            ))}  
          </div>
        </div>


      </div>
      <div id="modalMascotas" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{titulo}</label>
            </div>
            <div className="modal-body">
              <input type="hidden" id="id"></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="nombre"
                  className="form-control"
                  placeholder="Nombre"
                  value={nombre}
                  onChange={(e)=>setNombre(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="edad"
                  className="form-control"
                  placeholder="Edad"
                  value={edad}
                  onChange={(e)=>setEdad(e.target.value)}

                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="tipo_mascota"
                  className="form-control"
                  placeholder="Raza Mascota"
                  value={raza}
                  onChange={(e)=>setRaza(e.target.value)}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <i className="fa-solid fa-gift"></i>
                </span>
                <input
                  type="text"
                  id="tipo_mascota"
                  className="form-control"
                  placeholder="Perro o Gato"
                  value={tipo_mascota}
                  onChange={(e)=>setTipo_mascota(e.target.value)}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button onClick={()=>validar()} className="btn btn-success">
                  <i className="fa-solid fa-floppy-disk"></i>Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                id="btnCerrarModal"
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
        <button></button>
      </div>
    </div>
  );
};

//EXPORT
export default MascotasComponent;
