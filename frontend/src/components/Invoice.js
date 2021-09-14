import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file, logout,postReq } from "../helper";
import { Redirect } from "react-router-dom";
import AnimateNav from "./AnimateNav";
import { useToasts } from "react-toast-notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExclamationCircle, faMicrophoneAltSlash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";



function Invoice(props){
	const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);

  const [Factures, setFactures] = useState([]);

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
        await updateInvoices();
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


  async function updateInvoices(){
	let resp = await req('invoices');
	if (resp){
		console.log(resp);
		setFactures(resp);
	}
  }

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

  async function download(e) {
	let resp = await download_file('download/'+String(e.f_id),e.f_id+".pdf");
	if (resp) {
	  addToast("Facture " + String(e.f_id) +" a ete telecharge", {
		appearance: "success",
		autoDismiss: true,
	  });
	} else {
	  addToast("erreur", {
		appearance: "error",
		autoDismiss: true,
	  });
	}
	
	

}


  const DataTable = (
	<Fragment>
		
		<table id="status-table">
  <tbody>
	<tr>
	  <th className="date">Facture</th>
	  <th classname="task-title">Date de creation</th>
	  <th classname="tel"></th>
	</tr>

	{Factures.map(e => {
	  return (
		<tr>
	  <td className="date">{e.f_id}</td>
	  <td className="task-title">{new Date(e.date).toLocaleDateString("fr-FR", options)}</td>
	  <td className="status"><button onClick={() => {download(e)}} className="factsubmit" id="submit">Telecharger</button></td>
	  
	</tr>
	  )
	})}
	
  </tbody>
</table>
	</Fragment>);

const html = (
    <Fragment>
      
      <AnimateNav />
      <section className="card Supplier">
        <h1 className="card-title text-center">Factures</h1>


       {Factures.length == 0 ? NotFound : DataTable }
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




export default Invoice;