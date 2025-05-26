'use client'

import { Avatar } from '@/components/avatar'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/dropdown'
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from '@/components/sidebar'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from '@heroicons/react/16/solid'
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChartBarIcon,
  CheckCircleIcon,
  FolderIcon,
  CpuChipIcon,
} from '@heroicons/react/20/solid'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

function TasksAIDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleSignOut = () => {
    logout()
    router.push('/login')
  }

  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      <DropdownItem href="/settings">
        <Cog8ToothIcon />
        <DropdownLabel>Settings</DropdownLabel>
      </DropdownItem>
      <DropdownItem href="/profile">
        <UserCircleIcon />
        <DropdownLabel>My Account</DropdownLabel>
      </DropdownItem>
      <DropdownItem onClick={handleSignOut}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign Out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function ApplicationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let pathname = usePathname()
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Show loading or login page
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If on login page, render without layout
  if (pathname === '/login') {
    return <>{children}</>
  }

  // If not authenticated, don't render the main layout
  if (!isAuthenticated) {
    return null
  }

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src={user?.avatar_url || "/teams/catalyst.svg"} />
                <span className="text-sm font-medium">{user?.name || 'Tasks AI'}</span>
                <ChevronDownIcon />
              </DropdownButton>
              <TasksAIDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <Avatar src={user?.avatar_url || "/teams/catalyst.svg"} />
                <SidebarLabel>{user?.name || 'Tasks AI'}</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
                <DropdownItem href="/settings">
                  <Cog8ToothIcon />
                  <DropdownLabel>Settings</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="/profile">
                  <UserCircleIcon />
                  <DropdownLabel>My Account</DropdownLabel>
                </DropdownItem>
                <DropdownItem href="#">
                  <ArrowRightStartOnRectangleIcon />
                  <DropdownLabel>Sign Out</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/dashboard" current={pathname.startsWith('/dashboard')}>
                <ChartBarIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/tasks" current={pathname.startsWith('/tasks')}>
                <CheckCircleIcon />
                <SidebarLabel>Tasks</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/projects" current={pathname.startsWith('/projects')}>
                <FolderIcon />
                <SidebarLabel>Projects</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/ai-planner" current={pathname.startsWith('/ai-planner')}>
                <CpuChipIcon />
                <SidebarLabel>AI Planner</SidebarLabel>
              </SidebarItem>
            </SidebarSection>



          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}
