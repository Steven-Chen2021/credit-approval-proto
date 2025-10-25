export default {
  appTitle: 'Trade Credit Approval',
  login: { title: 'Login', username:'Username', password:'Password', submit:'Login' },
  actions: { create: 'Create', save:'Save', submit:'Submit', approve:'Approve', reject:'Reject', return:'Return', send:'Send', remind:'Remind', reply:'Register Reply' },
  status: {
    Draft: 'Draft', 'Pending-StationMgr':'Pending Station Manager', 'Pending-CustomerInput':'Waiting for Customer',
    'Referral-Sent':'Referral Sent', 'Referral-Received':'Referral Received', 'Pending-L1ManagerApproval':'Pending L1',
    'Pending-L2ManagerApproval':'Pending L2', Approved:'Approved', Rejected:'Rejected'
  },
  letters: {
    approvalSubject: 'Credit Approval Letter — {company}',
    approvalBody: 'Dear {contact}, your credit line {amount} USD is approved. (Ref: {id})'
  },
  list: { title:'Applications', new:'New Application' }
}
