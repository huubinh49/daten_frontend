const axiosClient = require("./axiosClient");

class ProfileAPI{
    url = `profile/`;
    get = (user_id) =>{
        
        return axiosClient.get(url, {
            params: {
                'user_id' : user_id
            }
        })
    }
    create = (formData) =>{
        return axiosClient.post(url, formData)
    }
}
const profileAPI = new ProfileAPI()
export default profileAPI;