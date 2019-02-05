import firebase from 'firebase/app'
import 'firebase/auth' 

const config ={
    apiKey: "AIzaSyCjNisRg_W2L1ZNJZ7bNg6n0D8IkaoD4Hw",
    authDomain: "workshop-project-dv-b3317.firebaseapp.com",
    projectId:"workshop-project-dv-b3317",
    messagingSenderId:"2533808236691521"
}

firebase.initializeApp(config)

const auth = firebase.auth()
const provider = new firebase.auth.FacebookAuthProvider()

export{
    auth,
    provider
}