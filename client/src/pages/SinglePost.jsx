import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { useParams } from 'react-router-dom';
import Comment from '../components/comments/Comment';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const SinglePost = () => {
  const { id } = useParams();
  console.log(id);
  const { userDetail } = useSelector((state) => state.auth);

  const queryClient = useQueryClient();

  const { isLoading, error, isError, data } = useQuery(
    ['blogs', id],
    () => axios.get(`/api/posts/${id}`).then((res) => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    }
  );

  console.log(data);

  const likeQuery = useQuery(['blogs', id, 'likes'], ({ signal }) =>
    axios.get(`/api/posts/${id}/likes`, { signal }).then((res) => res.data)
  );
  console.log(likeQuery.data);

  const isLikedByUser = likeQuery?.data?.find((u) => {
    return u?.user_id == userDetail?.user_id;
  });
  console.log(isLikedByUser);

  const mutation = useMutation({
    mutationFn: () => {
      return axios.post(`/api/posts/${id}/likes`, {
        user_id: userDetail.user_id,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(['blogs', id, 'likes']);
    },
    onError(error) {
      toast.error(error.response.data || error.message);
    },
  });

  const handleLike = () => {
    mutation.mutate();
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong...--- {JSON.stringify(error)}</p>;

  console.log(data);

  return (
    <>
      <hr />
      <div className="container mx-auto w-3/4">
        <hr />
        <>
          <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-lg px-4 md:px-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="gray-opacity relative overflow-hidden rounded-lg   flex items-center justify-center">
                    <img
                      src={data?.image}
                      loading="lazy"
                      alt="Photo by Himanshu Dewangan"
                      className=" object-cover object-center w-auto h-96 rounded-lg"
                    />
                  </div>
                </div>

                <div className="md:py-8">
                  <div className="mb-2 md:mb-3">
                    <span className="mb-0.5 inline-block text-gray-500">
                      Published on{' '}
                      {format(new Date(data?.createdon), 'dd-MM-yyyy')}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                      {data?.caption}
                    </h2>
                  </div>

                  <div className="mb-6 flex items-center md:mb-10">
                    <a
                      href="#"
                      className="ml-4 text-sm font-semibold text-indigo-500 transition duration-100 hover:text-indigo-600 active:text-indigo-700"
                    >
                      Author: {data?.name}
                    </a>
                  </div>

                  <div className="flex gap-2.5">
                    {isLikedByUser ? (
                      <AiFillHeart
                        className="text-2xl cursor-pointer"
                        onClick={handleLike}
                        fill="deeppink"
                      />
                    ) : (
                      <AiOutlineHeart
                        className="text-2xl cursor-pointer"
                        onClick={handleLike}
                      />
                    )}
                    <span>
                      {likeQuery.isLoading
                        ? 'Loading...'
                        : `Likes: ${likeQuery.data?.length}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>

        <hr />

        <Comment id={data.post_id} />
      </div>
    </>
  );
};

export default SinglePost;
