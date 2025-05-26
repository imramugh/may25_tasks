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
import { usePathname } from 'next/navigation'

function TasksAIDropdownMenu({ anchor }: { anchor: 'top start' | 'bottom end' }) {
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
      <DropdownItem href="#">
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

  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar src="/teams/catalyst.svg" />
                <span className="text-sm font-medium">Tasks AI</span>
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
                <Avatar src="/teams/catalyst.svg" />
                <SidebarLabel>Tasks AI</SidebarLabel>
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
