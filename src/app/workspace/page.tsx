'use client'
import React, {useEffect, useState} from 'react'
import { useAuth } from "../../../context/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import CourseList from "@/components/CourseList";
import EnrolledCourseList from "@/components/EnrolledCourseList";
import axios from "axios";
import {toast} from "sonner";
import {FlipWords} from "@/components/ui/flip-words";
import Footer from "@/components/Footer";
import {Card, CardTitle} from "@/components/ui/card";
import Image from "next/image";

// Навигационные ссылки для сайдбара






const Page = () => {
    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => setIsOpen(!isOpen)
    const [badges, setBadges] = useState<any[]>([]);
    const {user} = useAuth()


    useEffect(() => {
        if (user?.email) {
            axios.post("/api/get-badges").then((res) => {
                if (res.data.awardedBadges?.length) {
                    res.data.awardedBadges.forEach((badge: any) => {
                        toast.success(`Вы получили звание «${badge.title}» 🎉`);
                    });
                    setBadges((prev) => [...prev, ...res.data.awardedBadges]);
                }
            });
        }
    }, [user]);
    console.log(badges)
    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidebar isOpen={isOpen} toggle={toggleSidebar} />

            <div className="flex-1 flex flex-col">
                <div className="mt-10">
                    <h2 className="font-bold text-lg px-6">Мои награды</h2>
                    {badges.length === 0 ? (
                        <p className="px-6 text-neutral-500">Наград пока нет</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 mt-4">
                            {badges.map((badge) => (
                                <Card
                                    key={badge.id}
                                    className="flex flex-col items-center justify-center p-4 shadow-md"
                                >
                                    {badge.iconUrl && (
                                        <Image src={badge.iconUrl} width={40} height={40} alt={badge.title} className="w-16 h-16 object-cover" />
                                    )}
                                    <CardTitle className="mt-2 text-center">{badge.title}</CardTitle>
                                    <p className="text-sm text-neutral-500 text-center">
                                        {badge.description}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                <EnrolledCourseList/>
               <CourseList/>

            </div>
        </div>
    )
}

export default Page
