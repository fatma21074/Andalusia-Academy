import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PageLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetails />} />
          <Route path="/career-paths" element={<CareerPaths />} />
          <Route path="/career-paths/:id" element={<CareerPathDetails />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </PageLayout>
    </BrowserRouter>
  );
}
