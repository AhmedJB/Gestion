import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file, logout,postReq } from "../helper";
import { Redirect } from "react-router-dom";
import AnimateNav from "./AnimateNav";
import { useToasts } from "react-toast-notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExclamationCircle, faMicrophoneAltSlash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";




function HistoryV(props){
	const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const [selectedDate, handleDateChange] = useState(new Date());

  const [Orders, setOrders] = useState([]);


  

const materialTheme = createTheme({
  overrides: {
    
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "#282828",
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        /* backgroundColor: "#000",
        color: "white", */
      },
    },
    MuiPickersDay: {
      day: {
        color: "#000",
        
      },
      daySelected: {
        backgroundColor: "#b187ff",
        '&:hover': {
          background: "##5900ff",
       }
      },
      dayDisabled: {
        color: "#ff0000",
      },
      current: {
        color: "#b187ff",
        '&:hover': {
          background: "##5900ff",
        }
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: "#000",
      },
    },
  },
});

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
        await updateOrders();
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


  async function updateOrders(){
	let resp = await req('invoices');
	if (resp){
		console.log(resp);
		setOrders(resp);
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

	{Orders.map(e => {
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
        <h1 className="card-title text-center">Orders</h1>
        <div className="filtre-row seperate">
        <ThemeProvider theme={materialTheme}>
        <DatePicker
        variant="inline"
        label="Date Debut"
        value={selectedDate}
        onChange={handleDateChange}
      />
      </ThemeProvider>
      <ThemeProvider theme={materialTheme}>
<DatePicker
        variant="inline"
        label="Date Fin"
        value={selectedDate}
        onChange={handleDateChange}
      />
      </ThemeProvider>
          
          

          </div>


       {Orders.length == 0 ? NotFound : DataTable }
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




export default HistoryV;