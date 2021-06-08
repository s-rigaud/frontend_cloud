import React, {useEffect, useState} from 'react'

import { Form, Icon, Label } from 'semantic-ui-react'

const TagFilter = (props) => {

    const [tags, setTags] = useState([])
    const [apiTags, setApiTags] = useState([])

    const formatTags = (responseTags) => {
        setApiTags(responseTags.map(tag => {
            return { key: tag, text: `#${tag}`, value: tag }
        }))
    }
    useEffect(async() => await props.getTagList(formatTags), [])

    useEffect(() => {if(tags.length > 0) fetchPetitionsByTag()}, [tags])

    const fetchPetitionsByTag = async() => {
        let url = `${props.baseBackEndUrl}/petitions/tags`
        /* TODO update this ugly manual update
           Hard time trying to use URL as in PetitionListing
        */
        let sep = ''
        for (let i = 0; i< tags.length; i++){
            i === 0? sep = '?': sep = '&'
            url += sep + 'tag=' + tags[i]
        }
        console.log(url)
        await props.fetchAndUpdate(url)
    }

    return <React.Fragment>
         <Form size='large'>
            <Form.Select
                label='Add tags for search'
                placeholder='cookie, milk, ...'
                options={apiTags}
                onChange={(e, {value}) => {
                    if(!tags.includes(value)) setTags(tags => [...tags, value])
                }}
            />
        </Form>

        {tags.map(tag => {
            return (
            <Label key={`#${tag}`}>
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
    </React.Fragment>
}

export default TagFilter