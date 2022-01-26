const axiosClient = require("./axiosClient");

class MatchAPI{
    url = `match/`;
    get = (user_id, target_id) =>{
        
        return axiosClient.get(url, {
            params: {
                'user_id' : user_id,
                'target_id' : target_id
            }
        })
    }
    create = (formData) =>{
        return axiosClient.post(url, formData)
    }
}
const matchAPI = new MatchAPI()
export default matchAPI;