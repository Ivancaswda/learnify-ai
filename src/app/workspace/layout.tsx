'use client'
import React, {useEffect, useState} from 'react'
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import {useRouter} from "next/navigation";
import {useAuth} from "../../../context/useAuth";

const Layout = ({children}: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const {user, loading} = useAuth()
    const router =useRouter()
    const toggleSidebar = () => setIsOpen(!isOpen)
    useEffect(() => {
        if (!loading && !user) {
            router.push("/sign-up");
        }
    }, [user, loading, router]);
    return (
        <div className="flex ">

            <Sidebar isOpen={isOpen} toggle={toggleSidebar} />


            <div className="flex-1">
                <Navbar toggle={toggleSidebar} />
                    <main className='max-w-screen'>{children}</main>
                <Footer/>
            </div>

        </div>
    )
}
export default Layout
