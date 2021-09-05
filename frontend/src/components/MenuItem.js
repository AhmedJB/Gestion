import React, { useState, useEffect, useContext , Fragment} from "react";
import { motion } from "framer-motion";
import { UserContext } from "../contexts/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBoxes, faCoffee, faFileInvoice, faPeopleCarry, faSignOutAlt, faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

const colors = ["#FF008C", "#D309E1", "#9C1AFF", "#7700FF","#4400FF"];
const icons = [<FontAwesomeIcon icon={faTachometerAlt} />,<FontAwesomeIcon icon={faPeopleCarry} />,<FontAwesomeIcon icon={faBoxes} />,<FontAwesomeIcon icon={faFileInvoice} />,<FontAwesomeIcon icon={faSignOutAlt} />]
const text = ["Dashboard","Fournisseur","Stock","Facture","Log Out"]
const links = ['/app/pannel','/app/supplier','/app/supply','/app/invoice']


export const MenuItem = ({ i }) => {
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
    


  const style = { border: `2px solid ${colors[i]}`, color: `${colors[i]}` };
  const style2 = { border: `2px solid ${colors[i]}`, padding:'10px' , color: `${colors[i]}`}
  const ic = icons[i];
  return (
    <motion.li
      variants={variants}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={text[i] == 'Log Out' ? logout : "" }
    ><Link  to={links[i]}>
      <div className="icon-placeholder" style={style} > {ic}  </div>

      <div className="text-placeholder" style={style2}>{text[i]}  </div>
      
    </motion.li>
  );
};
