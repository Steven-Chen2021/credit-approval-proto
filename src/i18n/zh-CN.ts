export default {
  appTitle: '贸易授信审核',
  login: { title: '登录', username:'账号', password:'密码', submit:'登录' },
  actions: { create: '新增', save:'保存', submit:'提交', approve:'批准', reject:'拒绝', return:'退回', send:'发送', remind:'提醒', reply:'登记回复' },
  status: {
    Draft: '草稿', 'Pending-StationMgr':'等待站点主管', 'Pending-CustomerInput':'等待客户补件',
    'Referral-Sent':'已发送征信', 'Referral-Received':'已收征信', 'Pending-L1ManagerApproval':'待一级主管',
    'Pending-L2ManagerApproval':'待二级主管', Approved:'已批准', Rejected:'已拒绝'
  },
  letters: {
    approvalSubject: '信用批准通知 — {company}',
    approvalBody: '您好 {contact}，贵司信用额度 {amount} 美元已批准。（申请编号：{id}）'
  },
  list: { title:'申请清单', new:'新建申请' }
}
