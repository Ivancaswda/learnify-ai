'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import CourseCard from "@/components/CourseCard";
import { useAuth } from "../../../../context/useAuth";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ExplorePage = () => {
    const [courseList, setCourseList] = useState<any[]>([])
    const { user } = useAuth()

    useEffect(() => {
        user && GetCourseList()
    }, [user])

    const GetCourseList = async () => {
        try {
            const result = await axios.get('/api/courses?courseId=0')
            setCourseList(result.data)
        } catch (error) {
            toast.error('Не удалось загрузить курсы')
            console.error(error)
        }
    }

    return (
        <div className="px-6">

            <h2 className="font-bold text-4xl text-center mb-10 text-gray-800 mt-8">
                Изучить больше уроков
            </h2>


            <div className="flex justify-center mb-12">
                <div className="relative w-full max-w-xl flex gap-3">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            placeholder="Поиск по курсам..."
                            className="pl-10 pr-4 py-2 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition"
                        />
                    </div>
                    <Button className="rounded-2xl bg-orange-500 hover:bg-orange-600 transition">
                        Искать
                    </Button>
                </div>
            </div>

            {/* Список курсов */}
            <h3 className="font-semibold text-2xl mb-6 text-gray-800">
                Список курсов
            </h3>
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courseList?.length > 0
                    ? courseList.map((course, index) => (
                        <CourseCard course={course} key={index} />
                    ))
                    : [0, 1, 2, 3].map((_, index) => (
                        <Skeleton className="w-full h-[260px] rounded-2xl" key={index} />
                    ))}
            </div>
        </div>
    )
}

export default ExplorePage
