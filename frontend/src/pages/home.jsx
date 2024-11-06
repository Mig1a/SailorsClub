import './home.css'
import Card from '../components/cards';
import React, { useState, useEffect } from 'react';

const Home = (props) => {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        setPosts(props.data);
    }, [props.data]);

    return (
        <div>
            <div className="ReadPosts">
            {
                posts && posts.length > 0 ?(
                posts.map((posts,index) => 
                   <Card B_ID={posts.B_ID} B_Name={posts.B_Name} B_Type={posts.B_Type} B_Image={posts.B_Image}/>
                ) ): <h2>{'No Boats 😞'}</h2>
            }
        </div>
        

            

        </div>
        
    )

}

export default Home;