import React, { useEffect, useState } from 'react'

import { Card, Button } from 'semantic-ui-react'

import PetitionCard from './PetitionCard'

const Home = (props) => {

    const [petitions, setPetitions] = useState([])

    useEffect(async () => {
        await props.fetchAndUpdate(props.url, setPetitions)
    }, [])

    return <React.Fragment>
        <Button color='green' onClick={() => props.setActiveTab("Create")}>
            + Create new petition
        </Button>

        <Card.Group itemsPerRow={4} centered>
            {petitions.map(pet => {
                return <PetitionCard
                    petition={pet}
                    {...props}
                />
            })}
        </Card.Group>

    </React.Fragment>
}

export default Home
