import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import {Link} from "react-router-dom";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import styled from 'styled-components';



function AnimateNav(props){
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

    const sidebar = {
        open: (height = 1000) => ({
          clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
          transition: {
            type: "spring",
            stiffness: 20,
            restDelta: 2
          },
          
        }),
        closed: {
          clipPath: "circle(30px at 40px 40px)",
          transition: {
            delay: 0.5,
            type: "spring",
            stiffness: 400,
            damping: 40
          },
          
        }
      };

      const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);

  
  return (
    <motion.nav
      id="sidebar"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
    >
        
      <motion.div className="background" variants={sidebar} />
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />

    </motion.nav>
  );

    /* return (
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
    ) */



}



export default AnimateNav;