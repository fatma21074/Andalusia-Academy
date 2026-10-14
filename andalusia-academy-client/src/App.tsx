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
            </Route>

            {/* Learners only */}
            <Route element={<ProtectedRoute roles={["Learner"]} />}>
              <Route path="/my-applications" element={<MyApplications />} />
              <Route path="/my-payments" element={<MyPayments />} />
              <Route path="/checkout/:applicationId" element={<Checkout />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
