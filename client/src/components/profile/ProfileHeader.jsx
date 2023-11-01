import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Model from './Model';
import { useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

const ProfileHeader = () => {
  const [showModel, setShowModel] = useState(false);

  const handleClick = () => {
    setShowModel(true);
  };
  const onClose = () => {
    setShowModel(false);
  };
  const model = <Model onClose={onClose} />;

  const { userDetail } = useSelector((state) => state.auth);
  const { id } = useParams();

  const usersQuery = useQuery(['users', id], ({ signal }) =>
    axios.get(`/api/users/${id}`, { signal }).then((res) => res.data)
  );
  const followingsQuery = useQuery(['users', id, 'followings'], ({ signal }) =>
    axios
      .get(`/api/${userDetail?.user_id}/${id}/allFollowings`, { signal })
      .then((res) => res.data)
  );

  const followersQuery = useQuery(['users', id, 'followers'], ({ signal }) =>
    axios
      .get(`/api/${userDetail?.user_id}/${id}/allFollowers`, { signal })
      .then((res) => res.data)
  );

  const blogsQuery = useQuery(['users', id, 'blogs'], ({ signal }) =>
    axios.get(`/api/users/${id}/posts`, { signal }).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (followed_user_id) => {
      return axios.post(`/api/follow`, {
        user_id: userDetail?.user_id,
        followed_user_id,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(['users', id]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleFollow = (id) => {
    mutation.mutate(id);
  };

  const unfollowMutation = useMutation({
    mutationFn: (followed_user_id) => {
      return axios.post(`/api/unfollow`, {
        user_id: userDetail?.user_id,
        followed_user_id,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(['users', id]);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleUnFollow = (id) => {
    unfollowMutation.mutate(id);
  };

  console.log(usersQuery?.data);

  if (usersQuery.isLoading) return <p>Loading...</p>;
  if (usersQuery.isError) return <p>{JSON.stringify(usersQuery.error)}</p>;

  return (
    <>
      <main className="bg-gray-100 bg-opacity-25">
        <div className="lg:w-8/12 lg:mx-auto mb-8">
          <header className="flex flex-wrap items-center p-4 md:py-8">
            <div className="md:w-3/12 md:ml-16">
              <img
                className="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full
                     border-2 border-pink-600 p-1"
                src={
                  usersQuery?.data?.profilepic ||
                  'https://images.unsplash.com/photo-1502791451862-7bd8c1df43a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80'
                }
                alt="profile"
              />
            </div>

            <div className="w-8/12 md:w-7/12 ml-4">
              <div className="md:flex md:flex-wrap md:items-center mb-4">
                <h2 className="text-3xl inline-block font-light md:mr-2 mb-2 sm:mb-0">
                  {usersQuery?.data?.name}
                </h2>

                <span
                  className="inline-block fas fa-certificate fa-lg text-blue-500 
                               relative mr-6 text-xl transform -translate-y-2"
                  aria-hidden="true"
                >
                  <i
                    className="fas fa-check text-white text-xs absolute inset-x-0
                               ml-1 mt-px"
                  ></i>
                </span>

                <div>
                  {usersQuery?.data?.isfollowed == 1 ? (
                    <button
                      onClick={() => handleUnFollow(usersQuery?.data?.user_id)}
                      type="button"
                      className="w-24 rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                    >
                      Unfollow
                    </button>
                  ) : usersQuery?.data?.isfollowed == 0 ? (
                    <button
                      onClick={() => handleFollow(usersQuery?.data?.user_id)}
                      type="button"
                      className="w-24 rounded-lg border border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
                    >
                      Follow
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                {userDetail?.user_id &&
                  userDetail?.user_id === usersQuery?.data.user_id && (
                    <button
                      className="border rounded-md p-2 font-semibold bg-slate-700 text-white"
                      onClick={handleClick}
                    >
                      Edit Profile
                    </button>
                  )}
                {showModel && model}
              </div>

              <ul className="hidden md:flex space-x-8 mb-4">
                <li>
                  <span className="font-semibold pr-1">
                    {blogsQuery?.data?.length}
                  </span>
                  posts
                </li>

                <li>
                  <span className="font-semibold pr-1">
                    {followersQuery?.data?.length}
                  </span>
                  followers
                </li>
                <li>
                  <span className="font-semibold pr-1">
                    {followingsQuery?.data?.length}
                  </span>
                  following
                </li>
              </ul>

              <div className="hidden md:block">
                <h2 className="font-semibold">{usersQuery?.data?.bio}</h2>
              </div>
            </div>

            <div className="md:hidden text-sm my-2">
              <h2 className="font-semibold">{usersQuery?.data?.bio}</h2>
            </div>
          </header>
        </div>
      </main>
    </>
  );
};

export default ProfileHeader;
