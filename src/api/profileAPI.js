const { default: axiosClient } = require("./axiosClient");

class ProfileAPI{
    url = `profile/`;
    get = (user_id) =>{
        
        return axiosClient.get(this.url, {
            params: {
                'user_id' : user_id
            }
        })
    }
    create = (formData) =>{
        return axiosClient.post(this.url, formData)
    }
}
const profileAPI = new ProfileAPI()
export default profileAPI;