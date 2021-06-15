import React from 'react'

import { GoogleLogin } from 'react-google-login'
import { Button, Icon, Image, Input } from 'semantic-ui-react'

// Main header of the page
const Header = (props) => {

    const responseGoogleSuccess = (json) => {
        props.setAuthToken(json.tokenObj.access_token)
        props.setProfileInfo(json.profileObj)
    }

    const responseGoogleFailure = (response) => {
        console.log(response)
    }

    const disconnect = () => {
        props.setProfileInfo('')
        props.setAuthToken('')
    }

    return (
        <header>
            <div
                className='navbar navbar-dark bg-dark shadow-sm'
            >
                <div className='container d-flex justify-content-between'>
                    <h5
                        style={{ color: 'white', margin: '5px', cursor: 'pointer' }}
                        onClick={() => props.setActiveTab("Home")}
                        className='home-link'
                    >📝 Accueil</h5>

                    <Input
                        action={{ icon: 'search' }}
                        placeholder='#0 Nante'
                        onChange={(e, data) => props.updateSearchTag(data.value)}
                    />

                    {props.profileInfo !== "" && props.profileInfo.name !== '' ?
                        <React.Fragment>
                            <Button
                                animated='vertical'
                                onClick={() => props.setActiveTab("Profile")}
                                style={{ padding: 0, position: "fixed", right: "200px" }}
                            >
                                <Button.Content
                                    hidden
                                >
                                    <Icon name='user' />
                                    Profile
                                </Button.Content>
                                <Button.Content visible style={{ display: 'inline-flex' }}>
                                    <Image
                                        alt='Profile pic'
                                        size='mini'
                                        src={props.profileInfo.imageUrl}
                                        style={{ marginRight: '5px' }}
                                    //onFailure={() => console.log('fail loading Google picture')}
                                    />
                                    <p style={{ margin: 'auto', fontFamily: 'Roboto, sans-serif', fontWeight: '500' }}>{props.profileInfo.name}</p>
                                </Button.Content>
                            </Button>
                            <Button color='red' onClick={disconnect} style={{ padding: 11 }}>X</Button>
                        </React.Fragment>
                        :
                        <GoogleLogin
                            clientId='783652474514-hsrkuk75ikl453pu5fq2nf0m43q3qcsi.apps.googleusercontent.com'
                            buttonText='Connexion'
                            onSuccess={responseGoogleSuccess}
                            onFailure={responseGoogleFailure}
                            cookiePolicy='single_host_origin'
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