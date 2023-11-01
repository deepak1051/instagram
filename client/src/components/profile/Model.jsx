import { PhotoIcon } from '@heroicons/react/24/solid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const cloud_name = import.meta.env.VITE__CLOUD_NAME;
const upload_preset = import.meta.env.VITE__UPLOAD_PRESET;

const Model = ({ onClose, ActionBar }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { id } = useParams();

  const queryClient = useQueryClient();

  const usersQuery = useQuery(['users', id], ({ signal }) =>
    axios.get(`/api/users/${id}`, { signal }).then((res) => res.data)
  );

  const [imageLoading, setImageLoading] = useState(false);
  const [image, setImage] = useState(usersQuery?.data.profilepic || '');
  const [bio, setBio] = useState(usersQuery?.data?.bio || '');

  const handleImageChange = async (e) => {
    const profileImage = e.target.files[0];

    if (
      profileImage === null &&
      (profileImage.type !== 'image/jpeg' ||
        profileImage.type !== 'image/jpg' ||
        profileImage.type !== 'image/png')
    ) {
      toast.error('only accepted types are jpeg/jpg/png');
    }

    try {
      setImageLoading(true);
      if (
        profileImage !== null &&
        (profileImage.type === 'image/jpeg' ||
          profileImage.type === 'image/jpg' ||
          profileImage.type === 'image/png')
      ) {
        const image = new FormData();
        image.append('file', profileImage);
        image.append('cloud_name', cloud_name);
        image.append('upload_preset', upload_preset);

        // Save image to Cloudinary
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dzwub5bux/image/upload',
          { method: 'post', body: image }
        );

        const imgData = await response.json();

        setImage(imgData.url.toString());
      }

      setImageLoading(false);
    } catch (error) {
      setImageLoading(false);
      toast.error(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !bio) {
      toast.error('Please fill all fields');
      return;
    }

    if (!userDetail.user_id) {
      toast.error('user_id is not defined');
      return;
    }

    try {
      await axios.put(`/api/updateProfile`, {
        profilepic: image,
        bio,
      });

      onClose();
      queryClient.invalidateQueries(['users', id]);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data || error.message);
    }
  };

  useEffect(() => {
    document.body.classList.add('overflow-hidden');

    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return ReactDOM.createPortal(
    <div>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-400 opacity-80"
      ></div>
      <div className="fixed inset-10 p-2 bg-white rounded">
        <div className="flex flex-col justify-between gap-2 h-full rounded ">
          <form className="container mx-auto w-3/4 ">
            <div className="space-y-2 ">
              <div className="border-b border-gray-900/10 pb-12 ">
                <div className="mt-1 grid grid-cols-1 gap-x-1 gap-y-1 sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="caption"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Bio
                    </label>
                    <div className="">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        id="caption"
                        rows={3}
                        className="block w-full rounded-md border-0 py-0.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 "
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="cover-photo"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Profile Pic
                    </label>
                    <div className=" flex justify-center rounded-lg border border-dashed border-gray-900/25 ">
                      <div className="text-center">
                        <PhotoIcon
                          className="mx-auto h-12 w-12 text-gray-300"
                          aria-hidden="true"
                        />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            {imageLoading ? (
                              <span>Uploading file please wait....</span>
                            ) : (
                              <span>Upload a file</span>
                            )}
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only "
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                          </label>
                          {!imageLoading && (
                            <p className="pl-1">or drag and drop</p>
                          )}
                        </div>
                        {!imageLoading && (
                          <p className="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        )}

                        {!imageLoading && image && (
                          <>
                            <img
                              className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full
                     border-2 border-pink-600 p-1"
                              src={
                                image ||
                                'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80'
                              }
                              alt="profile"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center  justify-center gap-2 rounded-lg border border-red-300 px-8 py-3 text-center text-sm font-semibold  outline-none ring-gray-300 transition duration-100  focus-visible:ring active:bg-gray-200 md:text-base cursor-pointer
              bg-red-700 text-white
              "
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={imageLoading}
              className="flex items-center  justify-center gap-2 rounded-lg border border-gray-300 px-8 py-3 text-center text-sm font-semibold  outline-none ring-gray-300 transition duration-100  focus-visible:ring active:bg-gray-200 md:text-base cursor-pointer
              bg-slate-700 text-white
              "
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector('.model-container')
  );
};

export default Model;
