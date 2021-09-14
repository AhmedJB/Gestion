import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file } from "../helper";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Chart from "react-apexcharts";
import styled from 'styled-components';
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";
import {logout} from '../helper';
import ReactTooltip from "react-tooltip";


function Pannel(props) {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const colors = ['#5900ff','#5900ff','#5900ff','#5900ff','#5900ff','#5900ff','#5900ff']

  const [options , setOptions] = useState({
    chart: {
      id: "basic-bar"
    },
    colors: colors,
    xaxis: {
      categories:[
        ['Lundi'],
        ['mardi'],
        ['mercredi'],
        'jeudi',
        ['vendredi'],
        ['samedi'],
        ['dimanche']
        
      ],
      labels: {
        style: {
          colors: '#fff',
          fontSize: '12px'
        }
      }
    }
  });


  const [series , setSeries] = useState([{
    name : 'Articles vendu',
    data: [21, 22, 10, 28, 16, 21, 13]
  }]);
  

  useEffect(() => {
    async function test() {
      let resp = await isLogged();
      if (resp) {

        let obj = { ...User };
        obj.logged = true;
        obj.username = resp.username;
        obj.email = resp.email;
        setUser(obj);
        return obj;
      }else {
        logout(setUser,User);
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
      
      
    
    
    
    }
    
    
    );
  }, []);

  

  async function download(e) {
      let current = e.target;
      let name = current.name;
      let resp = await download_file('download/'+String(current.value),name);
      if (resp) {
        addToast("downloaded file "+ name, {
          appearance: "success",
          autoDismiss: true,
        });
      } else {
        addToast("Failed downloading file", {
          appearance: "error",
          autoDismiss: true,
        });
      }
      
      

  }

  const Card = styled.div`
    background: #000000;
    background: -webkit-linear-gradient(bottom right, #000000, #282828);
    background: -moz-linear-gradient(bottom right, #000000, #282828);
    background: linear-gradient(to top left, #000000, #282828);
    padding:30px 20px;
    margin:50px 15px 0px 15px;
    border-radius:10px;
    box-shadow:0px 0px 10px rgba(0, 0, 0, 0.644), 0px 0px 25px rgba(0, 0, 0, 0.719);
    width: ${props => props.width};
    max-width: ${props => props.maxWidth ? props.maxWidth : "90%"};
    height: ${props => props.height};
  `;

  const html = (
  <Fragment>
    <AnimateNav />
    <ReactTooltip  id="test"></ReactTooltip>

    <div className='row'>
      <Card width="450px" height="200px">
        <h3 className='card-title text-center'>Ventes</h3>
        <div className='card-value card-row'>
          <div className="card-column">
            <p>Articles Vendu</p>
            <p className="circle"
            
            >35</p>
          </div>

          <div className="card-column">
            <p>Total</p>
            <p className="box">1300DH</p>
          </div>
        </div>
      </Card>
      <Card width="450px" height="200px">
        <h3 className='card-title text-center'>Achat</h3>
        <div className='card-value card-row'>
          <div className="card-column">
            <p>Articles Achetes</p>
            <p className="circle">35</p>
          </div>

          <div className="card-column">
            <p>Total</p>
            <p className="box">1300DH</p>
          </div>
        </div>
      </Card>
      <Card width="450px" height="200px">
        <h3 className='card-title text-center'>Stock</h3>
        <div className='card-value card-row'>
          <div className="card-column">
            <p>Articles Disponible</p>
            <p className="circle">35</p>
          </div>

          <div className="card-column">
            <p>Total</p>
            <p className="box">1000DH</p>
          </div>
        </div>
      </Card>
    </div>

    
   

<div className='row'>
  <Card width="90%" height="500px">
    <h3 className='card-title text-center'>Ventes</h3>
    <Chart options={options}
    series={series}
    type="bar"
    height="400"
     />
  </Card>
</div>
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

export default Pannel;

{
  /* <Redirect
to={{
  pathname: "/app/login",  
  state: { referrer: currentLocation, error : "hello world" }
}}
/> */
}
