import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Link } from 'react-router-dom';

const MyFeed = () => {
  const blogsQuery = useQuery(['users', 'blogs'], ({ signal }) =>
    axios.get(`/api/posts`, { signal }).then((res) => res.data)
  );

  return (
    <div>
      <hr />

      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <div className="mb-10 md:mb-16">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">
              Blog
            </h2>

            <p className="mx-auto max-w-screen-md text-center text-gray-500 md:text-lg">
              This is a section of some simple filler text, also known as
              placeholder text. It shares some characteristics of a real written
              text but is random or otherwise generated.
            </p>
          </div>

          {/* flowrift */}

          <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
              <div className="mb-6 flex items-end justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                  Posts
                </h2>

                <a
                  href="#"
                  className="inline-block rounded-lg border bg-white px-4 py-2 text-center text-sm font-semibold text-gray-500 outline-none ring-indigo-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:px-8 md:py-3 md:text-base"
                >
                  Show more
                </a>
              </div>

              <div className="grid gap-x-4 gap-y-6 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
                {blogsQuery.data?.map((blog) => (
                  <div key={blog.post_id}>
                    <Link
                      to={`/posts/${blog.post_id}`}
                      className="group mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
                    >
                      <img
                        src={blog.image}
                        loading="lazy"
                        alt="Photo by Austin Wade"
                        className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                      />
                    </Link>

                    <div className="flex flex-col">
                      <Link to={`/profile/${blog.user_id}`}>
                        <span className="text-gray-500">{blog.user_id}</span>
                      </Link>
                      <Link
                        to={`/posts/${blog.post_id}`}
                        className="text-lg font-bold text-gray-800
                        transition duration-100 hover:text-gray-500 lg:text-xl"
                      >
                        {blog.caption}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyFeed;
