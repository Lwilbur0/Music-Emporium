import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import glitchy from './images/glitchy.jpeg';
import './PostBoard.css';

function PostBoard({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    document.body.style.backgroundColor = 'white'; // Change background color to black
    document.body.style.backgroundImage = `url(${glitchy})`;
    document.body.style.backgroundRepeat = 'repeat';
    document.body.style.backgroundSize = '150px 80px';
    return () => {
      document.body.style.backgroundColor = ''; // Reset background color when component unmounts
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
    };
  }, []);

  const getPosts = async () => {
    try {
      const data = await getDocs(query(postsCollectionRef, orderBy("timestamp", "desc")));
      console.log(data)
      setPostList(
        data.docs.map((post) => ({
          ...post.data(),
          id: post.id,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  // const getPosts = async () => {
  //   try {
  //     const querySnapshot = await getDocs(
  //       query(postsCollectionRef, orderBy("timestamp", "desc"))
  //     );
  //     setPostList(
  //       querySnapshot.docs.map((post) => ({
  //         ...post.data(),
  //         id: post.id,
  //       }))
  //     );
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    getPosts();
  };

  useEffect(() => {
    console.log("Effect called");
    getPosts();
  }, []);
  return (
    <div className="homePage">
      {postLists.map((post) => {
        return (
          <div className="post">
            <div className="postHeader">
              <div className="title">
                <h1> <em>{post.title}</em><br/>{post.artist}</h1>
              </div>
              <img src={post.albumArtUrl} className="albumArt"/>
           {/*<div className="deletePost">
              {isAuth && (
                <button
                  onClick={() => {
                    deletePost(post.id);
                  }}
                >
                  {" "}
                  &#128465;
                </button>
              )}
            </div>*/}
            </div>
            <div className="postTextContainer"> {post.postText} </div>
            <h3>{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default PostBoard;