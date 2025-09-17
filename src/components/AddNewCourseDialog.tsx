import React, {useState} from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Loader2Icon, SparkleIcon} from "lucide-react";
import axios from "axios";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

const AddNewCourseDialog = ({children} :any) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        includeVideo: false,
        noOfChapters:1,
        category: '',
        level: ''

    })

    const onHandleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        console.log(formData)
    }
    const onGenerate =  async () => {

        try {


        setLoading(true)
            const result = await axios.post('/api/generate-course-layout', {
                ...formData
            })
        console.log(result)

            console.log(result.data)
        router.push(`/workspace/edit-course/${result.data.courseId}`)
        } catch (error) {
            toast.error('Ошибка с генерацией курса')
        }
        setLoading(false)
    }

    return (
       <Dialog>
           <DialogTrigger asChild={true}>
               {children}
           </DialogTrigger>
           <DialogContent>
               <DialogHeader>
                   <DialogTitle>
                        Создать новый курс используя ИИ
                   </DialogTitle>
                   <DialogDescription asChild={true}>
                       <div className='flex flex-col gap-4 mt-3'>
                           <div>
                               <label className='mb-2' >Название курса</label>
                               <Input placeholder='Введите название курса' onChange={(event) => onHandleInputChange('name', event.target.value)}/>
                           </div>
                           <div>
                               <label className='mb-2' >Описание курса</label>
                               <Input onChange={(event) => onHandleInputChange('description', event.target.value)} placeholder='Введите описание курса'/>
                           </div>
                           <div>
                               <label className='mb-2' >Кол-во частей</label>
                               <Input type='number' max={5} min={1} onChange={(event) => onHandleInputChange('noOfChapters', event.target.value)} placeholder='Введите количество частей'/>
                           </div>
                           <div className='flex gap-3 items-center'>
                               <label className=''>Включить видео</label>
                               <Switch  onCheckedChange={() => onHandleInputChange('includeVideo', formData.includeVideo)}/>
                           </div>
                           <div>
                               <label className='mb-2' >Уровень сложности</label>
                               <Select onValueChange={(value) => onHandleInputChange('level', value)}>
                                   <SelectTrigger className='w-full'>
                                       <SelectValue placeholder='Уровень сложности'/>
                                       <SelectContent>
                                           <SelectItem value='begginer'>Начальный</SelectItem>
                                           <SelectItem value='moderate'>Средний</SelectItem>
                                           <SelectItem value='advanced'>Продвинутый</SelectItem>
                                       </SelectContent>
                                   </SelectTrigger>
                               </Select>
                           </div>
                           <div>
                               <label className='mb-2' htmlFor="">Категория</label>
                               <Input onChange={(event) => onHandleInputChange('category', event.target.value)} placeholder='Укажите категории'/>
                           </div>

                           <div>
                               <Button disabled={loading} onClick={onGenerate} className='w-full bg-orange-600'>
                                   {loading ? <Loader2Icon className='animate-spin'/> :<SparkleIcon/> }
                                   Сгенерировать курс
                               </Button>
                           </div>
                       </div>
                   </DialogDescription>
               </DialogHeader>
           </DialogContent>
       </Dialog>
    )
}
export default AddNewCourseDialog
