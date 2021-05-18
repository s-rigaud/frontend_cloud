import React, {useEffect, useState} from 'react'

import { useParams } from 'react-router-dom'
import { Card } from 'semantic-ui-react'

const PetitionView = (props) => {

    const { petitionId } = useParams()
    const [petitionData, setPetitionData] = useState(null)

    useEffect(
        () => {
            fetch(`${props.baseBackEndUrl}/petition?id=${petitionId}`)
            .then(res => res.json())
            .then(json => setPetitionData(json))
        }, [petitionId, props.baseBackEndUrl]
    )

    return petitionData !== null?
            <Card
                key={petitionData.key.name}
            >
                <Card.Content>
                    <Card.Header>{petitionData.properties.name}</Card.Header>
                    <Card.Description>{petitionData.properties.content}</Card.Description>
                </Card.Content>
            </Card>
            :
            <div>Loading</div>
}

export default PetitionView