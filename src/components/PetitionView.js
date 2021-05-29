import React, {useEffect, useState} from 'react'

import { Button, Card, Label } from 'semantic-ui-react'

const PetitionView = (props) => {

    const [petitionData, setPetitionData] = useState(null)
    const [alreadySigned, setAlredaySigned] = useState(false)

    useEffect(
        () => {
            props.setError("")
            let headers = {'Content-Type': 'application/json'}
            if(props.authToken !== "") headers['Authorization'] = `Bearer ${props.authToken}`

            fetch(`${props.baseBackEndUrl}/petition?id=${props.petitionId}`,
                {headers: new Headers(headers)}
            )
            .then(res => res.json())
            .then(json => {
                console.log(json)
                setPetitionData(json)
                setAlredaySigned(json.properties.userAlreadySigned)
            })
        // also updated when authToken will change
        }, [props.petitionId, props.baseBackEndUrl, props.authToken, props.setError]
    )

    const vote = () => {
        fetch(
            `${props.baseBackEndUrl}/petition?id=${props.petitionId}`, {
                method: 'PUT',
                headers: new Headers({
                    'Authorization': `Bearer ${props.authToken}`,
                    'Content-Type': 'application/json'
                })
            }
        )
        .then(res => res.json())
        .then(json => {
            setPetitionData(json)
            setAlredaySigned(true)
        })
    }

    const getTagsOrEmptyList = (tags) => {
        // Json return from google could be either undefined / object {"value": ""tag""} / ["tag1", "tag2"]
        if(tags !== undefined && !isNaN(tags.length)) return tags // list
        if(tags !== undefined) return [parseInt(tags.value.replace('"', ''))] // object
        return []
    }

    // Add leading zeros to numbers
    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const formatDate = (date) => {
        const dateObject = new Date(date)
        return `${zeroPad(dateObject.getDay(), 2)}/${zeroPad(dateObject.getMonth(), 2)}/${dateObject.getFullYear()}`
    }

    const getButtonText = () => {
        return props.authToken !== ""? (alreadySigned? "You already voted": "Vote") : "Log in first to become able to vote"
    }

    return petitionData !== null?
            <React.Fragment>
                <Card
                    key={petitionData.key.name}
                >
                    <Card.Content>
                        <Card.Header style={{margin: "10px"}}>{petitionData.properties.name}</Card.Header>
                        <Card.Meta>
                            <span className='date' >
                                <p>Created by {petitionData.properties.owner}</p>
                                <p>the {formatDate(petitionData.properties.created_at)}</p>
                            </span>
                        </Card.Meta>
                        <Card.Description>
                            <p>{petitionData.properties.content}</p>
                            <div style={{display: "-webkit-inline-box", marginTop: "35px"}}>
                                <p style={{marginRight: "10px"}}>Tags : </p>
                                {getTagsOrEmptyList(petitionData.properties.tags).map(tag => {
                                    return <Label color='blue' key={tag}>{`#${tag}`}</Label>
                                })}
                            </div>
                        </Card.Description>
                    </Card.Content>
                        <Card.Content extra>
                            <p>Currently signed {petitionData.properties.votes} times</p>
                            <div className='ui two buttons'>
                                <Button
                                    positive={props.authToken !== ""}
                                    onClick={vote}
                                    disabled={props.authToken === "" || alreadySigned}
                                >{getButtonText()}</Button>
                            </div>
                        </Card.Content>
                </Card>
                <Button onClick={() => {props.setPetitionId("")}}>Back to listing</Button>
            </React.Fragment>
            :
            <div>Loading</div>
}

export default PetitionView