'use client'
import React, {useEffect, useState} from 'react'
import Navbar from "@/components/Navbar";
import ChapterListSidebar from "@/app/course/_components/ChapterListSidebar";
import ChapterContent from "@/app/course/_components/ChapterContent";
import {useAuth} from "../../../../../context/useAuth";
import axios from "axios";
import {toast} from "sonner";
import {useParams} from "next/navigation";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";


const CoursePage = () => {

    const [isOpen, setIsOpen] = useState(false)
    const toggleSidebar = () => setIsOpen(!isOpen)

    const params = useParams();
    const { courseId, group} = params as { courseId: string; group: string };

    const groupIndex = parseInt(group) || 0;
    const [loading, setLoading] = useState<boolean>(false)
    const [enrolledCourse, setEnrolledCourse] = useState<any>()
    const [course, setCourse] = useState<any>()
    const {user} = useAuth()
    useEffect(() => {
        user && getEnrolledCourses()
    }, [user])
    const getEnrolledCourses = async () => {
        try {
            setLoading(true)
            const result = await axios.get(`/api/enroll-course?courseId=${courseId}`);
            console.log(result.data)
            setEnrolledCourse(result.data.enrolledCourse)
            setCourse(result.data.courses)
        } catch (error) {
            toast.error('failed to get enrolled course')
            setLoading(false)
        }
        setLoading(false)
    }
    return (
        <div className='max-h-screen'>

                <div className='flex gap-3 items-start'>

                    <ChapterListSidebar  course={course} enrolledCourse={enrolledCourse}/>
                    <ChapterContent course={course} enrolledCourse={enrolledCourse} refreshData={() => getEnrolledCourses()}/>

                </div>
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href={`/course/${courseId}/${groupIndex - 1}`} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href={`/course/${courseId}/1`} >1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationNext href={`/course/${courseId}/${groupIndex + 1}`} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}
export default CoursePage
