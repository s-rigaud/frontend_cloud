import React from 'react'

import { Button, Image } from 'semantic-ui-react'

const Profile = (props) => {

    return <React.Fragment>
        <Image src={props.profileInfo.imageUrl} size='medium' circular />
        <h2>{props.profileInfo.name}</h2>

        <div style={{ display: "inline-block" }}>
            <Button color="purple" onClick={() => props.setActiveTab("Created")}>
                Voir les pétitions que j'ai créé
            </Button>
            <Button color="orange" onClick={() => props.setActiveTab("Signed")}>
                Voir les pétitions que j'ai signé
            </Button>
        </div>

    </React.Fragment>
}

export default Profile