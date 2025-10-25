import { defineStore } from 'pinia'

export type Role = 'Admin'|'Sales'|'Accounting'|'StationManager'|'L1Manager'|'L2Manager'|'Customer'

export const demoUsers = [
  { username: 'admin', password: 'demo1234', role: 'Admin' },
  { username: 'sales', password: 'demo1234', role: 'Sales' },
  { username: 'accounting', password: 'demo1234', role: 'Accounting' },
  { username: 'station', password: 'demo1234', role: 'StationManager' },
  { username: 'l1', password: 'demo1234', role: 'L1Manager' },
  { username: 'l2', password: 'demo1234', role: 'L2Manager' }
] as const

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null as null | { username: string; role: Role },
  }),
  getters: {
    isAuthenticated: (s) => !!s.currentUser
  },
  actions: {
    login(username: string, password: string) {
      const found = demoUsers.find(u => u.username === username && u.password === password)
      if (!found) throw new Error('Invalid credentials')
      this.currentUser = { username: found.username, role: found.role as Role }
    },
    logout(){ this.currentUser = null }
  }
})
