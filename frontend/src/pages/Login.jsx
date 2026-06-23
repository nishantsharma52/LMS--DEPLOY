import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Navigate, useNavigate } from "react-router-dom"
const Login = () => {
  const [signupInput, SetSignupInput] = useState({ name: "", email: "", password: "" })
  const [loginInput, SetLoginInput] = useState({ email: "", password: "" })

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation()
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation()

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target
    if (type === "signup") {
      SetSignupInput({ ...signupInput, [name]: value })
    } else {
      SetLoginInput({ ...loginInput, [name]: value })
    }
  }

 const handleRegistration = async (type) => {
  const inputData = type === "signup" ? signupInput : loginInput;
  const action = type === "signup" ? registerUser : loginUser;
  try {
    const res = await action(inputData).unwrap();
    if (type === "login") {
      // Jab confirm ho jaye ki mutation completely success ho gaya aur state update ho gayi
      setTimeout(() => navigate("/"), 100); 
    }
  } catch (err) {
    console.error(err);
  }
};
 useEffect(() => {
  if (registerIsSuccess) {
    toast.success(registerData?.message || "Signup Successfully")
    SetSignupInput({ name: "", email: "", password: "" }) // ✅ fix
  }

  if (registerError) {
    toast.error(registerError?.data?.message || "Signup failed")
    SetSignupInput({ name: "", email: "", password: "" }) // optional
  }
}, [registerIsSuccess, registerError])

useEffect(() => {
  if (loginIsSuccess) {
    toast.success(loginData?.message || "Login Successfully")
     SetLoginInput({email:"", password :""})
    
  }

  if (loginError) {
    toast.error(loginError?.data?.message || "Login failed")
     SetLoginInput({email:"", password :""})
  }
}, [loginIsSuccess, loginError])

const navigate = useNavigate();

  return (
    <div className="flex justify-center w-full items-center mt-20">
      <Tabs defaultValue="signup" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  type="text"
                  placeholder="Enter your name"
                  required />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  type="email"
                  placeholder="Enter your email"
                  required />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  type="password"
                  placeholder="Enter your password"
                  required />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")}>
                {
                  registerIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                    </>
                  ) : "Signup"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup , you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  type="email"
                  placeholder="Enter your email"
                  required />
              </div>
              <div className="space-y-1">
                <Label>Password</Label>
                <Input name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  type="password"
                  placeholder="Enter your password"
                  required />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
                {
                  loginIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                    </>
                  ) : "Login"
                }
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


export default Login