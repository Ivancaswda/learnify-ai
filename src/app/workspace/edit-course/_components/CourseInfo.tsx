import React, {useState} from 'react'
import {Book, ClockIcon, Loader2Icon, PlayIcon, TrendingUp} from "lucide-react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {FaMagic} from "react-icons/fa";
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import Link from "next/link";

const CourseInfo = ({courseInfo, course, viewCourse}: any) => {
    const router =useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const GenerateCourseContent = async () => {
       try {
           setLoading(true)

        const result = await axios.post('/api/generate-course-content', {
            courseJson: courseInfo,
            courseTitle: course?.name,
            courseId: course?.cid
        })
        console.log(result.data)
           router.replace('/workspace')
           toast.success('Курс успешно сгенерирован!')
       } catch (error) {
        toast.error('failed to generate course content')
           console.log(error)
       }
       setLoading(false)
    }
    console.log(course)
    console.log(courseInfo)

    return (
        <div className="flex gap-8 justify-between p-6  rounded-xl shadow-lg">

            <div className="flex flex-col w-full">
                <h2 className="font-bold text-3xl">{courseInfo?.name}</h2>
                <p className="mt-2 mb-4 line-clamp-3">{courseInfo?.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <ClockIcon className="text-orange-500 w-6 h-6 shrink-0" />
                        <section>
                            <h2 className="font-semibold text-gray-700">Длительность</h2>
                            <p className="text-gray-500">{courseInfo?.duration || '3 часа'}</p>
                        </section>
                    </div>
                    <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <Book className="text-orange-500 w-6 h-6 shrink-0" />
                        <section>
                            <h2 className="font-semibold text-gray-700">Главы</h2>
                            <p className="text-gray-500">{course?.courseJson?.course?.chapters.length || 'N/A'}</p>
                        </section>
                    </div>
                    <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                        <TrendingUp className="text-orange-500 w-6 h-6 shrink-0" />
                        <section>
                            <h2 className="font-semibold text-gray-700">Уровень</h2>
                            <p className="text-gray-500">{course?.level || 'Нет данных'}</p>
                        </section>
                    </div>
                </div>
                {!viewCourse ?   <Button onClick={GenerateCourseContent} disabled={loading} className="w-full bg-orange-500 mt-6 text-white hover:bg-orange-600">

                    {loading ? <Loader2Icon className='animate-spin text-white'/> :  <FaMagic className="mr-2" /> }
                   Сгенерировать курс
                </Button>:
                    <Link  href={`/course/${course?.cid}/0`}>


                <Button disabled={loading} className="w-full bg-orange-500 mt-6 text-white hover:bg-orange-600">


                    {loading ? <Loader2Icon className='animate-spin text-white'/> :  <PlayIcon className="mr-2" /> }
                    Продолжить учиться
                </Button> </Link>}
            </div>


        </div>
    )
}
export default CourseInfo
