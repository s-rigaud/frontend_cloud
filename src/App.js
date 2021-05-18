import React, {useState} from 'react'
import './App.css'

import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'
import { Message } from 'semantic-ui-react'

import Menu from './components/Menu'
import Header from './components/Header'
import PetitionListing from './components/PetitionListing'
import PetitionView from './components/PetitionView'


function App() {

  const baseBackEndUrl = "https://petitions-31032021.ew.r.appspot.com/_ah/api"
  // [] means no result in API request
  const [petitions, setPetitions] = useState(null)
  const [nextPageToken, setNextPageToken] = useState("")
  const [lastFetchedURL, setLastFetchedURL] = useState("")
  const [error, setError] = useState("")

  // Used to know if the user is connected
  const [authToken, setAuthToken] = useState("")

  const fetchAndUpdate = (url) => {
      console.log(url)
      fetch(url, {
        headers: new Headers({
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }),
      })
      .then(res => {
        if (res.status >= 200 && res.status <= 299){
          setLastFetchedURL(url)

          let json = res.json()
          console.log(json)
          json.hasOwnProperty("items")? setPetitions(json.items) : setPetitions([])
          json.hasOwnProperty("nextPageToken")? setNextPageToken(json.nextPageToken) : setNextPageToken("")

        }else{
          setError(`${res.status}: ${res.url}`)
        }
      })
      .catch((error) => {setError("error"); console.log(error)})
  }

  return (
    <React.Fragment>
      <Header
        setAuthToken={setAuthToken}
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

        <Router>
          <Switch>
            <Route path = "/" exact>
              {petitions !== null?
                <PetitionListing
                  baseBackEndUrl={baseBackEndUrl}

                  petitions={petitions}
                  lastFetchedURL={lastFetchedURL}
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

                  fetchAndUpdate={fetchAndUpdate}
                />
              }
            </Route>

            <Route path = "/petition/:petitionId" exact>
              <PetitionView
                baseBackEndUrl={baseBackEndUrl}
              />
            </Route>

            <Redirect to = "/" />

          </Switch>
        </Router>
      </div>
    </React.Fragment>
  )
}

export default App
