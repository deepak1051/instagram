import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { clearCredentials } from '../store';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const _className =
  'text-lg font-semibold   hover:text-gray-700 active:text-indigo-700';

const Navbar = () => {
  const { userDetail } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { refetch } = useQuery(
    ['logout'],
    () => axios.get(`/api/logout`).then((res) => res.data),
    {
      retry: 0,
      enabled: false,
      onSuccess() {
        dispatch(clearCredentials());

        navigate('/login');
      },
      onError(error) {
        toast(error.response.data || error.message);
      },
    }
  );

  const handleLogout = async () => {
    refetch();
  };

  let content;
  if (!userDetail) {
    content = (
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-8 py-3 text-center text-sm font-semibold text-gray-800 outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base cursor-pointer"
      >
        Login
      </Link>
    );
  } else {
    content = (
      <button
        onClick={handleLogout}
        className="  rounded-lg border border-red-300 bg-white px-8 py-3 text-center text-sm font-semibold text-red-800 outline-none ring-gray-300 transition duration-100 hover:bg-gray-100 focus-visible:ring active:bg-gray-200 md:text-base cursor-pointer"
      >
        Logout
      </button>
    );
  }

  return (
    <div>
      <div className={`bg-teal-600`}>
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <header className="flex items-center justify-between py-4  md:py-8 ">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-2xl font-bold text-black md:text-3xl"
              aria-label="logo"
            >
              <svg
                width="95"
                height="94"
                viewBox="0 0 95 94"
                className="h-auto w-6 text-gray-700"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M96 0V47L48 94H0V47L48 0H96Z" />
              </svg>
              Instagram
            </Link>
            {userDetail && (
              <nav className="hidden gap-12 lg:flex">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? `${_className} text-gray-700`
                      : `${_className} text-white`
                  }
                >
                  Home
                </NavLink>
                <NavLink
                  to={`/${userDetail?.user_id}/myFeed`}
                  className={({ isActive }) =>
                    isActive
                      ? `${_className} text-gray-700`
                      : `${_className} text-white`
                  }
                >
                  My Feed
                </NavLink>
                <NavLink
                  to="/createPost"
                  className={({ isActive }) =>
                    isActive
                      ? `${_className} text-gray-700`
                      : `${_className} text-white`
                  }
                >
                  Create Blog
                </NavLink>

                <NavLink
                  to={`/profile/${userDetail?.user_id}`}
                  className={({ isActive }) =>
                    isActive
                      ? `${_className} text-gray-700`
                      : `${_className} text-white`
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to={`/${userDetail?.user_id}/allUsers`}
                  className={({ isActive }) =>
                    isActive
                      ? `${_className} text-gray-700`
                      : `${_className} text-white`
                  }
                >
                  All Users
                </NavLink>
              </nav>
            )}
            {content}
          </header>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
