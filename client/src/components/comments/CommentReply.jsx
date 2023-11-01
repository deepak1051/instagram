import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistance } from 'date-fns';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CommentReply = ({ id, commentId, onCancel }) => {
  const { userDetail } = useSelector((state) => state.auth);

  const [text, setText] = useState('');

  const queryClient = useQueryClient();

  const commentReplyQuery = useQuery(
    ['posts', id, 'comments', commentId, 'replies'],
    ({ signal }) =>
      axios
        .get(`/api/posts/${id}/comments/${commentId}/replies`, { signal })
        .then((res) => res.data)
  );

  const mutation = useMutation({
    mutationFn: (text) => {
      return axios.post(`/api/posts/${id}/comments/${commentId}/replies`, {
        user_id: userDetail.user_id,
        text,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries([
        'posts',
        id,
        'comments',
        commentId,
        'replies',
      ]);
      setText('');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  console.log(commentReplyQuery.data);

  const handleSubmitComment = () => {
    mutation.mutate(text);
  };

  return (
    <div className="ps-10 mt-2 ">
      <div className="flex">
        <input
          type="text"
          className="replay-comment-input"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className="flex justify-end my-1 gap-2 mx-3">
          <button
            onClick={() => onCancel()}
            className="px-1.5 py-0.5 rounded-md text-white text-sm bg-black text-center"
          >
            cancel
          </button>
          <button
            onClick={handleSubmitComment}
            className="px-1.5 py-0.5 rounded-md text-white text-sm bg-slate-500 text-center"
          >
            reply
          </button>
        </div>
      </div>
      <hr />
      {commentReplyQuery?.data?.map((item) => (
        <div
          className=" rounded-md p-2 ml-3  relative"
          key={item.comment_reply_id}
        >
          <div className="flex gap-3 ">
            <img
              src="https://c4.wallpaperflare.com/wallpaper/350/552/37/anime-anime-boys-monkey-d-luffy-one-piece-red-hd-wallpaper-preview.jpg"
              className="object-cover w-5 h-5 rounded-full 
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
              <div className="flex items-center gap-5 ">
                <p className="text-gray-700 text-sm">{item.text}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentReply;
