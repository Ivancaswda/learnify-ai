import React, { useContext, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SelectedChapterContext } from "../../../../context/SelectedChapterContext";
import {
    ArrowDown,
    CheckCircleIcon,
    Loader2Icon,
    PlayCircleIcon,
    Settings2Icon,
    TriangleAlert,
    XIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import YouTube from "react-youtube";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
    Pagination,
    PaginationContent, PaginationEllipsis,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import {toast} from "sonner";
import {LoaderOne} from "@/components/ui/loader";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Editor from "@monaco-editor/react";
import {cn} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Image from "next/image";
import {FaMagic} from "react-icons/fa";

const ChapterContent = ({ course, refreshData, enrolledCourse }: any) => {
    const [loadingPractice, setLoadingPractice] = useState<boolean>(false)
    const { selectedChapter, setSelectedChapter } = useContext(SelectedChapterContext);
    const [practiceTask, setPracticeTask] = useState()
    const [onChecking, setOnChecking] = useState<boolean>(false)
    const [practiceAnswer, setPracticeAnswer] = useState()
    const [materials, setMaterials] = useState()
    const [timeLeft, setTimeLeft] = useState(30);
    const [answer, setAnswer] = useState('');
    const [status, setStatus] = useState<"pending" | "fail" | "success">("pending");
    const [pdf, setPdf] = useState()
    const params = useParams();
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({});
    const [cardLoading, setCardLoading] = useState<boolean>(false)
    const [loadingMaterials, setLoadingMaterials] = useState<boolean>(false)
    const [loadingHomework, setLoadingHomework] = useState<boolean>(false);
    const [homework, setHomework] = useState<string | null>(null);
    const router = useRouter();
    console.log(course)
    const { courseId, group} = params as { courseId: string; group: string };

    const groupIndex = parseInt(group) || 0;


    const completedChapter = enrolledCourse?.completedChapters || [];
    const currentGroup = course?.courseContent?.[groupIndex]

    const currentChapter = currentGroup?.[selectedChapter];
    const getMaterials = async () => {
        if (!enrolledCourse?.userEmail) return;

        try {
            setCardLoading(true)
            const res = await axios.post("/api/get-materials", {
                courseId,
                groupIndex,
                chapterIndex: selectedChapter,
            });

            if (res.data) {
                setMaterials(res.data);
            }
        } catch (err) {
            console.error("Ошибка при загрузке материалов", err);
            setCardLoading(false)
        }
        setCardLoading(false)
    }
    useEffect(() => {
        const fetchSavedHomework = async () => {
            if (!enrolledCourse?.userEmail) return;
setCardLoading(true)
            try {
                const res = await axios.post("/api/get-homework", {
                    courseId,
                    groupIndex,
                    chapterIndex: selectedChapter
                });

                if (res.data?.answers) {
                    setUserAnswers(res.data.answers);
                }
            } catch (err) {
    setCardLoading(false)
                console.error("Ошибка при загрузке ответов", err);
            }
            setCardLoading(false)
        };

        fetchSavedHomework();
    }, [courseId, groupIndex, selectedChapter, enrolledCourse?.userEmail]);

    useEffect(() => {
        setSelectedChapter(selectedChapter);


        if (currentChapter?.homework) {
            setHomework(currentChapter.homework);
        } else {
            setHomework(null);
        }
    }, [selectedChapter, currentChapter, setSelectedChapter]);
    useEffect(() => {

        setSelectedChapter(selectedChapter);
    }, [selectedChapter, setSelectedChapter]);
    useEffect(() => {
            getMaterials()
    }, [courseId, groupIndex, selectedChapter, enrolledCourse?.userEmail]);

    useEffect(() => {
        const fetchPractice = async () => {
            setCardLoading(true)
            try {
                const res = await axios.get(`/api/save-practice-task`, {
                    params: {
                        courseId,
                        groupIndex,
                        chapterIndex: selectedChapter
                    }
                });
                console.log('fetchPractice===')
                console.log(res.data)
                if (res.data.practice) {

                    setPracticeTask(res.data.practice);
                    setAnswer(res.data.answer || "");
                }
            } catch (err) {
                setCardLoading(false)
                console.error("Ошибка загрузки практики", err);
            }
            setCardLoading(false)
        };
        fetchPractice();
    }, [courseId, groupIndex, selectedChapter]);
    const savePracticeAnswer = async (value: string) => {
        await axios.post(`/api/save-practice-task`, {
            courseId,
            groupIndex,
            chapterIndex: selectedChapter,
            userAnswer: value
        });
    };



    const updateURL = (groupIndex: number, chapterIndex: number) => {
        router.push(`/course/${courseId}/${groupIndex}`);
    };

    const [loading, setLoading] = useState<boolean>(false);

    const markChapterCompleted = async () => {
        setLoading(true)
        try {
            if (Object.keys(userAnswers).length === 0) {
                toast.warning('Вам сначало нужно ответить на вопросы перед тем как завершать!')
                return
            }

            const updated = [
                ...(completedChapter || []),
                { group: groupIndex, chapter: selectedChapter }
            ]
            await axios.put('/api/enroll-course', {
                courseId,
                completedChapter: updated
            })
            refreshData()
        } finally {
            setLoading(false)
        }
    }

    const markInCompleteChapter = async () => {
        setLoading(true)
        try {
            const updated = (completedChapter || []).filter(
                (item: any) => !(item.group === groupIndex && item.chapter === selectedChapter)
            )
            await axios.put('/api/enroll-course', {
                courseId,
                completedChapter: updated
            })
            refreshData()
        } finally {
            setLoading(false)
        }
    }
    if (!course?.courseContent || course?.courseContent.length === 0) {
        return ;
    }

    const isChapterCompleted = completedChapter?.some(
        (item: any) => item.group === groupIndex && item.chapter === selectedChapter
    );



    const generateHomework = async () => {
        setLoadingHomework(true);
        try {
            const res = await axios.post(`/api/generate-homework`, {
                courseId,
                groupIndex,
                chapterIndex: selectedChapter
            });
            setHomework(res.data.homework);
            toast.success('Дз успешно сгенеровано!')
        } catch (err) {
            toast.error("Ошибка генерации домашнего задания");
        } finally {
            setLoadingHomework(false);
        }
    };

    const checkAnswer = async (qIndex: number, question: any) => {
        const res = await axios.post("/api/check-homework", {
            userAnswer: userAnswers[qIndex],
            correctAnswer: question.correctAnswer,
            type: question.type,
        });
        setResults({ ...results, [qIndex]: res.data.correct });
    };

    const handleSaveHomework = async () => {
        try {
            setLoadingHomework(true)
            await axios.post("/api/save-homework", {
                courseId,
                userEmail: enrolledCourse.userEmail,
                groupIndex,
                chapterIndex: selectedChapter,
                answers: userAnswers
            });

            toast.success("Ответы сохранены!");
        } catch {
            setLoadingHomework(false)
            toast.error("Ошибка сохранения");
        }
        setLoadingHomework(false)
    }

    const generateMaterials = async () => {
        setLoadingMaterials(true);
        try {
            const res = await axios.post(`/api/generate-materials`, {
                courseId,
                groupIndex,
                chapterIndex: selectedChapter
            });
            console.log(res.data)
            setPdf(res.data.pdf)
            setMaterials(res.data.materials);
            toast.success('Материал успешно сгенерован!')
        } catch (err) {
            toast.error("Ошибка генерации разд. материала");
            setLoadingMaterials(false)
        } finally {
            setLoadingMaterials(false);
        }
    }




    function downloadPDF(base64: string) {
        const link = document.createElement("a");
        link.href = `data:application/pdf;base64,${base64}`;
        link.download = "materials.pdf";
        link.click();
    }

    const generatePracticeTask = async () => {
        setLoadingPractice(true);
        try {
            const res = await axios.post(`/api/generate-practice`, {
                courseId,
                groupIndex,
                chapterIndex: selectedChapter
            });
            setPracticeTask(res.data);

            await axios.post(`/api/save-practice-task`, {
                courseId,
                groupIndex,
                chapterIndex: selectedChapter,
                practice: res.data,
                userAnswer: "" // пока пустой ответ
            });

            console.log(res.data)
            toast.success('Practice task успешно сгенеровано!')
        } catch (err) {
            toast.error("Ошибка генерации save-practice-task task");
        } finally {
            setLoadingPractice(false);
        }
    }


    const checkPracticeAnswer = async () => {
        if (!practiceTask) return;

        try {
            setOnChecking(true)

            const res = await axios.post("/api/check-practice", {
                type: "code",
                language: practiceTask.language,
                code: answer,
                tests: practiceTask.tests,
            });


            if (res.data.correct) {
                setStatus("success");
            } else {
                setStatus("fail");
            }


            savePracticeAnswer(answer);
        } catch (e) {
            console.error(e);
            setOnChecking(false)
            setStatus("fail");
        } finally {
            setOnChecking(false)
        }
    };



    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <h2 className="font-semibold text-2xl">
                    {selectedChapter + 1}. {currentChapter?.courseData?.chapterName}
                </h2>

                {!isChapterCompleted ? (
                    <Button className='bg-orange-500 hover:bg-orange-600 text-white hover:text-white' disabled={loading} onClick={markChapterCompleted}>
                        {loading ? <Loader2Icon className="animate-spin" /> : <CheckCircleIcon />}
                        Отметить как законченное
                    </Button>
                ) : (
                    <Button className='bg-orange-500 hover:bg-orange-600 text-white hover:text-white' disabled={loading} variant="outline" onClick={markInCompleteChapter}>
                        {loading ? <Loader2Icon className="animate-spin" /> : <XIcon />}
                        Отметить как незаконченное
                    </Button>
                )}
            </div>


            <div className="my-5 flex gap-3">
                {course?.courseContent?.map((_, gIndex) => (
                    <Button
                        className={cn('bg-white text-black border border-gray-400 ', gIndex === groupIndex  && 'bg-orange-500 text-white' )}
                        key={gIndex}
                        variant={gIndex === groupIndex ? "default" : "outline"}
                        onClick={() => updateURL(gIndex, 0)}
                    >
                        Глава {gIndex + 1}
                    </Button>
                ))}
            </div>


            {currentChapter?.youtubeVideo?.length > 0 && (
                <>
                    <h2 className="my-4 font-bold flex items-center gap-3 text-lg">
                        Видео для обучения <PlayCircleIcon />
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {currentChapter.youtubeVideo.slice(0, 2).map((video: any, index: number) => (
                            <div key={index}>
                                <YouTube
                                    videoId={video?.videoId}
                                    opts={{ height: "250", width: "400" }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            )}


            {(currentChapter?.courseData?.topics?.length > 0 || currentChapter?.courseData?.topic) && (
                <div className="mt-10 bg-secondary w-full rounded-2xl px-4">
                    <Accordion type="single" collapsible>
                        {currentChapter.courseData.topics?.map((item, index) => (
                            <AccordionItem key={index} value={`topic-${index}`}>
                                <AccordionTrigger>
                                    {index + 1}. {item.topic}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='flex items-center gap-4' style={{ lineHeight: "2.5" }}>
                                        {item.content.split(/```(.*?)\n([\s\S]*?)```/g).map((part, i) => {

                                            if (i % 3 === 1) {
                                                const language = part; // язык программирования
                                                const code = item.content.split(/```.*?\n([\s\S]*?)```/g)[1];
                                                return (
                                                    <SyntaxHighlighter
                                                        key={i}
                                                        language={language || 'javascript'}
                                                        style={materialDark}
                                                        wrapLines
                                                    >
                                                        {code}
                                                    </SyntaxHighlighter>
                                                );
                                            }

                                            if (i % 3 === 0) return <p key={i} dangerouslySetInnerHTML={{ __html: part }} />;
                                            return null;
                                        })}
                                    </div>
                                    <div
                                        style={{ lineHeight: "2.5" }}
                                        dangerouslySetInnerHTML={{ __html: item.content }}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}

                        {currentChapter.courseData.topic && (
                            <AccordionItem value="first-topic">
                                <AccordionTrigger>{currentChapter.courseData.topic}</AccordionTrigger>

                                <AccordionContent>
                                    <div style={{ lineHeight: "2.5" }}>
                                        {currentChapter.courseData.content.split(/```(.*?)\n([\s\S]*?)```/g).map((part, i) => {
                                            // part[1] = язык, part[2] = код
                                            if (i % 3 === 1) {
                                                const language = part; // язык программирования
                                                const code = currentChapter.courseData.content.split(/```.*?\n([\s\S]*?)```/g)[1];
                                                return (
                                                    <SyntaxHighlighter
                                                        key={i}
                                                        language={language || 'javascript'}
                                                        style={materialDark}
                                                        wrapLines
                                                    >
                                                        {code}
                                                    </SyntaxHighlighter>
                                                );
                                            }

                                            if (i % 3 === 0) return <p key={i} dangerouslySetInnerHTML={{ __html: part }} />;
                                            return null;
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}

                        <div className="flex items-start gap-4 flex-wrap mt-6">
                            {(cardLoading) && (
                                <div className="flex items-start gap-4 flex-wrap mt-6">
                                    {[1, 2, 3].map((_, i) => (
                                        <Card
                                            key={i}
                                            className="w-full md:w-96 shadow-lg rounded-2xl border border-gray-200"
                                        >
                                            <CardHeader>
                                                <Skeleton className="h-6 w-40 rounded-md" />
                                            </CardHeader>
                                            <CardContent className="flex flex-col items-center gap-4">
                                                <Skeleton className="h-[120px] w-[120px] rounded-lg" />
                                                <Skeleton className="h-10 w-44 rounded-lg" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            {!homework && !cardLoading  && (
                                <Card className="w-full md:w-96 shadow-lg rounded-2xl border border-gray-200">

                                    <CardContent className="flex flex-col items-center gap-4">
                                        {
                                            loadingHomework ? <div className='flex flex-col h-full py-4 shrink-0 text-xl items-center text-orange-600 gap-4 font-semibold'>
                                                <FaMagic className='text-orange-500 size-[60px] animate-bounce'/>
                                                Идет генерация...
                                            </div> : <Image
                                                src="/homework.png"
                                                alt="materials"
                                                width={120}
                                                height={120}
                                                className="rounded-lg w-full h-[200px] object-cover"
                                            />
                                        }
                                        <Button
                                            className="bg-orange-500 hover:bg-orange-500 text-white"
                                            disabled={loadingHomework}
                                            onClick={generateHomework}
                                        >
                                            {loadingHomework ? (
                                                <Loader2Icon className="animate-spin" />
                                            ) : (

                                                <p className='flex items-center gap-4'>   <FaMagic/>

                                                    Сгенерировать вопросы</p>

                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                            {!materials && !cardLoading && (
                                <Card className="w-full md:w-96 shadow-lg rounded-2xl border border-gray-200">

                                    <CardContent className="flex flex-col items-center gap-4">
                                        {
                                           loadingMaterials ? <div className='flex flex-col h-full py-4 shrink-0 text-xl items-center text-orange-600 gap-4 font-semibold'>
                                                <FaMagic className='text-orange-500 size-[60px] animate-bounce'/>
                                                Идет генерация...
                                            </div> : <Image
                                                src="/ai-courses.png"
                                                alt="materials"
                                                width={120}
                                                height={120}
                                                className="rounded-lg w-full h-[200px] object-cover"
                                            />
                                        }

                                        <Button
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                            disabled={loadingMaterials}
                                            onClick={generateMaterials}
                                        >
                                            {loadingMaterials ? (
                                                <Loader2Icon className="animate-spin" />
                                            ) : (

                                                <p className='flex items-center gap-4'>   <FaMagic/>

                                                    Сгенерировать материалы</p>
                                            )}
                                        </Button>

                                    </CardContent>

                                </Card>
                            )}


                            {!practiceTask && !cardLoading && (
                                <Card className="w-full relative md:w-96 shadow-lg rounded-2xl border border-gray-200 ">

                                    <CardContent className="flex flex-col items-center gap-4">
                                        {
                                            loadingPractice ? <div className='flex flex-col h-full py-4 shrink-0 text-xl items-center text-orange-600 gap-4 font-semibold'>
                                                <FaMagic className='text-orange-500 size-[60px] animate-bounce'/>
                                                Идет генерация...
                                            </div> : <Image
                                                src="/practice-tasks.png"
                                                alt="materials"
                                                width={120}
                                                height={120}

                                                className="rounded-lg w-full h-[200px] object-cover"
                                            />
                                        }
                                        <Button
                                            className="bg-orange-500 hover:bg-orange-600 text-white"
                                            disabled={loadingPractice}
                                            onClick={generatePracticeTask}
                                        >
                                            {loadingPractice ? (
                                                <Loader2Icon className="animate-spin" />
                                            ) : (
                                                <p className='flex items-center gap-4'>   <FaMagic/>

                                                    Сгенерировать практику</p>

                                            )}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                        {homework &&   <AccordionItem value="second-topic">
                            <AccordionTrigger>2. Краткие вопросы</AccordionTrigger>

                            <AccordionContent>
                                <div className="mt-5 space-y-3">
                                    {homework?.questions?.map((q, index) => (
                                        <div key={index} className="p-4 border rounded-md my-2">
                                            <p className="font-medium">{q.question}</p>

                                            <input
                                                type="text"
                                                className="border p-2 w-full mt-2"
                                                value={userAnswers[index] || ""}
                                                onChange={(e) =>
                                                    setUserAnswers({ ...userAnswers, [index]: e.target.value })
                                                }
                                            />



                                            <Button disabled={onChecking}
                                                onClick={() => checkAnswer(index, q)}
                                                className="mt-2 bg-orange-500"
                                            >
                                                {onChecking ?   <Loader2Icon className='animate-spin '/> : <CheckCircleIcon/>}

                                                Проверить!
                                            </Button>


                                            {results[index] !== undefined && (
                                                <p className={results[index] ? "text-green-600" : "text-red-600"}>
                                                    {results[index] ? "Правильно ✅" : "Неправильно ❌"}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                     <Button disabled={loadingHomework}
                                                           className="mt-4 bg-green-600 text-white hover:bg-green-700"
                                                           onClick={handleSaveHomework}
                                    >
                                        Сохранить ответы
                                    </Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>}




                        {loadingMaterials &&    ([1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] bg-orange-100 w-[250px] rounded-xl"/>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]"/>
                            <Skeleton className="h-4 w-[200px]"/>
                        </div>
                </div>)))}

                        {!loadingMaterials && materials && (

                                <AccordionItem value="third-topic">
                                    <AccordionTrigger>3. Раздаточный материал</AccordionTrigger>

                                    <AccordionContent>
                                        <div className="mt-5 space-y-3">
                                            <h3 className="font-bold">Чек-лист:</h3>
                                            <ul>
                                                {materials?.checklist.map((item, i) => <li key={i}>✅ {item}</li>)}
                                            </ul>

                                            <h3 className="font-bold">Карточки:</h3>
                                            {materials?.flashcards.map((c, i) => (
                                                <div key={i} className="p-2 border rounded">
                                                    <p><b>В:</b> {c.q}</p>
                                                    <p><b>О:</b> {c.a}</p>
                                                </div>
                                            ))}

                                            <Button
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                onClick={() => downloadPDF(pdf)}
                                            >
                                                Скачать PDF
                                            </Button>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                        )}



                        {!practiceTask && loadingPractice &&  [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]"/>
                                    <Skeleton className="h-4 w-[200px]"/>
                                </div>
                            </div>
                        ))}


                        {practiceTask &&   <AccordionItem value="single-topic">
                            <AccordionTrigger>4. Практическое задание:</AccordionTrigger>

                            <AccordionContent>
                                <>
                                    <p className="mb-3">{practiceTask.question}</p>

                                    <div className="mb-3 w-full max-w-3xl mx-auto">
                                        <Editor
                                            height="400px"
                                            defaultLanguage={practiceTask.language}
                                            value={answer}
                                            onChange={(value) => setAnswer(value || "")}
                                            theme="vs-dark"
                                        />
                                    </div>
                                    {onChecking && <div className='flex  flex-col gap-4 items-center justify-center'>
                                        <LoaderOne/>
                                        <div className='font-semibold'>
                                            Идет проверка...
                                        </div>
                                    </div>}

                                    <div className="flex items-center justify-between mb-3">

                                        <Button disabled={onChecking}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            onClick={checkPracticeAnswer}
                                        >
                                            {onChecking ? <Loader2Icon className='animate-spin '/> : <CheckCircleIcon/>}

                                            Проверить
                                        </Button>
                                    </div>

                                    {status === "success" && <p className="text-green-600 font-bold">✅ Правильно!</p>}
                                    {status === "fail" && <p className="text-red-600 font-bold">❌ Неправильно</p>}
                                </>
                            </AccordionContent>
                        </AccordionItem>}

                </Accordion>

                </div>
            )}



        </div>
    );
};

export default ChapterContent;
