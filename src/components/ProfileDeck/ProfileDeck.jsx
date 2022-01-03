import React, { memo, useCallback, useState } from 'react'
import ProfileCard from '../ProfileCard/ProfileCard'
import "./ProfileDeck.scss";
const ProfileDeck = (props) => {
    const [profiles, setProfiles] = useState([
        {
            'user_id': "111",
            'name': "Thu Suong",
            'age': "18",
            'job': "Student",
            'address': "Ho Chi Minh",
            'distance': "2",
            'img_urls': ["https://images-ssl.gotinder.com/u/sswHNsj5gy9CTg84ug263d/rAEgpwz6QMxcXZgN9Nu6hh.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9zc3dITnNqNWd5OUNUZzg0dWcyNjNkLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDA4NzM1NjZ9fX1dfQ__&Signature=ocnhnN8uHKWTGfpVC5lScDLvHkHVZfFyJ6GuhVThri6jl11LioEJFzQ-TE-0GqEgQhQoIvZxNWS7o2TnOFopPBJAP3igfW19BXZk9dJfQkHC7QtvyHNiQbajFt5nDVOhZCY3YbOArsTtLYOx95eDTskCN0Yp-6HID0uYzdHDynHScNg7kDu05ESbAMqGgU3j-sLHUA85Kn0OZx~N83H9IGqD0GfmFKB7rVnS9kebo8JepYXP56hDu-LmuNAO7SKHm-HF32Qgylg4daLOXb93TzLMelsihGAeLX206n2Pm7xvFoVMPB-xxhCPaaoxg5apcF681ubLQ0NoS9fh-ha2dQ__&Key-Pair-Id=K368TLDEUPA6OI"],
            'bio': "Ban bong can icon cac thu"
        },
        {
            'user_id': "112",
            'name': "Que Tran",
            'age': "21",
            'job': "Student",
            'address': "Thu Duc",
            'distance': "20",
            'img_urls': ["https://images-ssl.gotinder.com/u/6Z1prNTM9cxLfRoQq58UcX/7wwDHqafRhM1e88S1og5yB.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS82WjFwck5UTTljeExmUm9RcTU4VWNYLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDA4NjcyMDZ9fX1dfQ__&Signature=daVfTFXe-JxboW8137c~dIjZ26yz6YnDpJLKWmhc~TqHTtzrYEMVQxTVQlHs0u5NueXnlpS28hex2r7aJiDqm9NPPERG2Lwwgp4Q5z~qsESkF7bJj4qN5F5j466qv0e9HWmGBH-PriB7ISnaXiSngXwJCcQ84nWXCIq9QkMdtu6N8fKIpjNs4xkcJvSu1HvXGRQPpJzZzNjT4ENEI4FOQzaKba~dBiuybcSIpfPv04AUMfyKvxz6oq~n8trsgSVmW9riR1YUDkchsmsFSkTCLe~nHESg7AeHs7D~BX5MP6I2oiHEqeuhewNU8lYj730-RZtzGB5GbMqHXkYHh73G~A__&Key-Pair-Id=K368TLDEUPA6OI"],
            'bio': ""
        },
        {
            'user_id': "113",
            'name': "Tuyet Anh",
            'age': "21",
            'job': "Student",
            'address': "Thu Duc",
            'distance': "20",
            'img_urls': ["https://images-ssl.gotinder.com/u/szPprGcro1DvMMNkKNai2P/am4tSofPSUwGMZDUYqZHnM.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS9zelBwckdjcm8xRHZNTU5rS05haTJQLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDA5NDQ5OTF9fX1dfQ__&Signature=jEO0b5jTNUixUG~dSpjZxt47zMU2-NqKzFIoa9MHzMg~RYSucFT~1BUhuKuHGNCWDDQX4N7zqHLis1hNz1G~XdGNtI7P8d4IVQza4Rah7zkA4Sxl3twSX3eB3klFQMQfV4U71cFG~kfkI0lP6trDP3Q-vB2TmVuBWjthlE8lUUFVN70HgVrU44AWiP~x9WituGmihtIx8e~grFkwY2p0tXY7T39Tu5WRSfVtL7da9n1JVExJvXJXoWn~xB-n0kR0FyxSzaETSbPr1P-ubAzhTFPkwJhzDaghhzQK2b6F2Ko6ACM237GlcUwV49WJFsLo-C~WewmpinTvsCauwgvzrg__&Key-Pair-Id=K368TLDEUPA6OI"],
            'bio': ""
        },
    ])

    const removeProfile = (id)=>{
            setProfiles((old_profiles)=> [  ...old_profiles.filter((profile, idx) => profile.user_id !== id)]);
    }

    return(
        <div className="card-deck">
            {
                profiles.map(
                        (profile, idx) => <ProfileCard {...profile} key={idx} removeProfile = {removeProfile}/>
                )
            }
        </div>
        
    )
}

export default memo(ProfileDeck);