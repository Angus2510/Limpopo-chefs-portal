"use client";
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiAlignJustify, FiSearch } from 'react-icons/fi';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { IoMdNotificationsOutline, IoMdInformationCircleOutline } from 'react-icons/io';
import Dropdown from '@/components/dropdown';
import Image from 'next/image';
import routes from '@/data/routes';
import { useSidebarContext } from '@/providers/SidebarProvider';
import { useThemeContext } from '@/providers/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext'; 

import { useSearchQuery } from '@/app/api/apiSlice';
import {useGetNotificationsQuery, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } from '@/lib/features/notifications/notificatinsApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setQuery } from '@/lib/features/search/searchSlice';
import { RootState } from '@/lib/store';

interface Notification {
  id: string;
  title: string;
  message: string;
}

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [currentRoute, setCurrentRoute] = useState('Main Dashboard');

  const [isSearchFocused, setIsSearchFocused] = useState(false); 

  const pathname = usePathname();
  const { setOpenSidebar } = useSidebarContext();
  const { theme, setTheme } = useThemeContext();

  const isAssignmentWrite = pathname.includes('assignment/write');

  const searchRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.search.query);
  const { data: searchResults, isLoading } = useSearchQuery(query, {
    skip: !query,
  });

  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();

  const { data: notifications = [], isLoading: isLoadingNotifications } = useGetNotificationsQuery(user?.id);

  const handleRemoveNotification = async (notificationId: string) => {
    try {
      await deleteNotification({ userId: user?.id, notificationId }).unwrap();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };
  
  const handleRemoveAllNotifications = async () => {
    try {
      await deleteAllNotifications(user?.id).unwrap();
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  useEffect(() => {
    getActiveRoute(routes);
  }, [pathname]);

  const getActiveRoute = (routes: any) => {
    let activeRoute = 'Main Dashboard';
    for (let i = 0; i < routes.length; i++) {
      if (window.location.href.indexOf(routes[i].path) !== -1) {
        setCurrentRoute(routes[i].name);
      }
    }
    return activeRoute;
  };

  const renderDefaultAvatar = (name: string) => {
    const initial = name ? name.charAt(0).toUpperCase() : 'U';
    return (
      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-500 text-white">
        {initial}
      </div>
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };


  const handleResultClick = () => {
    setIsSearchFocused(false);
  };


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        console.log('Click outside detected');
        setIsSearchFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    console.log('Event listener added');

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      console.log('Event listener removed');
    };
  }, [searchRef]);

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dmgray-800 p-2 rounded-md shadow-md max-h-60 overflow-auto z-50">
          Loading...
        </div>
      );
    }

    if (!searchResults || Object.keys(searchResults).length === 0) {
      return (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dmgray-800 p-2 rounded-md shadow-md max-h-60 overflow-auto z-50">
          No results found
        </div>
      );
    }

    return (
      <div className="absolute top-full mt-2 w-full bg-white dark:bg-dmgray-800 p-2 rounded-md shadow-md max-h-60 overflow-auto z-50">
        {Object.keys(searchResults).map((key) => (
          <div key={key}>
          <div className="font-bold text-navy-700 dark:text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
          {searchResults[key].map((result: any) => (
            <Link key={result.route} href={result.route} passHref>
              <div className="block p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-dmgray-600"
               onClick={handleResultClick}>
                <p className="text-sm font-medium text-navy-700 dark:text-white">{result.heading}</p>
                <p className="text-xs text-gray-500 dark:text-dmgray-300">{result.subheading}</p>
              </div>
            </Link>
          ))}
        </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return null; 
  }

  if (isAssignmentWrite) {
    return null;
  }

  if (user) {

    const hasUnreadNotifications = notifications.length > 0;

    return (
      <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#141b250b]">
        <div className="ml-[6px]">
          <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
            <Link href="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
              {currentRoute}
            </Link>
          </p>
        </div>

        <div className="relative mt-[3px] flex h-[61px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-dmgray-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[365px] xl:gap-2">
           {/* Search */}
          <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-dmgray-900 dark:text-white xl:w-[225px] relative"
          ref={searchRef} >
            <p className="pl-3 pr-2 text-xl">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </p>

            <input
              type="text"
              placeholder="Search..."
              className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-dmgray-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
              value={query}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
            />
             {isSearchFocused && query && renderSearchResults()}
          </div>

         {/* Menu */}

          <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={() => setOpenSidebar(true)}>
            <FiAlignJustify className="h-5 w-5" />
          </span>

       {/* Notification */}
          <Dropdown
            button={

              <div className="relative">
                <IoMdNotificationsOutline className="h-4 w-4 text-gray-600 dark:text-white" />
                {hasUnreadNotifications && (
                  <span className="absolute top-0 right-0 inline-flex h-1 w-1 rounded-full bg-red-500"></span>
                )}
              </div>
            }
            animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
            className={'py-2 top-4 -left-[230px] md:-left-[440px] w-max'}
          >
            <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-dmgray-700 dark:text-white dark:shadow-none sm:w-[460px]">
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-navy-700 dark:text-white">Notification</p>
                <button onClick={handleRemoveAllNotifications} className="text-sm font-bold text-navy-700 dark:text-white">
                  Mark all read
                </button>
              </div>
              {isLoadingNotifications ? (
                <p>Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-600 dark:text-white">No notifications</p>
              ) : (
                notifications.map((notification: Notification) => (
                  <div key={notification.id} className="relative flex w-full items-center group">
                    {/* <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
                      <BsArrowBarUp />
                    </div> */}
                    <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
                      <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="font-base text-left text-xs text-gray-900 dark:text-white">{notification.message}</p>
                    </div>
                    <button
                      className="absolute top-0 right-0 p-1 text-gray-600 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => handleRemoveNotification(notification.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </Dropdown>

          <Dropdown
            button={
              <p className="cursor-pointer">
                <IoMdInformationCircleOutline className="h-4 w-4 text-gray-600 dark:text-white" />
              </p>
            }
            className={'py-2 top-6 -left-[250px] md:-left-[330px] w-max'}
            animation="origin-[75%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
          >
            <div className="flex w-[350px] flex-col gap-2 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-dmgray-700 dark:text-white dark:shadow-none">
              No new updates
            </div>
          </Dropdown>

          <div
            className="cursor-pointer text-gray-600"
            onClick={() => {
              theme === 'dark' ? setTheme('light') : setTheme('dark');
            }}
          >
            {theme === 'dark' ? (
              <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
            ) : (
              <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
            )}
          </div>

          <Dropdown
            button={
              user?.image && !imageError ? (
                <Image
                  className="h-10 w-10 rounded-full cursor-pointer"
                  src={user?.image}
                  alt={user?.name ?? 'User'}
                  width={40}
                  height={40}
                  onError={() => setImageError(true)}
                />
              ) : (
                renderDefaultAvatar(user?.userFirstName ?? 'User')
              )
            }
            className={'py-2 top-8 -left-[180px] w-max'}
          >
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white bg-cover bg-no-repeat shadow-xl shadow-shadow-500 dark:!bg-dmgray-700 dark:text-white dark:shadow-none">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">👋 Hey, {user?.userFirstName ?? 'User'}</p>{' '}
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />

              <div className="flex flex-col p-4">
                {/* <Link href=" " className="text-sm text-gray-800 dark:text-white hover:dark:text-white">
                  Profile Settings
                </Link>
                <Link href=" " className="mt-3 text-sm text-gray-800 dark:text-white hover:dark:text-white">
                  Newsletter Settings
                </Link> */}

                <button className="mt-3 text-sm font-medium text-red-500 hover:text-red-500" onClick={logout}>
                  Log Out
                </button>
              </div>
            </div>
          </Dropdown>
        </div>
      </nav>
    );
  }

  return null;
};

export default Navbar;
