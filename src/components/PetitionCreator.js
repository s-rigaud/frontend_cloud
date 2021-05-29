import React, {useState} from 'react'

import { Button, Divider, Form, Popup, Icon, Label } from 'semantic-ui-react'

const PetitionCreator = (props) => {

    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(false)

    const availableTags = [
        { key: 'cookie', text: '#cookie', value: 'cookie' },
        { key: 'milk', text: '#milk', value: 'milk' },
    ]

    const clearFormFields = () => {
        setName('')
        setContent("")
        setTags([])
    }

    const isFormValid = () => {
        return name !== "" && content !== ""
    }

    const requestCreatePetition = () => {
        if(isFormValid()){
            console.log(name, content)
            setLoading(true)
            fetch(`${props.baseBackEndUrl}/petitions`, {
                method: "POST",
                headers: new Headers({
                    'Authorization': `Bearer ${props.authToken}`,
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({"name": name, "body": content, "tags": tags})
            })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                clearFormFields()
                props.reset()
                props.setPetitionId(json.key.name)
                setLoading(true)
            })
        }
    }

    return (
        <Form size='large'>
            <Form.Input
                autoFocus
                required
                fluid
                label='Petition Name'
                placeholder='Make more cookie ...'
                value={name}
                onChange={(e) => {
                    setName(e.target.value)
                }}
            />
            <Divider />

            <Form.TextArea
                label='Content'
                required
                placeholder='We definitely do not make enough cookies a year !'
                value={content}
                onChange={e => setContent(e.target.value)}
            />

            <Divider />

            <Form.Select
                label='Add tags'
                placeholder='Cookies, NotEnough, ...'
                options={availableTags}
                onChange={(e, {value}) => {if(!tags.includes(value)) setTags(tags => [...tags, value])}}
            />

            {tags.map(tag => {
                return (
                <Label key={`#${tag}`}>
                    {`#${tag}`}
                    <Icon
                        name="delete"
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
                color={loading || !isFormValid()? "grey" : "green"}
                loading={loading}
                onClick={requestCreatePetition}
            >
                Submit petition
            </Button>
            <Popup
                content='Add petition so millon users can sign it and change the world'
                trigger={<Button icon='question circle' />}
            />
        </Form>
  )
}

export default PetitionCreator