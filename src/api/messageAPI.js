const { default: axiosClient } = require("./axiosClient");
class MessageAPI{
    url = `messages/`;
    get = (target_id, page = 0, per_page = 20) =>{    
        return axiosClient.get(this.url, {
            params: {
                'target_id': target_id,
                'page': page,
                'per_page': per_page
            }
        })
    }
    create = (message) =>{
        return axiosClient.post(this.url, message)
    }
}
const messageAPI = new MessageAPI()
export default messageAPI;