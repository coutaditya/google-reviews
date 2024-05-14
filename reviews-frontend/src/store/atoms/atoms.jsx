import { atom } from 'recoil'
import { TOKEN_NAME } from '../../constants/constants'

export const moviesAtom = atom({
    key: 'moviesAtom',
    default: []
})

export const wishlistedMoviesAtom = atom({
    key: 'wishlistedMoviesAtom',
    default: []
})

export const userAtom = atom({
    key: 'userAtom',
    default: localStorage.getItem(TOKEN_NAME)
})