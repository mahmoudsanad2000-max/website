const SUPABASE_URL = 'https://bgdexjxkdvltorcvkpvq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Cb_uRCVqJk1x3drkGuuTwQ__a4aOha1';
const BUCKET = 'office-media';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (id) => document.getElementById(id);
const fields = [["hero_title","عنوان الواجهة الرئيسية","text"],["hero_description","وصف الواجهة الرئيسية","textarea"],["hero_cta_primary","زر الواجهة الرئيسي","text"],["hero_cta_secondary","زر الواجهة الثانوي","text"],["stats_number_1","الرقم الإحصائي الأول","text"],["stats_label_1","وصف الرقم الإحصائي الأول","text"],["stats_number_2","الرقم الإحصائي الثاني","text"],["stats_label_2","وصف الرقم الإحصائي الثاني","text"],["stats_number_3","الرقم الإحصائي الثالث","text"],["stats_label_3","وصف الرقم الإحصائي الثالث","text"],["about_title","عنوان من نحن","text"],["about_description","وصف من نحن","textarea"],["about_card_title_1","عنوان بطاقة من نحن 1","text"],["about_card_description_1","وصف بطاقة من نحن 1","textarea"],["about_card_title_2","عنوان بطاقة من نحن 2","text"],["about_card_description_2","وصف بطاقة من نحن 2","textarea"],["about_card_title_3","عنوان بطاقة من نحن 3","text"],["about_card_description_3","وصف بطاقة من نحن 3","textarea"],["about_card_title_4","عنوان بطاقة من نحن 4","text"],["about_card_description_4","وصف بطاقة من نحن 4","textarea"],["services_title","عنوان قسم الخدمات","text"],["service_1","اسم الخدمة 1","text"],["service_2","اسم الخدمة 2","text"],["service_3","اسم الخدمة 3","text"],["service_4","اسم الخدمة 4","text"],["service_5","اسم الخدمة 5","text"],["service_6","اسم الخدمة 6","text"],["service_7","اسم الخدمة 7","text"],["service_8","اسم الخدمة 8","text"],["service_9","اسم الخدمة 9","text"],["service_10","اسم الخدمة 10","text"],["service_11","اسم الخدمة 11","text"],["service_12","اسم الخدمة 12","text"],["service_13","اسم الخدمة 13","text"],["service_14","اسم الخدمة 14","text"],["service_15","اسم الخدمة 15","text"],["service_16","اسم الخدمة 16","text"],["why_title","عنوان لماذا نحن","text"],["why_feature_1","ميزة 1","text"],["why_feature_2","ميزة 2","text"],["why_feature_3","ميزة 3","text"],["why_feature_4","ميزة 4","text"],["why_feature_5","ميزة 5","text"],["why_feature_6","ميزة 6","text"],["why_feature_7","ميزة 7","text"],["why_feature_8","ميزة 8","text"],["why_feature_9","ميزة 9","text"],["why_feature_10","ميزة 10","text"],["why_feature_11","ميزة 11","text"],["gallery_title","عنوان معرض الصور","text"],["how_title","عنوان آلية العمل","text"],["how_step_1","خطوة العمل الأولى","text"],["how_step_2","خطوة العمل الثانية","text"],["testimonials_title","عنوان آراء العملاء","text"],["contact_title","عنوان التواصل","text"],["contact_phone","رقم الهاتف","text"],["contact_email","البريد الإلكتروني","text"],["contact_address","العنوان","text"],["whatsapp_number","رقم واتساب بصيغة دولية بدون +","text"],["footer_description","وصف أسفل الموقع","textarea"],["footer_quick_title","عنوان الروابط السريعة","text"],["footer_social_title","عنوان روابط التواصل الاجتماعي","text"],["footer_social_text","روابط التواصل الاجتماعي المعروضة","text"],["footer_copyright","نص حقوق النشر أسفل الموقع","text"],["nav_home","اسم رابط الرئيسية","text"],["nav_about","اسم رابط من نحن","text"],["nav_services","اسم رابط خدماتنا","text"],["nav_why","اسم رابط لماذا نحن","text"],["nav_gallery","اسم رابط معرض الصور","text"],["nav_how","اسم رابط آلية العمل","text"],["nav_testimonials","اسم رابط آراء العملاء","text"],["nav_contact","اسم رابط التواصل","text"],["footer_brand_text","اسم العلامة التجارية أسفل الموقع","text"],["footer_link_services","رابط الخدمات أسفل الموقع","text"],["footer_link_why","رابط لماذا نحن أسفل الموقع","text"],["footer_link_contact","رابط التواصل أسفل الموقع","text"],["whatsapp_label","نص زر واتساب","text"],["form_name_label","عنوان خانة الاسم في نموذج التواصل","text"],["form_phone_label","عنوان خانة الهاتف في نموذج التواصل","text"],["form_email_label","عنوان خانة البريد في نموذج التواصل","text"],["form_message_label","عنوان خانة الرسالة في نموذج التواصل","text"],["form_submit_label","نص زر إرسال النموذج","text"],["map_title","وصف الخريطة","text"],["map_embed_url","رابط تضمين خريطة Google Maps","textarea"]];
let currentUser = null, mediaRows = [], postRows = [], requestRows = [];
let requestRealtimeChannel = null, alertAudio = null, alertSoundEnabled = false;
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),4200)}
function playRequestAlertSound(){
  if(!alertSoundEnabled||!alertAudio)return;
  try{
    const now=alertAudio.currentTime;
    [880,660,880].forEach((frequency,index)=>{
      const oscillator=alertAudio.createOscillator(),gain=alertAudio.createGain();
      oscillator.type='sine';oscillator.frequency.value=frequency;
      gain.gain.setValueAtTime(0.0001,now+index*0.18);
      gain.gain.exponentialRampToValueAtTime(0.18,now+index*0.18+0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001,now+index*0.18+0.14);
      oscillator.connect(gain);gain.connect(alertAudio.destination);
      oscillator.start(now+index*0.18);oscillator.stop(now+index*0.18+0.15);
    });
  }catch(error){console.warn('تعذر تشغيل صوت التنبيه',error)}
}
async function enableRequestSound(){
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass){toast('المتصفح لا يدعم صوت التنبيه');return}
    if(!alertAudio)alertAudio=new AudioContextClass();
    await alertAudio.resume();alertSoundEnabled=true;
    $('soundToggle').textContent='🔔 الصوت مفعل';playRequestAlertSound();
    toast('تم تفعيل صوت تنبيه الطلبات');
  }catch(error){toast('تعذر تفعيل الصوت. تحقق من إعدادات المتصفح.')}
}
$('soundToggle').addEventListener('click',enableRequestSound);

