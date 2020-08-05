import React from 'react'
import CreateCompany from './CreateCompany'
import Login from './Login'
import Register from './Register'
import { Redirect } from 'react-router-dom'

class ProtectedRoute extends React.Component {

    render() {
        const Component = this.props.component;
        const isAuthenticated = localStorage.getItem('usertoken');
        const hasCompany = localStorage.getItem('hasCompany');

        if(isAuthenticated)
        {   
            if(Component !== Login && Component !== Register)
            {
                if(hasCompany === 'true')
                {
                    if(Component !== CreateCompany)
                    {
                        return <Component />
                    }
                    else
                    {
                        alert("You created already a company")
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
                alert("You Must Log Out To View This Page ")
                return <Redirect to={{ pathname: '/' }} />
            }
        }
        else
        {   
            if(Component === Login || Component === Register)
            {
                return <Component />
            }
            else
            {
                alert("You Must Log In To View This Page")
                return <Redirect to={{ pathname: '/login' }} />
            }
        }
    }
}

export default ProtectedRoute;