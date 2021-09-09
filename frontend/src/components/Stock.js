import React, { useState, useEffect, useContext , Fragment} from "react";
import { UserContext } from "../contexts/UserContext";
import { DataContext } from "../contexts/DataContext";
import { isLogged, req, download_file } from "../helper";
import { Redirect } from "react-router-dom";
import { useToasts } from "react-toast-notifications";

import styled from 'styled-components';
import Nav from "./Nav";
import AnimateNav from "./AnimateNav";



function Pannel(props) {
    const { addToast } = useToasts();
    const [loading, setLoading] = useState(true);
    const [User, setUser] = useContext(UserContext);
    const [Data, setData] = useContext(DataContext);
    
    return (
        <h1>Stock</h1>
    )

}

export default Pannel;