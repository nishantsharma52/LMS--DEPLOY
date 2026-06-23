import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useEditCourseMutation, useGetLectureByIdQuery, useRemoveLectureMutation, } from "@/features/api/courseApi";
import { useEditLectureMutation } from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "https://lms-deploy-lejt.onrender.com/api/v1/media";

const LectureTab = () => {
    const [lectureTitle, setLectureTitle] = useState("");
    const [uploadVideInfo, setUploadVideoInfo] = useState(null);
    const [isFree, setIsFree] = useState(false);
    const [mediaProgress, setMediaProgress] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [btnDisable, setBtnDisable] = useState(true);
    const params = useParams();
    const { courseId, lectureId } = params;

    const { data: lectureData } = useGetLectureByIdQuery(lectureId)
    const lecture = lectureData?.lecture;

    useEffect(() => {
        if (lecture) {
            setLectureTitle(lecture.lectureTitle)
            setIsFree(lecture.isPreviewFree);
            setUploadVideoInfo(lecture.videoInfo)
        }
    }, [lecture])

    const [editLecture, { data, isLoading, error, isSuccess }] = useEditLectureMutation()
    const [removeLecture, { isLoading: removeLoading, data: removeData, isSuccess: removeSuccess }] = useRemoveLectureMutation()

    const editLectureHandler = async () => {
        await editLecture({ lectureTitle, videoInfo: uploadVideInfo, isPreviewFree: isFree, courseId, lectureId })

    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message)
        }
        if (error) {
            toast.error(error.data.message)
        }
    }, [isSuccess, error])

    const fileChangeHandler = async (e) => {
        const file = e.target.files[0]
        if (file) {
            const formData = new FormData();
            formData.append("file", file)
            setMediaProgress(true)
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        setUploadProgress(Math.round((loaded * 100) / total))
                    }
                });
                if (res.data.success) {
                    setUploadVideoInfo({ videoUrl: res.data.data.url, publicId: res.data.data.public_id })
                    setBtnDisable(false)
                    toast.success("Viedo upload successfully")
                }
            } catch (error) {
                console.log(error);
                toast.error("Video upload failed")
            } finally {
                setMediaProgress(false)
            }
        }
    }

    const removeLectureHandler = async () => {
        await removeLecture(lectureId)
    }
    useEffect(() => {
        if (removeSuccess) {
            toast.success(removeData.message)
        }
    }, [removeSuccess])
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Edit Lecture</CardTitle>

                <CardDescription>
                    Make changes and click save when done.
                </CardDescription>
                <div className=" flex items-center gap-2">
                    <Button disbaled={removeLoading} onClick={removeLectureHandler} className="bg-red-600 text-white" variant="destructive">
                        {
                            removeLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Remove Lecture"
                        }
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>
                        Title
                    </Label>
                    <Input
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        type="text"
                        placeholder="Ex. Introduction to Javascript"
                    />
                </div>
                <div className="my-5">
                    <Label>
                        Video <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="file"
                        accept="video/*"
                        onChange={fileChangeHandler}
                        placeholder="Ex. Introduction to Javascript"
                        className="w-fit"
                    />
                </div>
                <div className="flex items-center space-x-2 my-5">
                    <Switch checked={isFree} onCheckedChange={setIsFree} id="airplane-mode" />
                    <Label htmlFor="">Is this video Free</Label>
                </div>

                {mediaProgress && (
                    <div className="my-4">
                        <Progress value={uploadProgress} />
                        <p>{uploadProgress}% uploaded</p>
                    </div>
                )}
                <div className="mt-4">
                    <Button disbaled={isLoading} onClick={editLectureHandler}>
                        {
                            isLoading ? <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </> : "Update Lecture"
                        }
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default LectureTab;