$('pushToggle').addEventListener('click',enablePushNotifications);
$('pushTest').addEventListener('click',sendPushTest);
function base64UrlToBytes(value){
  const normalized=value.replace(/-/g,'+').replace(/_/g,'/');
  const binary=atob(normalized+'='.repeat((4-normalized.length%4)%4));
  return Uint8Array.from(binary,c=>c.charCodeAt(0));
}
async function refreshPushButton(){
  if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
    $('pushToggle').textContent='الإشعارات غير مدعومة';$('pushToggle').disabled=true;return;
  }
  try{
    const registration=await navigator.serviceWorker.ready;
    const subscription=await registration.pushManager.getSubscription();
    $('pushToggle').textContent=subscription?'🔔 إشعارات الهاتف مفعلة':'تفعيل إشعارات الهاتف';
  }catch(error){console.warn('تعذر فحص اشتراك الإشعارات',error)}
}
async function enablePushNotifications(){
  const button=$('pushToggle');button.disabled=true;
  try{
    if(!('serviceWorker' in navigator)||!('PushManager' in window)||!('Notification' in window)){
      toast('المتصفح لا يدعم إشعارات الهاتف. جرّب تثبيت لوحة الإدارة من Chrome أو Safari.');return;
    }
    const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInstalled=window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
    if(isIOS&&!isInstalled){toast('على iPhone أضف لوحة الإدارة إلى الشاشة الرئيسية أولاً ثم افتحها منها.');return;}
    let permission=Notification.permission;
    if(permission!=='granted')permission=await Notification.requestPermission();
    if(permission!=='granted'){toast('لم يتم السماح بالإشعارات. فعّلها من إعدادات المتصفح والهاتف.');return;}
    const {data:setup,error:setupError}=await db.functions.invoke('office-push',{body:{action:'setup'}});
    if(setupError)throw setupError;
    if(!setup?.publicKey)throw new Error('تعذر إعداد مفتاح الإشعارات.');
    const registration=await navigator.serviceWorker.ready;
    let subscription=await registration.pushManager.getSubscription();
    if(!subscription){
      subscription=await registration.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:base64UrlToBytes(setup.publicKey)
      });
    }
    const {error}=await db.functions.invoke('office-push',{body:{action:'subscribe',subscription:subscription.toJSON()}});
    if(error)throw error;
    button.textContent='🔔 إشعارات الهاتف مفعلة';
    toast('تم تفعيل إشعارات الطلبات على هذا الجهاز.');
  }catch(error){
    console.error('Push setup failed',error);
    toast('تعذر تفعيل الإشعارات: '+(error.message||'تحقق من اتصال الإنترنت وإعدادات الهاتف.'));
  }finally{button.disabled=false;await refreshPushButton()}
}
async function sendPushTest(){
  const button=$('pushTest');button.disabled=true;
  try{
    const {data,error}=await db.functions.invoke('office-push',{body:{action:'test'}});
    if(error)throw error;
    if(!data?.ok)throw new Error(data?.error||'لم يصل الإشعار التجريبي.');
    toast('تم إرسال الإشعار التجريبي. اقفل شاشة الهاتف وتأكد من ظهوره.');
  }catch(error){toast('تعذر إرسال الإشعار التجريبي: '+(error.message||''))}
  finally{button.disabled=false}
}

