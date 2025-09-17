import React, { useContext } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SelectedChapterContext } from "../../../../context/SelectedChapterContext";
import { CheckCircleIcon, Loader2Icon } from "lucide-react";
import { useParams } from 'next/navigation';
import {LoaderOne} from "@/components/ui/loader";

const ChapterListSidebar = ({ course, enrolledCourse }: any) => {
    const { selectedChapter, setSelectedChapter } = useContext(SelectedChapterContext);
    const completedChapter = enrolledCourse?.completedChapters;

    const { group } = useParams(); // Получаем текущую группу из URL параметра

    // Проверка на пустое содержание курса
    if (!course?.courseContent || course?.courseContent.length === 0) {
        return (
            <div className='flex items-center flex-col gap-4 h-screen justify-center w-full'>
                <LoaderOne  />
                Загружаем данные...
            </div>
        );
    }


    console.log(selectedChapter)
    const handleChapterClick = ( chapterIndex: number) => {
        setSelectedChapter(chapterIndex);
    };


    return (
        <div className="w-80 bg-secondary p-5">
            <Accordion type="single" collapsible>

                {course?.courseContent[group]?.map((chapterGroup, chapterIndex) => (
                    <div key={chapterIndex}>
                        <AccordionItem
                            onClick={() => handleChapterClick(chapterIndex)}
                            value={`chapter-${chapterIndex}`}
                        >

                            <AccordionTrigger
                                className={`text-lg font-medium px-5 ${
                                    completedChapter?.some(
                                        (item: any) => item.group === parseInt(group) && item.chapter === chapterIndex
                                    )
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-white'
                                }`}
                            >
                                <span>{chapterIndex + 1}.</span>
                                {chapterGroup?.courseData?.topics[0].topic  || chapterGroup?.courseData?.topic}

                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    {chapterGroup?.courseData?.topics?.map((topic, topicIndex) => (
                                        <h2
                                            key={topicIndex}
                                            className={`p-3 my-1 rounded-lg ${
                                                completedChapter?.some(
                                                    (item: any) =>
                                                        item.group === parseInt(group) &&
                                                        item.chapter === chapterIndex
                                                )
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-white'
                                            }`}
                                        >
                                            {topic?.topic}
                                        </h2>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </div>
                ))}
            </Accordion>
        </div>
    );
};

export default ChapterListSidebar;
