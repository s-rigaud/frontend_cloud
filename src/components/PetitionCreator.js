import React, { useState } from 'react'

import { Button, Divider, Form, Popup, Icon, Label } from 'semantic-ui-react'

const PetitionCreator = (props) => {

    const [name, setName] = useState('')
    const [content, setContent] = useState('')

    const [currentTag, setCurrentTag] = useState('')
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)

    const clearFormFields = () => {
        setName('')
        setContent('')
        setTags([])
    }

    const isFormValid = () => {
        return name !== '' && content !== ''
    }

    const requestCreatePetition = () => {
        if (isFormValid()) {
            console.log(name, content)
            setLoading(true)
            fetch(props.url, {
                method: 'POST',
                headers: new Headers({
                    'Authorization': `Bearer ${props.authToken}`,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ 'name': name, 'body': content, 'tags': tags })
            })
                .then(res => res.json())
                .then(json => {
                    console.log(json)
                    clearFormFields()
                    props.setActiveTab('Home')
                })
        }
    }

    const handleTagInput = (value) => {
        if (value.slice(-1) === "\n") {
            const tagString = value.slice(0, -1).replaceAll("#", "")
            if (!tags.includes(tagString)) {
                setTags(tags => [...tags, tagString])
            }
            setCurrentTag('')
        } else {
            setCurrentTag(value)
        }
    }

    return (
        <React.Fragment>
            {props.authToken === '' ?
                <p>Connectez vous d'abord avant de pouvoir créer une nouvelle pétition</p>
                :
                <Form size='large'>
                    <Form.Input
                        autoFocus
                        required
                        fluid
                        label='Titre de la pétition'
                        placeholder="Pour l'indépendance de la Palestine ..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        style={{ width: '350px' }}
                    />
                    <Divider />

                    <Form.TextArea
                        label='Content'
                        required
                        placeholder="Et pourquoi pas ?"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        style={{ height: '150px' }}
                    />

                    <Divider />
                    <Form.TextArea
                        label='Add tags'
                        placeholder='#palestine, #free, ...'
                        value={currentTag}
                        onChange={(e, { value }) => handleTagInput(value)}
                    />

                    {tags.map(tag => {
                        return (
                            <Label key={`#${tag}`} color='orange'>
                                {`#${tag}`}
                                <Icon
                                    name='delete'
                                    key={tag}
                                    onClick={() => setTags(tags => tags.filter(
                                        currTag => currTag !== tag
                                    ))}
                                />
                            </Label>
                        )
                    })}

                    <Divider />

                    <Button
                        color={loading || !isFormValid() ? 'grey' : 'green'}
                        loading={loading}
                        onClick={requestCreatePetition}
                    >
                        Submit petition
                    </Button>
                    <Popup
                        mouseEnterDelay={500}
                        mouseLeaveDelay={500}
                        content="Ajouter une pétiton pour qu'elle soit signée par des millions de personnes"
                        trigger={<Button icon='question circle' />}
                    />
                </Form>
            }

        </React.Fragment>
    )
}

export default PetitionCreator