import React, { useState, useEffect, useContext, Fragment } from "react";
import Select from "react-dropdown-select";



function CustomSelect(props) {




    return (
        <Select 

    options={props.options} 
    onChange={props.changeFunc} 
    labelField= {props.label}
    valueField= {props.fvalue}
    searchable= {true}
    placeholder={props.placeholder}
    color = "#b187ff"
    className = "CustomDropdown"
    clearable = {true}
    />
    )





}


export default CustomSelect;