'use client'
import React from 'react'
import EditCoursePage from "@/app/workspace/edit-course/[courseId]/page";



const ViewCourse = () => {



    return (
        <div>
            <EditCoursePage viewCourse={true}/>
        </div>
    )
}
export default ViewCourse
