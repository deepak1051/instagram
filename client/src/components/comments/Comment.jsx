import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatDistance } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

import CommentReplyContainer from './CommentReplyContainer';
import { useSelector } from 'react-redux';

const Comment = ({ id }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const [text, setText] = useState('');

  const queryClient = useQueryClient();

  const commentQuery = useQuery(['posts', id, 'comments'], ({ signal }) =>
    axios.get(`/api/posts/${id}/comments`, { signal }).then((res) => res.data)
  );

  const mutation = useMutation({
    mutationFn: (text) => {
      return axios.post(`/api/posts/${id}/comments`, {
        user_id: userDetail.user_id,
        text,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries(['posts', id, 'comments']);
      setText('');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(text);
  };

  console.log(commentQuery?.data);

  if (commentQuery.isLoading) return <p>Loading...</p>;
  if (commentQuery.isError) return <p>{commentQuery.error.message}</p>;

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" bg-white rounded-lg border p-2  mt-20"
        // style={{ background: 'red' }}
      >
        <div className="px-3 mb-2 mt-2">
          <textarea
            // placeholder="comment"
            className="w-full bg-gray-100 rounded border border-gray-400 leading-normal resize-none h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end px-4">
          <button
            type="submit"
            className="px-2.5 py-1.5 rounded-md text-white text-sm bg-indigo-500"
          >
            Comment
          </button>
        </div>
      </form>

      <div className="w-full bg-white rounded-lg  p-2 my-4 mx-6">
        <h3 className="font-bold">Discussion ({commentQuery.data.length})</h3>

        <div className="flex flex-col">
          {commentQuery.data.map((item) => (
            <div
              className="border rounded-md p-3 ml-3 my-3 relative"
              key={item.comment_id}
            >
              <div className="flex gap-3 ">
                <img
                  src="https://c4.wallpaperflare.com/wallpaper/350/552/37/anime-anime-boys-monkey-d-luffy-one-piece-red-hd-wallpaper-preview.jpg"
                  className="object-cover w-8 h-8 rounded-full 
                    border-2 border-emerald-400  shadow-emerald-400
                    "
                />

                <div>
                  <div className="flex gap-2 items-center">
                    <h3 className="font-semibold">{item?.name}</h3>
                    <span className="text-xs text-slate-400 ">
                      {' '}
                      {formatDistance(new Date(item?.createdon), Date.now(), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 mt-1">
                    <p className="text-gray-700 text-base ">{item.text}</p>
                  </div>
                </div>
              </div>

              <CommentReplyContainer
                id={id}
                commentId={item.comment_id}
                user_id={item.user_id}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Comment;
