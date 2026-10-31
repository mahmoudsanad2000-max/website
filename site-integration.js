// Add this file to the same folder as index.html and include it after the Supabase CDN script.
// The page keeps its original HTML as a fallback if Supabase is unavailable.
(() => {
  const URL = 'https://bgdexjxkdvltorcvkpvq.supabase.co';
  const KEY = 'sb_publishable_Cb_uRCVqJk1x3drkGuuTwQ__a4aOha1';
  const BUCKET = 'office-media';
  const client = window.supabase.createClient(URL, KEY);
  const getUrl = path => client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  function trackWebsiteVisit(){
    try{
      let visitorId=localStorage.getItem('office_design_visitor_id');
      if(!visitorId){
        visitorId=crypto.randomUUID();
        localStorage.setItem('office_design_visitor_id',visitorId);
      }
      let referrer=null;
      try{if(document.referrer)referrer=new URL(document.referrer).origin;}catch(_){}
      client.from('site_visits').insert({
        visitor_id:visitorId,
        page_path:window.location.pathname||'/',
        referrer
      }).then(({error})=>{if(error)console.warn('Office Design analytics:',error.message)});
    }catch(error){console.warn('Office Design analytics unavailable:',error)}
  }
  trackWebsiteVisit();
  const text = (selector, value) => { const el=document.querySelector(selector); if(el && value) el.textContent=value; };
  function setMeta(selector, attribute, value, content){
    if(!content)return;
    let element=document.querySelector(selector);
    if(!element){element=document.createElement('meta');element.setAttribute(attribute,value);document.head.appendChild(element);}
    element.setAttribute('content',content);
  }
  function applySeoSettings(settings){
    if(settings.seo_title){document.title=settings.seo_title;setMeta('meta[property="og:title"]','property','og:title',settings.seo_title);setMeta('meta[name="twitter:title"]','name','twitter:title',settings.seo_title);}
    if(settings.seo_description){setMeta('meta[name="description"]','name','description',settings.seo_description);setMeta('meta[property="og:description"]','property','og:description',settings.seo_description);setMeta('meta[name="twitter:description"]','name','twitter:description',settings.seo_description);}
    if(settings.seo_keywords)setMeta('meta[name="keywords"]','name','keywords',settings.seo_keywords);
    setMeta('meta[property="og:type"]','property','og:type','website');
    setMeta('meta[property="og:url"]','property','og:url',window.location.href.split('#')[0]);
    setMeta('meta[name="twitter:card"]','name','twitter:card','summary_large_image');
  }
  async function init(){
    const [{data:content,error:cErr},{data:media,error:mErr},{data:posts,error:pErr}] = await Promise.all([
      client.from('site_content').select('key,value'),
      client.from('media_items').select('*').eq('is_published',true).order('sort_order'),
      client.from('posts').select('*').eq('is_published',true).order('published_at',{ascending:false})
    ]);
    if(cErr||mErr||pErr) { console.warn('Office Design CMS: using original page content.',cErr||mErr||pErr); return; }
    const c=Object.fromEntries((content||[]).map(x=>[x.key,x.value]));
    applySeoSettings(c);
    text('.hero h1',c.hero_title); text('.hero-content > p',c.hero_description);
    text('#about h2',c.about_title); text('#about > .container > p',c.about_description);
    text('#services h2',c.services_title);
    const email=document.querySelector('.contact-info a[href^="mailto:"]'); if(email&&c.contact_email){email.href=`mailto:${c.contact_email}`;email.textContent=`📧 البريد الإلكتروني: ${c.contact_email}`;}
    const address=[...document.querySelectorAll('.contact-info p')].find(x=>x.textContent.includes('العنوان')); if(address&&c.contact_address) address.innerHTML=`<strong>العنوان:</strong> ${escapeHtml(c.contact_address)}`;
    const phoneLinks=[...document.querySelectorAll('a[href^="tel:"],a[href*="wa.me/"]')];
    if(c.contact_phone) phoneLinks.filter(a=>a.href.startsWith('tel:')).forEach(a=>a.href=`tel:${c.contact_phone.replace(/\s/g,'')}`);
    if(c.whatsapp_number) phoneLinks.filter(a=>a.href.includes('wa.me/')).forEach(a=>a.href=`https://wa.me/${c.whatsapp_number.replace(/\D/g,'')}`);
    const hero=media?.find(x=>x.section==='hero'); if(hero) document.querySelector('.hero')?.style.setProperty('background-image',`url("${getUrl(hero.file_path)}")`);
    const banner=media?.find(x=>x.section==='banner'); if(banner){const img=document.querySelector('.about-banner-image');if(img){img.src=getUrl(banner.file_path);img.alt=banner.alt_text||banner.title||'Office Design';}}
    const gallery=document.querySelector('.gallery-track'); if(gallery){const items=media.filter(x=>x.section==='gallery');if(items.length)gallery.innerHTML=items.map(x=>`<div class="gallery-item"><img loading="lazy" class="lightbox-trigger reveal visible" src="${getUrl(x.file_path)}" alt="${escapeHtml(x.alt_text||x.title)}"></div>`).join('');}
    const reviews=document.querySelector('#testimonialTrack'); if(reviews){const items=media.filter(x=>x.section==='testimonials');if(items.length)reviews.innerHTML=items.map(x=>`<article class="review-shot"><img loading="lazy" class="lightbox-trigger" src="${getUrl(x.file_path)}" alt="${escapeHtml(x.alt_text||x.title)}"></article>`).join('');}
    if(posts?.length) renderPosts(posts);
  }
  function escapeHtml(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function renderPosts(posts){
    const contact=document.querySelector('#contact');if(!contact)return;
    let section=document.querySelector('#cms-posts');if(!section){section=document.createElement('section');section.id='cms-posts';section.className='section';section.innerHTML='<div class="container"><h2>آخر الأخبار والمنشورات</h2><div class="cards-grid" id="cms-post-list"></div></div>';contact.parentNode.insertBefore(section,contact);}
    const list=section.querySelector('#cms-post-list');list.innerHTML=posts.map(p=>`<article class="card">${p.image_path?`<img src="${getUrl(p.image_path)}" alt="${escapeHtml(p.title)}" style="width:100%;height:190px;object-fit:cover;margin-bottom:12px">`:''}<h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.excerpt)}</p>${p.body?`<details><summary>اقرأ المزيد</summary><p>${escapeHtml(p.body).replace(/\n/g,'<br>')}</p></details>`:''}</article>`).join('');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
