import React, { useEffect, useState } from 'react'

import { Button, Card, Icon } from 'semantic-ui-react'

import PetitionCard from './PetitionCard'

const PetitionListing = (props) => {

    const [petitions, setPetitions] = useState([])
    const [pageNumber, setPageNumber] = useState(0)

    // First element is page 1 token
    const [pageTokens, setPageTokens] = useState(['', '', '', '', '', '', '', '', '', ''])

    const [lastFetchedURL, setLastFetchedURL] = useState('')


    useEffect(async () => {
        await fetchAndUpdate(props.url, 1)
    }, [props])


    const fetchAndUpdate = async (url, newPageNumber) => {
        console.log(url)
        fetch(url, {
            headers: new Headers({
                'Authorization': `Bearer ${props.authToken}`,
                'Content-Type': 'application/json'
            })
        })
            .then(res => res.json())
            .then(json => {
                setLastFetchedURL(url)

                console.log(json)
                let itemCounts = 0
                if (json.hasOwnProperty('items')) {
                    setPetitions(
                        json.items.map(pet => [
                            pet.key.name,
                            pet.properties.content,
                            pet.properties.created_at,
                            pet.properties.name,
                            pet.properties.owner,
                            pet.properties.signCount,
                            pet.properties.tags,
                            pet.properties.userAlreadySigned,
                        ]))
                    itemCounts = json.items.length
                } else { setPetitions([]) }

                // Google provide a last token leading to an empty result page as last token for pagination
                // We suppose we only get 10 results by page here
                if (json.hasOwnProperty('nextPageToken') && itemCounts > 9) {
                    setPageNumber(newPageNumber)
                    console.log(newPageNumber);
                    let updatedPageTokenList = pageTokens.slice()
                    updatedPageTokenList[newPageNumber] = json.nextPageToken
                    setPageTokens(updatedPageTokenList)
                    console.log('updated');
                }

            })
            .catch((error) => console.log(error))
    }

    const updateNextTokenURL = () => {
        let url = new URL(lastFetchedURL)
        let search_params = url.searchParams
        search_params.set('next', pageTokens[pageNumber])
        url.search = search_params.toString()
        return url.toString()
    }

    const updateLastTokenURL = () => {
        let url = new URL(lastFetchedURL)
        let search_params = url.searchParams
        if (pageNumber > 1 && pageTokens[pageNumber - 2] !== '') {
            search_params.set('next', pageTokens[pageNumber - 2])
        } else {
            search_params.delete("next")
        }
        url.search = search_params.toString()
        setPageNumber(pageNumber - 1)
        return url.toString()
    }

    const getRowSize = () => {
        const size = (typeof petitions !== "undefined" ? Number(petitions.length) : 0)
        return Math.min(4, size)
    }

    return (
        <React.Fragment>
            {console.log(pageTokens)}
            <h1>{props.title}</h1>
            {petitions.length ?
                <React.Fragment>
                    <Card.Group itemsPerRow={getRowSize()} centered>
                        {petitions.map(pet => {
                            return <PetitionCard
                                key={pet}
                                petition={pet}
                                {...props}
                            />
                        })}
                    </Card.Group>

                    <div style={{ display: 'inlineBlock' }}>
                        {pageNumber > 1 ?
                            <Button
                                icon
                                labelPosition='left'
                                onClick={() => {
                                    let newPageNumber = pageNumber - 1
                                    fetchAndUpdate(updateLastTokenURL(), newPageNumber)
                                }}                        >
                                Last
                                <Icon name='left arrow' />
                            </Button>
                            :
                            <div />
                        }
                        {pageTokens[pageNumber] !== '' && pageNumber < 10 ?
                            <Button
                                icon
                                labelPosition='right'
                                onClick={() => {
                                    let newPageNumber = pageNumber + 1
                                    fetchAndUpdate(updateNextTokenURL(), newPageNumber)
                                }}
                            >
                                Next
                                <Icon name='right arrow' />
                            </Button>
                            :
                            <div />
                        }

                    </div>

                    {pageNumber > 1 || pageTokens[pageNumber] !== '' ? <p>Page {pageNumber}</p> : <React.Fragment />}

                </React.Fragment>
                :
                <p>Pas de pétitions trouvées :/</p>
            }
        </React.Fragment>
    )
}

export default PetitionListing