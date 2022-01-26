const axiosClient = require("./axiosClient");

class MatchAPI{
    url = 'match';
    // check 2 users are matched
    get = (user_id, target_id) =>{
        
        return axiosClient.get(url, {
            params: {
                'user_id' : user_id,
                'target_id' : target_id
            }
        })
    }
    // Get all partner
    getAll = (user_id) =>{
        return axiosClient.get(`${this.url}/all`, {
            params: {
                'user_id' : user_id
            }
        })
    }
}
const matchAPI = new MatchAPI()
export default matchAPI;