import React, { useEffect, useState } from 'react'
import './DatingApp.scss';
import ProfileDeck from '../../components/ProfileDeck/ProfileDeck';
import Menu from '../../components/Menu/Menu';
import ChattingWindow from '../../components/ChattingWindow/ChattingWindow';
import { Routes, Route } from 'react-router-dom';
import { ChattingContext } from './DatingContext';
import * as authActions from '../../redux/authentication/auth_actions';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

export default function DatingApp(props) {
    const [chatting, setChatting] = useState(false);
    const reduxProps = useSelector(state=>({
        isAuthenticated: (state.user.token!=null)? true:false
      }), shallowEqual);
    
    const dispatch = useDispatch()
    useEffect(() => { 
        tryAutoSignIn();
    })

    const tryAutoSignIn=  ()=>{
        dispatch(authActions.checkAuthentication())
    }
    const user = {
        'user_id': "112",
        'name': "Que Tran",
        'age': "21",
        'job': "Student",
        'address': "Thu Duc",
        'distance': "20",
        'img_urls': ["https://images-ssl.gotinder.com/u/6Z1prNTM9cxLfRoQq58UcX/7wwDHqafRhM1e88S1og5yB.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS82WjFwck5UTTljeExmUm9RcTU4VWNYLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDA4NjcyMDZ9fX1dfQ__&Signature=daVfTFXe-JxboW8137c~dIjZ26yz6YnDpJLKWmhc~TqHTtzrYEMVQxTVQlHs0u5NueXnlpS28hex2r7aJiDqm9NPPERG2Lwwgp4Q5z~qsESkF7bJj4qN5F5j466qv0e9HWmGBH-PriB7ISnaXiSngXwJCcQ84nWXCIq9QkMdtu6N8fKIpjNs4xkcJvSu1HvXGRQPpJzZzNjT4ENEI4FOQzaKba~dBiuybcSIpfPv04AUMfyKvxz6oq~n8trsgSVmW9riR1YUDkchsmsFSkTCLe~nHESg7AeHs7D~BX5MP6I2oiHEqeuhewNU8lYj730-RZtzGB5GbMqHXkYHh73G~A__&Key-Pair-Id=K368TLDEUPA6OI", "https://images-ssl.gotinder.com/u/6Z1prNTM9cxLfRoQq58UcX/7wwDHqafRhM1e88S1og5yB.jpg?Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6IiovdS82WjFwck5UTTljeExmUm9RcTU4VWNYLyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE2NDA4NjcyMDZ9fX1dfQ__&Signature=daVfTFXe-JxboW8137c~dIjZ26yz6YnDpJLKWmhc~TqHTtzrYEMVQxTVQlHs0u5NueXnlpS28hex2r7aJiDqm9NPPERG2Lwwgp4Q5z~qsESkF7bJj4qN5F5j466qv0e9HWmGBH-PriB7ISnaXiSngXwJCcQ84nWXCIq9QkMdtu6N8fKIpjNs4xkcJvSu1HvXGRQPpJzZzNjT4ENEI4FOQzaKba~dBiuybcSIpfPv04AUMfyKvxz6oq~n8trsgSVmW9riR1YUDkchsmsFSkTCLe~nHESg7AeHs7D~BX5MP6I2oiHEqeuhewNU8lYj730-RZtzGB5GbMqHXkYHh73G~A__&Key-Pair-Id=K368TLDEUPA6OI"],
        'bio': "Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis sunt, unde quisquam, natus odit vitae perspiciatis laboriosam veniam odio animi amet ratione assumenda eaque porro tenetur repellendus dignissimos! Sint, amet!\nLorem ipsum dolor sit amet consectetur adipisicing elit. Facilis sunt, unde quisquam, natus odit vitae perspiciatis laboriosam veniam odio animi amet ratione assumenda eaque porro tenetur repellendus dignissimos! Sint, amet!"
    }
    return(
        <div className="app">
            <ChattingContext.Provider value={[chatting, setChatting]}>
                <Menu />
                <section className="deck">
                    
                        <Routes>
                            <Route element = {
                                    <React.Suspense fallback = {"loading..."}>
                                        <ChattingWindow {...user} />
                                    </React.Suspense>
                                } path="/messages/:id" key="/messages/:id" />;
                            
                            <Route exact ={true} element = {
                                    <React.Suspense fallback = {"loading..."}>
                                        <ProfileDeck />
                                    </React.Suspense>
                                } path="/" key="/" />;

                        </Routes>
                    
                </section>
            </ChattingContext.Provider>
        </div>
    )
};
