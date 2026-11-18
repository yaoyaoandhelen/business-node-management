// Shared certification fields for applicant pages and operator review dialogs.
window.IdentityCertification = {
 isRequired(kind,name) {return (kind==='personal'?['姓名','证件类型','证件号码','证件有效期','证书请求文件 CSR']:kind==='agent'?['经办人姓名','经办人标识','所属组织名称','所属组织标识','颁发时间','过期时间','经办权限','签名类型','签名值']:['企业全称','法人或其他组织类型','统一社会信用代码','经营期限','认证方式','法人姓名','法人身份证号']).includes(name);},
 groups(kind, record = {}) {
 if(kind==='agent')return [
 {title:'经办人审核信息',rows:[['经办人姓名',record.name||'李一'],['经办人标识',record.code||'xp9a507oq86i3k1wjx'],['所属组织名称',record.organization||'李二家族企业集团'],['所属组织标识',record.organizationCode||'91500100RGM16RFG9'],['颁发时间',record.issuedAt||'2026-09-01 16:59:42'],['过期时间',record.expiresAt||'2027-02-28 16:59:42']]},
 {title:'经办权限',permissions:true,rows:[['接入连接器注册更新注销（CONNECTOR_NODE_MAINTAIN）','查看和操作经办组织的全部数据'],['数据资源登记更新注销（RESOURCE_REGISTER_MAINTAIN）','无权限'],['数据产品登记更新注销（PRODUCT_REGISTER_MAINTAIN）','无权限'],['数据产品上架下架维护（PRODUCT_SHELF_MAINTAIN）','无权限'],['数据产品交易操作（PRODUCT_TRANSACTION_OPERATE）','无权限']]},
 {title:'签发信息',signature:true,rows:[['签名类型','SM2-SM3'],['签名值',record.signature||'MEUCIH1cHZcM+koxbn+7KSR29YkAVqAsSPRAzG1EQBLt6jxBAiEA7eh5egF6IxpF4CEc/Xa1EcYX19w0Io8Edw0aEEHw0eY=']]}
 ];
 const personal=kind==='personal';
 const values=personal?{'姓名':record.name||'王三','证件类型':record.document||'中华人民共和国居民身份证','证件号码':record.code||'500228199505070116','证件有效期':'2019-07-02 至 2035-07-02','证书请求文件 CSR':'客户端生成','申请状态':'认证审核中'}:{'企业全称':record.name||'重庆壹弘科技有限公司','法人或其他组织类型':record.organizationType||'企事业单位法人','统一社会信用代码':record.code||'91500103MAE2CF7R62','经营期限':'2024-10-30 至 长期','认证方式':'法定代表人认证','申请状态':'认证审核中'};
 const info=(title,rows)=>({title,rows}); const files=(title,rows)=>({title,rows,materials:true});
 const groups=[info(personal?'个人信息':'企业信息',Object.entries(values))];
 if(!personal)groups.push(files('电子营业执照',[['电子营业执照','business-license.jpg']]),info('企业附加信息',[['注册地址','重庆市渝中区示例路 88 号'],['注册金额（元）','1,000,000.00'],['注册日期','2024-10-30'],['行业类型','软件和信息技术服务业'],['经营范围','软件开发、信息技术咨询服务、数据处理服务。',true]]),info('法定代表人信息',[['法人姓名',record.legal||'王艳波'],['法人身份证号',record.legalCode||'220181198008060421'],['法人邮箱','未提供']]),info('补充信息',[['主体资质信息','相关资质信息及证明材料已随申请提交。',true],['业务对接信息',record.phone?'对接人：'+(record.legal||'王艳波')+'；联系电话：'+record.phone+'。':'对接人：王艳波；联系电话：18611740968。',true],['主体授权信息','由法定代表人发起认证，授权范围为主体身份认证。',true]]));
 groups.push(files(personal?'证件照片':'法人身份证',personal?[['证件正面','personal-id-front.jpg'],['证件反面','personal-id-back.jpg']]:[['身份证正面','legal-id-front.jpg'],['身份证反面','legal-id-back.jpg']]));
 if(!personal)groups.push(files('补充材料',[['授权文件证明材料','authorization.pdf'],['资质证书证明材料','qualification.pdf']]));
 groups.push(files('证书请求文件 CSR',[[personal?'个人 CSR 文件':'企业 CSR 文件',personal?'personal-identity.csr':'enterprise-identity.csr']]));
 return groups;
 }
};
