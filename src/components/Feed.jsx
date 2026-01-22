import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    try {
      if (feed?.length) return;

      const res = await axios.get(`${BASE_URL}/feed`, {
        withCredentials: true,
      });

      dispatch(addFeed(res.data));
    } catch (error) {
      console.error("Error fetching feed:", error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const handleAction = (type) => {
    const userId = feed[0]?._id;
    console.log(type, userId);

    if (!userId) return;

    dispatch(removeUserFromFeed(userId));
  };

  if (!feed?.length) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[90vh] overflow-hidden">
      <UserCard
        profile={feed[0]}   
        onAction={handleAction}
      />
    </div>
  );
};

export default Feed;