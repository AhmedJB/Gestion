import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file } from "../helper";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import Chart from "react-apexcharts";
import styled from "styled-components";
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";
import { logout } from "../helper";
import ReactTooltip from "react-tooltip";
import CustomSelect from "./CustomSelect";

function Pannel(props) {
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const [User, setUser] = useContext(UserContext);
  const [Data, setData] = useContext(DataContext);
  const colors = [
    "#5900ff",
    "#5900ff",
    "#5900ff",
    "#5900ff",
    "#5900ff",
    "#5900ff",
    "#5900ff",
  ];
  const pieColors = [
    "#4f7e9e" , "#654ea3" , "#804ea0" , "#944f9e" , "#9b5088"
  ]
  const [Clients, setClients] = useState([]);
  const [Providers, setProviders] = useState([]);
  const [options, setOptions] = useState({
    chart: {
      id: "basic-bar",
    },
    colors: colors,
    xaxis: {
      categories: [
        ["Lundi"],
        ["mardi"],
        ["mercredi"],
        "jeudi",
        ["vendredi"],
        ["samedi"],
        ["dimanche"],
      ],
      labels: {
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
    },
  });

  const [ProviderLineOptions, setProviderLineOption] = useState({
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
      labels: {
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  const [ProviderLineSeries, setProviderLineSeries] = useState([
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ]);
  const [ProviderPieOptions, setProviderPieOptions] = useState({
    labels: ["Apple", "Mango", "Orange", "Watermelon"],
    colors: pieColors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      colors: ["transparent"],
      width: 0,
    },
    legend: {
      labels: {
        colors: "#fff",
      },
    },
  });
  const [ProviderPieSeries, setProviderPieSeries] = useState([44, 55, 41, 17, 15]);

  const [clientLineOptions, setClientLineOption] = useState({
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
      labels: {
        style: {
          colors: "#fff",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  const [clientLineSeries, setClientLineSeries] = useState([
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
  ]);
  const [clientPieOptions, setClientPieOptions] = useState({
    labels: ["Apple", "Mango", "Orange", "Watermelon"],
    colors: pieColors,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      colors: ["transparent"],
      width: 0,
    },
    legend: {
      labels: {
        colors: "#fff",
      },
    },
  });
  const [clientPieSeries, setClientPieSeries] = useState([44, 55, 41, 17, 15]);

  const [Articleseries, setArticleSeries] = useState([
    {
      name: "Articles vendu",
      data: [21, 22, 10, 28, 16, 21, 13],
    },
  ]);

  const [Profitseries, setProfitSeries] = useState([
    {
      name: "Profit",
      data: [21, 22, 10, 28, 16, 21, 13],
    },
  ]);

  useEffect(() => {
    async function test() {
      let resp = await isLogged();
      if (resp) {
        let obj = { ...User };
        obj.logged = true;
        obj.username = resp.username;
        obj.email = resp.email;
        setUser(obj);
        await updateUsers();
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

  // functions for data
  async function updateUsers(){
    let supResp = await  req('client');
    let supResp2 = await req('provider')
    let obj2 = {...Data};
    obj2.Clients = supResp;
    obj2.Suppliers = supResp2;
    setClients(supResp);
    setProviders(supResp2);
    setData(obj2);
  }

  async function loadSupplierLine(){};



  const Card = styled.div`
    background: #000000;
    background: -webkit-linear-gradient(bottom right, #000000, #282828);
    background: -moz-linear-gradient(bottom right, #000000, #282828);
    background: linear-gradient(to top left, #000000, #282828);
    padding: 30px 20px;
    margin: 50px 15px 0px 15px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.644),
      0px 0px 25px rgba(0, 0, 0, 0.719);
    width: ${(props) => props.width};
    max-width: ${(props) => (props.maxWidth ? props.maxWidth : "90%")};
    height: ${(props) => props.height};
    min-height: ${(props) => props.minHeight};
  `;

  const overview = (
    <div className="row">
      <Card width="450px" height="260px">
        <h3 className="card-title text-center">Ventes</h3>
        <div className="card-value card-row">
          <div className="card-column">
            <p>Articles Vendu</p>
            <p className="circle">35</p>
          </div>

          <div className="card-column">
            <p>Total</p>
            <p className="box">1300DH</p>
          </div>
        </div>
      </Card>
      <Card width="450px" height="260px">
        <h3 className="card-title text-center">Achat</h3>
        <div className="card-value card-row">
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
      <Card width="450px" height="260px">
        <h3 className="card-title text-center">Stock</h3>
        <div className="card-value card-row">
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
  );

  const supplierChart = (
    <div className="row">
      <Card width="90%" height="auto" minHeight="500px">
        <div className='title-select-row'>
        <h3 className="card-title text-center inline">Fournisseur</h3>
        <div className="inline">
        <CustomSelect options={Data.Suppliers} changeFunc={loadSupplierLine}
label="name" multi={true} fvalue="id" placeholder="Choisir un Fournisseur" />
        </div>
        
        </div>
        
        <div className="inner-row">
          <div className="grow">
            <Chart
              options={ProviderLineOptions}
              series={ProviderLineSeries}
              type="line"
              height="400"
            />
          </div>
          <Chart
            options={ProviderPieOptions}
            series={ProviderPieSeries}
            type="donut"
            height="600"
            width="300"
          />
        </div>
      </Card>
    </div>
  );

  const clientChart = (
    <div className="row">
      <Card width="90%" height="auto" minHeight="500px">
      <div className='title-select-row'>
        <h3 className="card-title text-center inline">Clients</h3>
        <div className="inline">
        <CustomSelect options={Data.Clients} changeFunc={loadSupplierLine}
label="name" multi={true} fvalue="id" placeholder="Choisir un Client" />
        </div>
        
        </div>
        <div className="inner-row">
          <div className="grow">
            <Chart
              options={clientLineOptions}
              series={clientLineSeries}
              type="line"
              height="400"
            />
          </div>
          <Chart
            options={clientPieOptions}
            series={clientPieSeries}
            type="donut"
            height="600"
            width="300"
          />
        </div>
      </Card>
    </div>
  );

  const profitChart = (
    <div className="row">
      <Card width="90%" height="500px">
        <h3 className="card-title text-center">Profit</h3>
        <Chart
          options={options}
          series={Profitseries}
          type="bar"
          height="400"
        />
      </Card>
    </div>
  );

  const articleChart = (
    <div className="row">
      <Card width="90%" height="500px">
        <h3 className="card-title text-center">Ventes</h3>
        <Chart
          options={options}
          series={Articleseries}
          type="bar"
          height="400"
        />
      </Card>
    </div>
  );

  const html = (
    <Fragment>
      <AnimateNav />
      <ReactTooltip id="test"></ReactTooltip>
      <div className="pannel-container">
        {overview}
        {supplierChart}
        {clientChart}
        {articleChart}
        {profitChart}


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
