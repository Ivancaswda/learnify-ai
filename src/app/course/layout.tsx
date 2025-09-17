'use client'
import React, {useEffect, useState} from 'react'
import {SelectedChapterContext} from "../../../context/SelectedChapterContext";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import {useAuth} from "../../../context/useAuth";
import {useRouter} from "next/navigation";

const Layout = ({children}: any) => {
    const [selectedChapter, setSelectedChapter] = useState<number>(0)
    const [isOpen, setIsOpen] = useState(false)
    const {user, loading} = useAuth()
    const router = useRouter()
    const toggleSidebar = () => setIsOpen(!isOpen)
    useEffect(() => {
        if (!loading && !user) {
            router.push("/sign-up");
        }
    }, [user, loading, router]);
    return (
        <div className="flex">

            <Sidebar isOpen={isOpen} toggle={toggleSidebar} />


            <div className="flex-1">
                <SelectedChapterContext.Provider value={{ selectedChapter, setSelectedChapter }}>
                    <Navbar toggle={toggleSidebar} />
                    <main>{children}</main>
                </SelectedChapterContext.Provider>
            </div>
        </div>
    )
}
export default Layout
