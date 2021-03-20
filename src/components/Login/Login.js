import firebase from "firebase/app";
import "firebase/auth";

import React, { useContext, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { UserContext } from "../../App";
import firebaseConfig from "../../firebase.config";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
  }

const Login = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [newUser, setNewUser] = useState(false);
    const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
    password: "",
  });
  const googleProvider = new firebase.auth.GoogleAuthProvider
  ();
  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        const { displayName, photoURL, email } = res.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photoURL: photoURL,
        };
        setUser(signedInUser);
        setLoggedInUser(signedInUser);
        history.replace(from);
       
      })
      .catch((err) => {
        console.log(err);
        // console.log(error.msg);
      });
  };
  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          photo: "",
          email: "",
          error: "",
          success: false,
        };
        setUser(signedOutUser);
      });
  };
  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    // console.log("clicked");
    if (newUser && user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
        //   setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
        history.replace(from);
        //   console.log('sign  in user info');
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
         
        });
    }
    console.log(newUser);
    if (!newUser && user.email && user.password) {
      console.log("log in");
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
        //   console.log(newUserInfo);
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          history.replace(from);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          updateUserName(user.name);
          // console.log('signed in user info', res.user);
        });
    }
    e.preventDefault();
  };
  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;
    

    user.updateProfile({
        displayName: name
        // photoURL: "https://example.com/jane-q-user/profile.jpg",
      })
      .then(function () {
       console.log('user name updated successfully');
      })
      .catch(function (error) {
        console.log(error);
      });
  };

   
    

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button onClick={handleSignIn} type="button" className="btn btn-outline-warning mt-5 mb-5">Sign in With Google</button>
        
      )}
      <br/>

      <button onClick={() => setNewUser(!newUser)}
        name="newUser"
        id="" type="button" class="btn btn-link">For new user</button>

        <div className="form-group"> 
      <form onSubmit={handleSubmit} action="">
        {newUser && (
          <input className=""
            type="text"
            onBlur={handleBlur}
            name="name"
            placeholder="enter name"
          />
        )}
        <input className="mt-3"
          type="text"
          onBlur={handleBlur}
          name="email"
          placeholder="Your email address"
          required
        />
        <br />
        <input
        className="mt-3"
          type="password"
          onBlur={handleBlur}
          name="password"
          placeholder="Your password"
          required
        />
        <br />
        <br />
        <input className="btn btn-warning" type="submit" value={newUser ? 'Sign up': 'Sign in'} />
       
      </form>
      </div>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && (
        <p style={{ color: 'green' }}>
          User {newUser ? "created" : "logged in"} successfully
        </p>
      )}
    </div>
  );
};

export default Login;
