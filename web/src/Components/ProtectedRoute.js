import React from 'react'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('usertoken');
        const hasCompany = localStorage.getItem('hasCompany');
   
        if(isAuthenticated)
        {   
            if(hasCompany)
            {
                return <Component />
            }
            else
            {
                return <Redirect to={{ pathname: '/createCompany' }} />
            }
        }
        else
        {
            return <Redirect to={{ pathname: '/login' }} />
        }
    }
}

export default ProtectedRoute;