// Match business prototype records by subject ID; never reuse another subject's appeal.
window.IdentityWorkflowData={
 freezeKey:'identity-review-freeze-records-v1',
 readFreezes(){try{return JSON.parse(sessionStorage.getItem(this.freezeKey)||'{}')}catch{return {}}},
 freeze(kind,record){return this.readFreezes()[kind+':'+record.code]||null},
 appeal(kind,record){try{const value=JSON.parse(localStorage.getItem('cq-portal-freeze-appeal-v1')||'null');return value&&[record.subjectId,record.code].filter(Boolean).includes(value.subjectId)&&typeof value.reason==='string'&&typeof value.phone==='string'?value:null}catch{return null}},
 unfreeze(kind,record){const freeze=this.freeze(kind,record),appeal=this.appeal(kind,record);return {freezeReason:freeze?.reason||'',reason:appeal?.reason||'',phone:appeal?.phone||''};}
};
