import { buddhistDay } from '@/const/day';
import { useNavigate } from '@/utils/navigation';
import { Button, Collapse, Menu, Typography, Tooltip } from 'antd';
import { CaretUpOutlined } from '@ant-design/icons';
import { SignOut, CalendarBlank } from '@phosphor-icons/react';
import { usePathname, useParams } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/authContext';
import Loading from '@/components/loading';
import HamburgerMenu from './hamburger';
import { format } from 'date-fns';
import { FaRegUser } from 'react-icons/fa';
import { LuBarChartHorizontal } from 'react-icons/lu';
import { RiBloggerLine } from "react-icons/ri";

type Props = {
  children: React.ReactNode;
};

type MenuItem = {
  name: string;
  icon: JSX.Element;
  path: string;
  navigate: () => void;
  subMenu?: MenuItem[];
};

const navigateWithDelay = (
  navigateFunction: Function,
  setIsChangingPage: Function
) => {
  setIsChangingPage(true);
  setTimeout(() => {
    setIsChangingPage(false);
  }, 500);
  navigateFunction();
};

export default function Navbar({ children }: Props) {
  const params = useParams();
  const id = params.id as string;
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigateTo = useNavigate();
  const pathname = usePathname();
  const [isChangingPage, setIsChangingPage] = useState(false);
  const { logout, userProfile } = useAuth();
  const { mobileScreen } = useAuth();
  const todayDate = format(new Date(), 'dd MMMM yyyy');

  const handleSidebarOpen = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  let HeadetTitle: { title?: string; desc?: string } = {};
  switch (pathname) {
    case '/blog':
      HeadetTitle = {
        title: 'List of Blogs Management',
        desc: 'Search, add, delete, and edit blogs in the system.',
      };
      break;
    case '/blog/create':
      HeadetTitle = {
        title: 'Create Blogs',
        desc: 'Upload or fill in all details accurately.',
      };
      break;
    case `/blog/${id}`:
      HeadetTitle = {
        title: 'Edit Blogs',
        desc: 'Upload or fill in all details accurately.',
      };
      break;
    case '/user':
      HeadetTitle = {
        title: 'User Account Management',
        desc: 'Search, add, delete, and edit users in the system.',
      };
      break;
    case '/user/create':
      HeadetTitle = {
        title: 'Create User Account',
        desc: 'Fill in all details accurately.',
      };
      break;
    case `/user/${id}`:
      HeadetTitle = {
        title: 'Edit User Account',
        desc: 'Fill in all details accurately.',
      };
      break;
    case '/overview':
      HeadetTitle = {
        title: 'Dashboard Overview',
        desc: 'View various statistical reports in the system.',
      };
      break;
    default:
      HeadetTitle = {};
  }

  const MenuList: MenuItem[] = [
    {
      name: 'Overview',
      icon: <LuBarChartHorizontal size={24} />,
      path: '/overview',
      navigate: () => navigateWithDelay(navigateTo.Overview, setIsChangingPage),
    },
    {
      name: 'Blogs',
      icon: <RiBloggerLine size={24} />,
      path: '/blog',
      navigate: () =>
        navigateWithDelay(navigateTo.Blog, setIsChangingPage),
    },
    {
      name: 'User Account',
      icon: <FaRegUser size={24} />,
      path: '/user',
      navigate: () =>
        navigateWithDelay(navigateTo.User, setIsChangingPage),
    },
  ];

  const initialListOpenStateState = Object.fromEntries(
    MenuList.map((menu) => [menu.name, false])
  );

  const [listOpenState, setListOpenState] = useState(initialListOpenStateState);

  const handleListClick = (menuName: string) => {
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
      setListOpenState((o: { [key: string]: boolean }) => ({
        ...initialListOpenStateState,
        [menuName]: true,
      }));
    } else {
      setListOpenState((o: { [key: string]: boolean }) => ({
        ...initialListOpenStateState,
        [menuName]: !o[menuName],
      }));
    }
  };

  useEffect(() => {
    if (!isSidebarOpen) setListOpenState(initialListOpenStateState);
  }, [isSidebarOpen]);

  return (
    <>
      <div
        className={`fixed h-screen sm:h-[calc(100vh-80px)] w-full gap-4 z-49 py-6 bg-[#010b19] border-r box-border flex flex-col justify-between transition-all duration-300 top-0 sm:top-20 sm:w-full ${
          isSidebarOpen
            ? 'xl:max-w-[276px] md:max-w-[276px] sm:max-w-full block px-6 z-49'
            : 'max-w-[72px] sm:hidden px-3'
        }`}
      >
        <div
          className={`menu flex flex-col gap-4 items-center overflow-y-auto flex-grow`}
        >
          <div
            className={`flex flex-col mt-[10px] gap-4 items-center cursor-pointer transition-all duration-300 ${
              !isSidebarOpen ? 'h-12' : 'h-min'
            }`}
            onClick={handleSidebarOpen}
          >
            <img
              src={'/Surakiat-WhiteBG.avif'}
              alt="icon"
              className="w-full max-w-24 h-fit transition-all duration-300"
            />
          </div>
          <div className="flex flex-col gap-2 items-center w-full flex-grow custom-scrollbar overflow-x-hidden">
            {MenuList.map((menu, index) => (
              <Fragment key={index}>
                <div className="flex flex-col gap-3 w-full">
                  {!isSidebarOpen ? (
                    <Tooltip
                      title={menu.name}
                      placement="right"
                      mouseEnterDelay={0.1}
                      mouseLeaveDelay={0.1}
                    >
                      <Button
                        type={
                          pathname.includes(menu.path) ? 'primary' : 'default'
                        }
                        size="large"
                        onClick={() => {
                          if (menu.subMenu) handleListClick(menu.name);
                          else {
                            menu.navigate();
                            if (mobileScreen) {
                              handleSidebarOpen();
                            }
                          }
                        }}
                        block={isSidebarOpen}
                        className={`flex flex-row items-center border-none justify-start transition-all w-full ${
                          !isSidebarOpen && 'p-3 w-fit min-w-0 !justify-center'
                        } ${menu.subMenu && 'justify-between'}`}
                      >
                        <div className="flex flex-row items-center">
                          {menu.icon}
                          <Typography.Text
                            className={`text-start ${
                              isSidebarOpen
                                ? `transition-from-small ml-2 ${
                                    pathname.includes(menu.path)
                                      ? `text-white`
                                      : `text-black`
                                  }`
                                : `text-[0px] transition-from-large ${
                                    pathname.includes(menu.path)
                                      ? `text-white`
                                      : `text-black`
                                  }`
                            }`}
                          >
                            {menu.name}
                          </Typography.Text>
                        </div>
                        {menu.subMenu && (
                          <CaretUpOutlined
                            className={`${
                              !listOpenState[menu.name] && 'rotate-180'
                            } transition-all duration-100 ${
                              !isSidebarOpen && 'hidden'
                            }`}
                          />
                        )}
                      </Button>
                    </Tooltip>
                  ) : (
                    <Button
                      type={
                        pathname.includes(menu.path) ? 'primary' : 'default'
                      }
                      size="large"
                      onClick={() => {
                        if (menu.subMenu) handleListClick(menu.name);
                        else {
                          menu.navigate();
                          if (mobileScreen) {
                            handleSidebarOpen();
                          }
                        }
                      }}
                      block={isSidebarOpen}
                      className={`flex flex-row items-center border-none justify-start transition-all w-full ${
                        !isSidebarOpen && 'p-3 w-fit min-w-0 !justify-center'
                      } ${menu.subMenu && 'justify-between'}`}
                    >
                      <div className="flex flex-row items-center">
                        {menu.icon}
                        <Typography.Text
                          className={`text-start ${
                            isSidebarOpen
                              ? `transition-from-small ml-2 ${
                                  pathname.includes(menu.path)
                                    ? `text-white`
                                    : `text-black`
                                }`
                              : `text-[0px] transition-from-large ${
                                  pathname.includes(menu.path)
                                    ? `text-white`
                                    : `text-black`
                                }`
                          }`}
                        >
                          {menu.name}
                        </Typography.Text>
                      </div>
                      {menu.subMenu && (
                        <CaretUpOutlined
                          className={`${
                            !listOpenState[menu.name] && 'rotate-180'
                          } transition-all duration-100 ${
                            !isSidebarOpen && 'hidden'
                          }`}
                        />
                      )}
                    </Button>
                  )}
                  {menu.subMenu && (
                    <Collapse
                      activeKey={listOpenState[menu.name] ? [menu.name] : []}
                      className="w-full"
                    >
                      <Collapse.Panel key={menu.name} header={null}>
                        <Menu mode="inline" inlineIndent={20}>
                          {menu.subMenu.map((subMenu, index) => (
                            <Menu.Item
                              key={index}
                              onClick={() => {
                                subMenu.navigate();
                                if (mobileScreen) handleSidebarOpen();
                              }}
                              className={`${
                                isSidebarOpen
                                  ? 'transition-from-small'
                                  : '!text-transparent !bg-transparent transition-from-large'
                              }`}
                            >
                              <Typography.Text>{subMenu.name}</Typography.Text>
                            </Menu.Item>
                          ))}
                        </Menu>
                      </Collapse.Panel>
                    </Collapse>
                  )}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div className={`profile flex flex-col items-center gap-4`}>
          <Tooltip
            title={!isSidebarOpen ? 'ออกจากระบบ' : ''}
            placement="right"
            mouseEnterDelay={0.1}
            mouseLeaveDelay={0.1}
          >
            <Button
              size="large"
              block={isSidebarOpen}
              className={`flex flex-row border border-[#e11d48] items-center justify-start transition-all w-full ${
                !isSidebarOpen && 'px-3 w-fit min-w-0'
              }`}
              onClick={logout}
            >
              <div className="flex flex-row items-center">
                <SignOut color="#e11d48" size={24} weight="fill" />
                <Typography.Text
                  className={`${
                    isSidebarOpen
                      ? 'transition-from-small ml-2 text-[#e11d48]'
                      : 'text-[0px] transition-from-large text-[#e11d48]'
                  }`}
                >
                  {'Logout'}
                </Typography.Text>
              </div>
            </Button>
          </Tooltip>
        </div>
      </div>
      <div
        className={`navbar bg-[#010b19] border-b fixed top-0 right-0 transition-all duration-300 z-50 h-auto sm:h-min ${
          isSidebarOpen
            ? 'xl:left-[276px] lg:left-[276px] md:left-[276px] sm:z-50 sm:left-[0px]'
            : 'xl:left-[72px] lg:left-[72px] md:left-[72px] sm:left-[0px]'
        }`}
      >
        <img
          src={'/pattern-left.svg'}
          alt="left"
          className="absolute sm:hidden top-0 left-0"
        />
        <img
          src={'/pattern-right.svg'}
          alt="right"
          className="absolute sm:hidden bottom-0 right-0"
        />
        <div className="flex justify-between items-center">
          <div
            className={`w-full h-full flex sm:py-6 py-8 sm:gap-4 justify-start items-center sm:items-center text-white z-30 ${
              isSidebarOpen
                ? 'xl:left-[276px] sm:z-50 sm:left-[0px]'
                : 'left-[72px]'
            }`}
          >
            <div className="flex pl-6 sm:pl-3 pr-3 cursor-pointer">
              <HamburgerMenu
                onClick={handleSidebarOpen}
                isSidebarOpen={isSidebarOpen}
              />
            </div>
            <div className="flex flex-col pl-6 sm:pl-0 gap-3">
              <h1 className="text-[28px] sm:text-xl font-bold leading-4 text-white">
                {HeadetTitle.title}
              </h1>
              <h2 className="text-[16px] sm:hidden font-normal leading-4 text-white">
                {HeadetTitle.desc}
              </h2>
            </div>
          </div>
          <div className="flex flex-col w-3/5 sm:flex-col sm:w-full pr-6 sm:gap-1 sm:hidden gap-4">
            <div className="flex gap-4 text-white justify-end">
              <Typography.Text className="flex gap-2 sm:text-sm items-center text-white">
                <CalendarBlank size={24} />
                {'Today '}
                {todayDate}
              </Typography.Text>
            </div>
            <Typography.Text
              className={`text-white text-end ${
                isSidebarOpen
                  ? 'transition-from-small'
                  : 'transition-from-small'
              }`}
            >
              {userProfile
                ? `${userProfile?.prefix}${userProfile?.firstname} ${userProfile?.lastname}`
                : 'ไม่พบผู้ใช้งาน'}
            </Typography.Text>
          </div>
        </div>
      </div>
      <div
        className={`sm:pt-20 pt-32 transition-all duration-300 h-screen box-border ${
          isSidebarOpen
            ? 'ml-[276px]'
            : 'xl:ml-[72px] lg:ml-[72px] md:ml-[72px]'
        }`}
      >
        <div
          className={`px-8 sm:px-4 py-6 ${
            isSidebarOpen ? 'sm:hidden xl:block lg:block md:block' : 'block'
          }`}
        >
          {isChangingPage ? <Loading /> : children}
        </div>
      </div>
    </>
  );
}
