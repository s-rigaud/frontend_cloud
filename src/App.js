import './App.css'

import React, { useState } from 'react'

import { Message } from 'semantic-ui-react'

import Home from './components/Home'
import Header from './components/Header'
import PetitionCreator from './components/PetitionCreator'
import PetitionListing from './components/PetitionListing'
import Profile from './components/Profile'


function App() {

  const baseBackEndUrl = 'https://petitions-31032021.ew.r.appspot.com/_ah/api'

  const [nextPageToken, setNextPageToken] = useState('')
  const [lastPageToken, setLastPageToken] = useState('')
  const [lastFetchedURL, setLastFetchedURL] = useState('')

  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('Home')

  // Used to know if the user is connected
  const [authToken, setAuthToken] = useState('')
  const [profileInfo, setProfileInfo] = useState('')

  const [filterWords, setFilterWords] = useState('')

  const ENDPOINTS = {
    create: {
      url: `${baseBackEndUrl}/petitions`,
    },
    created: {
      url: `${baseBackEndUrl}/me/petitions`,
    },
    filtered: {
      url: `${baseBackEndUrl}/petiton/filter`,
    },
    popular: {
      url: `${baseBackEndUrl}/petitions/top10`,
    },
    signed: {
      url: `${baseBackEndUrl}/me/signature`,
    },
  }

  const fetchAndUpdate = async (url, callBackFunction) => {
    console.log(url)
    setError('')
    fetch(url, {
      headers: new Headers({
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(json => {
        setLastFetchedURL(url)

        console.log(json)
        if (json.hasOwnProperty('items')) {
          callBackFunction(json.items.map(pet => [
            pet.key.name,
            pet.properties.content,
            pet.properties.created_at,
            pet.properties.name,
            pet.properties.owner,
            pet.properties.votes,
            pet.properties.tags,
            pet.properties.alreadySigned,
          ]))
        } else { callBackFunction([]) }

        // Google provide a last token leading to an empty result page as last token for pagination
        // We suppose we only get 10 results by page here
        if (json.hasOwnProperty('nextPageToken') && json.items.length > 9) {
          setNextPageToken(json.nextPageToken)
          console.log('last ', lastPageToken);
          console.log('next ', nextPageToken);
        } else {
          setNextPageToken('')
        }

      })
      .catch((error) => { setError(error); console.log(error) })
  }

  const getTagList = async (callbackHook) => {

    fetch(`${baseBackEndUrl}/petitions/tags/list`, {
      headers: new Headers({
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(json => {
        callbackHook(json.items)
      })
      .catch((error) => { setError(error); console.log(error) })
  }


  const updateSearchTag = (string) => {
    if (string.length > 2) {
      setFilterWords(string)
      setActiveTab("Filter")
    } else if(string.length == 0){
      setActiveTab("Home")
    }
  }

  const reset = () => {
    setError('')
    setFilterWords('')
  }

  // console.log("token ", authToken)

  return (
    <React.Fragment>
      <Header
        profileInfo={profileInfo}
        setAuthToken={setAuthToken}
        setProfileInfo={setProfileInfo}
        setActiveTab={setActiveTab}
        updateSearchTag={updateSearchTag}

        reset={reset}
      />

      <div id='content'>

        {error !== '' ?
          <Message
            negative
            icon='inbox'
            header='Sorry an error happened'
            content={error}
          />
          :
          <React.Fragment />
        }

        {activeTab === 'Profile' ?
          <Profile
            profileInfo={profileInfo}
            setActiveTab={setActiveTab}
          />
          :
          activeTab === 'Create' ?
            <PetitionCreator
              authToken={authToken}
              url={ENDPOINTS.create.url}

              getTagList={getTagList}
              setActiveTab={setActiveTab}

            />
            :
            activeTab === 'Created' ?
              <PetitionListing
                baseBackEndUrl={baseBackEndUrl}
                authToken={authToken}
                lastFetchedURL={lastFetchedURL}
                nextPageToken={nextPageToken}
                lastPageToken={lastPageToken}

                url={ENDPOINTS.created.url}
                title="Pétitions que j'ai créé"
                profileInfo={profileInfo}

                fetchAndUpdate={fetchAndUpdate}
                setLastPageToken={setLastPageToken}
              />
              :
              activeTab === 'Signed' ?
                <PetitionListing
                  baseBackEndUrl={baseBackEndUrl}
                  authToken={authToken}
                  lastFetchedURL={lastFetchedURL}
                  nextPageToken={nextPageToken}
                  lastPageToken={lastPageToken}

                  url={ENDPOINTS.signed.url}
                  title="Pétitions que j'ai signé"
                  profileInfo={profileInfo}

                  fetchAndUpdate={fetchAndUpdate}
                  setLastPageToken={setLastPageToken}
                />
                :
                activeTab === 'Filter' ?
                  <PetitionListing
                    baseBackEndUrl={baseBackEndUrl}
                    authToken={authToken}
                    lastFetchedURL={lastFetchedURL}
                    nextPageToken=''
                    lastPageToken=''

                    url={`${ENDPOINTS.filtered.url}?text=${filterWords}`}
                    title="Pétitions filtrées"
                    profileInfo={profileInfo}

                    fetchAndUpdate={fetchAndUpdate}
                    setLastPageToken={setLastPageToken}
                  />
                  :
                  <Home
                    baseBackEndUrl={baseBackEndUrl}
                    authToken={authToken}
                    url={ENDPOINTS.popular.url}
                    profileInfo={profileInfo}

                    setActiveTab={setActiveTab}
                    fetchAndUpdate={fetchAndUpdate}
                  />
        }

      </div>
    </React.Fragment>
  )
}

export default App
