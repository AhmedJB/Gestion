import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { isLogged, req, download_file, logout } from "../helper";
import styled from 'styled-components';
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "./CustomSelect";
import Modal from "./Modal";



function Stock(props) {
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(true);
    const [User, setUser] = useContext(UserContext);
    const [Data, setData] = useContext(DataContext);
    const [open,setOpen] = useState(false);
    const [viewOptions,setView] = useState(false);
    const names = {
        'eau': 'Radiateur Eau',
        'air': 'Radiateur Air',
        'clime': 'Radiateur Clime',
        'chauf': 'Radiateur Chauffage'
    }
    const [Filter, setFilter] = useState({
        fournisseur: '',

    })
    const [Products, setProduct] = useState([
        {
            id:0,
            fournisseur: 'testf',
            prodname : 'test',
            ptype : 'eau',
            Sell : '20',
            Achat : '15',
            options : {
                metal : '',
                ref : '',
                type : ''
            }
        },
        {
            id:1,
            fournisseur: 'testf2',
            prodname : 'test2',
            ptype : 'air',
            Sell : '20',
            Achat : '15',
            options : {
                metal : 'test',
                ref : '',
                type : ''
            }
        },
        {
            id:2,
            fournisseur: 'testf2',
            prodname : 'test2',
            ptype : 'clime',
            Sell : '20',
            Achat : '15',
            options : {
                metal : '',
                ref : '',
                type : ''
            }
        }
    ]);

    const [Options, setOptions] = useState([
        {
            name:names['eau'],
            value:'eau'
        },
        {
            name:names['air'],
            value:'air'
        },
        {
            name:names['clime'],
            value:'clime'
        },
        {
            name:names['chauf'],
            value:'chauf'
        },
        
    ]);


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



      function SelectProvider(){
        console.log('selected')
      }


    const NotFound = (
        <div className="not-found">
            <h2 className="error-text">Resultat : 0</h2>
            <FontAwesomeIcon icon={faExclamationCircle}  className="error-circle"/>
        </div>
      );

    const DataTable = (
        <Fragment>
            <div className="filtre-row seperate">
                <div className='filtre-group'>
                <CustomSelect options={Products} changeFunc={(val) => alert(val)}
  label="fournisseur" fvalue="fournisseur" placeholder="Choisir un Fournisseur" />
                    <CustomSelect options={Options} changeFunc={(val) => alert(val)}
  label="name" fvalue="value" placeholder="Choisir un Produit" />


                </div>
  
  <button class='btn-main' onClick={() => {setOpen(!open)}}>Ajouter un Produit</button>
            </div>
            <table id="status-table">
      <tbody>
        <tr>
          <th classname="date">Fournisseur</th>
          <th classname="task-title">Nom du Produit</th>
          <th classname="status">Type</th>
          <th classname="tel">Prix Vente</th>
          <th classname="tel">Prix Achat</th>
          <th classname="tel">Metal</th>
          <th classname="tel">Reference</th>
          <th classname="tel">type de tube</th>
        </tr>
  
        {Products.map(e => {
          return (
            <tr key={e.id}>
          <td classname="date">{e.fournisseur}</td>
          <td classname="task-title">{e.prodname}</td>
          <td classname="status">{e.ptype}</td>
          <td classname="date">
            {e.Sell}
          </td>
          <td classname="status">{e.Achat}</td>
          <td classname="status">{e.options.metal}</td>
          <td classname="status">{e.options.ref}</td>
          <td classname="status">{e.options.type}</td>
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
            <CustomSelect options={Data.Suppliers} changeFunc={SelectProvider}
label="name" multi={true} fvalue="id" placeholder="Choisir un Fournisseur" />
              <label for="email">Email</label>
              <input type="text" id="email"></input>
              <label for="phone">Tel</label>
              <input type="text" id="phone"></input>
    
              <button id="submit">Creer</button>
            </div>
          </Modal>
          <AnimateNav />
          <section className="card Supplier">
            <h1 className="card-title text-center">Stock</h1>
    
           {Products.length == 0 ? NotFound : DataTable }
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



export default Stock;