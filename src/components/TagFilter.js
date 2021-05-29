import React, {useEffect, useState} from 'react'

import { Form, Icon, Label } from 'semantic-ui-react'


const TagFilter = (props) => {

    const [tags, setTags] = useState([])
    const [apiTags, setApiTags] = useState([])

    useEffect(() => {
        const populateTags = async() => {
          const responseTags = await props.getTagList()
          setApiTags(responseTags.map(tag => {
              return { key: tag, text: `#${tag}`, value: tag }
          }))
        }
        populateTags()
    }, [])

    return <React.Fragment>
         <Form size='large'>
            <Form.Select
                label='Add tags for search'
                placeholder='cookie, milk, ...'
                options={apiTags}
                onChange={(e, {value}) => {if(!tags.includes(value)) setTags(tags => [...tags, value])}}
            />
        </Form>

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
    </React.Fragment>
}

export default TagFilter