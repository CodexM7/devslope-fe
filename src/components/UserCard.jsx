import axios from "axios";
import { useState } from "react";

const UserCard = ({ profile, onAction }) => {
  const [loading, setLoading] = useState(false);

  if (!profile) return null;

  const handleAction = async (status) => {
    try {
      setLoading(true);

      await axios.post(
        `http://localhost:7777/request/send/${status}/${profile._id}`,
        {},
        { withCredentials: true }
      );

      // Notify parent (move to next card, update feed, etc.)
      onAction?.(status, profile._id);
    } catch (err) {
      console.error(`Failed to ${status} user`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 w-96 max-h-[80vh] shadow-xl overflow-hidden">
      
      {/* Image */}
      <figure className="h-72 overflow-hidden">
        <img
          src={
            profile.photoUrl ||
            "https://via.placeholder.com/400x500?text=No+Image"
          }
          alt="profile"
          className="object-cover w-full h-full"
        />
      </figure>

      {/* Body */}
      <div className="card-body flex-1">
        <h2 className="card-title">
          {profile.firstName} {profile.lastName}
          <span className="text-sm text-gray-500 ml-1">
            • {profile.age}
          </span>
        </h2>

        <p className="text-gray-600 line-clamp-3">
          {profile.about || "No bio available"}
        </p>

        <div className="flex flex-wrap gap-2 mt-2">
          {profile.skills?.map((skill, i) => (
            <span key={i} className="badge badge-outline">
              {skill}
            </span>
          ))}
        </div>

        <div className="card-actions justify-between mt-auto">
          <button
            className="btn btn-circle btn-outline btn-error text-xl"
            disabled={loading}
            onClick={() => handleAction("ignored")}
          >
            {loading ? "…" : "❌"}
          </button>

          <button
            className="btn btn-circle btn-outline btn-success text-xl"
            disabled={loading}
            onClick={() => handleAction("interested")}
          >
            {loading ? "…" : "❤️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
