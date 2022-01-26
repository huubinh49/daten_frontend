const axiosClient = require("./axiosClient");

class EvaluateAPI{
    url = 'evaluate';
    // check 2 users are matched
    evaluate = (user_id, target_id, evaluation) =>{
        
        return axiosClient.get(url, {
            params: {
                'user_id' : user_id,
                'target_id' : target_id,
                'evaluation': evaluation
            }
        })
    }
}
const evaluateAPI = new EvaluateAPI()
export default evaluateAPI;