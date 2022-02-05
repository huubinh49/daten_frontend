const { default: axiosClient } = require("./axiosClient");
class MessageAPI{
    url = `messages/`;
    per_page = 20;
    get = (target_id, page = 0) =>{    
        return axiosClient.get(this.url, {
            params: {
                'target_id': target_id,
                'page': page,
                'per_page': this.per_page
            }
        })
    }
    create = (message) =>{
        return axiosClient.post(this.url, message)
    }
    seen = (message) => {
        return axiosClient.post(this.url + "seen", message)
    }
}
const messageAPI = new MessageAPI()
export default messageAPI;