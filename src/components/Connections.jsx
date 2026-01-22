import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      setConnections(res.data.data);
    } catch (err) {
      console.error("Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Your Connections</h2>

      {connections.length === 0 && (
        <p className="opacity-60">No connections yet.</p>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {connections.map((conn) => {
          const user = conn.user;

          return (
            <div
              key={conn._id}
              className="card bg-base-100 shadow-md hover:shadow-xl transition-all"
            >
              <div className="card-body">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-16 rounded-full">
                      <img src={user.photoUrl} alt="profile" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm opacity-60">
                      {user.age} • {user.gender}
                    </p>
                  </div>

                  {/* Chat icon */}
                  <button
                    className="btn btn-circle btn-ghost tooltip"
                    data-tip="Chat (coming soon)"
                    disabled
                    >
                    💬
                    </button>
                </div>

                {/* About */}
                <p className="mt-3 text-sm opacity-80 line-clamp-2">
                  {user.about}
                </p>

                {/* Skills */}
                {user.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="badge badge-outline badge-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="card-actions justify-end mt-4">
                  <span className="badge badge-success badge-outline">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;