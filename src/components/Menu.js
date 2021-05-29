import { Card } from 'semantic-ui-react'

const Menu = (props) => {

    const loadAndDo = async(endpointName) => {
      props.setBreadcrumb(endpointName)
      switch (endpointName) {
        case 'popular':
          await props.fetchAndUpdate(`${props.baseBackEndUrl}/petitions/top10`)
          break

        case 'fake':
          await props.fetchAndUpdate(`${props.baseBackEndUrl}/petitions/create/fake`)
          break

        case 'tags':
          await props.setPetitionTagFiltering(true)
          break

        case 'create':
          props.setPetitionInCreation(true)
          break

        case 'created':
          await props.fetchAndUpdate(`${props.baseBackEndUrl}/me/petitions`)
          break

        case 'signed':
          await props.fetchAndUpdate(`${props.baseBackEndUrl}/me/signature`)
          break

        default:
          break
      }
      console.log(endpointName)
    }

    // TODO retrieve url from API call like "/petition/actions"
    const ENDPOINTS = {
        unauthEndpoints : [
            {
              name: 'popular',
              header: 'List the 10 most popular petitions',
            },
            {
              name: 'fake',
              header: 'Populate with fake data',
            },
            {
              name: 'tags',
              header: 'Filter petition by tags',
            },
        ],
        authEndpoints : [
            {
                name: 'create',
                header: 'Create a petition',
            },
            {
                name: 'created',
                header: 'List petition I created',
            },
            {
                name: 'signed',
                header: 'List petition I signed',
            },
          ]
    }

    const getAPIEndpoints = () => {
        let endpoints = ENDPOINTS.unauthEndpoints
        if (props.authToken !== "") endpoints = endpoints.concat(ENDPOINTS.authEndpoints)
        return endpoints
    }

    return <Card.Group>
        {getAPIEndpoints().map(infos => {
            return  <Card
                        key={infos.header}
                        onClick={() => {loadAndDo(infos.name)}}
                    >
                        <Card.Content>
                          <Card.Header>{infos.header}</Card.Header>
                        </Card.Content>
                    </Card>
        })}
    </Card.Group>
}

export default Menu