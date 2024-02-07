// AdminRoutes.js

import { Route, Routes } from "react-router-dom";
import CurriculumUpload from "../pages/CurriculumUpload";
import FacultyUpload from "../pages/FacultyUpload";
import Admin from "./pages/admin/admin";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
      <Route path="/curriupload" element={<CurriculumUpload />} />
      <Route path="/facultyupload" element={<FacultyUpload />} />
    </Routes>
  );
}

export default AdminRoutes;
