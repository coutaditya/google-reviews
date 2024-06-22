import { atom } from 'recoil'
import { TOKEN_NAME } from '../../constants/constants'

export const moviesAtom = atom({
    key: 'moviesAtom',
    default: []
})

export const filteredMoviesAtom = atom({
    key: 'filteredMoviesAtom',
    default: []
})

export const wishlistedMoviesAtom = atom({
    key: 'wishlistedMoviesAtom',
    default: []
})

export const editorsChoiceMoviesAtom = atom({
    key: 'editorsChoiceMoviesAtom',
    default: []
})

export const myEditorsChoiceMoviesAtom = atom({
    key: 'myEditorsChoiceMoviesAtom',
    default: []
})

export const userAtom = atom({
    key: 'userAtom',
    default: {
        "token": localStorage.getItem(TOKEN_NAME),
        "isEditor": false
    }
})