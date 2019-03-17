import currentUser from '../header'
import factory from '../api/http-client-factory'



const  bsMsgApiClient = factory.create(currentUser.bsMsgApiUrl)


export default {
    postNotification(postData){
        
    }
}