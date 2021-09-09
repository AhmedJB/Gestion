import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

// components
import Sign from './Sign'
import Pannel from './Pannel'



// Contexts

import { UserContext , UserProvider } from '../contexts/UserContext';
import { ToastProvider, useToasts } from 'react-toast-notifications';
import { DataContext , DataProvider } from '../contexts/DataContext';
import Nav from './Nav';
import AnimateNav from './AnimateNav';




const App = (props) => {

    const base = '/app'

    return (
        <DataProvider>
        <ToastProvider>
        <UserProvider>
        
        <Router>
        
            <Switch>
                <Route path={base + '/login' }  render={(props) =>  <Sign login={true} {...props} />}>
                    
                </Route>
                <Route path={ base + '/register'  } render={(props) =>  <Sign login={false} {...props} />}>
                    
                </Route>

                <Route path={ base + '/vente'  } render={(props) =>  <Vente  {...props} />}>
                    
                </Route>

                <Route path= {base + '/pannel'} render={(props) =>  <Pannel {...props} />}>
                </Route>
            </Switch>

        </Router>
        </UserProvider>
        </ToastProvider>
        </DataProvider>
        
    )

}


export default App;