function startRequestRealtime(){
  if(requestRealtimeChannel)db.removeChannel(requestRealtimeChannel);
  requestRealtimeChannel=db.channel('admin-service-requests')
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'service_requests'},payload=>{
      const incoming=payload.new;
      if(!incoming||requestRows.some(r=>String(r.id)===String(incoming.id)))return;
      requestRows.unshift(incoming);requestRows=requestRows.slice(0,200);
      renderRequests();renderCustomers();
      $('requestsStatus').textContent='وصل طلب جديد الآن. عدد الطلبات المعروضة: '+requestRows.length;
      toast('🔔 طلب جديد من '+(incoming.customer_name||'عميل جديد'));
      playRequestAlertSound();
    })
    .subscribe(status=>{
      if(status==='SUBSCRIBED')console.info('تم تفعيل تنبيهات الطلبات المباشرة');
      if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')console.warn('تعذر الاتصال بتنبيهات الطلبات:',status);
    });
}
function safe(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function publicUrl(path){return /^(photo|screan)\//.test(path)?'/'+path:db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}
async function checkAdmin(user){const {data,error}=await db.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(error||!data)throw new Error('هذا الحساب ليس ضمن قائمة مديري الموقع. اطلب إضافة حسابك إلى جدول admin_users.');return true}
async function showApp(user){await checkAdmin(user);currentUser=user;$('userEmail').textContent=user.email;$('loginScreen').classList.add('hidden');$('app').classList.remove('hidden');await refreshAll();startRequestRealtime();refreshPushButton()}
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginError').textContent='جارٍ التحقق...';const {data,error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error){$('loginError').textContent=error.message;return}try{await showApp(data.user)}catch(err){$('loginError').textContent=err.message;await db.auth.signOut()}});
$('logoutBtn').addEventListener('click',async()=>{await db.auth.signOut();location.reload()});
const pageNames={overview:'نظرة عامة',content:'محتوى الموقع',media:'الصور والمعرض',posts:'المنشورات',requests:'طلبات العملاء',customers:'سجل العملاء',seo:'SEO والتسويق',visitors:'إحصائيات الزوار'};
function go(page){document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));$('page-'+page).classList.remove('hidden');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('pageTitle').textContent=pageNames[page];if(page==='visitors')loadVisitorStats()}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
async function refreshAll(){await Promise.all([loadContent(),loadSeo(),loadMedia(),loadPosts(),loadRequests()]);$('mediaCount').textContent=mediaRows.length;$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length}
const requestStatuses=[['new','جديد'],['contacted','تم التواصل'],['scheduled','تم تحديد موعد'],['in_progress','قيد التنفيذ'],['completed','مكتمل'],['cancelled','ملغي']];
async function loadRequests(){
  $('requestsStatus').textContent='جارٍ تحميل الطلبات...';
  const {data,error}=await db.from('service_requests').select('id,customer_name,phone,email,address,service_type,description,status,estimated_cost,final_cost,admin_notes,created_at').order('created_at',{ascending:false}).limit(200);
  if(error){$('requestsStatus').textContent='تعذر تحميل الطلبات: '+error.message;return}
  requestRows=data||[];renderRequests();renderCustomers();
  $('requestsStatus').textContent='عدد الطلبات المعروضة: '+requestRows.length;
}
function customerIdentity(r){
  const phone=String(r.phone||'').replace(/\D/g,'');
  if(phone)return 'phone:'+phone;
  const email=String(r.email||'').trim().toLowerCase();
  if(email)return 'email:'+email;
  return 'name:'+String(r.customer_name||'').trim().toLowerCase();
}
function renderCustomers(){
  const target=$('customersBody');if(!target)return;
  const term=$('customerSearch').value.trim().toLowerCase();
  const groups=new Map();
  requestRows.forEach(r=>{
    const key=customerIdentity(r);
    if(!groups.has(key))groups.set(key,{key,name:r.customer_name||'—',phone:r.phone||'',email:r.email||'',address:r.address||'',requests:[],latest:r.created_at||''});
    const c=groups.get(key);c.requests.push(r);
    if(r.created_at&&(!c.latest||new Date(r.created_at)>new Date(c.latest)))c.latest=r.created_at;
    if(!c.address&&r.address)c.address=r.address;
    if(!c.email&&r.email)c.email=r.email;
    if(!c.phone&&r.phone)c.phone=r.phone;
  });
  const customers=[...groups.values()].filter(c=>[c.name,c.phone,c.email,c.address].some(v=>String(v).toLowerCase().includes(term))).sort((a,b)=>new Date(b.latest||0)-new Date(a.latest||0));
  $('customerTotal').textContent=groups.size;
  $('customerRequestsTotal').textContent=requestRows.length;
  if(!customers.length){target.innerHTML='<tr><td colspan="6" class="request-empty">لا يوجد عملاء مطابقون للبحث.</td></tr>';return}
  target.innerHTML=customers.map(c=>'<tr><td>'+safe(c.name)+'</td><td><a href="tel:'+safe(c.phone)+'">'+safe(c.phone||'—')+'</a></td><td>'+safe(c.email||'—')+'</td><td>'+c.requests.length+'</td><td>'+safe(c.latest?new Date(c.latest).toLocaleDateString('ar-EG'):'—')+'</td><td><button class="mini" type="button" data-view-customer="'+safe(c.key)+'">ملف العميل</button></td></tr>').join('');
  target.querySelectorAll('[data-view-customer]').forEach(button=>button.addEventListener('click',()=>{
    const customer=groups.get(button.dataset.viewCustomer);if(customer)showCustomerProfile(customer);
  }));
}
$('customerSearch').addEventListener('input',renderCustomers);
function showCustomerProfile(customer){
  const requests=[...customer.requests].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0));
  const finalTotal=requests.reduce((sum,r)=>sum+(Number(r.final_cost)||0),0);
  const openCount=requests.filter(r=>!['completed','cancelled'].includes(r.status)).length;
  const statusName=value=>(requestStatuses.find(x=>x[0]===value)||['','غير محدد'])[1];
  const dateText=value=>value?new Date(value).toLocaleDateString('ar-EG'):'—';
  const field=(label,value)=>'<div class="request-detail-item"><small>'+safe(label)+'</small><p>'+safe(value||'—')+'</p></div>';
  const rows=requests.map(r=>'<tr><td>'+safe(r.id)+'</td><td>'+safe(dateText(r.created_at))+'</td><td>'+safe(r.service_type||'—')+'</td><td>'+safe(statusName(r.status))+'</td><td>'+safe(r.final_cost==null?'غير مسجل':Number(r.final_cost).toLocaleString('ar-EG')+' جنيه')+'</td><td>'+safe(r.admin_notes||'—')+'</td></tr>').join('');
  $('customerProfileContent').innerHTML=
    '<div class="request-detail-grid">'+
    field('اسم العميل',customer.name)+field('رقم الهاتف',customer.phone)+
    field('البريد الإلكتروني',customer.email)+field('العنوان',customer.address)+
    field('عدد الطلبات',String(requests.length))+field('طلبات غير مكتملة',String(openCount))+
    field('مجموع التكاليف النهائية المسجلة',finalTotal.toLocaleString('ar-EG')+' جنيه')+
    '</div><p class="muted" style="margin:8px 0 12px">هذا المجموع مبني على خانة التكلفة النهائية في الطلبات، ولا يعني بالضرورة المبلغ المحصّل فعلياً.</p>'+
    '<h3>كل طلبات العميل</h3><div class="requests-table-wrap"><table class="requests-table"><thead><tr><th>رقم الطلب</th><th>التاريخ</th><th>الخدمة</th><th>الحالة</th><th>التكلفة النهائية</th><th>ملاحظات الطلب</th></tr></thead><tbody>'+
    (rows||'<tr><td colspan="6">لا توجد طلبات.</td></tr>')+'</tbody></table></div>';
  $('customerProfileModal').classList.remove('hidden');
}
function closeCustomerProfile(){$('customerProfileModal').classList.add('hidden')}
$('closeCustomerProfile').addEventListener('click',closeCustomerProfile);
$('closeCustomerProfileBottom').addEventListener('click',closeCustomerProfile);
$('customerProfileModal').addEventListener('click',e=>{if(e.target===$('customerProfileModal'))closeCustomerProfile()});
function updateRequestStats(){
  $('requestTotal').textContent=requestRows.length;
  $('requestNew').textContent=requestRows.filter(r=>r.status==='new').length;
  $('requestInProgress').textContent=requestRows.filter(r=>r.status==='in_progress').length;
  $('requestCompleted').textContent=requestRows.filter(r=>r.status==='completed').length;
  const newCount=requestRows.filter(r=>r.status==='new').length;
  $('newRequestBadge').textContent=newCount;
  $('newRequestBadge').classList.toggle('hidden',newCount===0);
}
function renderRequests(){
  updateRequestStats();
  const body=$('requestsBody');
  const term=$('requestSearch').value.trim().toLowerCase();
  const status=$('requestStatusFilter').value;
  const filtered=requestRows.filter(r=>{
    const matchesText=!term||String(r.customer_name||'').toLowerCase().includes(term)||String(r.phone||'').toLowerCase().includes(term);
    return matchesText&&(status==='all'||r.status===status);
  });
  if(!filtered.length){body.innerHTML='<tr><td class="request-empty" colspan="11">'+(requestRows.length?'لا توجد طلبات مطابقة للبحث أو الفلتر.':'لا توجد طلبات حتى الآن.')+'</td></tr>';return}
  body.innerHTML=filtered.map(r=>{
    const date=r.created_at?new Date(r.created_at).toLocaleString('ar-EG'):'—';
    const options=requestStatuses.map(([value,label])=>'<option value="'+value+'" '+(r.status===value?'selected':'')+'>'+label+'</option>').join('');
    return '<tr><td>'+safe(date)+'</td><td>'+safe(r.customer_name)+'</td><td><a href="tel:'+safe(r.phone)+'">'+safe(r.phone)+'</a></td><td>'+safe(r.email||'—')+'</td><td>'+safe(r.service_type||'—')+'</td><td>'+safe(r.description||'—')+'</td><td><select class="request-status" data-request-status="'+safe(r.id)+'">'+options+'</select></td><td><input class="request-cost" type="number" min="0" step="0.01" placeholder="تقديرية" value="'+(r.estimated_cost??'')+'" data-req-est="'+safe(r.id)+'"></td><td><input class="request-cost" type="number" min="0" step="0.01" placeholder="نهائية" value="'+(r.final_cost??'')+'" data-req-final="'+safe(r.id)+'"></td><td><textarea class="request-notes" rows="2" placeholder="ملاحظات داخلية" data-req-notes="'+safe(r.id)+'">'+safe(r.admin_notes||'')+'</textarea></td><td><button class="mini" type="button" data-save-request="'+safe(r.id)+'">حفظ</button> <button class="mini" type="button" data-view-request="'+safe(r.id)+'">تفاصيل</button></td></tr>';
  }).join('');
  body.querySelectorAll('[data-request-status]').forEach(select=>select.addEventListener('change',()=>updateRequestStatus(select.dataset.requestStatus,select.value,select)));
  body.querySelectorAll('[data-save-request]').forEach(button=>button.addEventListener('click',()=>saveRequestDetails(button.dataset.saveRequest,button)));
  body.querySelectorAll('[data-view-request]').forEach(button=>button.addEventListener('click',()=>showRequestDetails(button.dataset.viewRequest)));
}
function showRequestDetails(id){
  const r=requestRows.find(x=>String(x.id)===String(id));if(!r)return;
  const statusLabel=(requestStatuses.find(x=>x[0]===r.status)||['','غير محدد'])[1];
  const date=r.created_at?new Date(r.created_at).toLocaleString('ar-EG'):'—';
  const item=(label,value,wide=false)=>'<div class="request-detail-item'+(wide?' request-detail-wide':'')+'"><small>'+safe(label)+'</small><p>'+safe(value||'—')+'</p></div>';
  $('requestDetailContent').innerHTML='<div class="request-detail-grid">'+
    item('رقم الطلب',r.id)+item('تاريخ الاستلام',date)+
    item('اسم العميل',r.customer_name)+item('رقم الهاتف',r.phone)+
    item('البريد الإلكتروني',r.email)+item('نوع الخدمة',r.service_type)+
    item('الحالة',statusLabel)+item('التكلفة التقديرية',r.estimated_cost==null?'غير محددة':r.estimated_cost+' جنيه')+
    item('التكلفة النهائية',r.final_cost==null?'غير محددة':r.final_cost+' جنيه')+
    item('تفاصيل الطلب',r.description,true)+item('ملاحظات داخلية',r.admin_notes,true)+
    '</div>';
  $('requestDetailModal').dataset.requestId=String(id);
  $('requestDetailModal').classList.remove('hidden');
}
function closeRequestDetails(){$('requestDetailModal').classList.add('hidden')}
$('closeRequestDetail').addEventListener('click',closeRequestDetails);
$('closeRequestDetailBottom').addEventListener('click',closeRequestDetails);
$('requestDetailModal').addEventListener('click',e=>{if(e.target===$('requestDetailModal'))closeRequestDetails()});
$('printRequest').addEventListener('click',()=>{
  const id=$('requestDetailModal').dataset.requestId;
  const r=requestRows.find(x=>String(x.id)===String(id));if(!r)return;
  const statusLabel=(requestStatuses.find(x=>x[0]===r.status)||['','غير محدد'])[1];
  const date=r.created_at?new Date(r.created_at).toLocaleString('ar-EG'):'—';
  const rows=[['رقم الطلب',r.id],['التاريخ',date],['اسم العميل',r.customer_name],['الهاتف',r.phone],['البريد الإلكتروني',r.email],['نوع الخدمة',r.service_type],['الحالة',statusLabel],['التكلفة التقديرية',r.estimated_cost==null?'غير محددة':r.estimated_cost+' جنيه'],['التكلفة النهائية',r.final_cost==null?'غير محددة':r.final_cost+' جنيه'],['تفاصيل الطلب',r.description],['ملاحظات داخلية',r.admin_notes]];
  const popup=window.open('','_blank','width=850,height=700');
  if(!popup){toast('اسمح بالنوافذ المنبثقة لإتمام الطباعة');return}
  popup.document.write('<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>أمر شغل - Office Design</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#18263a}h1{text-align:center;color:#102f55}p.sub{text-align:center;color:#667}table{width:100%;border-collapse:collapse;margin-top:25px}td{border:1px solid #dce2e9;padding:12px;vertical-align:top}td:first-child{width:28%;font-weight:bold;background:#f4f6fa}.sign{display:flex;justify-content:space-between;margin-top:55px}@media print{body{padding:10mm}}</style></head><body><h1>Office Design</h1><p class="sub">أمر شغل / تفاصيل طلب عميل</p><table>'+rows.map(([k,v])=>'<tr><td>'+safe(k)+'</td><td>'+safe(v||'—')+'</td></tr>').join('')+'</table><div class="sign"><span>توقيع العميل: ....................</span><span>توقيع المسؤول: ....................</span></div><script>window.onload=()=>window.print()</script></body></html>');
  popup.document.close();
});
async function saveRequestDetails(id,button){
  const estimated=$('requestsBody').querySelector('[data-req-est="'+id+'"]').value;
  const finalCost=$('requestsBody').querySelector('[data-req-final="'+id+'"]').value;
  const notes=$('requestsBody').querySelector('[data-req-notes="'+id+'"]').value;
  if((estimated!==''&&(!Number.isFinite(Number(estimated))||Number(estimated)<0))||(finalCost!==''&&(!Number.isFinite(Number(finalCost))||Number(finalCost)<0))){toast('أدخل تكلفة صحيحة غير سالبة');return}
  button.disabled=true;
  const payload={estimated_cost:estimated===''?null:Number(estimated),final_cost:finalCost===''?null:Number(finalCost),admin_notes:notes,updated_at:new Date().toISOString()};
  const {error}=await db.from('service_requests').update(payload).eq('id',id);
  button.disabled=false;
  if(error){toast('تعذر حفظ بيانات الطلب: '+error.message);return}
  const row=requestRows.find(x=>x.id===id);if(row)Object.assign(row,payload);
  toast('تم حفظ التكلفة والملاحظات');
}
async function updateRequestStatus(id,status,select){
  select.disabled=true;
  const {error}=await db.from('service_requests').update({status,updated_at:new Date().toISOString()}).eq('id',id);
  select.disabled=false;
  if(error){toast('تعذر تحديث الحالة: '+error.message);const row=requestRows.find(x=>x.id===id);if(row)select.value=row.status;return}
  const row=requestRows.find(x=>x.id===id);if(row)row.status=status;
  updateRequestStats();
  toast('تم تحديث حالة الطلب');
}
$('requestSearch').addEventListener('input',renderRequests);
$('requestStatusFilter').addEventListener('change',renderRequests);
$('refreshRequests').addEventListener('click',loadRequests);
async function loadContent(){const {data,error}=await db.from('site_content').select('*');if(error)throw error;const values=Object.fromEntries((data||[]).map(r=>[r.key,r.value]));$('contentFields').innerHTML=fields.map(([key,label,type])=>`<label>${label}${type==='textarea'?`<textarea rows="3" data-key="${key}">${safe(values[key]||'')}</textarea>`:`<input data-key="${key}" value="${safe(values[key]||'')}">`}</label>`).join('')}

