import React from 'react'

import { Button, Card, Icon } from 'semantic-ui-react'

class PetitionListing extends React.Component{

    updateNextTokenURL = () => {
        let url = new URL(this.props.lastFetchedURL)
        let search_params = url.searchParams
        search_params.set("next", this.props.nextPageToken)
        url.search = search_params.toString()
        url = url.toString()
        return url
    }

    render = () => {
        return (
            this.props.petitions.length?
            <React.Fragment>
                <Card.Group>
                    {this.props.petitions.map(petition => {
                        return  <Card
                                    key={petition.key.name}
                                    onClick={() => {this.props.setPetitionId(petition.key.name)}}
                                >
                                    <Card.Content>
                                        <Card.Header>{petition.properties.name}</Card.Header>
                                    </Card.Content>
                                </Card>
                    })}
                </Card.Group>
                {this.props.nextPageToken !== ""?
                    <Button
                        icon
                        labelPosition='right'
                        onClick={() => {this.props.fetchAndUpdate(this.updateNextTokenURL())}}
                    >
                        Next
                        <Icon name='right arrow' />
                    </Button>
                    :
                    <div/>
                }
                <Button
                    icon
                    labelPosition='right'
                    onClick={() => {this.props.setPetitions(null)}}
                >
                    Back to menu
                    <Icon name='arrow left' />
                </Button>
            </React.Fragment>
            :
            <React.Fragment>
                <p>No petitions found sorry :/</p>
                <Button onClick={() => {this.props.setPetitions(null)}}>Back to menu</Button>
            </React.Fragment>
        )
    }
}

export default PetitionListing