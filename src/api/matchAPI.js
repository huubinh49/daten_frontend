const { default: axiosClient } = require("./axiosClient");

class MatchAPI{
    url = 'matches';
    // Get all partner
    getAll = (user_id) =>{
        return axiosClient.get(this.url)
    }
    // Get all chatted partner
    getAllChatted = (user_id) => {
        return axiosClient.get(`${this.url}/chatted`)
    }
}
const matchAPI = new MatchAPI()
export default matchAPI;