async function loadVisitorStats(){
  $('visitorStatus').textContent='جارٍ تحميل إحصائيات الزوار...';
  const [summary,daily]=await Promise.all([db.rpc('get_visit_stats'),db.rpc('get_visit_daily_stats',{days_back:30})]);
  if(summary.error||daily.error){$('visitorStatus').textContent='تعذر تحميل الإحصائيات: '+(summary.error||daily.error).message;return}
  const stats=(summary.data||[])[0]||{};
  $('visitorTotal').textContent=Number(stats.total_visits||0).toLocaleString('ar-EG');
  $('visitorUnique').textContent=Number(stats.unique_visitors||0).toLocaleString('ar-EG');
  $('visitorToday').textContent=Number(stats.today_unique_visitors||0).toLocaleString('ar-EG');
  $('visitorWeek').textContent=Number(stats.week_unique_visitors||0).toLocaleString('ar-EG');
  $('visitorMonth').textContent=Number(stats.month_unique_visitors||0).toLocaleString('ar-EG');
  const rows=daily.data||[],max=Math.max(1,...rows.map(r=>Number(r.unique_visitors||0)));
  $('visitorsChart').innerHTML=rows.map(r=>{
    const value=Number(r.unique_visitors||0),width=Math.max(value?3:0,value/max*100);
    const date=new Date(r.visit_date+'T12:00:00');
    const label=date.toLocaleDateString('ar-EG',{day:'numeric',month:'short'});
    return '<div class="visitor-day"><div class="visitor-day-label">'+label+'</div><div class="visitor-track"><div class="visitor-fill" style="width:'+width+'%"></div></div><b>'+value.toLocaleString('ar-EG')+'</b></div>';
  }).join('')||'<p class="muted">لا توجد زيارات مسجلة بعد.</p>';
  $('visitorStatus').textContent='آخر تحديث: '+new Date().toLocaleString('ar-EG')+' · الأرقام تعرض زواراً فريدين حسب معرّف متصفح مجهول.';
}
$('refreshVisitors').addEventListener('click',loadVisitorStats);

