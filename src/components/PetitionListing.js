import React, { useEffect, useState } from 'react'

import { Button, Card, Icon } from 'semantic-ui-react'

import PetitionCard from './PetitionCard'

const PetitionListing = (props) => {

    const [petitions, setPetitions] = useState([])

    useEffect(async () => {
        await props.fetchAndUpdate(props.url, setPetitions)
    }, [])

    const updateNextTokenURL = () => {
        props.setLastPageToken(props.nextPageToken)

        let url = new URL(props.lastFetchedURL)
        let search_params = url.searchParams
        search_params.set('next', props.nextPageToken)
        url.search = search_params.toString()
        url = url.toString()
        console.log('last here ', props.lastPageToken);
        return url
    }

    const updateLastTokenURL = () => {
        props.setLastPageToken(props.nextPageToken)

        let url = new URL(props.lastFetchedURL)
        let search_params = url.searchParams
        if (props.lastPageToken !== '') {
            search_params.set('next', props.lastPageToken)
        } else {
            search_params.delete("next")
        }
        url.search = search_params.toString()
        url = url.toString()
        return url
    }

    return (
        <React.Fragment>
            <h1>{props.title}</h1>
            {petitions.length ?
                <React.Fragment>
                    <Card.Group itemsPerRow={4} centered>
                        {petitions.map(pet => {
                            return <PetitionCard
                                petition={pet}
                                {...props}
                            />
                        })}
                    </Card.Group>
                    {props.nextPageToken !== '' ?
                        <Button
                            icon
                            labelPosition='right'
                            onClick={() => { props.fetchAndUpdate(updateNextTokenURL(), setPetitions) }}
                        >
                            Next
                            <Icon name='right arrow' />
                        </Button>
                        :
                        <div />
                    }
                    {props.lastPageToken !== '' ?
                        <Button
                            icon
                            labelPosition='left'
                            onClick={() => { props.fetchAndUpdate(updateLastTokenURL(), setPetitions) }}
                        >
                            Last
                            <Icon name='left arrow' />
                        </Button>
                        :
                        <div />
                    }

                </React.Fragment>
                :
                <p>Pas de pétitions trouvées :/</p>
            }
        </React.Fragment>
    )
}

export default PetitionListing