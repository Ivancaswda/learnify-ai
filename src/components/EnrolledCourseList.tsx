'use client'
import React, {useEffect, useState} from 'react'
import axios from "axios";
import {toast} from "sonner";
import {useAuth} from "../../context/useAuth";
import EnrolledCourseCard from "@/components/EnrolledCourseCard";
import {Skeleton} from "@/components/ui/skeleton";

const EnrolledCourseList = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [enrolledCourses, setEnrolledCourses] = useState<any>([])
    const {user} = useAuth()
    useEffect(() => {
        user && getEnrolledCourses()
    }, [user])
    const getEnrolledCourses = async () => {
        try {
            setLoading(true)
            const result = await axios.get('/api/enroll-course');
            console.log(result.data)
            setEnrolledCourses(result.data)
        } catch (error) {
         toast.error('failed to get enrolled courses')
            setLoading(false)
        }
        setLoading(false)
    }

    return (
        <div className='mt-3'>
            {enrolledCourses.length === 0 ?  <div></div> :
                <div>

                     <h1 className='font-semibold text-2xl text-center'>Курсы на которые вы записались</h1>

                    <div className='gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>



                        {enrolledCourses?.map((course, index) => (
                            <EnrolledCourseCard course={course} key={index}/>
                        ))}

                    </div>
                </div>
            }
        </div>
    )
}
export default EnrolledCourseList
