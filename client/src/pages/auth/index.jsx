import React, { useState } from 'react';
import Victory from '@/assets/victory.svg';
import Background from '@/assets/login2.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { apiClient } from '@/lib/api-client';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

const Auth = () => {
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore(); // Corrected usage
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        } else if (!password.length) {
            toast.error("Password is required");
            return false;
        }
        return true;
    };

    const validateSignup = () => {
        if (!email.length) {
            toast.error("Email is required");
            return false;
        } else if (!password.length) {
            toast.error("Password is required");
            return false;
        } else if (password !== confirmPassword) {
            toast.error("Passwords are not matching");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (validateLogin()) {
            try {
                console.log("Entered");
                const response = await apiClient.post(LOGIN_ROUTE, { email, password });
                console.log('Login response:', response);
                if (response.data.user) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetup) {
                        navigate("/chat");
                    } else {
                        navigate("/profile");
                    }
                }
            } catch (error) {
                console.log('Login error:', error);
            }
        } else {
            console.error('Login validation failed');
        }
    };

    const handleSignup = async () => {
        if (validateSignup()) {
            try {
                console.log("Entered");
                const response = await apiClient.post(SIGNUP_ROUTE, { email, password });
                console.log('Signup response:', response);
                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetup) {
                        navigate("/chat");
                    } else {
                        navigate("/profile");
                    }
                }
            } catch (error) {
                console.log('Signup error:', error);
            }
        } else {
            console.error('Signup validation failed');
        }
    };

    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
                <div className='flex flex-col gap-10 items-center justify-center'>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                            <img src={Victory} alt='Victory Image' className='h-[100px]' />
                        </div>
                        <p className='font-medium text-center'>Fill in the Details to get started with the best chat app!</p>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <Tabs className='w-3/4' defaultValue='login'>
                            <TabsList className='bg-transparent rounded-none w-full'>
                                <TabsTrigger value='login'
                                    className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                    data-[state=active]:text-black
                                    data-[state=active]:font-semibold
                                    data-[state=active]:border-purple-500 p-3 transition-all duration-300'> Login </TabsTrigger>
                                <TabsTrigger value='signup'
                                    className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                    data-[state=active]:text-black
                                    data-[state=active]:font-semibold
                                    data-[state=active]:border-purple-500 p-3 transition-all duration-300'> Signup </TabsTrigger>
                            </TabsList>
                            <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6 mt-4" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Button className='rounded-full p-6' onClick={handleLogin}>Login</Button>
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5">
                                <Input placeholder="Email" type="email" className="rounded-full p-6" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6 mt-4" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <Input placeholder="Confirm Password" type="password" className="rounded-full p-6 mt-4" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                <Button className='rounded-full p-6' onClick={handleSignup}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className='hidden xl:flex justify-center items-center overflow-hidden'>
                    <img src={Background} alt='background login' className='h-full w-auto object-cover' />
                </div>
            </div>
        </div>
    );
}

export default Auth;
