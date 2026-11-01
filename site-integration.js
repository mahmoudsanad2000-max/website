// Add this file to the same folder as index.html and include it after the Supabase CDN script.
// The page keeps its original HTML as a fallback if Supabase is unavailable.
(() => {
  const URL = 'https://bgdexjxkdvltorcvkpvq.supabase.co';
  const KEY = 'sb_publishable_Cb_uRCVqJk1x3drkGuuTwQ__a4aOha1';
  const BUCKET = 'office-media';
  const client = window.supabase.createClient(URL, KEY);
  const getUrl = path => (path.startsWith('photo/') || path.startsWith('screan/')) ? '/'+path : client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
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
    text('.hero-actions .btn-primary',c.hero_cta_primary);text('.hero-actions .btn-secondary',c.hero_cta_secondary);
    const stats=document.querySelectorAll('.stats-grid .stat-card');
    stats.forEach((card,i)=>{const n=c['stats_number_'+(i+1)],label=c['stats_label_'+(i+1)],counter=card.querySelector('.counter');if(counter&&n){counter.dataset.target=n;counter.textContent=n;}if(label)text('.stats-grid .stat-card:nth-child('+(i+1)+') p',label);});
    const aboutCards=document.querySelectorAll('.about-cards .about-card');
    aboutCards.forEach((card,i)=>{const title=c['about_card_title_'+(i+1)],description=c['about_card_description_'+(i+1)];if(title)card.querySelector('h3')&&(card.querySelector('h3').textContent=title);if(description)card.querySelector('p')&&(card.querySelector('p').textContent=description);});
    const serviceCards=document.querySelectorAll('#services .cards-grid .card');
    serviceCards.forEach((card,i)=>{const value=c['service_'+(i+1)];if(value)text('#services .cards-grid .card:nth-child('+(i+1)+') h3',value);});
    text('#why h2',c.why_title);
    const features=document.querySelectorAll('#why .feature-grid .feature');
    features.forEach((card,i)=>{const value=c['why_feature_'+(i+1)];if(value)card.querySelector('h3')&&(card.querySelector('h3').textContent=value);});
    text('#gallery h2',c.gallery_title);text('#how h2',c.how_title);
    const steps=document.querySelectorAll('#how .steps-grid .step');
    steps.forEach((card,i)=>{const value=c['how_step_'+(i+1)];if(value)text('#how .steps-grid .step:nth-child('+(i+1)+') h3',value);});
    text('#testimonials h2',c.testimonials_title);text('#contact .contact-info h2',c.contact_title);
    text('.footer-grid > div:first-child > p',c.footer_description);
    text('.footer-grid > div:nth-child(2) h4',c.footer_quick_title);
    text('.footer-grid > div:nth-child(3) h4',c.footer_social_title);
    text('.footer-grid > div:nth-child(3) p',c.footer_social_text);
    text('.footer-bottom p',c.footer_copyright);text('.footer-grid > div:first-child .logo-text',c.footer_brand_text);
    const footerLinks=document.querySelectorAll('.footer-grid > div:nth-child(2) a');[c.footer_link_services,c.footer_link_why,c.footer_link_contact].forEach((v,i)=>{if(v&&footerLinks[i])footerLinks[i].textContent=v;});
    text('.contact-info .btn-whatsapp',c.whatsapp_label);
    const formLabels=document.querySelectorAll('.contact-form label');[c.form_name_label,c.form_phone_label,c.form_email_label,c.form_address_label,c.form_message_label].forEach((v,i)=>{if(v&&formLabels[i])formLabels[i].firstChild.textContent=v;});text('.contact-form button[type=submit]',c.form_submit_label);
    const map=document.querySelector('.map-wrap iframe');if(map){if(c.map_embed_url)map.src=c.map_embed_url;if(c.map_title)map.title=c.map_title;}
    const navKeys=['nav_home','nav_about','nav_services','nav_why','nav_gallery','nav_how','nav_testimonials','nav_contact'];
    document.querySelectorAll('.nav-links a').forEach((a,i)=>{if(c[navKeys[i]])a.textContent=c[navKeys[i]];});

    const email=document.querySelector('.contact-info a[href^="mailto:"]'); if(email&&c.contact_email){email.href=`mailto:${c.contact_email}`;email.textContent=`📧 البريد الإلكتروني: ${c.contact_email}`;}
    const address=[...document.querySelectorAll('.contact-info p')].find(x=>x.textContent.includes('العنوان')); if(address&&c.contact_address) address.innerHTML=`<strong>العنوان:</strong> ${escapeHtml(c.contact_address)}`;
    const phoneLinks=[...document.querySelectorAll('a[href^="tel:"],a[href*="wa.me/"]')];
    if(c.contact_phone) phoneLinks.filter(a=>a.href.startsWith('tel:')).forEach(a=>{a.href=`tel:${c.contact_phone.replace(/\s/g,'')}`;if(a.classList.contains('btn-secondary'))a.textContent=`📞 الهاتف: ${c.contact_phone}`;});
    if(c.whatsapp_number) phoneLinks.filter(a=>a.href.includes('wa.me/')).forEach(a=>a.href=`https://wa.me/${c.whatsapp_number.replace(/\D/g,'')}`);
    const hero=media?.find(x=>x.section==='hero');if(document.querySelector('.hero'))document.querySelector('.hero').style.backgroundImage=hero?`url("${getUrl(hero.file_path)}")`:'none';
    const logo=media?.find(x=>x.section==='logo');document.querySelectorAll('.logo-image').forEach(img=>{if(logo){img.src=getUrl(logo.file_path);img.alt=logo.alt_text||logo.title||'Office Design';img.style.display='';}else img.style.display='none';});
    const banner=media?.find(x=>x.section==='banner');const bannerSection=document.querySelector('.about-banner');if(bannerSection)bannerSection.style.display=banner?'':'none';if(banner){const img=document.querySelector('.about-banner-image');if(img){img.src=getUrl(banner.file_path);img.alt=banner.alt_text||banner.title||'Office Design';}}
    const gallery=document.querySelector('.gallery-track'); if(gallery){const items=media.filter(x=>x.section==='gallery');gallery.innerHTML=items.map(x=>`<div class="gallery-item"><img loading="lazy" class="lightbox-trigger reveal visible" src="${getUrl(x.file_path)}" alt="${escapeHtml(x.alt_text||x.title)}"></div>`).join('');}
    const reviews=document.querySelector('#testimonialTrack'); if(reviews){const items=media.filter(x=>x.section==='testimonials');reviews.innerHTML=items.map(x=>`<article class="review-shot"><img loading="lazy" class="lightbox-trigger" src="${getUrl(x.file_path)}" alt="${escapeHtml(x.alt_text||x.title)}"></article>`).join('');}
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
