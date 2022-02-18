const { default: axiosClient } = require("./axiosClient");

class MatchAPI{
    url = 'matches';
    // Get specific match
    get = (target_id) => {
        return axiosClient.get(this.url, {
            params: {
                'target_id': target_id
        }})
    }
    // Get all partner
    getAll = (user_id) =>{
        return axiosClient.get(`${this.url}/all`)
    }
    // Get all chatted partner
    getAllChatted = (user_id) => {
        return axiosClient.get(`${this.url}/chatted`)
    }
    // Get all chatted partner
    getAllPrivatelyChatted = (user_id) => {
        return axiosClient.get(`${this.url}/privately-chatted`)
    }
}
const matchAPI = new MatchAPI()
export default matchAPI;