async function loadSeo(){
  const keys=['seo_title','seo_description','seo_keywords'];
  const {data,error}=await db.from('site_content').select('key,value').in('key',keys);
  if(error)throw error;
  const values=Object.fromEntries((data||[]).map(row=>[row.key,row.value]));
  $('seoTitle').value=values.seo_title||'';
  $('seoDescription').value=values.seo_description||'';
  $('seoKeywords').value=values.seo_keywords||'';
}
$('seoForm').addEventListener('submit',async e=>{
  e.preventDefault();
  const rows=[
    {key:'seo_title',value:$('seoTitle').value.trim()},
    {key:'seo_description',value:$('seoDescription').value.trim()},
    {key:'seo_keywords',value:$('seoKeywords').value.trim()}
  ].map(row=>({...row,updated_by:currentUser.id,updated_at:new Date().toISOString()}));
  $('seoStatus').textContent='جارٍ حفظ إعدادات SEO...';
  const {error}=await db.from('site_content').upsert(rows,{onConflict:'key'});
  $('seoStatus').textContent=error?'تعذر الحفظ: '+error.message:'تم حفظ إعدادات SEO. ستظهر التغييرات على الموقع بعد تحديث الصفحة.';
  if(!error)toast('تم حفظ إعدادات SEO');
});

