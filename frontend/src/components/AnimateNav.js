import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import {Link} from "react-router-dom";
import { useRef } from "react";
import { motion, useCycle } from "framer-motion";
import { useDimensions } from "./use-dimensions";
import { MenuToggle } from "./MenuToggle";
import { Navigation } from "./Navigation";
import styled from 'styled-components';
import {logout} from '../helper';

import { useDetectClickOutside } from 'react-detect-click-outside';



function AnimateNav(props){
    const [User, setUser] = useContext(UserContext);
    

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

    const navbar = {
      open : {
        zIndex:10,
        width:300
      },
      closed : {
        zIndex:0,
        transition : {
          zIndex:{
            delay:1
          },
          width :{
            delay:1.2
          }
        }
        , width:0
      }
    }

    const layer = {
      open : {
        opacity:1,
        transition:{
          opacity:{
            delay:0
          }
        },

        zIndex:9
      },
      closed : {
        opacity:0,
        
        zIndex:-1,
        transition : {
          opacity:{
            delay:0.8
          },
          zIndex:{
            delay:1
          }
          
        }
      }
    }

    function handleClick(){
      if (isOpen){
        toggleOpen();
      }
      
    }

      const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const reff = useDetectClickOutside({ onTriggered: handleClick});
  
  return (

    <Fragment>
      <motion.div
    id="layer"
    initial={false}
    animate={isOpen ? "open" : "closed"}
    /* className={isOpen ? "open" : "closed"} */
    variants={layer}
    onClick={handleClick}
    
      >

      </motion.div>
<motion.nav
      id="sidebar"
      initial={false}
      animate={isOpen ? "open" : "closed"}
      /* className={isOpen ? "open" : "closed"} */
      variants={navbar}
      custom={height}
      ref={containerRef}
      
    >
        
      <motion.div className="background" variants={sidebar}  />
      <Navigation />
      <MenuToggle toggle={() => toggleOpen()} />

    </motion.nav>
    </Fragment>
    
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