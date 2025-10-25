export default {
  appTitle: '貿易授信審核',
  login: { title: '登入', username:'帳號', password:'密碼', submit:'登入' },
  actions: { create: '新增', save:'儲存', submit:'送出', approve:'核准', reject:'拒絕', return:'退回', send:'發送', remind:'提醒', reply:'登記回覆' },
  status: {
    Draft: '草稿', 'Pending-StationMgr':'等待站點主管', 'Pending-CustomerInput':'等待客戶補件',
    'Referral-Sent':'已發送徵信', 'Referral-Received':'已收徵信', 'Pending-L1ManagerApproval':'待一階主管',
    'Pending-L2ManagerApproval':'待二階主管', Approved:'核准', Rejected:'已拒絕'
  },
  letters: {
    approvalSubject: '信用核准通知 — {company}',
    approvalBody: '您好 {contact}，貴司信用額度 {amount} 美元已核准。（申請編號：{id}）'
  },
  list: { title:'申請清單', new:'建立申請' }
}
