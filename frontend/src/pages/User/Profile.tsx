import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  uploadImage,
} from "../../featuers/auth/authActions";
import type { AppDispatch, RootState } from "../../store/store";
import { toast } from "react-toastify";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user, loadingUpdateUserProfile } = useSelector((state: RootState) => state.auth);
  const [name, setName] = useState(user?.name || "");

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await dispatch(uploadImage(file)).unwrap();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      await dispatch(
        updateUserProfile({
            ...user,
          name,
        }),
      ).unwrap();

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to update profile.");
    }
  };
  return (
    <div className="px-2 py-4">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* avatar user */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-col items-center">
          <img
            src={user?.profileImageUrl}
            className="w-30 h-30 mb-1 rounded-full"
            alt="user-avatar"
          />
          {/* hidden input for file upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          {/* button to change avatar */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            onClick={handleButtonClick}
          >
            Change Avatar
          </button>
        </div>
      </div>

      <form className="max-w-2xl mx-auto" onSubmit={handleUpdateUser}>
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-2xl p-2 border  rounded focus:outline-none bg-gray-100"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>{" "}
          <input
            type="email"
            value={user?.email}
            readOnly
            className="w-full max-w-2xl p-2 border text-gray-500 rounded focus:outline-none bg-gray-100"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Role</label>{" "}
          <input
            type="email"
            value={user?.role}
            readOnly
            className="w-full max-w-2xl p-2 border text-gray-500 rounded focus:outline-none bg-gray-100"
            placeholder="Enter your email"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            {loadingUpdateUserProfile ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
