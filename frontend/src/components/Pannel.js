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

  async function updateTasks() {
    let resp = await req("tasks");
    let obj2 = {...Data}
    if (resp) {
      obj2.tasks = resp;
    }
    setData(obj2);
  }

  
  async function updateVidiq() {
    let username = document.getElementById("account_email").value;
    let password = document.getElementById("account_password").value;
    let resp = await set_vidiq_account("vidiq", username, password);
    if (resp) {
      addToast("Updated Vidiq Login info", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  async function createTask() {
    let title = document.getElementById("task-title").value;
    let keywords = document.getElementById("keywords").value;
    let resp = await create_task("tasks", title, keywords);
    if (resp) {
      let obj = { ...Data };
      obj.tasks = resp;
      setData(obj);
      addToast("Created Task", {
        appearance: "success",
        autoDismiss: true,
      });
    } else {
      addToast("Failed Task Creation", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

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
    margin:50px;
    border-radius:10px;
    box-shadow:0px 0px 10px rgba(0, 0, 0, 0.644), 0px 0px 25px rgba(0, 0, 0, 0.719);
    width: ${props => props.width};
    height: ${props => props.height};
  `;

  const html = (
  <Fragment>
    <AnimateNav />

    <div className='row'>
      <Card width="25%" height="200px">
        <h3 className='card-title text-center'>Ventes</h3>
        <h3 className='card-value text-center'>0</h3>
      </Card>
      <Card width="25%" height="200px">
        <h3 className='card-title text-center'>Profit</h3>
        <h3 className='card-value text-center'>0</h3>
      </Card>
      <Card width="25%" height="200px">
        <h3 className='card-title text-center'>Achat</h3>
        <h3 className='card-value text-center'>0</h3>
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
