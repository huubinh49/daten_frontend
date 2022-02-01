const { default: axiosClient } = require("./axiosClient");

class EvaluateAPI{
    url = 'evaluate';
    // get evaluating profiles
    get = (per_page = 10, distance = 20) => {
        return axiosClient.get(`${this.url}/all`, {
            params: {
                'per_page': per_page,
                'distance': distance
            }
        })
    }
    vote = (target_id, is_liked) =>{
        return axiosClient.post(`${this.url}`)
    }
}
const evaluateAPI = new EvaluateAPI()
export default evaluateAPI;