$('saveContent').addEventListener('click',async()=>{const rows=[...document.querySelectorAll('[data-key]')].map(el=>({key:el.dataset.key,value:el.value,updated_by:currentUser.id,updated_at:new Date().toISOString()}));const {error}=await db.from('site_content').upsert(rows,{onConflict:'key'});$('contentStatus').textContent=error?error.message:'تم حفظ التعديلات بنجاح.';if(!error)toast('تم حفظ محتوى الموقع')});
async function loadMedia(){const {data,error}=await db.from('media_items').select('*').order('section').order('sort_order');if(error)throw error;mediaRows=data||[];renderMedia()}
function renderMedia(){
  const filter=$('mediaFilter').value;
  const list=mediaRows.filter(m=>filter==='all'||m.section===filter);
  const sectionNames={hero:'الواجهة الرئيسية',banner:'من نحن',gallery:'معرض الصور',testimonials:'آراء العملاء',logo:'الشعار'};
  $('mediaGrid').innerHTML=list.map(m=>`<article class="media-card">
    <img src="${safe(publicUrl(m.file_path))}" alt="${safe(m.alt_text)}">
    <div class="meta"><small>${safe(sectionNames[m.section]||m.section)} · ${m.is_published?'ظاهرة':'مخفية'}</small>
      <label>اسم الصورة<input data-media-title="${m.id}" value="${safe(m.title||'')}" maxlength="140"></label>
      <label>الوصف البديل<input data-media-alt="${m.id}" value="${safe(m.alt_text||'')}" maxlength="250"></label>
      <label>الترتيب<input data-media-order="${m.id}" type="number" min="0" step="1" value="${m.sort_order||0}"></label>
    </div>
    <div class="media-actions"><button class="mini" data-save-media="${m.id}">حفظ التفاصيل</button><button class="mini" data-toggle-media="${m.id}">${m.is_published?'إخفاء':'إظهار'}</button><button class="mini danger" data-delete-media="${m.id}">حذف</button></div>
  </article>`).join('')||'<p class="muted">لا توجد صور في هذا القسم حتى الآن.</p>';
  document.querySelectorAll('[data-save-media]').forEach(b=>b.onclick=()=>saveMediaDetails(b.dataset.saveMedia,b));
  document.querySelectorAll('[data-toggle-media]').forEach(b=>b.onclick=()=>toggleMedia(b.dataset.toggleMedia));
  document.querySelectorAll('[data-delete-media]').forEach(b=>b.onclick=()=>deleteMedia(b.dataset.deleteMedia));
}
async function saveMediaDetails(id,button){
  const row=mediaRows.find(x=>x.id===id);if(!row)return;
  const title=document.querySelector('[data-media-title="'+id+'"]').value.trim();
  const alt_text=document.querySelector('[data-media-alt="'+id+'"]').value.trim();
  const sort_order=Math.max(0,Number(document.querySelector('[data-media-order="'+id+'"]').value)||0);
  button.disabled=true;
  const {error}=await db.from('media_items').update({title,alt_text,sort_order}).eq('id',id);
  button.disabled=false;
  if(error){toast('تعذر حفظ بيانات الصورة: '+error.message);return}
  Object.assign(row,{title,alt_text,sort_order});toast('تم حفظ بيانات الصورة');await loadMedia();
}
async function deleteMedia(id){
  if(!confirm('هل تريد حذف الصورة من الموقع ومكتبة الصور؟'))return;
  const m=mediaRows.find(x=>x.id===id);if(!m)return;
  const {error}=await db.from('media_items').delete().eq('id',id);
  if(error)return toast('تعذر حذف الصورة: '+error.message);
  if(!(m.file_path.startsWith('photo/')||m.file_path.startsWith('screan/')))await db.storage.from(BUCKET).remove([m.file_path]);
  await loadMedia();$('mediaCount').textContent=mediaRows.length;toast('تم حذف الصورة من الموقع');
}
async function loadPosts(){const {data,error}=await db.from('posts').select('*').order('created_at',{ascending:false});if(error)throw error;postRows=data||[];renderPosts()}
function renderPosts(){$('postsList').innerHTML=postRows.map(p=>`<article class="post-row"><img src="${p.image_path?safe(publicUrl(p.image_path)):''}" alt=""><div class="info"><b>${safe(p.title)}</b><small>${new Date(p.created_at).toLocaleDateString('ar-EG')} · ${safe(p.excerpt)}</small></div><span class="pill ${p.is_published?'':'draft'}">${p.is_published?'منشور':'مسودة'}</span><button class="mini" data-edit-post="${p.id}">تعديل</button><button class="mini danger" data-delete-post="${p.id}">حذف</button></article>`).join('')||'<p class="muted">لا توجد منشورات حتى الآن.</p>';document.querySelectorAll('[data-edit-post]').forEach(b=>b.onclick=()=>editPost(b.dataset.editPost));document.querySelectorAll('[data-delete-post]').forEach(b=>b.onclick=()=>deletePost(b.dataset.deletePost))}
function clearPost(){$('postForm').reset();$('postId').value='';$('postFormTitle').textContent='إنشاء منشور'}$('resetPost').onclick=clearPost;
function editPost(id){const p=postRows.find(x=>x.id===id);$('postId').value=p.id;$('postTitle').value=p.title;$('postExcerpt').value=p.excerpt;$('postBody').value=p.body;$('postPublished').checked=p.is_published;$('postFormTitle').textContent='تعديل المنشور';go('posts');window.scrollTo({top:0,behavior:'smooth'})}
$('postForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('postId').value;const payload={title:$('postTitle').value.trim(),excerpt:$('postExcerpt').value,body:$('postBody').value,is_published:$('postPublished').checked,updated_at:new Date().toISOString()};let uploadedPath=null;const file=$('postImage').files[0];if(file){const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');uploadedPath=`posts/${crypto.randomUUID()}.${ext}`;const up=await db.storage.from(BUCKET).upload(uploadedPath,file,{contentType:file.type});if(up.error){$('postStatus').textContent=up.error.message;return}payload.image_path=uploadedPath}if(payload.is_published)payload.published_at=new Date().toISOString();if(!id)payload.created_by=currentUser.id;const query=id?db.from('posts').update(payload).eq('id',id):db.from('posts').insert(payload);const {error}=await query;if(error){if(uploadedPath)await db.storage.from(BUCKET).remove([uploadedPath]);$('postStatus').textContent=error.message;return}$('postStatus').textContent='تم حفظ المنشور.';clearPost();await loadPosts();$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length;toast('تم حفظ المنشور')});
async function deletePost(id){if(!confirm('حذف هذا المنشور؟'))return;const p=postRows.find(x=>x.id===id);const {error}=await db.from('posts').delete().eq('id',id);if(error)return toast(error.message);if(p.image_path)await db.storage.from(BUCKET).remove([p.image_path]);await loadPosts();$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length;toast('تم حذف المنشور')}
(async()=>{const {data:{session}}=await db.auth.getSession();if(session){try{await showApp(session.user)}catch(e){$('loginError').textContent=e.message;await db.auth.signOut()}}})();
