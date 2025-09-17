'use client'
import React from 'react'
import {SparklesCore} from "@/components/ui/sparkles";
import {Vortex} from "@/components/ui/vortex";
import {MaskContainer} from "@/components/ui/svg-mask-effect";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import Footer from "@/components/Footer";
import {useRouter} from "next/navigation";

const Page = () => {
    const router = useRouter()
    return (
        <div className="w-full flex flex-col overflow-hidden">

            <div className="h-[90vh] flex flex-col items-center justify-center relative bg-gradient-to-b from-orange-600 via-orange-700 to-black text-white text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                    Learnify-AI
                </h1>
                <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-neutral-200">
                    Инновационная школа будущего, где ИИ помогает учиться быстрее,
                    эффективнее и интереснее.
                </p>
                <div className="mt-8 flex gap-4">
                    <button onClick={() => router.push('/dashboard')} className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-neutral-100 transition">
                        Начать обучение
                    </button>
                    <button onClick={() => router.push('/dashboard')} className="px-6 py-3 border border-white/40 text-white rounded-xl font-semibold hover:bg-orange-500 transition">
                        Узнать больше
                    </button>
                </div>
                <SparklesCore
                    background="transparent"
                    minSize={0.5}
                    maxSize={1.2}
                    particleDensity={800}
                    className="absolute bottom-0 w-full h-40"
                    particleColor="#ffffff"
                />
            </div>


            <div className="flex w-full h-[35rem] mx-auto max-w-6xl items-center justify-center overflow-hidden">
                <MaskContainer
                    revealText={
                        <p className="mx-auto text-center text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
                            Образование нового поколения доступно каждому.
                        </p>
                    }
                    className="h-[35rem] text-white dark:text-black"
                >
                    Наши курсы помогают освоить{" "}
                    <span className="text-orange-500 font-bold">
            программирование
          </span>{" "}
                    с помощью искусственного интеллекта. Учитесь в удобном темпе, проходите
                    практику и получайте домашние задания.
                </MaskContainer>
            </div>


            <div className="w-full h-[60vh] overflow-hidden">
                <Vortex
                    backgroundColor="black"
                    rangeY={600}
                    particleCount={400}
                    baseHue={30}
                    className="flex flex-col items-center justify-center px-4 md:px-10 py-6 w-full h-full"
                >
                    <h2 className="text-white text-3xl md:text-5xl font-bold text-center">
                        Почему именно Learnify-AI?
                    </h2>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <CardHeader>
                                <CardTitle>Интерактивные уроки</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Курсы построены так, чтобы вы сразу могли применять знания на
                                практике.
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <CardHeader>
                                <CardTitle>Домашние задания</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Как в школе: получите задания после урока и закрепите материал.
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                            <CardHeader>
                                <CardTitle>Практические проекты</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Создавайте реальные проекты и портфолио вместе с Learnify-AI.
                            </CardContent>
                        </Card>
                    </div>
                </Vortex>
            </div>


            <div className="h-[30rem] w-full bg-gradient-to-b from-black to-orange-800 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-white text-3xl md:text-6xl font-bold mb-6">
                    Присоединяйтесь к Learnify-AI
                </h1>
                <p className="text-neutral-200 text-lg md:text-xl max-w-2xl">
                    Более <span className="text-orange-400 font-bold">200 студентов</span>{" "}
                    уже учатся вместе с нами. Станьте частью комьюнити!
                </p>
                <button onClick={() => router.push('/sign-up')} className="mt-8 px-8 py-3 bg-orange-600 hover:bg-orange-700 transition text-white rounded-xl font-semibold">
                    Зарегистрироваться
                </button>
            </div>
            <Footer/>
        </div>
    )
}
export default Page
