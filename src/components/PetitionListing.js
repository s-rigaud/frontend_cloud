import React, {useState} from 'react'

import { Button, Card, Icon } from 'semantic-ui-react'

import PetitionView from './PetitionView'

const PetitionListing = (props) => {

    const [petitionId, setPetitionId] = useState('')

    const updateNextTokenURL = () => {
        let url = new URL(props.lastFetchedURL)
        let search_params = url.searchParams
        search_params.set('next', props.nextPageToken)
        url.search = search_params.toString()
        url = url.toString()
        return url
    }

    return (
        <React.Fragment>
            {petitionId !== ''?
                <PetitionView
                    baseBackEndUrl={props.baseBackEndUrl}
                    authToken={props.authToken}
                    petitionId={petitionId}
                    setPetitionId={setPetitionId}
                    setError={props.setError}
                />
            :
                props.petitions.length?
                    <React.Fragment>
                        <Card.Group>
                            {props.petitions.map(petition => {
                                return  <Card
                                            key={petition.key.name}
                                            onClick={() => {setPetitionId(petition.key.name)}}
                                        >
                                            <Card.Content>
                                                <Card.Header>{petition.properties.name}</Card.Header>
                                            </Card.Content>
                                        </Card>
                            })}
                        </Card.Group>
                        {props.nextPageToken !== ''?
                            <Button
                                icon
                                labelPosition='right'
                                onClick={() => {props.fetchAndUpdate(updateNextTokenURL())}}
                            >
                                Next
                                <Icon name='right arrow' />
                            </Button>
                            :
                            <div/>
                        }

                    </React.Fragment>
                :
                    <p>No petitions found sorry :/</p>
            }
        </React.Fragment>
    )
}

export default PetitionListing