import './App.css'

import React, { useEffect, useState } from 'react'

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
      url: `${baseBackEndUrl}/petitions/top100`,
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

  const getUrlToFilter = () => {
    let url = `${baseBackEndUrl}/petitions/filter`
    /* TODO update this ugly manual update
       Hard time trying to use URL as in PetitionListing
    */
    const words = filterWords.split(' ')
    const tags = words.filter(w => w.slice(0, 1) == '#' && w.length > 1)
    const title = words.filter(w => w.slice(0, 1) != '#').join(' ').trim()

    for (let i = 0; i < tags.length; i++) {
      url += (i === 0 ? '?' : '&') + 'tag=' + tags[i].slice(1)
    }
    if (title != "" && tags.length)
      url += "&title=" + title
    else if (title != "")
      url += "?title=" + title

    console.log(url)
    return url
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
                description="Triées de la plus récente à la plus ancienne"
                profileInfo={profileInfo}

              />
              :
              activeTab === 'Signed' ?
                <PetitionListing
                  baseBackEndUrl={baseBackEndUrl}
                  authToken={authToken}

                  url={ENDPOINTS.signed.url}
                  title="Pétitions que j'ai signé"
                  description="Triées de la plus récente à la plus ancienne"
                  profileInfo={profileInfo}
                />
                :
                activeTab === 'Filter' ?
                  <PetitionListing
                    baseBackEndUrl={baseBackEndUrl}
                    authToken={authToken}

                    url={getUrlToFilter()}
                    title="Pétitions filtrées"
                    description="Triées de la plus récente à la plus ancienne"
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
                      description="Triées par nombre de signatures, puis de la plus récente à la plus ancienne"
                      profileInfo={profileInfo}
                    />
                  </React.Fragment>
        }

      </div>
    </React.Fragment>
  )
}

export default App
