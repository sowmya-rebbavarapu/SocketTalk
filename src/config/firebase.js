
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCDgiT_4FXWG01Vg-S49_t7mR2MhkigM-w",
  authDomain: "chat-app-e701b.firebaseapp.com",
  projectId: "chat-app-e701b",
  storageBucket: "chat-app-e701b.firebasestorage.app",
  messagingSenderId: "67930421178",
  appId: "1:67930421178:web:819188cc6c0c9b76bccf83"
};
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
const signup=async(username,email,password)=>{
   try{
        const res=await createUserWithEmailAndPassword(auth,email,password);
        const user=res.user;
        await setDoc(doc(db,"users",user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey",
            lastSeen:Date.now()
        })
        await setDoc(doc(db,"chats",user.uid),{
            chatData:[]
        })
   }catch(error)
   {

   }
}