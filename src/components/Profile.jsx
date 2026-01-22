import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addUser } from "../utils/userSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const userFromStore = useSelector((store) => store.user);

  const [user, setUser] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch profile only if not in store ---------------- */
  useEffect(() => {
    if (!userFromStore) {
      fetchProfile();
    } else {
      setUser(userFromStore);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/view`, {
        withCredentials: true,
      });
      setUser(res.data);
      // dispatch(addUser(res.data));
    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  /* ---------------- Handle form changes ---------------- */
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (!skillsInput.trim()) return;
    setUser({
      ...user,
      skills: [...(user.skills || []), skillsInput.trim()],
    });
    setSkillsInput("");
  };

  const removeSkill = (skill) => {
    setUser({
      ...user,
      skills: user.skills.filter((s) => s !== skill),
    });
  };

  /* ---------------- Save profile ---------------- */
  const saveProfile = async () => {
    setLoading(true);
    try {
      await axios.patch(
        `${BASE_URL}/profile/edit`,
        {
          firstName: user.firstName,
          lastName: user.lastName,
          photoUrl: user.photoUrl,
          age: user.age,
          gender: user.gender,
          about: user.about,
          skills: user.skills,
        },
        { withCredentials: true }
      );

      alert("Profile updated successfully ✅");
      dispatch(addUser(user));
    } catch (err) {
      alert("Failed to update profile ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <span className="loading loading-spinner"></span>;

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <div className="avatar">
              <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoUrl || "https://via.placeholder.com/150"}
                  alt="profile"
                />
              </div>
            </div>
          </div>

          {/* Photo URL */}
          <div className="mt-4">
            <label className="label">
              <span className="label-text">Photo URL</span>
            </label>
            <input
              type="text"
              name="photoUrl"
              value={user.photoUrl || ""}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="https://image-url"
            />
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Last Name"
            />
          </div>

          {/* Email (read-only) */}
          <div className="mt-4">
            <input
              value={user.emailId}
              disabled
              className="input input-bordered w-full opacity-70"
            />
          </div>

          {/* Other fields */}
          <div className="mt-4 space-y-4">
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Age"
            />

            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="select select-bordered w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <textarea
              name="about"
              value={user.about}
              onChange={handleChange}
              className="textarea textarea-bordered w-full"
              placeholder="About you"
            />
          </div>

          {/* Skills */}
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Add skill"
              />
              <button onClick={addSkill} className="btn btn-primary">
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {user.skills?.map((skill) => (
                <div key={skill} className="badge badge-outline gap-2">
                  {skill}
                  <span
                    className="cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end mt-6">
            <button
              className={`btn btn-success ${loading && "btn-disabled"}`}
              onClick={saveProfile}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;