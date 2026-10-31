const SUPABASE_URL = 'https://bgdexjxkdvltorcvkpvq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_Cb_uRCVqJk1x3drkGuuTwQ__a4aOha1';
const BUCKET = 'office-media';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const $ = (id) => document.getElementById(id);
const fields = [
  ['hero_title','عنوان الواجهة الرئيسية','text'],['hero_description','وصف الواجهة الرئيسية','textarea'],
  ['about_title','عنوان من نحن','text'],['about_description','وصف من نحن','textarea'],
  ['services_title','عنوان الخدمات','text'],['contact_phone','رقم الهاتف','text'],
  ['contact_email','البريد الإلكتروني','text'],['contact_address','العنوان','text'],
  ['whatsapp_number','رقم واتساب بصيغة دولية بدون +','text']
];
let currentUser = null, mediaRows = [], postRows = [], requestRows = [];
function toast(msg){$('toast').textContent=msg;$('toast').classList.add('show');setTimeout(()=>$('toast').classList.remove('show'),2600)}
function safe(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function publicUrl(path){return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}
async function checkAdmin(user){const {data,error}=await db.from('admin_users').select('user_id').eq('user_id',user.id).maybeSingle();if(error||!data)throw new Error('هذا الحساب ليس ضمن قائمة مديري الموقع. اطلب إضافة حسابك إلى جدول admin_users.');return true}
async function showApp(user){await checkAdmin(user);currentUser=user;$('userEmail').textContent=user.email;$('loginScreen').classList.add('hidden');$('app').classList.remove('hidden');await refreshAll()}
$('loginForm').addEventListener('submit',async e=>{e.preventDefault();$('loginError').textContent='جارٍ التحقق...';const {data,error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});if(error){$('loginError').textContent=error.message;return}try{await showApp(data.user)}catch(err){$('loginError').textContent=err.message;await db.auth.signOut()}});
$('logoutBtn').addEventListener('click',async()=>{await db.auth.signOut();location.reload()});
const pageNames={overview:'نظرة عامة',content:'محتوى الموقع',media:'الصور والمعرض',posts:'المنشورات',requests:'طلبات العملاء'};
function go(page){document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));$('page-'+page).classList.remove('hidden');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('pageTitle').textContent=pageNames[page]}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
async function refreshAll(){await Promise.all([loadContent(),loadMedia(),loadPosts(),loadRequests()]);$('mediaCount').textContent=mediaRows.length;$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length}
const requestStatuses=[['new','جديد'],['contacted','تم التواصل'],['scheduled','تم تحديد موعد'],['in_progress','قيد التنفيذ'],['completed','مكتمل'],['cancelled','ملغي']];
async function loadRequests(){
  $('requestsStatus').textContent='جارٍ تحميل الطلبات...';
  const {data,error}=await db.from('service_requests').select('id,customer_name,phone,email,service_type,description,status,estimated_cost,final_cost,admin_notes,created_at').order('created_at',{ascending:false}).limit(200);
  if(error){$('requestsStatus').textContent='تعذر تحميل الطلبات: '+error.message;return}
  requestRows=data||[];renderRequests();
  $('requestsStatus').textContent='عدد الطلبات المعروضة: '+requestRows.length;
}
function renderRequests(){
  const body=$('requestsBody');
  if(!requestRows.length){body.innerHTML='<tr><td class="request-empty" colspan="11">لا توجد طلبات حتى الآن.</td></tr>';return}
  body.innerHTML=requestRows.map(r=>{
    const date=r.created_at?new Date(r.created_at).toLocaleString('ar-EG'):'—';
    const options=requestStatuses.map(([value,label])=>'<option value="'+value+'" '+(r.status===value?'selected':'')+'>'+label+'</option>').join('');
    return '<tr><td>'+safe(date)+'</td><td>'+safe(r.customer_name)+'</td><td><a href="tel:'+safe(r.phone)+'">'+safe(r.phone)+'</a></td><td>'+safe(r.email||'—')+'</td><td>'+safe(r.service_type||'—')+'</td><td>'+safe(r.description||'—')+'</td><td><select class="request-status" data-request-status="'+safe(r.id)+'">'+options+'</select></td><td><input class="request-cost" type="number" min="0" step="0.01" placeholder="تقديرية" value="'+(r.estimated_cost??'')+'" data-req-est="'+safe(r.id)+'"></td><td><input class="request-cost" type="number" min="0" step="0.01" placeholder="نهائية" value="'+(r.final_cost??'')+'" data-req-final="'+safe(r.id)+'"></td><td><textarea class="request-notes" rows="2" placeholder="ملاحظات داخلية" data-req-notes="'+safe(r.id)+'">'+safe(r.admin_notes||'')+'</textarea></td><td><button class="mini" type="button" data-save-request="'+safe(r.id)+'">حفظ</button></td></tr>';
  }).join('');
  body.querySelectorAll('[data-request-status]').forEach(select=>select.addEventListener('change',()=>updateRequestStatus(select.dataset.requestStatus,select.value,select)));
  body.querySelectorAll('[data-save-request]').forEach(button=>button.addEventListener('click',()=>saveRequestDetails(button.dataset.saveRequest,button)));
}
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
  toast('تم تحديث حالة الطلب');
}
$('refreshRequests').addEventListener('click',loadRequests);
async function loadContent(){const {data,error}=await db.from('site_content').select('*');if(error)throw error;const values=Object.fromEntries((data||[]).map(r=>[r.key,r.value]));$('contentFields').innerHTML=fields.map(([key,label,type])=>`<label>${label}${type==='textarea'?`<textarea rows="3" data-key="${key}">${safe(values[key]||'')}</textarea>`:`<input data-key="${key}" value="${safe(values[key]||'')}">`}</label>`).join('')}
$('saveContent').addEventListener('click',async()=>{const rows=[...document.querySelectorAll('[data-key]')].map(el=>({key:el.dataset.key,value:el.value,updated_by:currentUser.id,updated_at:new Date().toISOString()}));const {error}=await db.from('site_content').upsert(rows,{onConflict:'key'});$('contentStatus').textContent=error?error.message:'تم حفظ التعديلات بنجاح.';if(!error)toast('تم حفظ محتوى الموقع')});
async function loadMedia(){const {data,error}=await db.from('media_items').select('*').order('section').order('sort_order');if(error)throw error;mediaRows=data||[];renderMedia()}
function renderMedia(){const filter=$('mediaFilter').value;const list=mediaRows.filter(m=>filter==='all'||m.section===filter);$('mediaGrid').innerHTML=list.map(m=>`<article class="media-card"><img src="${safe(publicUrl(m.file_path))}" alt="${safe(m.alt_text)}"><div class="meta"><b>${safe(m.title||'صورة بدون عنوان')}</b><small>${safe(m.section)} · ${m.is_published?'ظاهرة':'مخفية'} · ترتيب ${m.sort_order}</small></div><div class="media-actions"><button class="mini" data-toggle-media="${m.id}">${m.is_published?'إخفاء':'إظهار'}</button><button class="mini danger" data-delete-media="${m.id}">حذف</button></div></article>`).join('')||'<p class="muted">لا توجد صور في هذا القسم حتى الآن.</p>';document.querySelectorAll('[data-toggle-media]').forEach(b=>b.onclick=()=>toggleMedia(b.dataset.toggleMedia));document.querySelectorAll('[data-delete-media]').forEach(b=>b.onclick=()=>deleteMedia(b.dataset.deleteMedia))}
$('mediaFilter').addEventListener('change',renderMedia);
$('mediaForm').addEventListener('submit',async e=>{e.preventDefault();const file=$('mediaFile').files[0];if(!file)return;if(file.size>10*1024*1024){$('mediaStatus').textContent='حجم الصورة أكبر من 10 ميجابايت.';return}const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');const path=`${$('mediaSection').value}/${crypto.randomUUID()}.${ext}`;$('mediaStatus').textContent='جارٍ رفع الصورة...';const up=await db.storage.from(BUCKET).upload(path,file,{contentType:file.type,upsert:false});if(up.error){$('mediaStatus').textContent=up.error.message;return}const {error}=await db.from('media_items').insert({section:$('mediaSection').value,file_path:path,title:$('mediaTitle').value,alt_text:$('mediaAlt').value,created_by:currentUser.id});if(error){await db.storage.from(BUCKET).remove([path]);$('mediaStatus').textContent=error.message;return}$('mediaForm').reset();$('mediaStatus').textContent='تم رفع الصورة وإضافتها للمكتبة.';await loadMedia();$('mediaCount').textContent=mediaRows.length;toast('تم رفع الصورة بنجاح')});
async function toggleMedia(id){const m=mediaRows.find(x=>x.id===id);const {error}=await db.from('media_items').update({is_published:!m.is_published}).eq('id',id);if(error)return toast(error.message);await loadMedia()}
async function deleteMedia(id){if(!confirm('هل تريد حذف الصورة نهائياً؟'))return;const m=mediaRows.find(x=>x.id===id);const {error}=await db.from('media_items').delete().eq('id',id);if(error)return toast(error.message);await db.storage.from(BUCKET).remove([m.file_path]);await loadMedia();$('mediaCount').textContent=mediaRows.length;toast('تم حذف الصورة')}
async function loadPosts(){const {data,error}=await db.from('posts').select('*').order('created_at',{ascending:false});if(error)throw error;postRows=data||[];renderPosts()}
function renderPosts(){$('postsList').innerHTML=postRows.map(p=>`<article class="post-row"><img src="${p.image_path?safe(publicUrl(p.image_path)):''}" alt=""><div class="info"><b>${safe(p.title)}</b><small>${new Date(p.created_at).toLocaleDateString('ar-EG')} · ${safe(p.excerpt)}</small></div><span class="pill ${p.is_published?'':'draft'}">${p.is_published?'منشور':'مسودة'}</span><button class="mini" data-edit-post="${p.id}">تعديل</button><button class="mini danger" data-delete-post="${p.id}">حذف</button></article>`).join('')||'<p class="muted">لا توجد منشورات حتى الآن.</p>';document.querySelectorAll('[data-edit-post]').forEach(b=>b.onclick=()=>editPost(b.dataset.editPost));document.querySelectorAll('[data-delete-post]').forEach(b=>b.onclick=()=>deletePost(b.dataset.deletePost))}
function clearPost(){$('postForm').reset();$('postId').value='';$('postFormTitle').textContent='إنشاء منشور'}$('resetPost').onclick=clearPost;
function editPost(id){const p=postRows.find(x=>x.id===id);$('postId').value=p.id;$('postTitle').value=p.title;$('postExcerpt').value=p.excerpt;$('postBody').value=p.body;$('postPublished').checked=p.is_published;$('postFormTitle').textContent='تعديل المنشور';go('posts');window.scrollTo({top:0,behavior:'smooth'})}
$('postForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('postId').value;const payload={title:$('postTitle').value.trim(),excerpt:$('postExcerpt').value,body:$('postBody').value,is_published:$('postPublished').checked,updated_at:new Date().toISOString()};let uploadedPath=null;const file=$('postImage').files[0];if(file){const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'');uploadedPath=`posts/${crypto.randomUUID()}.${ext}`;const up=await db.storage.from(BUCKET).upload(uploadedPath,file,{contentType:file.type});if(up.error){$('postStatus').textContent=up.error.message;return}payload.image_path=uploadedPath}if(payload.is_published)payload.published_at=new Date().toISOString();if(!id)payload.created_by=currentUser.id;const query=id?db.from('posts').update(payload).eq('id',id):db.from('posts').insert(payload);const {error}=await query;if(error){if(uploadedPath)await db.storage.from(BUCKET).remove([uploadedPath]);$('postStatus').textContent=error.message;return}$('postStatus').textContent='تم حفظ المنشور.';clearPost();await loadPosts();$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length;toast('تم حفظ المنشور')});
async function deletePost(id){if(!confirm('حذف هذا المنشور؟'))return;const p=postRows.find(x=>x.id===id);const {error}=await db.from('posts').delete().eq('id',id);if(error)return toast(error.message);if(p.image_path)await db.storage.from(BUCKET).remove([p.image_path]);await loadPosts();$('postCount').textContent=postRows.length;$('publishedCount').textContent=postRows.filter(p=>p.is_published).length;toast('تم حذف المنشور')}
(async()=>{const {data:{session}}=await db.auth.getSession();if(session){try{await showApp(session.user)}catch(e){$('loginError').textContent=e.message;await db.auth.signOut()}}})();
