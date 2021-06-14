import './App.css'

import React, { useState } from 'react'

import { Button, Message } from 'semantic-ui-react'

import Header from './components/Header'
import PetitionCreator from './components/PetitionCreator'
import PetitionListing from './components/PetitionListing'
import Profile from './components/Profile'


function App() {

  const baseBackEndUrl = 'https://petitions-31032021.ew.r.appspot.com/_ah/api'

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

  const updateSearchTag = (string) => {
    if (string.length > 2) {
      setFilterWords(string)
      setActiveTab("Filter")
    } else if (string.length === 0) {
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

              setActiveTab={setActiveTab}

            />
            :
            activeTab === 'Created' ?
              <PetitionListing
                baseBackEndUrl={baseBackEndUrl}
                authToken={authToken}

                url={ENDPOINTS.created.url}
                title="Pétitions que j'ai créé"
                profileInfo={profileInfo}

              />
              :
              activeTab === 'Signed' ?
                <PetitionListing
                  baseBackEndUrl={baseBackEndUrl}
                  authToken={authToken}

                  url={ENDPOINTS.signed.url}
                  title="Pétitions que j'ai signé"
                  profileInfo={profileInfo}
                />
                :
                activeTab === 'Filter' ?
                  <PetitionListing
                    baseBackEndUrl={baseBackEndUrl}
                    authToken={authToken}

                    url={`${ENDPOINTS.filtered.url}?text=${filterWords}`}
                    title="Pétitions filtrées"
                    profileInfo={profileInfo}
                  />
                  :
                  <React.Fragment>
                    <Button color='green' onClick={() => setActiveTab("Create")}>
                      + Créer une nouvelle pétition
                    </Button>

                    <PetitionListing
                      baseBackEndUrl={baseBackEndUrl}
                      authToken={authToken}
                      url={ENDPOINTS.popular.url}

                      title="Top 100 des pétitions"
                      profileInfo={profileInfo}
                    />
                  </React.Fragment>
        }

      </div>
    </React.Fragment>
  )
}

export default App
