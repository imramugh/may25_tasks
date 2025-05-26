'use client'

import { Avatar } from '@/components/avatar'
import { Badge } from '@/components/badge'
import { Button } from '@/components/button'
import { Divider } from '@/components/divider'
import { Field, FieldGroup, Fieldset, Label } from '@/components/fieldset'
import { Heading, Subheading } from '@/components/heading'
import { Input } from '@/components/input'
import { Text } from '@/components/text'
import { 
  CameraIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  CheckCircleIcon,
} from '@heroicons/react/16/solid'
import { useState, useRef } from 'react'

// Utility function to format dates consistently across server and client
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC' // Use UTC to ensure consistency
  })
}

// Mock user data - in a real app, this would come from your authentication system
const mockUser = {
  id: 1,
  name: 'Sarah Chen',
  email: 'sarah.chen@example.com',
  avatar: '/users/sarah-chen.jpg',
  role: 'Project Manager',
  department: 'Product Development',
  joinDate: '2023-03-15',
  lastLogin: '2024-05-26T10:30:00Z',
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload this to your server/cloud storage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePicture(result)
        // Update user avatar
        setUser(prev => ({ ...prev, avatar: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = () => {
    // In a real app, you'd save to your API
    setUser(prev => ({
      ...prev,
      name: profileForm.name,
      email: profileForm.email,
    }))
    // Show success message
    alert('Profile updated successfully!')
  }

  const handlePasswordSave = () => {
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!')
      return
    }

    // In a real app, you'd validate current password and save new one to your API
    console.log('Password change request:', {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    alert('Password changed successfully!')
  }

  return (
    <>
      <Heading>My Profile</Heading>
      <Text className="mt-2 text-zinc-500 dark:text-zinc-400">
        Manage your account settings and preferences
      </Text>

      <Divider className="my-10 mt-6" />

      {/* Profile Picture Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Profile Picture</Subheading>
          <Text>Upload a profile picture to personalize your account.</Text>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar 
              src={profilePicture || user.avatar} 
              className="size-20"
              square={false}
            />
            <button
              onClick={handleProfilePictureClick}
              className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-2 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
          </div>
          <div>
            <Button onClick={handleProfilePictureClick} outline>
              Change Picture
            </Button>
            <Text className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              JPG, PNG or GIF. Max size 5MB.
            </Text>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </div>
      </section>

      <Divider className="my-10" soft />

      {/* Basic Information Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Basic Information</Subheading>
          <Text>Update your personal information and contact details.</Text>
        </div>
        <div className="space-y-4">
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Full Name</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </Field>
              <Field>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                />
              </Field>
            </FieldGroup>
            <div className="mt-6">
              <Button onClick={handleProfileSave}>
                <CheckCircleIcon />
                Save Changes
              </Button>
            </div>
          </Fieldset>
          
          <div className="space-y-4 pt-4">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Role
              </Text>
              <div className="mt-1">
                <Badge color="blue">{user.role}</Badge>
              </div>
            </div>
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Department
              </Text>
              <Text className="mt-1 text-zinc-900 dark:text-white">{user.department}</Text>
            </div>
          </div>
        </div>
      </section>

      <Divider className="my-10" soft />

      {/* Account Security Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Account Security</Subheading>
          <Text>Keep your account secure by updating your password regularly.</Text>
        </div>
        <div className="space-y-4">
          <Fieldset>
            <FieldGroup>
              <Field>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter your current password"
                />
              </Field>
              <Field>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter your new password"
                />
              </Field>
              <Field>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm your new password"
                />
              </Field>
            </FieldGroup>
            <div className="mt-6">
              <Button onClick={handlePasswordSave}>
                <KeyIcon />
                Change Password
              </Button>
            </div>
          </Fieldset>
          
          <div className="space-y-4 pt-4">
            <div>
              <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Last Login
              </Text>
              <Text className="mt-1 text-zinc-900 dark:text-white">
                {formatDateTime(user.lastLogin)}
              </Text>
            </div>
          </div>
        </div>
      </section>

      <Divider className="my-10" soft />

      {/* Account Information Section */}
      <section className="grid gap-x-8 gap-y-6 sm:grid-cols-[16rem_1fr]">
        <div className="space-y-1">
          <Subheading>Account Information</Subheading>
          <Text>View your account details and membership information.</Text>
        </div>
        <div className="space-y-4">
          <div>
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Member Since
            </Text>
            <Text className="mt-1 text-zinc-900 dark:text-white">
              {new Date(user.joinDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </div>
          <div>
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              User ID
            </Text>
            <Text className="mt-1 text-zinc-900 dark:text-white font-mono text-sm">
              #{user.id.toString().padStart(6, '0')}
            </Text>
          </div>
        </div>
      </section>
    </>
  )
} 