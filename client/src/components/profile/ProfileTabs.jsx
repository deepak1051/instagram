import { NavLink, useParams } from 'react-router-dom';

const ProfileTabs = () => {
  const { id } = useParams();
  return (
    <>
      <div className="border-b border-b-gray-100  ">
        <ul className="-mb-px flex items-center gap-4 text-sm font-medium justify-center">
          <li>
            <NavLink
              end
              to={`/profile/${id}`}
              className={({ isActive }) =>
                isActive
                  ? `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-blue-500 hover:text-blue-700 underline`
                  : `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-500 hover:text-primary-700`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z"
                  clipRule="evenodd"
                />
              </svg>
              Posts
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/profile/${id}/followers`}
              className={({ isActive }) =>
                isActive
                  ? `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-blue-500 hover:text-blue-700 underline`
                  : `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-500 hover:text-primary-700`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M3.5 2A1.5 1.5 0 002 3.5V15a3 3 0 106 0V3.5A1.5 1.5 0 006.5 2h-3zm11.753 6.99L9.5 14.743V6.257l1.51-1.51a1.5 1.5 0 012.122 0l2.121 2.121a1.5 1.5 0 010 2.122zM8.364 18H16.5a1.5 1.5 0 001.5-1.5v-3a1.5 1.5 0 00-1.5-1.5h-2.136l-6 6zM5 16a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
              Followers
            </NavLink>
          </li>

          <li>
            <NavLink
              to={`/profile/${id}/followings`}
              className={({ isActive }) =>
                isActive
                  ? `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-blue-500 hover:text-blue-700 underline`
                  : `inline-flex cursor-pointer items-center gap-2 px-1 py-3 text-gray-500 hover:text-primary-700`
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z"
                  clipRule="evenodd"
                />
              </svg>
              Followings
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ProfileTabs;
