import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./auth/AuthProvider";
import ProtectedRoute from "./auth/ProtectedRoute";
import PageLayout from "./layout/PageLayout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import CareerPaths from "./pages/CareerPaths";
import CareerPathDetails from "./pages/CareerPathDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MyApplications from "./pages/MyApplications";
import MyPayments from "./pages/MyPayments";
import Checkout from "./pages/Checkout";
import MyCourses from "./pages/MyCourses";
import CourseLearn from "./pages/CourseLearn";
import InstructorDashboard from "./pages/InstructorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminContent from "./pages/AdminContent";
import CheckoutResult from "./pages/CheckoutResult";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <PageLayout>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/programs/:id" element={<ProgramDetails />} />
            <Route path="/career-paths" element={<CareerPaths />} />
            <Route path="/career-paths/:id" element={<CareerPathDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Any signed-in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
            </Route>

            {/* Learners only */}
            <Route element={<ProtectedRoute roles={["Learner"]} />}>
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/my-courses" element={<MyCourses />} />
              <Route path="/learn/:courseId" element={<CourseLearn />} />
              <Route path="/my-payments" element={<MyPayments />} />
              <Route path="/checkout/result" element={<CheckoutResult />} />
              <Route path="/checkout/:applicationId" element={<Checkout />} />
            </Route>

            <Route element={<ProtectedRoute roles={["Instructor"]} />}>
              <Route path="/instructor" element={<InstructorDashboard />} />
            </Route>

            <Route element={<ProtectedRoute roles={["Admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/content" element={<AdminContent />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
