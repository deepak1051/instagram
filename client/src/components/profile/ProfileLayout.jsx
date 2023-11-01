import ProfileHeader from './ProfileHeader';
import { Outlet } from 'react-router-dom';
import ProfileTabs from './ProfileTabs';

const ProfileLayout = () => {
  return (
    <div className="bg-white py-6 sm:py-8 lg:py-12">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div>
          <ProfileHeader />
        </div>

        <hr />
        <ProfileTabs />

        <hr />
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
