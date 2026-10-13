import { signInWithEmailAndPassword } from "firebase/auth";
import {auth, db} from "./firebaseconfig.js"
import {doc,getDoc, updateDoc, onSnapshot, setDoc} from "firebase/firestore"



export async function UserLogin(username, password) {
    try {
        const cred = await signInWithEmailAndPassword(auth, username, password)
        alert("login successful")
        return cred.user
    } catch (error) {
        alert(`error logging in (${error.code}): ${error.message}`)
        return null
    }
}

export async function checkStore(boatName,boatId){
    const docref=doc(db,"boat",`${boatName}:${boatId}`)
    const snap=await getDoc(docref);

    if (!snap.exists()){
        await setDoc(docref,{})
    }
    return docref
}

export async function writeToStore(boatName,boatId,payload){
    try{
        const docref = await checkStore(boatName,boatId)
        await updateDoc(docref,payload)
    }catch(error){
        alert(`error updating the firestore ${error}`)
    }
}

export function subscribeToBoat(boatName, boatId, callback){
    const docref = doc(db, "boat", `${boatName}:${boatId}-telemetry`)
    const unsubscribe = onSnapshot(docref, (snap) => {
        if (snap.exists()){
            callback(snap.data())
        } else {
            callback(null)
        }
    })
    return unsubscribe
}

