import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfileFollowers = () => {
  const { id } = useParams();
  const { userDetail } = useSelector((state) => state.auth);
  const followersQuery = useQuery(['users', id, 'followers'], ({ signal }) =>
    axios
      .get(`/api/${userDetail?.user_id}/${id}/allFollowers`, { signal })
      .then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (followed_user_id) => {
      return axios.post(`/api/follow`, {
        user_id: userDetail.user_id,
        followed_user_id,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(['users', id, 'followers']);
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
      queryClient.invalidateQueries(['users', id, 'followers']);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleUnFollow = (id) => {
    unfollowMutation.mutate(id);
  };
  console.log(followersQuery.data);
  if (followersQuery?.data?.length == 0)
    return (
      <p className="text-center mt-4 text-lg text-slate-500 font-bold">
        You have 0 followers
      </p>
    );

  return (
    <div className="container mx-auto px-12 mt-4">
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Name
              </th>
              <th scope="col" className="px-6 py-4 font-medium text-gray-900">
                Email
              </th>

              <th
                scope="col"
                className="px-6 py-4 font-medium text-gray-900"
              ></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 border-t border-gray-100">
            {followersQuery.data &&
              followersQuery.data.map((item) => {
                return (
                  <tr className="hover:bg-gray-50 " key={item.follow_id}>
                    <th className="flex  items-center gap-3 px-6 py-4 font-normal text-gray-900">
                      <div className="relative h-10 w-10">
                        <img
                          src={
                            item.profilepic ||
                            'https://cdn-icons-png.flaticon.com/128/3899/3899618.png'
                          }
                          loading="lazy"
                          alt="Photo by Aiony Haust"
                          className="h-full w-full rounded-full object-cover
                        object-center"
                        />
                        {/* <span className="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span> */}
                      </div>
                      <div className="text-base font-medium text-gray-700">
                        <Link to={`/profile/${item.user_id}`}>
                          {item?.name}
                        </Link>
                      </div>
                    </th>

                    <td className="px-6 py-4">{item?.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {item?.isfollowed == 1 ? (
                          <button
                            onClick={() => handleUnFollow(item?.user_id)}
                            type="button"
                            className="w-24 rounded-lg border border-red-500 bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                          >
                            Unfollow
                          </button>
                        ) : item?.isfollowed == 0 ? (
                          <button
                            onClick={() => handleFollow(item?.user_id)}
                            type="button"
                            className="w-24 rounded-lg border border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200 disabled:cursor-not-allowed disabled:border-blue-300 disabled:bg-blue-300"
                          >
                            Follow
                          </button>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileFollowers;
