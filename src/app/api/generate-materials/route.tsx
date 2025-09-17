import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../../../../configs/db";
import {coursesTable, enrolledCourseTable} from "../../../../configs/schema";
import { eq, and } from "drizzle-orm";
import getServerUser from "@/lib/auth-server";
import { generatePdf } from "@/lib/downloadPDF";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const { courseId, groupIndex, chapterIndex } = await req.json();
        const user = await getServerUser();
        const userEmail = user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Не найден пользователь" }, { status: 401 });
        }

        // достаём курс именно этого юзера
        const enrolled = await db
            .select()
            .from(enrolledCourseTable)
            .where(
                and(
                    eq(enrolledCourseTable.cid, courseId),
                    eq(enrolledCourseTable.userEmail, userEmail)
                )
            )
            .execute();
        if (!enrolled || enrolled.length === 0) {
            return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
        }
        const course = enrolled[0];
        const courseRow = await db
            .select()
            .from(coursesTable)
            .where(eq(coursesTable.cid, courseId))
            .execute();

        if (!courseRow || courseRow.length === 0) {
            return NextResponse.json({ error: "Курс не найден" }, { status: 404 });
        }
        console.log(courseRow[0])

        const courseData = courseRow[0].courseJson?.course; // твой JSON



        const chapter = courseData.chapters?.[groupIndex] || courseData.chapters[groupIndex].topics[chapterIndex]; // если у тебя 1 уровень групп = главы
// либо courseData.chapters[groupIndex].topics[chapterIndex] — зависит от структуры

        if (!chapter) {
            return NextResponse.json({ error: "Глава не найдена" }, { status: 404 });
        }



        if (!chapter) {
            return NextResponse.json({ error: "Глава не найдена" }, { status: 404 });
        }

        const prompt = `
Ты — преподаватель. Сгенерируй раздаточные материалы для главы курса.
Глава: ${chapter.chapterName || "Без названия"}
Темы: ${chapter.topics?.map((t: any) => t.topic).join(", ") || chapter.topic || "Нет"}
Текст: ${chapter.topics?.map((t: any) => t.content).join("\n") || chapter.content || "Нет"}

Формат ответа (JSON):
{
  "summary": ["краткий конспект (5–7 пунктов)"],
  "checklist": ["список того, что нужно повторить"],
  "flashcards": [
    {"q": "вопрос по содержанию главы", "a": "короткий ответ"}
  ]
}
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);

        let raw = result.response.text().replace(/```json|```/g, "").trim();
        const materials = JSON.parse(raw);
        console.log('materials===')
        console.log(materials)
        const pdfBuffer = await generatePdf(materials);
        console.log('course===')
        console.log(course)
        await db
            .update(enrolledCourseTable)
            .set({
                materials: {
                    ...(course.materials || {}), // чтобы не затирать старое
                    [`${groupIndex}-${chapterIndex}`]: {
                        ...materials,
                        pdf: pdfBuffer.toString("base64"),
                    }
                }
            })
            .where(
                and(
                    eq(enrolledCourseTable.cid, courseId),
                    eq(enrolledCourseTable.userEmail, userEmail)
                )
            );

        return NextResponse.json({
            materials,
            pdf: pdfBuffer.toString("base64"),
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Ошибка генерации материалов" }, { status: 500 });
    }
}
