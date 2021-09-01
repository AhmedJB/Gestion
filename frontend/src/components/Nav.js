import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import {Link} from "react-router-dom";



function Nav(props){
    const [User, setUser] = useContext(UserContext);
    function logout() {
        let obj = { ...User };
        obj.logged = false;
        obj.username = null;
        obj.email = null;
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        setUser(obj);
      }

    return (
        <Fragment>
        <input type="checkbox" id="toggle" />
  <label className="fa fa-bars" htmlFor="toggle" />
  

    <nav id="side">
  <a className="brand">
    Gestion
    <label className="fa fa-times" htmlFor="toggle" />
  </a>
  <ul>
    <li> <Link  to='/app/pannel'><i className="fa fa-chart-bar" /><a> Dashboard </a></Link></li>
    <li> <Link to='/app/vente'><i className="fa fa-shopping-cart" /><a> Vente </a></Link></li>
    
    <li onClick={logout}><i className="fas fa-sign-out-alt" /><a> déconnecter </a></li>
  </ul>
  <div className="share">
    <i className="fa fa-instagram" />
    <i className="fa fa-facebook" />
    <i className="fa fa-twitter" />
    <i className="fa fa-linkedin" />
  </div>
</nav>
</Fragment>
    )


}



export default Nav;