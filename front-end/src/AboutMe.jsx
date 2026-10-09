import './AboutMe.css' // get css from AboutMe.css file
import { useEffect, useState } from 'react' 

const AboutMe = props => {
    // initialize state for data and error
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/about-me') // fetch from back end
        .then(res => {
            if (!res.ok) throw new Error('Fetch failed.')
            return res.json()
        })
        .then(setData) // update data state
        .catch(setError) // update error state if fetch fails
    }, [])

    if (error) return <p>Error loading page: {error.message}</p>
    if (!data) return <p>Loading...</p>
    return (
        <div>
            <h1>{data.title}</h1>
            <img src={data.image} alt="Photo of Me" style={{ width: '200px' }} />
            <p>{data.info[0]}</p>
            <p>{data.info[1]}</p>
        </div>
    )
}

export default AboutMe