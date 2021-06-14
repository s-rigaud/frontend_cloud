import React, { useEffect, useState } from 'react'

import { Card, Image, Button } from 'semantic-ui-react'

const PetitionCard = (props) => {

    const [petition, setPetition] = useState([])

    useEffect(() => {
        setPetition(props.petition)
    }, [props])

    const sign = (petitionId) => {
        console.log(`${props.baseBackEndUrl}/petition?id=${petitionId}`);
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
                    json.properties.signCount,
                    json.properties.tags,
                    json.properties.userAlreadySigned,
                ]
                setPetition(pet)
            })
    }

    const getButtonText = (alreadySigned) => {
        return props.authToken !== '' ? (alreadySigned ? 'Vous avez déjà signé' : 'Signer') : "Connectez vous d'abord pour pouvoir signer"
    }

    const getProfileImage = (petitionAuthor) => {
        return (petitionAuthor === props.profileInfo.email ? props.profileInfo.imageUrl : 'https://react.semantic-ui.com/images/avatar/large/jenny.jpg')
    }

    const getProfileName = (petitionAuthor) => {
        return (petitionAuthor === props.profileInfo.email ? "moi" : petitionAuthor)
    }

    function timeDiffCalc(dateFuture, dateNow) {
        let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

        // calculate days
        const days = Math.floor(diffInMilliSeconds / 86400);
        diffInMilliSeconds -= days * 86400;

        // calculate hours
        const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
        diffInMilliSeconds -= hours * 3600;

        // calculate minutes
        const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
        diffInMilliSeconds -= minutes * 60;

        let difference = '';
        if (days > 0)
            difference += (days === 1) ? `${days} jour, ` : `${days} jours, `;

        if (hours > 0)
            difference += (hours === 0 || hours === 1) ? `${hours} heure et ` : `${hours} heure et `;

        difference += (minutes === 0 || hours === 1) ? `${minutes} minutes` : `${minutes} minutes`;

        return difference;
    }

    return <Card key={petition[0]} raised>
        <Card.Content>
            <Image
                floated='right'
                size='mini'
                src={getProfileImage(petition[4])}
            />
            <Card.Header>{petition[3]}</Card.Header>
            <Card.Meta>
                {`Créée il y a ${timeDiffCalc(Date.now(), new Date(petition[2]))} par ${getProfileName(petition[4])}`}
            </Card.Meta>
            <Card.Description>{petition[1]}</Card.Description>
        </Card.Content>

        <Card.Content extra>
            <Card.Meta>{`Déjà signée ${petition[5]} fois`}</Card.Meta>
        </Card.Content>
        <div
            className='ui bottom attached button'
            onClick={() => { if (props.authToken !== '' && !petition[7]) sign(petition[0]) }}
        >
            <Button
                positive={props.authToken !== ''}
                disabled={props.authToken === '' || petition[7]}
            >
                {getButtonText(petition[7])}
            </Button>
        </div>

    </Card>
}

export default PetitionCard
