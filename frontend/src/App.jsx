import { createBrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx"
import HeroSaction from "./pages/student/HeroSaction.jsx";
import { RouterProvider } from "react-router";
import MainLayout from "./layout/MainLayout.jsx";
import Courses from "./pages/student/Courses.jsx";
import MyLearning from "./pages/student/myLearning.jsx";
import Profile from "./pages/student/Profile.jsx";
import Sidebar from "./pages/admin/Sidebar.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import CourseTable from "./pages/admin/course/CourseTable.jsx";
import AddCourse from "./pages/admin/course/AddCourse.jsx";
import EditCourse from "./pages/admin/course/EditCourse.jsx";
import CreateLecture from "./pages/admin/lecture/CreateLecture.jsx";
import EditLecture from "./pages/admin/lecture/EditLecture.jsx";
import CourseDetail from "./pages/student/CourseDetail.jsx";
import CourseProgress from "./pages/student/CourseProgress.jsx";
import SearchPage from "./pages/student/SearchPage.jsx";
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from "./components/ProtectedRoutes.jsx";
import PurchaseCourseProtectedRoute from "./components/PurchaseCourseProtectedRoute.jsx";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSaction />
            <Courses />
          </>
        ),
      },
      {
        path: "login",
        element: <AuthenticatedUser>  <Login /> </AuthenticatedUser>
      },
      {
        path: "my-learning",
        element:<ProtectedRoute> <MyLearning /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute> <Profile /></ProtectedRoute>
      },
      {
        path: "course/search",
        element:<ProtectedRoute> <SearchPage /> </ProtectedRoute>
      },
      {
        path: "course-detail/:courseId",
        element:<ProtectedRoute> <CourseDetail /> </ProtectedRoute>
      },
      {
        path: "course-progress/:courseId",
        element:  <ProtectedRoute>
          <PurchaseCourseProtectedRoute>
         <CourseProgress />
          </PurchaseCourseProtectedRoute>
         
          </ProtectedRoute>
      },

      //admin routes
      {
        path: "admin",
        element:<AdminRoute> <Sidebar /></AdminRoute>,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />
          },
          {
            path: "course",
            element: <CourseTable />
          },
          {
            path: "course/create",
            element: <AddCourse />
          },
          {
            path: "course/:courseId",
            element: <EditCourse />
          },
          {
            path: "course/:courseId/lecture",
            element: <CreateLecture />
          },
          {
            path: "course/:courseId/lecture/:lectureId",
            element: <EditLecture />
          },
        ]
      }
    ],

  },
]);
function App() {
  return (
    <main>
      <ThemeProvider defaultTheme="light">
      <RouterProvider router={appRouter} />

      </ThemeProvider>
    </main>
  );
}


export default App