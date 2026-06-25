import { Menu, School } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess, navigate, data]);

  return (
    <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
      {/* Desktop View */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full px-4">
        <div className="flex items-center gap-2">
          <School size={"30"} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-Learning
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-8">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/my-learning")}>
                    My learning
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-red-500">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin/dashboard")}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/course")}>
                      Courses
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate("/login")}>
                Login
              </Button>
              <Button onClick={() => navigate("/login")}>Signup</Button>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      
      {/* Mobile View */}
      <div className="flex md:hidden items-center justify-between px-4 h-full">
        <h1 className="font-extrabold text-2xl"><Link to={"/"}>E-learning</Link></h1>
        <MobileNavbar user={user}/>
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false); 
   
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  
  const logoutHandler = async () => {
    await logoutUser();
    setOpen(false);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User log out.");
      navigate("/login");
    }
  }, [isSuccess, navigate, data]);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full hover:bg-gray-200"
          variant="outline"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex flex-row items-center justify-between mt-2">
          <SheetTitle> 
            <span className="cursor-pointer" onClick={() => handleNavigate("/")}>E-Learning</span>
          </SheetTitle>
          <DarkMode />
        </SheetHeader>
        
        <hr className="my-2 border-gray-200 dark:border-gray-800" />
        
        <nav className="flex flex-col space-y-4">
          {/*  Yahan check lagaya hai ki agar logged in hai tabhi ye options dikhein  */}
          {user ? (
            <>
              <span className="cursor-pointer font-medium hover:text-blue-500" onClick={() => handleNavigate("/my-learning")}>
                My Learning
              </span>
              <span className="cursor-pointer font-medium hover:text-blue-500" onClick={() => handleNavigate("/profile")}>
                Edit Profile
              </span>
              <span className="cursor-pointer font-medium text-red-500" onClick={logoutHandler}>
                Log out
              </span>
            </>
          ) : (
            /*  Agar logged in nahi hai, toh sirf Login aur Signup dikhega  */
            <div className="flex flex-col space-y-2 mt-2">
              <Button variant="outline" onClick={() => handleNavigate("/login")}>
                Login
              </Button>
              <Button onClick={() => handleNavigate("/login")}>
                Signup
              </Button>
            </div>
          )}
        </nav>

        {/* Mobile Instructor Panel (Sirf logged in instructor ke liye) */}
        {user && user?.role === "instructor" && (
          <>
            <hr className="my-4 border-gray-200 dark:border-gray-800" />
            <div className="flex flex-col space-y-4">
               <span className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                 Admin Panel
               </span>
               <span 
                 className="cursor-pointer font-medium hover:text-blue-500" 
                 onClick={() => handleNavigate("/admin/dashboard")}
               >
                 Dashboard
               </span>
               <span 
                 className="cursor-pointer font-medium hover:text-blue-500" 
                 onClick={() => handleNavigate("/admin/course")} 
               >
                 Courses
               </span>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};