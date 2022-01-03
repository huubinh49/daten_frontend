import React from 'react'
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import ProfileForm from '../../components/ProfileForm/ProfileForm'

function Profile() {
    return (
        <>
            <Header />
                <section id="profile">
                    <ProfileForm />
                </section>
            <Footer />
        </>
    )
}

export default Profile
