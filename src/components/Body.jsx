import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import axios from "axios";

const Body = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async() => {
    if(userData) return; // If user data already exists, no need to fetch
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      dispatch(addUser(res.data));
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if(error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />

      {/* Main content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Body;