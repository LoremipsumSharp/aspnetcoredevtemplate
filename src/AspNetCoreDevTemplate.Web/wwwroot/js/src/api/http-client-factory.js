import axios from 'axios'
import {
    currentUser
} from "../../src/header";
import utils from '../utils'

const create = (baseUrl) => {
    let client = axios.create({
        baseURL: baseUrl,
        headers: {
            Authorization: utils.formatToken(currentUser.token)
        },
        timeout: 10000
    })

    return client
}


export default {
    create
}