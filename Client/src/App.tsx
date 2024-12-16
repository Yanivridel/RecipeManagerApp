import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster"
// Components
import Profile from "./pages/Profile";
import RecipeDetails from "./pages/RecipeDetails";
import Home from "./pages/Home";
import RecipesPage from "./pages/RecipesPage";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { AppSidebar } from "./components/Sidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
// Functions
import { getCookie } from "./services/cookies";
import { setUser } from "./store/slices/userSlice";
import { getSelf } from "./services/api";


function App() {
  const dispatch = useDispatch();

  const reloadUser = async () => {
    const token = getCookie('token');
    if (token) {
        const user = await getSelf(token);
        if(user)
          dispatch(setUser(user));
    }
  }

  useEffect( () => {
    reloadUser();
  }, []);

  return (
  <Router>
    <AppSidebar />
    <SidebarTrigger />
    <Toaster/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipe/:id" element={<RecipeDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="*" element={<Error404 />} />
    </Routes>

  </Router>
  )
}

export default App
