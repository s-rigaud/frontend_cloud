import React, { useEffect, useState } from 'react'

import { Card, Image, Button} from 'semantic-ui-react'

const PetitionCard = (props) => {

    const [petition, setPetition] = useState([])

    useEffect(() => {
        setPetition(props.petition)
    }, [])

    const vote = (petitionId) => {
        fetch(
            `${props.baseBackEndUrl}/petition?id=${petitionId}`, {
            method: 'PUT',
            headers: new Headers({
                'Authorization': `Bearer ${props.authToken}`,
                'Content-Type': 'application/json'
            })
        }
        )
            .then(res => res.json())
            .then(json => {
                console.log(json);
                const pet = [
                    json.key.name,
                    json.properties.content,
                    json.properties.created_at,
                    json.properties.name,
                    json.properties.owner,
                    json.properties.votes,
                    json.properties.tags,
                    json.properties.alreadySigned,
                ]

                petition = pet
            })
    }

    const getButtonText = (alreadySigned) => {
        return props.authToken !== '' ? (alreadySigned ? 'You already voted' : 'Vote') : 'Log in first to become able to vote'
    }

    const getProfileImage = (petitionAuthor) => {
        return (petitionAuthor === props.profileInfo.email ? props.profileInfo.imageUrl : 'https://react.semantic-ui.com/images/avatar/large/jenny.jpg')
    }

    // Add leading zeros to numbers
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const formatDate = (date) => {
        const dateObject = new Date(date)
        return `${zeroPad(dateObject.getDay(), 2)}/${zeroPad(dateObject.getMonth(), 2)}/${dateObject.getFullYear()}`
    }

    return <Card key={petition[0]} raised>
        <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={getProfileImage(petition[4])}
            />
            <Card.Header>{petition[3]}</Card.Header>
            <Card.Meta>{`Créé le ${formatDate(petition[2])} par ${petition[4]}`}</Card.Meta>
            <Card.Description>{petition[1]}</Card.Description>
        </Card.Content>
        <Card.Content extra>
            <span class='right floated'>
                <Card.Meta>{`Already voted ${petition[5]} times`}</Card.Meta>
            </span>
        </Card.Content>
        <div
            className='ui bottom attached button'
            onClick={() => { if (props.authToken !== '' && false) vote(petition[0]) }}
        >
            <Button
                positive={props.authToken !== ''}
                disabled={props.authToken === '' || false}
            >
                {getButtonText(false)}
            </Button>
        </div>

    </Card>
}

export default PetitionCard
