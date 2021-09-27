import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req,req_body, download_file, logout,postReq } from "../helper";
import { Redirect } from "react-router-dom";
import AnimateNav from "./AnimateNav";
import { useToasts } from "react-toast-notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faExclamationCircle, faMicrophoneAltSlash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import { createTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { Preview, print } from 'react-html2pdf';
import Modal from "./Modal";
import "../../static/frontend/invoice.css"



function HistoryV(props){
	const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const [startDate, handleDateChange] = useState(new Date(new Date().getTime() - (24 * 60 * 60 * 1000)));
  const [endDate,handleEndChange] = useState(new Date());
  const [Details,setDetails] = useState([]);
  const [Open,setOpen] = useState(false);
  const [Orders, setOrders] = useState([]);
  const [SelectedOrder,setSelectedOrder] = useState({
    client:{},
    order: {},
    details : []
  });
  const [PaymentOptions, setPaymentOptins] = useState([
    {
      name: 'cash',
      id: 0
    },
    {
      name: 'cheque',
      id: 1
    },
    {
      name: 'effet',
      id: 2
    },
    {
      name: 'versement',
      id: 3
    }
  ])

  function getOption(id){
    for (let i =0; i < PaymentOptions.length ; i++){
      if(PaymentOptions[i].id == id){
        return PaymentOptions[i].name
      }
    }
  }


  

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

  function changeStart(date){
    console.log(date);
    handleDateChange(date);
    updateOrders(date,null);
  }

  function changeEnd(date){
    console.log(date);
    handleEndChange(date);
    updateOrders(null,date);
  }

  async function updateOrders(startdate=null , enddate = null){
    if (!startdate){
      startdate = startDate
    }

    if (!enddate){
      enddate = endDate
    }


    let body = {
      startdate,
      enddate
    }
    let resp = await postReq('filterorder',body);
    if (resp){
      setOrders(resp);
    }
  }



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

function getOrder(id){
  for(let i =0 ; i < Orders.length ; i++){
    if (Orders[i].order.id == id){
      return Orders[i]
    }
  }
}


function downloadFact(){
  

  print(SelectedOrder.order.o_id, 'jsx-template')
}

function downloadBon(){
  print(SelectedOrder.order.o_id, 'jsx-template-2')
}

function updateData(id){
  let order = getOrder(id);
  console.log(order);
  setSelectedOrder(order);
}

function clearData(){
  setSelectedOrder({
    client:{},
    order: {},
    details : []
  });
}

function setOrderDetails(id){
  let order = getOrder(id);
  console.log(order);
  setDetails(order.details)
  setOpen(!Open);
}



const bon = (
  <div id="invoice" className="page" size="A4">
  <div className="top-padding">
    <section className="top-content bb d-flex justify-content-between">
      <div className="logo-facture">
        <img src="/static/pics/LOGO-1.png" alt className="img-fluid" />
      </div>
      <img id="watermark" src="/static/pics/LOGOa.png" />
      {/* <div className="top-left">
        <div className="graphic-path">
          <p id="bon-title">Bon De livraison</p>
        </div>
      </div> */}
    </section>
    <section className="store-user mt-5">
      <div className="col-12 center-elem">
        <p>Bon De livraison N<sup>°</sup>: <span>#{SelectedOrder.order.o_id}</span></p>
      </div>
      <div className="col-10">
        <div className="row-custom pb-3">
          <div>
            <p>Client,</p>
            <h2 id="client">{SelectedOrder.client.name}</h2>
          </div>
          <div>
            <p>Le,</p>
            <h2>{ (new Date(SelectedOrder.order.date)).getUTCDate()+'-'+((new Date(SelectedOrder.order.date)).getUTCMonth() + 1)+'-'+(new Date(SelectedOrder.order.date)).getUTCFullYear()}</h2>
          </div>
        </div>
      </div>
    </section>
    <section className="product-area mt-4">
      <table id="fact-table" className="table table-hover">
        <thead>
          <tr>
            <td>Quantite</td>
            <td>Designation</td>
            <td>P.U</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {SelectedOrder.details.map((e) => {
            return (
<tr>
            <td>{e.quantity}</td>
            <td>
              <div className="media">
                <div className="media-body">
                  <p className="mt-0 title">{e.product_name}</p>
                </div>
              </div>
            </td>
            <td>{e.prix}DH</td>
            <td>{e.prix * e.quantity}DH</td>
          </tr>
            )
          })}
          
          
        </tbody><tfoot>
        
          <tr>
            <td />
            <td />
            <td className="bord">Total HT:</td>
            <td className="bord">{SelectedOrder.order.total}DH</td>
          </tr>
        </tfoot>
      </table>
    </section>
    <section className="balance-info">
      <div className="">
        <div className="col-8">
          <p className="m-0 font-weight-bold note"> Note: <span>Reconnaît avoir recu conforme à la livraison ci-dessus</span> </p>
          <p />
        </div>
        
      </div>
    </section>
    {/* Cart BG */}
   {/*  <img src="/static/pics/cart.jpg" className="img-fluid cart-bg" alt /> */}
    <footer id="footer-facture">
      <hr />
      <p className="m-0 text-center  colortext">
        10 Lot Baraka Wiam Bensouda Mag 3 ‐ Fès / GSM: 06 61 08 56 62
      </p>
      <br />
      <span className="email">
        <span>Email: najate.radiateur@yahoo.fr</span>
      </span>
      <br />
      <div className="social">
        <span className="pr-2">
          <span>TP: 13439808</span>
        </span>
        <span className="pr-2">
          <span>IF: 15163065</span>
        </span>
        <span className="pr-2">
          <span>RC: 43697</span>
        </span>
        <span className="pr-2">
          <span>CNSS: 9961659</span>
        </span>
        <span className="pr-2">
          <span>ICE: 000010730000029</span>
        </span>
      </div>
    </footer>
  </div>
</div>

)



const template = (
  <div id="invoice" className="page" size="A4">
  <div className='top-padding'>
    <section className="top-content bb d-flex justify-content-between">
      <div className="logo-facture">
        <img src="/static/pics/LOGO-1.png" alt className="img-fluid" />
      </div>
      <img id="watermark" src="/static/pics/LOGOa.png" />
      {/* <div className="top-left">
        <div className="graphic-path">
          <p>Facture</p>
        </div>
      </div> */}
    </section>
    <section className="store-user mt-5">
      <div className="col-12 center-elem">
        <p>Facture N<sup>°</sup>: <span>#{SelectedOrder.order.o_id}</span></p>
      </div>
      <div className="col-10">
        <div className="row-custom pb-3">
          <div>
            <p>Client,</p>
            <h2 id="client">{SelectedOrder.client.name}</h2>
          </div>
          <div>
            <p>Le,</p>
            <h2>{ (new Date(SelectedOrder.order.date)).getUTCDate()+'-'+((new Date(SelectedOrder.order.date)).getUTCMonth() + 1)+'-'+(new Date(SelectedOrder.order.date)).getUTCFullYear()}</h2>
          </div>
        </div>
      </div>
    </section>
    <section className="product-area mt-4">
      <table id="fact-table" className="table table-hover">
        <thead>
          <tr>
            <td>Quantite</td>
            <td>Designation</td>
            <td>P.U</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {SelectedOrder.details.map((e) => {
            return (
<tr>
            <td>{e.quantity}</td>
            <td>
              <div className="media">
                <div className="media-body">
                  <p className="mt-0 title">{e.product_name}</p>
                </div>
              </div>
            </td>
            <td>{e.prix}DH</td>
            <td>{e.prix * e.quantity}DH</td>
          </tr>
            )
          })}
          
          
        </tbody><tfoot>
          <tr>
            <td />
            <td />
            <td>Total HT:</td>
            <td>{SelectedOrder.order.total}DH</td>
          </tr>
          <tr>
            <td />
            <td />
            <td>TVA 20%:</td>
            <td>{SelectedOrder.order.total * 20 / 100}DH</td>
          </tr>
          <tr>
            <td />
            <td />
            <td className="bord">Total TTC:</td>
            <td className="bord">{SelectedOrder.order.total + (SelectedOrder.order.total * 20 / 100)}DH</td>
          </tr>
        </tfoot>
      </table>
    </section>
    <section className="balance-info">
      <div className="">
        <div className="col-8">
          <p className="m-0 font-weight-bold note"> Note: <span>Reconnaît avoir recu conforme à la livraison ci-dessus</span> </p>
          <p />
        </div>
        {/* <div class="col-4">
            <table class="table total border-0 table-hover">
                <tr>
                    <td>Total HT:</td>
                    <td>1000DH</td>
                </tr>
                <tr>
                    <td>TVA 20%:</td>
                    <td>200DH</td>
                </tr>
                <tfoot>
                    <tr>
                        <td>Total TTC:</td>
                        <td>1200DH</td>
                    </tr>
                </tfoot>
            </table>

             Signature 
        </div> */}
      </div>
    </section>
    {/* Cart BG */}
   {/*  <img src="/static/pics/cart.jpg" className="img-fluid cart-bg" alt /> */}
    <footer id="footer-facture">
      <hr />
      <p className="m-0 text-center colortext">
        10 Lot Baraka Wiam Bensouda Mag 3 ‐ Fès / GSM: 06 61 08 56 62
      </p>
      <br />
      <span className="email">
        <span>Email: najate.radiateur@yahoo.fr</span>
      </span>
      <br />
      <div className="social">
        <span className="pr-2">
          <span>TP: 13439808</span>
        </span>
        <span className="pr-2">
          <span>IF: 15163065</span>
        </span>
        <span className="pr-2">
          <span>RC: 43697</span>
        </span>
        <span className="pr-2">
          <span>CNSS: 9961659</span>
        </span>
        <span className="pr-2">
          <span>ICE: 000010730000029</span>
        </span>
      </div>
    </footer>
  </div>
</div>

)

  const DataTable = (
	<Fragment>
    {SelectedOrder.order.id ? <div id="exportPdf" >
    <Preview id={'jsx-template-2'} >
    {bon}
    </Preview>
    <Preview id={'jsx-template'} >
    {template}
    </Preview>
    </div> : ''}
    
		
		<table id="status-table">
  <tbody>
	<tr>
	  <th className="date">N&deg; Commande</th>
	  <th classname="task-title">Client</th>
	  <th classname="tel">Total</th>
    <th classname="tel">Credit</th>
    <th>Mode Paiement</th>
    <th>Date</th>
    <th>Facture</th>
    <th>Bon</th>
    <th></th>
	</tr>

	{Orders.map(e => {
	  return (
		<tr>
	  <td className="date">{e.order.o_id}</td>
    <td>{e.client.name}</td>
    <td>{e.order.total +"DH"}</td>
    <td>{Number(e.order.total) - Number(e.order.paid) +"DH"}</td>
      <td>{getOption(e.order.mode)}</td>
	  <td className="task-title">{new Date(e.order.date).toLocaleDateString("fr-FR", options)}</td>
	  <td className="status"><button onMouseOver={() => updateData(e.order.id)} onMouseLeave={()  => clearData()} onClick={() => downloadFact()} className="factsubmit" id="submit">Telecharger</button></td>
    <td className="status"><button onMouseOver={() => updateData(e.order.id)} onClick={() => downloadBon()} onMouseLeave={()  => clearData()} className="factsubmit" id="submit">Telecharger</button></td>
	  <td onClick={() => setOrderDetails(e.order.id)} ><FontAwesomeIcon icon={faExclamationCircle} className="trash"></FontAwesomeIcon>  </td>
	</tr>
	  )
	})}
	
  </tbody>
</table>
	</Fragment>);

const html = (
    <Fragment>

      <Modal open={Open} closeFunction = {setOpen}>
            <h1 className='title-modal m20'>Detail de Commande</h1>
            <table id="status-table">
            <tbody>
              <tr>
                <th className="date">Nom du Produit</th>
                <th classname="task-title">Quantite</th>
                <th classname="tel">Prix</th>
              </tr>

              {Details.map(e => {
                return (
                  <tr>
                    <td className="date">{e.product_name}</td>
                    <td className="task-title">
                      <input
                        key={e.id}
                        className="editable-field"
                        name="quantity"
                        readOnly={true}
                        id={e.id}
                        
                        datavalue={e.quantity}
                        
                        defaultValue={e.quantity}
                      ></input>
                    </td>
                    <td className="status">
                      <input
                        className="editable-field"
                        name="price_vente"
                        readOnly={true}
                        dataid={e.id}
                        
                        defaultValue={e.prix + ' DH'}
                      ></input>
                    </td>
                    
                  </tr>
                )
              })}
            </tbody>
          </table>
      </Modal>
      
      <AnimateNav />
      <section className="card Supplier">
        <h1 className="card-title text-center">Historique</h1>
        <div className="filtre-row seperate">
        <ThemeProvider theme={materialTheme}>
        <DatePicker
        variant="inline"
        label="Date Debut"
        value={startDate}
        onChange={changeStart}
      />
      </ThemeProvider>
      <ThemeProvider theme={materialTheme}>
<DatePicker
        variant="inline"
        label="Date Fin"
        value={endDate}
        onChange={changeEnd}
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