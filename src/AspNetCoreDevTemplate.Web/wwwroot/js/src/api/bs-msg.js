import currentUser from '../header'
import factory from '../api/http-client-factory'



bsMsgApiClient = factory.create(currentUser.bsMsgApiUrl)

export default {
    postNotification(postData){
        
    }
}