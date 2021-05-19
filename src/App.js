import './App.css'

import React, {useState} from 'react'

import { Message } from 'semantic-ui-react'

import Header from './components/Header'
import Menu from './components/Menu'

import PetitionCreator from './components/PetitionCreator'
import PetitionListing from './components/PetitionListing'
import PetitionView from './components/PetitionView'


function App() {

  const baseBackEndUrl = "https://petitions-31032021.ew.r.appspot.com/_ah/api"

  // [] means no result in API request / null means nothing has been fetched yet
  const [petitions, setPetitions] = useState(null)
  const [petitionId, setPetitionId] = useState('')

  const [nextPageToken, setNextPageToken] = useState("")
  const [lastFetchedURL, setLastFetchedURL] = useState("")
  const [error, setError] = useState("")
  const [petitionInCreation, setPetitionInCreation] = useState(false)

  // Used to know if the user is connected
  const [authToken, setAuthToken] = useState("")

  const fetchAndUpdate = async(url) => {
      console.log(url)
      fetch(url, {
        headers: new Headers({
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        })
      })
      .then(res => res.json())
      .then(json => {
        let items = []
        if(json.hasOwnProperty("items")){
          setPetitions(json.items)
          items = json.items
        }else{setPetitions([])}

        // Google provide a last token leading to an empty result page as last token for pagination
        // We suppose we only get 10 results by page here
        json.hasOwnProperty("nextPageToken") && items.length > 9? setNextPageToken(json.nextPageToken) : setNextPageToken("")
        setLastFetchedURL(url)
      })
      .catch((error) => {setError("error"); console.log(error)})
  }

  return (
    <React.Fragment>
      <Header
        setAuthToken={setAuthToken}
        setPetitionId={setPetitionId}
        setPetitions={setPetitions}
      />

      <div id="content">
        {error !== ""?
          <Message
            negative
            icon='inbox'
            header='Sorry an error happened'
            content={error}
          />
        :
          <React.Fragment />
        }

        {petitionInCreation?
          <PetitionCreator />
          :
          petitionId !== ""?
            <PetitionView
              baseBackEndUrl={baseBackEndUrl}
              authToken={authToken}
              petitionId={petitionId}
              setPetitionId={setPetitionId}
            />
            :
            petitions !== null?
              <PetitionListing
                baseBackEndUrl={baseBackEndUrl}

                petitions={petitions}
                lastFetchedURL={lastFetchedURL}
                setPetitionId={setPetitionId}
                setPetitions={setPetitions}
                nextPageToken={nextPageToken}
                setNextPageToken={setNextPageToken}

                fetchAndUpdate={fetchAndUpdate}
              />
              :
              <Menu
                baseBackEndUrl={baseBackEndUrl}
                authToken={authToken}

                setPetitions={setPetitions}
                setNextPageToken={setNextPageToken}

                setPetitionInCreation={setPetitionInCreation}

                fetchAndUpdate={fetchAndUpdate}
              />
          }
      </div>
    </React.Fragment>
  )
}

export default App
