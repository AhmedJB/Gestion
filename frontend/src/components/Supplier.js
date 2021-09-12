import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file, logout } from "../helper";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import styled from "styled-components";
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Select from "react-dropdown-select";
import CustomSelect from "./CustomSelect";
import Modal from "./Modal";

function Supplier(props) {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const [Suppliers, setSuppliers] = useState([{
    name:'test'
  },{
    name:'test2'
  }]);

  const [open,setOpen] = useState(false);

  useEffect(() => {
    async function test() {
      let resp = await isLogged();
      console.log(resp);
      if (resp) {
        let obj = { ...User };
        obj.logged = true;
        obj.username = resp.username;
        obj.email = resp.email;
        setUser(obj);
        return obj;
      } else {
        logout(setUser, User);
      }
    }

    test().then((obj) => {
      setLoading(false);
      console.log(obj);
      if (props.location.state) {
        if (props.location.state.success) {
          addToast("connecté en tant que " + obj.username, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      }
    });
  }, []);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const NotFound = (
    <div className="not-found">
        <h2 className="error-text">Resultat : 0</h2>
        <FontAwesomeIcon icon={faExclamationCircle}  className="error-circle"/>
    </div>
  );


  const DataTable = (
      <Fragment>
          <div className="filtre-row seperate">
              {/* <select id="fourn-select">
                  <option value="0">Tout</option>
                  <option value="Test">Jhon</option>
              </select> */}

  

<CustomSelect options={Suppliers} changeFunc={(val) => alert(val)}
label="name" fvalue="name" placeholder="Choisir un Fournisseur" />
<button class='btn-main' onClick={() => {setOpen(!open)}}>Ajouter un Fournisseur</button>
          </div>
          <table id="status-table">
    <tbody>
      <tr>
        <th classname="date">Fournisseur</th>
        <th classname="task-title">Email</th>
        <th classname="status">Tel</th>
        <th classname="tel">Date</th>
      </tr>

      {Suppliers.map(e => {
        return (
          <tr>
        <td classname="date">{e.name}</td>
        <td classname="task-title">casa@gmail.com</td>
        <td classname="status">06524871234</td>
        <td classname="date">
          {new Date().toLocaleDateString("fr-FR", options)}
        </td>
      </tr>
        )
      })}
      
    </tbody>
  </table>
      </Fragment>
    

  );

  const html = (
    <Fragment>
      <Modal open={open} closeFunction = {setOpen}>
        <h1 className='title-modal'>Ajout de fournisseur</h1>
        <div className="modal-input">
          <label for="name">Fournisseur</label>
          <input type="text" id="name"></input>
          <label for="email">Email</label>
          <input type="text" id="email"></input>
          <label for="phone">Tel</label>
          <input type="text" id="phone"></input>

          <button id="submit">Creer</button>
        </div>
      </Modal>
      <AnimateNav />
      <section className="card Supplier">
        <h1 className="card-title text-center">Fournisseur</h1>

       {Suppliers.length == 0 ? NotFound : DataTable }

       
        {/* Data.tasks.map((e) => {
              return (
                <li className="row">
                  <span className="date">{e.date}</span>
                  <span className="task-title">{e.title}</span>
                  <span className="status">{e.status}</span>
                  <button
                    className={e.status != "done" ? "disabled" : "download"}
                    value={e.status != "done" ? "" : e.id}
                    onClick={e.status != "done" ? "" : download}
                    name={e.status != "done" ? "" : e.path}
                    disabled={e.status != "done" ? true : false}
                  >
                    Download
                  </button>
                </li>
              );
            }) */}
      </section>
    </Fragment>
  );

  const loader = (
    <div className="animation-container">
      <div className="lds-facebook">
        <div />
        <div />
        <div />
      </div>
    </div>
  );

  return loading ? (
    loader
  ) : User.logged ? (
    html
  ) : (
    <Redirect
      to={{
        pathname: "/app/login",
        state: { error: true, msg: "Please Login" },
      }}
    />
  );
}

export default Supplier;
