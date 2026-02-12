import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../../featuers/auth/authActions";
import type { AppDispatch, RootState } from "../../store/store";

const Profile = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

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
  return (
    <div className="px-2 py-4">
      <h2 className="text-xl font-bold mb-4">Profile</h2>

      {/* avatar user */}
      <div className="mb-4 flex justify-center">
        <div className="flex flex-col items-center">
          <img
            src={user?.profileImageUrl}
            className="w-30 h-30 rounded-full"
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

      <form>
        <div className="mb-4">
          <label className="block font-medium mb-1">Full Name</label>{" "}
          <input
            type="text"
            value={"the name of the user"}
            className={`w-full p-2 border rounded focus:outline-none `}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>{" "}
          <input
            type="email"
            value={"the email of the user"}
            className={`w-full p-2 border rounded focus:outline-none `}
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Role</label>{" "}
          <input
            type="email"
            value={"the email of the user"}
            className={`w-full p-2 border rounded focus:outline-none `}
            placeholder="Enter your email"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          {"Save changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
