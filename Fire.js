import firebase from 'firebase';

class Fire {
    constructor() {
      this.init();
      // this.observeAuth();
    }
  
    init = () => {
      if (!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: 'AIzaSyDoRix4u6dHzTB3F6mfooymJjHGgKlsCDA',
          authDomain: 'livechat-1c219.firebaseapp.com',
          databaseURL: 'https://livechat-1c219.firebaseio.com',
          projectId: 'livechat-1c219',
          storageBucket: '',
          messagingSenderId: '647962745390',
        });
      }
    };


    // observeAuth = () =>
    // firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

    // onAuthStateChanged = user => {
    //     if (!user) {
    //     try {
    //         firebase.auth().signInAnonymously();
    //     } catch ({ message }) {
    //         alert(message);
    //     }
    //     }
    // };

    // get uid() {
    //     return (firebase.auth().currentUser || {}).uid;
    // }

    // get ref() {
    //     return firebase.database().ref('messages');
    // }

    // parse = snapshot => {
    //     const { timestamp: numberStamp, text, user } = snapshot.val();
    //     const { key: _id } = snapshot;
    //     const timestamp = new Date(numberStamp);
    //     const message = {
    //     _id,
    //     timestamp,
    //     text,
    //     user,
    //     };
    //     return message;
    // };

    // on = callback =>
    //     this.ref
    //     .limitToLast(20)
    //     .on('child_added', snapshot => callback(this.parse(snapshot)));

    // get timestamp() {
    //     return firebase.database.ServerValue.TIMESTAMP;
    // }
     // send the message to the Backend
    // send = messages => {
    //     for (let i = 0; i < messages.length; i++) {
    //     const { text, user } = messages[i];
    //     const message = {
    //         text,
    //         user,
    //         timestamp: this.timestamp,
    //     };
    //     this.append(message);
    //     }
    // }; 
    // append = message => this.ref.push(message);

    // Login
    // login = async(users) => {
    //     await firebase.auth()
    //         .signInWithEmailAndPassword(users.email, users.password)
    //         .then(function(data){
    //             console.warn('login')
    //             console.warn(data)
    //         })
    //         .catch(function(error){
    //             console.warn(error)
    //         })
    //   }


    // add user
    // createAccount = async (users) => {
    //     await firebase.auth()
    //     .createUserWithEmailAndPassword(users.email, users.password)
    //     .then(function(data) {
    //       console.warn('berhasil')
    //       console.warn(data.user.uid)
    //       let username = users.username;
    //       let email = users.email;
    //       let password = users.password;
    //       firebase.database().ref('users/'+data.user.uid).set({
    //         username: username,
    //         email: email,
    //         password: password
    //       });
    //       Alert.alert('Success', "User "+username+" was created successfully.")
    //     }, 
    //     function(error ){
    //       console.warn(error.message)
    //       Alert.alert('Error',error.message)
    //     });
        
    //   }




    // close the connection to the Backend
    // off() {
    //     this.ref.off();
    // }
} 

Fire.shared = new Fire();
export default Fire;