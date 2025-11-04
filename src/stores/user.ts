import { defineStore } from 'pinia'

export type UserRole = 'OP' | 'Viewer'

export const useUserStore = defineStore('user', {
  state: () => ({
    role: 'OP' as UserRole,
    timezone: 'Asia/Taipei',
    username: 'op.tpe01',
  }),
  actions: {
    setRole(role: UserRole) {
      this.role = role
    },
  },
})
