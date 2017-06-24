import Firebase from './firebase'
import firebase from 'firebase'

export const get = (id) => Firebase
  .onceValue(`user/${id}/profile`)

export const setCurrentRoom = (roomId) => Firebase
  .set(`user/${firebase.auth().currentUser.uid}/current-room`, roomId)

export const getCurrentRoom = () => Firebase
  .onceValue(`user/${firebase.auth().currentUser.uid}/current-room`)
