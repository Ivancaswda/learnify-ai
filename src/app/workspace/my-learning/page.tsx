import React from 'react'
import EnrolledCourseList from "@/components/EnrolledCourseList";

const MyLearningPage = () => {
    return (
        <div>
            <h2 className='font-bold text-2xl mt-5'>Мое обучение</h2>
            <EnrolledCourseList/>
        </div>
    )
}
export default MyLearningPage
