import { Card } from 'semantic-ui-react'

const Menu = (props) => {

    // TODO retrieve url from API call like '/petition/actions'
    const ENDPOINTS = {
        unauthEndpoints : [
            {
              name: 'popular',
              header: 'List the 10 most popular petitions',
              action: async() => {await props.fetchAndUpdate(`${props.baseBackEndUrl}/petitions/top10`)},
            },
            {
              name: 'fake',
              header: 'Populate with fake data',
              action: async() => {await props.fetchAndUpdate(`${props.baseBackEndUrl}/petitions/create/fake`)},
            },
            {
              name: 'tags',
              header: 'Filter petition by tags',
              action: async() => {await props.setPetitionTagFiltering(true)},
            },
        ],
        authEndpoints : [
            {
                name: 'create',
                header: 'Create a petition',
                action: async() => {await props.setPetitionInCreation(true)},
            },
            {
                name: 'created',
                header: 'List petition I created',
                action: async() => {await props.fetchAndUpdate(`${props.baseBackEndUrl}/me/petitions`)},
            },
            {
                name: 'signed',
                header: 'List petition I signed',
                action: async() => {await props.fetchAndUpdate(`${props.baseBackEndUrl}/me/signature`)},
            },
          ]
    }

    const getAPIEndpoints = () => {
        let endpoints = ENDPOINTS.unauthEndpoints
        if (props.authToken !== '') endpoints = endpoints.concat(ENDPOINTS.authEndpoints)
        return endpoints
    }

    return <Card.Group>
        {getAPIEndpoints().map(infos => {
            return  <Card
                        key={infos.header}
                        onClick={async() => {await infos.action(); props.setBreadcrumb(infos.name)}}
                    >
                        <Card.Content>
                          <Card.Header>{infos.header}</Card.Header>
                        </Card.Content>
                    </Card>
        })}
    </Card.Group>
}

export default Menu