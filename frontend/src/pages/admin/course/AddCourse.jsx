import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'

const AddCourse = () => {
    const [courseTitle, setCourseTitle] = useState("")
    const [category, setCategory] = useState("");

    const [createCourse, { data, error, isSuccess, isLoading }] = useCreateCourseMutation()
    const navigate = useNavigate()


    const getSelectedCategory = (value) => {
        setCategory(value)
    }

    const createCourseHandler = async () => {
        await createCourse({ courseTitle, category })

    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data?.message || "Course created")
            navigate("/admin/course")
        }
    },[isSuccess,error,data])

    return (
        <div className='w-full p-10'>

            {/* Heading */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold'>
                    Lets add course, add some basic course details for your new course
                </h1>

                <p className='text-gray-500 mt-2'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
            </div>

            {/* Form */}
            <div className='max-w-xl space-y-6'>

                {/* Title */}
                <div className='space-y-2'>
                    <Label>Title</Label>

                    <Input
                        type='text'
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder='Your Course Name'
                    />
                </div>

                {/* Category */}
                <div className='space-y-2'>
                    <Label>Category</Label>

                    <Select onValueChange={getSelectedCategory}>

                        <SelectTrigger className='w-[200px]'>
                            <SelectValue placeholder='Select a category' />
                        </SelectTrigger>

                        <SelectContent>

                            <SelectGroup>

                                <SelectLabel>Category</SelectLabel>

                                <SelectItem value='react'>React</SelectItem>
                                <SelectItem value='mern'>MERN</SelectItem>
                                <SelectItem value='next'>Next JS</SelectItem>
                                <SelectItem value='Python'>Python</SelectItem>
                                <SelectItem value='Js'>JS</SelectItem>
                                <SelectItem value='Docker'>Docker</SelectItem>
                                <SelectItem value='html'>HTML</SelectItem>
                                <SelectItem value='frontend'>Frontend</SelectItem>
                                <SelectItem value='data science'>Data Science</SelectItem>

                            </SelectGroup>

                        </SelectContent>

                    </Select>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant='outline' onClick={() => navigate("/admin/course")}>Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler}>
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please Wait
                                </>

                            ) : "Create"
                        }
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default AddCourse