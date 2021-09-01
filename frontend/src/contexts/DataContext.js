import React , {useState , useContext , createContext} from 'react';


export const DataContext = createContext();

export const DataProvider = props => {

    let obj = {
        vidiq : {
            username : '',
            password : ''
        },
        tasks : []
    }
    
    const [Data,setData] = useState(obj);

    return <DataContext.Provider value= {[Data,setData]}>{props.children}</DataContext.Provider>

}