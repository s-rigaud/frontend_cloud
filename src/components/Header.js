import {useState} from 'react'

import { GoogleLogin } from 'react-google-login'
import { Button, Icon } from 'semantic-ui-react'

// Main header of the page
// It only display usefull infos
const Header = (props) => {

    const [name, setName] = useState("")

    const responseGoogleSuccess = (json) => {
        console.log(json.tokenObj.access_token)
        setName(json.At.Ve)
        props.setAuthToken(json.tokenObj.access_token)
    }

    const responseGoogleFailure = (response) => {
        console.log(response)
    }

    const disconnect = () => {
        setName("")
        props.setAuthToken("")
    }

    return (
        <header>
            <div
                className='navbar navbar-dark bg-dark shadow-sm'
            >
                <div className='container d-flex justify-content-between'>
                    <h5
                        style={{ color: 'white', margin:'5px', cursor: 'pointer'}}
                        onClick={() => {window.location = "/"}}
                        className="home-link"
                    >🍹 Home</h5>

                    {name !== ""?
                    <Button animated='vertical' onClick={disconnect}>
                        <Button.Content
                            hidden
                            style={{color:'red !important'}}
                        >
                            <Icon name='close' />
                            Disconnect
                        </Button.Content>
                        <Button.Content visible><Icon name='user outline' />{name}</Button.Content>
                    </Button>
                    :
                    <GoogleLogin
                        clientId="783652474514-hsrkuk75ikl453pu5fq2nf0m43q3qcsi.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={responseGoogleSuccess}
                        onFailure={responseGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    }
                </div>
            </div>
        </header>
    )
}

export default Header