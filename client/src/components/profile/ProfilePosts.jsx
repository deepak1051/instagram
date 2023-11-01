import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistance } from 'date-fns';

import { Link, useParams } from 'react-router-dom';

const ProfilePosts = () => {
  const { id } = useParams();
  const blogsQuery = useQuery(['users', id, 'blogs'], ({ signal }) =>
    axios.get(`/api/users/${id}/posts`, { signal }).then((res) => res.data)
  );

  return (
    <div className="container mx-auto px-12 mt-4">
      <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        {blogsQuery.isLoading ? (
          <p>Loading...</p>
        ) : (
          blogsQuery?.data.map((blog) => (
            <div
              className="flex flex-col overflow-hidden rounded-lg border bg-white"
              key={blog.post_id}
            >
              <Link
                to={`/posts/${blog.post_id}`}
                className="group relative block h-48 overflow-hidden bg-gray-100 md:h-48"
              >
                <img
                  src={blog.image}
                  loading="lazy"
                  alt="Photo by Martin Sanchez"
                  className="lazyload absolute inset-0 h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
              </Link>

              <div className="flex flex-1 flex-col p-4 sm:p-6">
                <h2 className="mb-2 text-lg font-semibold text-gray-800">
                  <Link
                    to={`/posts/${blog.post_id}`}
                    className="transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                  >
                    {blog.caption}
                  </Link>
                </h2>

                <div className="mt-auto flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                      <img
                        src={
                          blog.profilepic ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&q=75&fit=crop&w=64'
                        }
                        loading="lazy"
                        alt="Photo by Aiony Haust"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div>
                      <Link to={`/profile/${blog.user_id}`}>
                        <span className="block text-indigo-500">
                          {blog.name}
                        </span>
                      </Link>
                      <span className="block text-sm text-gray-400">
                        {formatDistance(new Date(blog?.createdon), Date.now(), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* <span className="rounded border px-2 py-1 text-sm text-gray-500">
                    Article
                  </span> */}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePosts;
