import {useState} from 'react'

import { GoogleLogin } from 'react-google-login'
import { Button, Icon, Image } from 'semantic-ui-react'

// Main header of the page
// It only display usefull infos
const Header = (props) => {

    const [name, setName] = useState('')
    const [profileURL, setProfileURL] = useState('')

    const responseGoogleSuccess = (json) => {
        setName(json.profileObj.name)
        setProfileURL(json.profileObj.imageUrl)
        props.setAuthToken(json.tokenObj.access_token)
    }

    const responseGoogleFailure = (response) => {
        alert(response)
    }

    const disconnect = () => {
        setName('')
        props.setAuthToken('')
    }

    return (
        <header>
            <div
                className='navbar navbar-dark bg-dark shadow-sm'
            >
                <div className='container d-flex justify-content-between'>
                    <h5
                        style={{ color: 'white', margin:'5px', cursor: 'pointer'}}
                        onClick={props.reset}
                        className='home-link'
                    >🍹 Home</h5>

                    {name !== ''?
                    <Button animated='vertical' onClick={disconnect} style={{padding: '0'}} >
                        <Button.Content
                            hidden
                        >
                            <Icon name='close' />
                            Disconnect
                        </Button.Content>
                        <Button.Content visible style={{display: 'inline-flex'}}>
                            <Image
                                alt='Profile pic'
                                size='mini'
                                src={profileURL}
                                style={{marginRight: '5px'}}
                                //onFailure={() => console.log('fail loading Google picture')}
                            />
                            <p style={{margin: 'auto', fontFamily: 'Roboto, sans-serif', fontWeight: '500'}}>{name}</p>
                        </Button.Content>
                    </Button>
                    :
                    <GoogleLogin
                        clientId='783652474514-hsrkuk75ikl453pu5fq2nf0m43q3qcsi.apps.googleusercontent.com'
                        buttonText='Login'
                        onSuccess={responseGoogleSuccess}
                        onFailure={responseGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        /*accessType='offline'
                        responseType='code'
                        approvalPrompt='force'
                        prompt='consent'*/
                    />
                    }
                </div>
            </div>
        </header>
    )
}

export default Header