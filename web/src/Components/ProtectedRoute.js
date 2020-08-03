import React from 'react'
import CreateCompany from './CreateCompany'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('usertoken');
        const hasCompany = localStorage.getItem('hasCompany');

        if(isAuthenticated)
        {   
            if(hasCompany === 'true')
            {
                if(Component !== CreateCompany)
                {
                    return <Component />
                }
                else
                {
                    return <Redirect to={{ pathname: '/' }} />
                }
            }
            else
            {
                return <Component />
            }
        }
        else
        {
            alert("You must log in to view the page")
            return <Redirect to={{ pathname: '/login' }} />
        }
    }
}

export default ProtectedRoute;