import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // store requestId

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/requests/received`,
        { withCredentials: true }
      );
      setRequests(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (status, requestId) => {
    try {
      setActionLoading(requestId);

      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      // Remove reviewed request from UI
      setRequests((prev) =>
        prev.filter((req) => req._id !== requestId)
      );
    } catch (err) {
      console.error(`Failed to ${status} request`, err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="text-center mt-16 text-gray-500">
        <h2 className="text-xl font-semibold">No Requests Found</h2>
        <p className="mt-2">You don’t have any new connection requests.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Connection Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => {
          const user = req.fromUserId;

          return (
            <div key={req._id} className="card bg-base-100 shadow-xl">
              <figure className="h-60">
                <img
                  src={
                    user.photoUrl ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                  alt={user.firstName}
                  className="object-cover w-full h-full"
                />
              </figure>

              <div className="card-body">
                <h2 className="card-title">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="text-sm text-gray-500 flex gap-3">
                  <span>{user.age} yrs</span>
                  <span className="capitalize">{user.gender}</span>
                </div>

                <p className="mt-2 text-sm">
                  {user.about || "No bio available"}
                </p>

                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-success btn-sm"
                    disabled={actionLoading === req._id}
                    onClick={() =>
                      handleReview("accepted", req._id)
                    }
                  >
                    {actionLoading === req._id ? "Processing..." : "Accept"}
                  </button>

                  <button
                    className="btn btn-error btn-sm btn-outline"
                    disabled={actionLoading === req._id}
                    onClick={() =>
                      handleReview("rejected", req._id)
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
