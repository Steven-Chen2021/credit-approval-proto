export type Status =
  | 'Draft'
  | 'Pending-StationMgr'
  | 'Pending-CustomerInput'
  | 'Referral-Sent'
  | 'Referral-Received'
  | 'Pending-L1ManagerApproval'
  | 'Pending-L2ManagerApproval'
  | 'Approved'
  | 'Rejected'

export const canTransition: Record<Status, Status[]> = {
  'Draft': ['Pending-StationMgr','Pending-CustomerInput'],
  'Pending-StationMgr': ['Pending-CustomerInput','Rejected'],
  'Pending-CustomerInput': ['Referral-Sent'],
  'Referral-Sent': ['Referral-Received'],
  'Referral-Received': ['Pending-L1ManagerApproval','Rejected'],
  'Pending-L1ManagerApproval': ['Pending-L2ManagerApproval','Rejected'],
  'Pending-L2ManagerApproval': ['Approved','Rejected'],
  'Approved': [],
  'Rejected': []
}
