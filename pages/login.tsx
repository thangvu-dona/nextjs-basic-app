import * as React from 'react'
import { authApi } from '@/api/index'

export default function Login() {
  async function handleLoginClick() {
    try {
      await authApi.login({
        username: 'testtt',
        password: '123123',
      })
    } catch (error) {
      console.log('Failed to login.', error)
    }
  }
  async function handleGetProfileClick() {
    try {
      await authApi.getProfile()
    } catch (error) {
      console.log('Failed to get profile.', error)
    }
  }
  async function handleLogoutClick() {
    try {
      await authApi.logout()
    } catch (error) {
      console.log('Failed to logout.')
    }
  }
  return (
    <div>
      <h3>login Page</h3>
      <button onClick={handleLoginClick}>Login</button>
      <button onClick={handleGetProfileClick}>Get Profile</button>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  )
}
