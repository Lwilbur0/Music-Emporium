import React, { useState, useEffect, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import { StarIcon } from '@heroicons/react/24/outline';
import Rating from "./Rating";
import { IonIcon } from '@ionic/react';
import { starOutline } from 'ionicons';



function CreatePost({ isAuth }) {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [postText, setPostText] = useState("");
  const [albumArtUrl, setAlbumArtUrl] = useState("");
  const [user, setUser] = useState("");
  const [rating, setRating] = useState("");
  const [albumNotFound, setAlbumNotFound] = useState(false)
  const [initial, setInitial] = useState(true);
  const [activeStar, setActiveStar] = useState(-1);
  const [hoverActiveStar, setHoverActiveStar] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);
  const totalStars = 5;
  const activeStars = 3;
  const ratingContainerRef = useRef(null);
  const precision = 1;
  
  const handleClick = (e) => {
    setIsHovered(false);
    setActiveStar(calculateRating(e));
  };
  const handleMouseMove = (e) => {
    setIsHovered(true);
    setHoverActiveStar(calculateRating(e)); // We already calculation in this function
  };
  const handleMouseLeave = (e) => {
    setHoverActiveStar(-1); // Reset to default state
    setIsHovered(false);
  };

  const activeState = isHovered ? hoverActiveStar : activeStar;

  const postsCollectionRef = collection(db, "posts");
  let navigate = useNavigate();



  const createPost = async () => {
    console.log(auth)
    console.log(title)
    console.log(artist)
    console.log("'${artist}', '${title}'")
    await albumArt(artist, {album: title}).then((result) => {
      if (result) {
      console.log(result);
      setAlbumArtUrl(result);
      }
      else {

      }
    })
    .catch((error) => {
      document.body.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='173' height='90' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='maroon' font-family='sans-serif' font-size='22' font-weight='bold'%3EAlbum%20Not%20Found%3C/text%3E%3C/svg%3E")`;
      console.error("Error fetching album art:", error);
    });
  //  console.log("addDoc")
  //  console.log(albumArtUrl)
  //   await addDoc(postsCollectionRef, {
  //     title,
  //     artist,
  //     postText,
  //     author: { name: "Liam Wilbur", id: 4 },
  //     albumArtUrl,
  //   });
  //   navigate("/music");
  };
  
  useEffect(() => {
    if (initial) {
      console.log("first");
      setInitial(false);
    }
    else {
      console.log(albumArtUrl);
      const savePost = async () => {
        console.log("addDoc");
        console.log(albumArtUrl);
    
        try {
          await addDoc(postsCollectionRef, {
            title,
            artist,
            postText,
            author: { name: user, id: 4 },
            albumArtUrl,
            timestamp: serverTimestamp(),
          });
    
          navigate("/music");
        } catch (error) {
          console.error("Error adding document:", error);
          // Handle the error, e.g., display an error message to the user
        }
      };
    
      savePost();
    }
  }, [albumArtUrl]);
  
  // if banned:
  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
  }, []);
  
  useEffect(() => {
    document.body.style.backgroundColor = 'white'; // Change background color to black
    // document.body.style.backgroundImage = `url(${glitchy})`;
    // document.body.style.backgroundRepeat = 'repeat';
    return () => {
      document.body.style.backgroundColor = ''; // Reset background color when component unmounts
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);
  
  function RatingIcon(props) {
    const {
      index,
      rating,
      hoverRating,
      onMouseEnter,
      onMouseLeave,
      onSaveRating,
    } = props;
    const fill = React.useMemo(() => {
      if (hoverRating >= index) {
        return 'yellow';
      } else if (!hoverRating && rating >= index) {
        return 'yellow';
      }
      return 'none';
    }, [rating, hoverRating, index]);
    return (
        <div 
          className="cursor-pointer"
          onMouseEnter={() => onMouseEnter(index)} 
          onMouseLeave={() => onMouseLeave()} 
          onClick={() => onSaveRating(index)}>
          <StarIcon fill={fill} />
        </div>
    )
  }
  
  const calculateRating = (e) => {
    const { width, left } = ratingContainerRef.current.getBoundingClientRect();
    let percent = (e.clientX - left) / width;
    const numberInStars = percent * totalStars;
    const nearestNumber = Math.round((numberInStars + precision / 2) / precision) * precision;;
    return Number(
      nearestNumber.toFixed(precision.toString().split(".")[1]?.length || 0)
    );
  };

  const albumArt = require( 'album-art' )

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h1>Create A Post</h1>
        <div style = {{display: 'flex', alignItems: 'center',}}>
        <div className="inputGp" style ={{marginRight: '2.7vw'}}>
          <label> Title:</label>
          <input
            placeholder="Title..."
            onChange={(event) => {
              setTitle(event.target.value.replace("'", ''));
            }}
            style = {{width: '210px'}}
          />
        </div>
        <div className="inputGp">
          <label> Artist:</label>
          <input
            placeholder="Artist..."
            onChange={(event) => {
              setArtist(event.target.value.replace("'", ''));
            }}
            style = {{width: '230px'}}
          />
        </div>
        </div>
        <div className="inputGp">
          <label> Post:</label>
          <textarea
            placeholder="Post..."
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
        </div>
        <div style = {{ display: 'inline-flex', marginLeft: '12%'}}>
       
    { /* <div style={{textAlign: "left",}}>
          <Rating rating={5} />
          </div> */ }
          <div style = {{top: '50px'}}>
         <h1 style = {{fontWeight: 15, fontSize: 25, position: 'relative', top: 13}}>Who are you?</h1>
         </div>
        <input
            placeholder="User..."
            onChange={(event) => {
              setUser(event.target.value);
            }}
            style = {{width: '13vw', height: '35px', justifyContent: 'center', marginLeft: '28px', marginTop: '23px' }}
          />
          </div>
        <button onClick={createPost}> Submit Post</button>
      </div>
      {albumNotFound && (
        <div className="speechBubble">Album Not Found</div>
      )}
    </div>
  );
}

export default CreatePost;