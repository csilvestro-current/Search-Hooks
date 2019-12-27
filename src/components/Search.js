import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'


export default function Search() {
    const [query, setQuery] = useState('')
    const [jokes, setJokes] = useState([])
    const focusSearch = useRef(null)

    useEffect(() => {focusSearch.current.focus()}, [])

    //Fetch API Data
    const getJokes = async (query) => {
        const results = await fetch(`https://icanhazdadjoke.com/search?term=${query}`, {
            headers: {'accept': 'application/json'}
        })
        const jokesData = await results.json()
            return jokesData.results
    }
// }

    //Prevents rerender flickering as user types in search
    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    //useEffect - Only rerenders when query is changed
    useEffect(() => {
        let currentQuery = true
        const controller = new AbortController()

        const loadJokes = async () => {
            if (!query) return setJokes([])

            await sleep(350)
            if (currentQuery) {
                const jokes = await getJokes(query, controller)
                setJokes(jokes)
            }
        }
        loadJokes()
        
        return () => {
            currentQuery = false
            controller.abort(0)
        }

    }, [query])


    let jokeComponents = jokes.map((joke, index) => {
        return (
            <ListGroup.Item key={index} action variant="secondary">
                {joke.joke}
            </ListGroup.Item>
        )
    })

    //Render Component
    return (
        <>
        <Jumbotron fluid>
            <Form id="search-form">
                <h4>Dad Jokes</h4>
                <Form.Control 
                    type="email"
                    placeholder="Search for a Joke..."
                    ref={focusSearch}
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
            />
            </Form>
            <br />
            <ListGroup>
                {jokeComponents}
            </ListGroup>
        </Jumbotron>
        </>
    )
}