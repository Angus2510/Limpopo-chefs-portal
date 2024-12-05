"use client";

import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDENAV_ITEMS } from '@/data/sideBarLinks';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { useSidebarContext } from '@/providers/SidebarProvider';
import { useThemeContext } from '@/providers/ThemeProvider';
import useMobileView from '@/hooks/useMobileView';

const Sidebar = () => {
  const { user, logout, loading } = useAuth();
  const userType = user?.userType;

  const { openSidebar, setOpenSidebar } = useSidebarContext();
  const { isMobile } = useMobileView();
  const { theme } = useThemeContext();

  const filteredItems = SIDENAV_ITEMS.filter(item => item.userType === userType);
  const pathname = usePathname() || '';
  const isAssignmentWrite = pathname.includes('assignment/write');

  if (isAssignmentWrite) {
    return null;
  }

  const sidebarBgColor = theme === 'dark' ? 'bg-dmgray-900' : 'bg-white';
  const sidebarBorderColor = theme === 'dark' ? 'border-dmgray-800' : 'border-zinc-200';
  const hoverBgColor = theme === 'dark' ? 'hover:bg-dmgray-800' : 'hover:bg-zinc-100';
  const activeBgColor = theme === 'dark' ? 'bg-dmgray-800' : 'bg-zinc-100';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const logoBgColor = theme === 'dark' ? 'bg-white' : 'bg-transparent';
  const borderColor = theme === 'dark' ? 'border-white' : 'border-zinc-200';

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 ${sidebarBgColor} ${sidebarBorderColor} border-r transition-transform duration-300 transform ${openSidebar || !isMobile ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0 xl:flex xl:flex-col xl:w-60`}>
      <div className="flex flex-col space-y-6 w-full h-full overflow-y-auto">
        <div className={`flex items-center justify-between p-4 ${borderColor} border-b ${logoBgColor}`}>
            <div className="bg-white p-2">
              <Image src="/img/logo.png" alt="Limpopo Chefs Logo" width={200} height={200} />
            </div>
          <button className="xl:hidden" onClick={() => setOpenSidebar(false)}>
            ✕
          </button>
        </div>

        <div className={`flex flex-col space-y-2 p-4 ${textColor}`}>
          {filteredItems.map((item, idx) => (
            <MenuItem key={idx} item={item} hoverBgColor={hoverBgColor} activeBgColor={activeBgColor} pathname={pathname} textColor={textColor} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ item, hoverBgColor, activeBgColor, pathname, textColor }) => {
  const [subMenuOpen, setSubMenuOpen] = React.useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div>
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg ${hoverBgColor} w-full justify-between ${pathname.includes(item.path) ? activeBgColor : ''} ${textColor}`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex">{item.title}</span>
            </div>
            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <FiChevronDown />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link key={idx} href={subItem.path} className={`${subItem.path === pathname ? 'font-bold' : ''} ${textColor}`}>
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link href={item.path} className={`flex flex-row space-x-4 items-center p-2 rounded-lg ${hoverBgColor} ${item.path === pathname ? activeBgColor : ''} ${textColor}`}>
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
