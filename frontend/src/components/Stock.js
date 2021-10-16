import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { isLogged, req, download_file,post_download_file, logout, postReq } from "../helper";
import styled from "styled-components";
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faExclamationCircle,
  faPrint,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import CustomSelect from "./CustomSelect";
import Checkbox from "@mui/material/Checkbox";
import Modal from "./Modal";

function Stock(props) {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [viewOptions, setView] = useState(false);
  const [ModifyOpen, setModify] = useState(false);
  const [ConfirmOpen, setConfirm] = useState(false);
  const [viewModify, setViewModify] = useState(false);
  const [printIDs,setPrintIDs] = useState([]);
  const [modifyData, setModifyData] = useState({
    fournisseur: "",
    product: {
      name: "",
      ptype: "",
      price_vente: "",
      price_achat: "",
      quantity: "",
      place: "",
      paid: "",
    },
    options: {
      metal: "",
      type: "",
    },
  });
  const names = {
    eau: "Radiateur Eau",
    air: "Radiateur Air",
    clime: "Radiateur Clime",
    chauf: "Radiateur Chauffage",
    bonchon : "Bonchon",
    maneau : "Maneau",
    Deurite : "Deurite",
    antifel :"Antifèlle",
    fref :"Fréférant",
    termonstat :"Termonstat"
  };
  const [Products, setProduct] = useState([]);

  const [Metal, setMetal] = useState([
    {
      name: "Cuivre",
      value: "cuivre",
    },
    {
      name: "Alimunium",
      value: "aluminium",
    },
  ]);

  const [Options, setOptions] = useState([
    {
      name: names["eau"],
      value: "eau",
    },
    {
      name: names["air"],
      value: "air",
    },
    {
      name: names["clime"],
      value: "clime",
    },
    {
      name: names["chauf"],
      value: "chauf",
    },
    {
      name: names["bonchon"],
      value: "bonchon",
    }
    ,
    {
      name: names["maneau"],
      value: "maneau",
    }
    ,
    {
      name: names["Deurite"],
      value: "Deurite",
    }
    ,
    {
      name: names["antifel"],
      value: "antifel",
    }
    ,
    {
      name: names["fref"],
      value: "fref",
    }
    ,
    {
      name: names["termonstat"],
      value: "termonstat",
    }
  ]);

  const [Place, setPlace] = useState([
    {
      name: "Depot",
      value: 0,
    },
    {
      name: "Comptoire",
      value: 1,
    },
  ]);

  const [Body, setBody] = useState({
    fournisseur: "",
    product: {
      name: "",
      ptype: "",
      price_vente: "",
      price_achat: "",
      quantity: "",
      place: "",
    },
    options: {
      metal: "",
      type: "",
    },
  });

  useEffect(() => {
    async function test() {
      let resp = await isLogged();
      //console.log(resp);
      if (resp) {
        let obj = { ...User };
        obj.logged = true;
        obj.username = resp.username;
        obj.email = resp.email;
        setUser(obj);
        await updateData();

        return obj;
      } else {
        logout(setUser, User);
      }
    }

    test().then((obj) => {
      setLoading(false);
      //console.log(obj);
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

  async function updateProducts() {
    let pResp = await req("product");
    let obj = { ...Data };
    obj.Products = pResp;
    setProduct(pResp);
    setData(obj);
    return true;
  }

  async function updateData() {
    let supResp = await req("provider");
    let Prods = await req("product");
    let obj2 = { ...Data };
    obj2.Suppliers = supResp;
    obj2.Products = Prods;
    setData(obj2);
    setProduct(Prods);
    return true;
  }

  function formatPrice(e) {
    let t = e.target;

    t.value = t.value.split(" ")[0].replace(",", ".") + " DH";
  }

  function handleProvider(ps) {
    let body = { ...Body };
    if (ps == "") {
      body.fournisseur = "";
    } else {
      let p = ps[0];
      body.fournisseur = p.id;
    }

    setBody(body);
  }

  function handleOption(vs) {
    let body = { ...Body };
    let v = vs[0];
    if ( v){
      if (v.value == "eau") {
        setView(true);
        body.product.ptype = v.value;
      } else {
        setView(false);
        body.product.ptype = v.value;
        body.options.metal = "";
        body.options.type = "";
      }
    }else{
      setView(false);
      body.product.ptype = 0;
      body.options.metal = "";
      body.options.type = "";
    }
    
    setBody(body);
  }

  function handlePlace(ps) {
    let body = { ...Body };
    if (ps == "") {
      body.product.place = 0;
    } else {
      body.product.place = ps[0].value;
    }
    setBody(body);
  }

  function handlePlacev2(ps) {
    let body = { ...modifyData };
    if (ps == "") {
      body.product.place = 0;
    } else {
      body.product.place = ps[0].value;
    }
    setModifyData(body);
  }

  function handleMetal(ms) {
    let body = { ...Body };
    if (ms == "") {
      body.options.metal = "";
    } else {
      let m = ms[0];
      body.options.metal = m.value;
    }
    setBody(body);
  }

  function handleProviderv2(ps) {
    let body = { ...modifyData };
    if (ps == "") {
      body.fournisseur = "";
    } else {
      let p = ps[0];
      body.fournisseur = p;
    }

    setModifyData(body);
  }

  function handleOptionv2(vs) {
    let body = { ...modifyData };
    let v = vs[0];
    if (v.value == "eau") {
      setViewModify(true);

      body.product.ptype = v.value;
    } else {
      setViewModify(false);
      body.product.ptype = v.value;
      body.options.metal = "";
      body.options.type = "";
    }
    //console.log(body);
    setModifyData(body);
  }

  function handleMetalv2(ms) {
    let body = { ...modifyData };
    if (ms == "") {
      body.options.metal = "";
    } else {
      let m = ms[0];
      body.options.metal = m.value;
    }
    setModifyData(body);
  }

  function handleOpen() {
    setView(false);
    setBody({
      fournisseur: "",
      product: {
        name: "",
        ptype: "",
        price_vente: "",
        price_achat: "",
        quantity: "",
      },
      options: {
        metal: "",
        type: "",
      },
    });
    setOpen(!open);
  }

  async function CreateProduct() {
    let body = { ...Body };
    body.product.name = document.getElementById("name").value;

    if (body.product.ptype == "eau") {
      body.options.type = document.getElementById("type").value;
    }

    body.product.price_achat = document
      .getElementById("achat")
      .value.split(" ")[0];
    body.product.price_vente = document
      .getElementById("vente")
      .value.split(" ")[0];
    body.product.quantity = document.getElementById("qt").value;
    body.product.paid = document.getElementById("paid").value.split(" ")[0];

    setBody(body);

    let resp = await postReq("product", body);
    if (resp) {
      addToast("Succès", {
        appearance: "success",
        autoDismiss: true,
      });
      //console.log(resp);
      updateProducts();
      //updateSuppliers();
    } else {
      addToast("Erreur", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  function getSupp(id) {
    if (id) {
      let supp = Data.Suppliers.filter((e) => e.id == id)[0];
      return supp.name;
    }
  }

  function getarray(key1) {
    let arr = [];
    for (let i = 0; i < Products.length; i++) {
      let temp = Products[i][key1];
      let found = false;
      let q = temp.quantity;
      for (let j  = arr.length-1 ; j >= 0;j--){
        if (arr[j].name == temp.name  && !found){
          q +=  arr[j].total_quantity
          found = true
        }
        if (arr[j].name == temp.name){
          arr[j].total_quantity =  q;
          arr[j].total_name =  arr[j].name + " ("+q+")";
        }
        
      }
      temp.total_quantity = q
      temp.total_name = temp.name+" ("+q+")";
      arr.push(temp);
    }
    console.log(arr);
    return arr;
  }

  function filterCat(cs) {
    if (cs == "") {
      updateProducts();
    } else {
      let arr = [];
      let v = cs[0];

      for (let i = 0; i < Products.length; i++) {
        if (Products[i].product.ptype == v.value) {
          arr.push(Products[i]);
        }
      }
      setProduct(arr);
    }
  }

  function filterProduct(vs) {
    if (vs == "") {
      updateProducts();
    } else {
      let arr = [];
      let v = vs[0];
      for (let i = 0; i < Products.length; i++) {
        if (Products[i].product.p_id == v.p_id) {
          arr.push(Products[i]);
        }
      }
      setProduct(arr);
    }
  }

  function filterProductName(vs) {
    if (vs == "") {
      updateProducts();
    } else {
      let arr = [];
      let v = vs[0];
      for (let i = 0; i < Products.length; i++) {
        if (Products[i].product.name == v.name) {
          arr.push(Products[i]);
        }
      }
      setProduct(arr);
    }
  }

  function filterFournisseur(fs) {
    if (fs == "") {
      updateProducts();
    } else {
      let arr = [];
      let f = fs[0];
      for (let i = 0; i < Products.length; i++) {
        if (Products[i].fournisseur.id == f.id) {
          arr.push(Products[i]);
        }
      }
      setProduct(arr);
    }
  }

  function filterPlace(ps) {
    if (ps == "") {
      updateProducts();
    } else {
      let arr = [];
      let p = ps[0];
      //console.log(p);
      for (let i = 0; i < Products.length; i++) {
        if (Products[i].product.place == p.value) {
          arr.push(Products[i]);
        }
      }
      setProduct(arr);
    }
  }

  async function modify(id) {
    setModify(!ModifyOpen);
    let mod = Products.filter((e) => e.product.p_id == id)[0];
    //console.log(mod);
    if (mod.product.ptype == "eau") {
      setViewModify(true);
    } else {
      setViewModify(false);
    }
    setModifyData(mod);
    //let resp = await modifySupplier(id);
  }

  async function delData(id){
    setConfirm(!ConfirmOpen)
    let mod = Products.filter((e) => e.product.p_id == id)[0];
    //console.log(mod);
    if (mod.product.ptype == "eau") {
      setViewModify(true);
    } else {
      setViewModify(false);
    }
    setModifyData(mod);
  }

  async function del(id) {
    let resp = await req("modproduct/" + String(id));
    let p = Products.filter((e) => e.product.p_id == id)[0];
    if (resp) {
      addToast("Produit " + p.product.name + " a ete supprime", {
        appearance: "success",
        autoDismiss: true,
      });
      updateData();
      setConfirm(!ConfirmOpen);
    }
  }

  async function ModifyProduct(id) {
    let body = { ...modifyData };
    body.product.name = document.getElementById("name").value;

    if (body.product.ptype == "eau") {
      body.options.type = document.getElementById("type").value;
    }

    body.product.price_achat = document
      .getElementById("achat")
      .value.split(" ")[0];
    body.product.price_vente = document
      .getElementById("vente")
      .value.split(" ")[0];
    body.product.quantity = document.getElementById("qt").value;
    body.product.paid = document.getElementById("paid").value.split(" ")[0];

    setModifyData(body);

    let resp = await postReq("modproduct/" + body.product.p_id, body);
    if (resp) {
      addToast("Succès", {
        appearance: "success",
        autoDismiss: true,
      });
      //console.log(resp);
      updateData();
      //updateSuppliers();
    } else {
      addToast("Erreur", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  function checkChange(checked,val) {
    //console.log(checked)
    //console.log(val)
    let copy = [...printIDs]
    if (checked){
      if (val != 'all'){
        copy.push(val);
      }else{
        copy = Products.map(e => [e.product.name,e.product.p_id,e.product.quantity])

      }
      
    }else{
      if (val != 'all'){
      let index = printIDs.findIndex((i) => i == val);
      //console.log('value is ' + index)
      copy.splice(index,1);
      }else{
        copy = []
      }
    }
    //console.log(copy);
    setPrintIDs(copy);
    
  }


  async function print(){
    let resp = await post_download_file('downloadbr','barcode.pdf',printIDs);
    if (resp) {
      addToast("Fichier Barcode a ete telechare", {
        appearance: "success",
        autoDismiss: true,
      });
      setPrintIDs([]);
    } else {
      addToast("Erreur", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  const NotFound = (
    <div className="not-found">
      <h2 className="error-text">Resultat : 0</h2>
      <FontAwesomeIcon icon={faExclamationCircle} className="error-circle" />
    </div>
  );

  const DataTable = (
    <Fragment>
      <div id="table-wrapper">
      <table id="status-table">
        <tbody>
          <tr>
            <th>
              <Checkbox
                checked={printIDs.length == Products.length ? true : false}
                onChange={(t) => {checkChange(t.target.checked,'all')}}
                sx={{
                  color: "#b187ff",
                  "&.Mui-checked": {
                    color: "#b187ff",
                  },
                }}
              />
            </th>
            <th classname="date">ID</th>
            <th classname="task-title">Nom du Produit</th>
            <th classname="status">Categorie</th>
            {/*  <th>Metal</th>
          <th classname="tel">Type</th> */}
            <th>Quantite</th>
            {/* <th classname="tel">Prix Achat</th> */}
            <th classname="tel">Prix Vente</th>
            {/* <th>Montant Payé</th> */}
            <th classname="tel">Fournisseur</th>
            <th></th>
            <th onClick={print} >
              <FontAwesomeIcon icon={faPrint} className="trash" />{" "}
              {/* <button className="factsubmit" id="submit">Imprimer</button> */}
            </th>
          </tr>

          {Products.map((e) => {
            //console.log(e);
            return (
              <tr>
                <td>
                  <Checkbox
                    checked={printIDs.findIndex(r => r[1] == e.product.p_id) != -1 ? true : false}
                    onChange={(t) => {
                      checkChange(t.target.checked,[e.product.name,e.product.p_id,e.product.quantity]);
                    }}
                    sx={{
                      color: "#b187ff",
                      "&.Mui-checked": {
                        color: "#b187ff",
                      },
                    }}
                  />
                </td>
                <td>{e.product.p_id}</td>
                <td classname="date">{e.product.name}</td>
                <td classname="task-title">{names[e.product.ptype]}</td>
                {/* <td classname="status">{e.options.metal}</td>
          <td classname="date">
            {e.options.type}
          </td> */}
                <td classname="status">{e.product.quantity}</td>
                {/* <td classname="status">{e.product.price_achat + ' DH'}</td> */}
                <td classname="status">{e.product.price_vente + " DH"}</td>
                {/* <td>{e.product.paid + ' DH'}</td> */}
                <td classname="status">{getSupp(e.fournisseur.id)}</td>
                <td className="edit" onClick={() => modify(e.product.p_id)}>
                  <FontAwesomeIcon icon={faEdit} className="trash" />
                </td>
                <td
                  onClick={() => {
                    //del(e.product.p_id);
                    delData(e.product.p_id);
                  }}
                  className="delete"
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="trash" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </Fragment>
  );

  const html = (
    <Fragment>
      <Modal open={ConfirmOpen} closeFunction={setConfirm}>
        <h1 className="title-modal m20">{"Voulez-vous supprimer le produit "+modifyData.product.name +" ?"}</h1>
        <div className='modal-input-row'>
        <button onClick={() => {
                    del(modifyData.product.p_id);
                    //delData(e.product.p_id);
                  }} className="factsubmit" id="submit">Supprimer</button>
        </div>
      </Modal>

      <Modal open={ModifyOpen} closeFunction={setModify}>
        <h1 className="title-modal m20">Modification de Produit</h1>
        <div className="modal-input">
          <div className="modal-input-row">
            <CustomSelect
              options={Data.Suppliers}
              changeFunc={handleProviderv2}
              label="name"
              multi={false}
              values={[modifyData.fournisseur]}
              fvalue="id"
              placeholder="Choisir un Fournisseur"
            />
            <CustomSelect
              options={Options}
              changeFunc={handleOptionv2}
              label="name"
              fvalue="value"
              values={[
                Options.find((opt) => opt.value == modifyData.product.ptype),
              ]}
              placeholder="Choisir un Produit"
            />
            {/* <CustomSelect options={Place}  changeFunc={handlePlacev2}
  label="name" fvalue="value" values={[Place.find(opt => opt.value  == modifyData.product.place)]} placeholder="Choisir une Place" /> */}
          </div>

          <div className="input-wrapper">
            <label for="name">Nom du produit</label>
            <input
              type="text"
              id="name"
              defaultValue={modifyData.product.name}
            ></input>
          </div>
          {viewModify && (
            <div className="input-wrapper">
              <label for="type">Type</label>
              <CustomSelect
                options={Metal}
                changeFunc={handleMetalv2}
                label="name"
                fvalue="value"
                values={
                  modifyData.options.metal == ""
                    ? []
                    : [
                        Metal.find(
                          (opt) => opt.value == modifyData.options.metal
                        ),
                      ]
                }
                clas="CustomSelectMargin"
                placeholder="Choisir un Metal"
              />

              <input
                type="text"
                defaultValue={modifyData.options.type}
                id="type"
              ></input>
            </div>
          )}

          <div className="modal-input-row">
            <div className="modal-input-row">
              <div className="input-wrapper">
                <label for="qt">Quantite</label>
                <input
                  type="number"
                  defaultValue={modifyData.product.quantity}
                  id="qt"
                ></input>
              </div>
            </div>

            <div className="modal-input-row">
              <div className="input-wrapper">
                <label for="achat">Prix Achat</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  defaultValue={modifyData.product.price_achat}
                  onBlur={formatPrice}
                  id="achat"
                ></input>
              </div>
              <div className="input-wrapper">
                <label for="vente">Prix Vente</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  defaultValue={modifyData.product.price_vente}
                  onBlur={formatPrice}
                  id="vente"
                ></input>
              </div>
              <div className="input-wrapper">
                <label for="vente">Montant Payé</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  defaultValue={modifyData.product.paid}
                  onBlur={formatPrice}
                  id="paid"
                ></input>
              </div>
            </div>
          </div>

          <button id="submit" onClick={ModifyProduct} className="modalSubmit">
            Modifier
          </button>
        </div>
      </Modal>

      <Modal open={open} closeFunction={setOpen}>
        <h1 className="title-modal m20">Ajout de Produit</h1>
        <div className="modal-input">
          <div className="modal-input-row">
            <CustomSelect
              options={Data.Suppliers}
              changeFunc={handleProvider}
              label="name"
              multi={false}
              fvalue="id"
              placeholder="Choisir un Fournisseur"
            />
            <CustomSelect
              options={Options}
              changeFunc={handleOption}
              label="name"
              fvalue="value"
              placeholder="Choisir un Produit"
            />
            {/* <CustomSelect options={Place}  changeFunc={handlePlace}
  label="name" fvalue="value"  placeholder="Choisir une Place" /> */}
          </div>

          <div className="input-wrapper">
            <label for="name">Nom du produit</label>
            <input type="text" id="name"></input>
          </div>
          {viewOptions && (
            <div className="input-wrapper">
              <label for="type">Type</label>
              <CustomSelect
                options={Metal}
                changeFunc={handleMetal}
                label="name"
                fvalue="value"
                clas="CustomSelectMargin"
                placeholder="Choisir un Metal"
              />

              <input type="text" id="type"></input>
            </div>
          )}

          <div className="modal-input-row">
            <div className="modal-input-row">
              <div className="input-wrapper">
                <label for="qt">Quantite</label>
                <input type="number" id="qt"></input>
              </div>
            </div>

            <div className="modal-input-row">
              <div className="input-wrapper">
                <label for="achat">Prix Achat</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  onBlur={formatPrice}
                  id="achat"
                ></input>
              </div>
              <div className="input-wrapper">
                <label for="vente">Prix Vente</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  onBlur={formatPrice}
                  id="vente"
                ></input>
              </div>
              <div className="input-wrapper">
                <label for="vente">Montant Payé</label>
                <input
                  type="text"
                  placeholder="0 DH"
                  onBlur={formatPrice}
                  id="paid"
                ></input>
              </div>
            </div>
          </div>

          <button id="submit" onClick={CreateProduct} className="modalSubmit">
            Creer
          </button>
        </div>
      </Modal>
      <AnimateNav />
      <section className="card Supplier">
        <h1 className="card-title text-center">Stock</h1>
        <div className="filtre-row">
          <div className="filtre-group">
            <CustomSelect
              options={Data.Suppliers}
              changeFunc={filterFournisseur}
              label="name"
              fvalue="id"
              searchBy="name"
              placeholder="Choisir un Fournisseur"
            />
            <CustomSelect
              options={Options}
              changeFunc={filterCat}
              label="name"
              fvalue="name"
              placeholder="Choisir une Categorie"
            />
            {/* <CustomSelect options={Place} changeFunc={filterPlace}
  label="name" fvalue="value" placeholder="Choisir une Place" /> */}
            <CustomSelect
              options={getarray("product")}
              changeFunc={filterProduct}
              label="p_id"
              fvalue="p_id"
              placeholder="Choisir un ID"
            />
            <CustomSelect
              options={getarray("product")}
              changeFunc={filterProductName}
              label="total_name"
              fvalue="p_id"
              placeholder="Choisir un produit"
            />
          </div>

          <button
            class="btn-main"
            onClick={() => {
              handleOpen();
            }}
          >
            Ajouter un Produit
          </button>
        </div>

        {Products.length == 0 ? NotFound : DataTable}
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
