import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import SelectRole from "./pages/Selectrole";
import CustomerSignup from "./pages/Signupcustomer";
import HelperSignup from "./pages/Helpersignup";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import CreateTask from "./pages/CreateTask";
import TaskDetail from "./pages/TaskDeatail";
import EditTask from "./pages/EditTask";
import HelperDashboard from "./pages/HelperDashboard";
import HelperTaskDetail from "./pages/HelperTaskDetail";
import TaskMap from "./components/TaskMap";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
         <Route path="/login" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/signup/helper" element={<HelperSignup />} />
        <Route path="/customer/dashboard" element={ <CustomerDashboard/>}/>
        <Route path="/customer/create-task" element={<CreateTask />}/>
        <Route path="/customer/task/:id" element={<TaskDetail />}
/>
<Route
  path="/helper/dashboard"
  element={<HelperDashboard />}
/>
 <Route path="/customer/edit-task/:id" element={<EditTask />}/>
 <Route
  path="/helper/task/:id"
  element={<HelperTaskDetail />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;