import React from 'react'

import { Card } from 'semantic-ui-react'

class Menu extends React.Component{

    // TODO retrieve url from API call like "/petition/actions"
    states = {
        unauthEndpoints : [
            {
              header: 'List the 10 most popular petitions',
              url: `${this.props.baseBackEndUrl}/petitions/top10`,
            },
            {
              header: 'Populate with fake data',
              url: `${this.props.baseBackEndUrl}/petitions/create/fake`,
            },
            {
              header: 'Filter petition by tags',
              url: `${this.props.baseBackEndUrl}/petitions/tags?tag=1&tag=2`,
            },
        ],
        authEndpoints : [
            {
                header: 'Create a petition',
                url: `${this.props.baseBackEndUrl}/petitions`,
            },
            {
                header: 'List petition I created',
                url: `${this.props.baseBackEndUrl}/me/petitions`,
            },
            {
                header: 'List petition I signed',
                url: `${this.props.baseBackEndUrl}/me/signature`,
            },
          ]
    }

    getAPIEndpoints = () => {
        let endpoints = this.states.unauthEndpoints
        console.log(this.props.authToken)
        if (this.props.authToken !== "") endpoints = endpoints.concat(this.states.authEndpoints)
        return endpoints
    }

    render = () => {
        return <Card.Group>
            {this.getAPIEndpoints().map(infos => {
                return  <Card
                            key={infos.header}
                            onClick={() => {this.props.fetchAndUpdate(infos.url)}}
                        >
                            <Card.Content>
                                <Card.Header>{infos.header}</Card.Header>
                            </Card.Content>
                        </Card>
            })}
        </Card.Group>
    }
}

export default Menu