/* ═══════════════════════════════════════════════════════
   Portfolio demo harness for the Packages prototype.
   ─ Seeds sample packages and visa entries on first visit
     (each visitor gets a private copy in their own browser)
   ─ Shows the prototype label on every page, with a reset
   ─ Lists the demo CMS logins on the admin sign-in screen
   Loaded in <head> so the seed lands before main.js reads it.
   ═══════════════════════════════════════════════════════ */
(function () {
  var LABEL = 'Working prototype. Sample data. Not a live product.';
  var ABOUT = '/labs/packages';

  var PACKAGES = [
      {
          id: 'dubai', name: 'Dubai Desert Escape', destination: 'Dubai, UAE',
          price: '₦1,150,000', days: 5, nights: 4, tier: 'mid',
          highlights: '4-Star Hotel,Desert Safari,City Tour',
          badge: { text: 'Popular', cls: '' },
          hero: '/labs/packages/demo/img/dubai.svg',
          card_img: '/labs/packages/demo/img/dubai.svg',
          dest_img: '/labs/packages/demo/img/dubai.svg',
          overview: 'This 5-day Dubai package combines luxury accommodation, a desert safari and guided city tour.',
          includes: [
              { icon: 'fa-solid fa-plane', text: 'Return Flights (Lagos – Dubai)' },
              { icon: 'fa-solid fa-hotel', text: '4-Star Hotel (4 nights)' },
              { icon: 'fa-solid fa-mug-saucer', text: 'Daily Breakfast' },
              { icon: 'fa-solid fa-van-shuttle', text: 'Airport Transfers' },
              { icon: 'fa-solid fa-sun', text: 'Desert Safari' },
              { icon: 'fa-solid fa-map', text: 'Dubai City Tour' },
          ],
          excludes: ['Visa fees', 'Meals beyond breakfast', 'Personal expenses'],
          facts: [
              { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Required' },
              { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Oct – Apr' },
              { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'UAE Dirham' },
              { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '20–25°C winter' },
          ],
          itinerary: [
              { day: 1, title: 'Arrival', desc: 'Airport pickup and hotel check-in.' },
              { day: 2, title: 'Dubai City Tour', desc: 'Burj Khalifa, Dubai Mall, Gold Souk.' },
              { day: 3, title: 'Desert Safari', desc: 'Dune bashing, camel riding, BBQ dinner.' },
              { day: 4, title: 'Free Day', desc: 'Leisure or optional activities.' },
              { day: 5, title: 'Departure', desc: 'Breakfast and airport transfer.' },
          ],
          todo: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah', 'Jumeirah Beach', 'Gold & Spice Souks'],
          tab: ['all', 'adventure'], category_label: 'Adventure & City',
          visa: [{ cls: 'visa-tag-required', text: 'Visa Required' }],
          status: 'published',
      },
      {
          id: 'zanzibar', name: 'Zanzibar Beach Retreat', destination: 'Zanzibar, Tanzania',
          price: '₦990,000', days: 6, nights: 5, tier: 'budget',
          highlights: 'Beachfront Hotel,Snorkelling,Spice Tour',
          badge: { text: 'Best Value', cls: 'green' },
          hero: '/labs/packages/demo/img/zanzibar.svg',
          card_img: '/labs/packages/demo/img/zanzibar.svg',
          dest_img: '/labs/packages/demo/img/zanzibar.svg',
          overview: 'Pristine beaches, turquoise waters and UNESCO Stone Town.',
          includes: [
              { icon: 'fa-solid fa-plane', text: 'Return Flights' },
              { icon: 'fa-solid fa-hotel', text: 'Beachfront Hotel' },
              { icon: 'fa-solid fa-fish', text: 'Snorkelling Trip' },
              { icon: 'fa-solid fa-leaf', text: 'Spice Tour' },
              { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
              { icon: 'fa-solid fa-mug-saucer', text: 'Daily Breakfast' },
          ],
          excludes: ['Visa fees', 'Insurance (compulsory)', 'Personal expenses'],
          facts: [
              { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Required' },
              { type: 'insurance', icon: 'fa-solid fa-shield-halved', label: 'Insurance', value: 'Compulsory' },
              { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Jun – Oct' },
              { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'Tanzanian Shilling' },
          ],
          itinerary: [
              { day: 1, title: 'Arrival', desc: 'Hotel check-in.' },
              { day: 2, title: 'Stone Town', desc: 'UNESCO heritage tour.' },
              { day: 3, title: 'Spice Tour', desc: 'Full spice farm visit.' },
              { day: 4, title: 'Snorkelling', desc: 'Mnemba Atoll trip.' },
              { day: 5, title: 'Beach Day', desc: 'Free day.' },
              { day: 6, title: 'Departure', desc: 'Return flight.' },
          ],
          todo: ['Stone Town', 'Prison Island', 'Nungwi Beach', 'Kizimkazi dolphins', 'Jozani Forest'],
          tab: ['all', 'budget'], category_label: 'Beach & Culture',
          visa: [{ cls: 'visa-tag-required', text: 'Visa Required' }, { cls: 'visa-tag-insurance', text: 'Insurance Compulsory' }],
          status: 'published',
      },
      {
          id: 'maldives', name: 'Maldives Overwater Paradise', destination: 'Maldives',
          price: '₦3,200,000', days: 7, nights: 6, tier: 'premium',
          highlights: 'Overwater Villa,All Inclusive,Diving',
          badge: { text: 'Luxury', cls: 'purple' },
          hero: '/labs/packages/demo/img/maldives.svg',
          card_img: '/labs/packages/demo/img/maldives.svg',
          dest_img: '/labs/packages/demo/img/maldives.svg',
          overview: 'Wake above the Indian Ocean in a private overwater villa.',
          includes: [
              { icon: 'fa-solid fa-plane', text: 'Return Flights' },
              { icon: 'fa-solid fa-umbrella-beach', text: 'Overwater Villa' },
              { icon: 'fa-solid fa-utensils', text: 'All Inclusive' },
              { icon: 'fa-solid fa-water', text: 'Snorkelling & Diving' },
              { icon: 'fa-solid fa-ship', text: 'Speedboat Transfers' },
              { icon: 'fa-solid fa-sailboat', text: 'Sunset Cruise' },
          ],
          excludes: ['Visa on arrival fee', 'Extra water sports', 'Spa treatments'],
          facts: [
              { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'On arrival' },
              { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Nov – Apr' },
              { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'USD accepted' },
              { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '28–30°C' },
          ],
          itinerary: [
              { day: 1, title: 'Arrival', desc: 'Speedboat to resort.' },
              { day: 2, title: 'Reef Snorkelling', desc: 'Guided reef trip.' },
              { day: 3, title: 'Diving', desc: 'Intro dive session.' },
              { day: 4, title: 'Dolphin Cruise', desc: 'Sunset cruise.' },
              { day: 5, title: 'Island Hopping', desc: 'Village visit.' },
              { day: 6, title: 'Leisure', desc: 'Relax or spa.' },
              { day: 7, title: 'Departure', desc: 'Return flight.' },
          ],
          todo: ['Snorkel with mantas', 'Underwater dining', 'Sandbank picnic', 'Night fishing'],
          tab: ['all', 'luxury', 'romantic'], category_label: 'Luxury & Romance',
          visa: [{ cls: 'visa-tag-arrival', text: 'Visa on Arrival' }],
          status: 'published',
      },
      {
          id: 'capetown', name: 'Cape Town Explorer', destination: 'Cape Town, South Africa',
          price: '₦980,000', days: 5, nights: 4, tier: 'budget',
          highlights: 'Table Mountain,Wine Tour,Cape Point',
          badge: { text: '', cls: '' },
          hero: '/labs/packages/demo/img/capetown.svg',
          card_img: '/labs/packages/demo/img/capetown.svg',
          dest_img: '/labs/packages/demo/img/capetown.svg',
          overview: 'Iconic Table Mountain, world-class wine farms and stunning coastline.',
          includes: [
              { icon: 'fa-solid fa-plane', text: 'Return Flights' },
              { icon: 'fa-solid fa-hotel', text: '3-Star+ Hotel' },
              { icon: 'fa-solid fa-mountain', text: 'Table Mountain' },
              { icon: 'fa-solid fa-wine-glass', text: 'Winelands Tour' },
              { icon: 'fa-solid fa-binoculars', text: 'Boulders Beach' },
              { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
          ],
          excludes: ['Meals beyond breakfast', 'Cape Point entry', 'Optional boat trips'],
          facts: [
              { type: 'visa', icon: 'fa-solid fa-circle-check', label: 'Visa', value: 'Visa free' },
              { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Oct – Apr' },
              { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'South African Rand' },
              { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '20–28°C summer' },
          ],
          itinerary: [
              { day: 1, title: 'Arrival', desc: 'V&A Waterfront evening.' },
              { day: 2, title: 'Table Mountain', desc: 'Cable car and city tour.' },
              { day: 3, title: 'Cape Peninsula', desc: 'Cape Point and penguins.' },
              { day: 4, title: 'Winelands', desc: 'Stellenbosch wine tour.' },
              { day: 5, title: 'Departure', desc: 'Airport transfer.' },
          ],
          todo: ['Table Mountain', 'V&A Waterfront', 'Robben Island', 'Boulders Beach', 'Stellenbosch'],
          tab: ['all', 'budget', 'family', 'adventure'], category_label: 'Adventure & Culture',
          visa: [{ cls: 'visa-tag-free', text: 'Visa Free' }],
          status: 'published',
      },
      {
          id: 'paris', name: 'Paris Romantic Getaway', destination: 'Paris, France',
          price: '₦2,100,000', days: 5, nights: 4, tier: 'premium',
          highlights: 'Boutique Hotel,Seine Cruise,Eiffel Visit',
          badge: { text: 'Romantic', cls: 'purple' },
          hero: '/labs/packages/demo/img/paris.svg',
          card_img: '/labs/packages/demo/img/paris.svg',
          dest_img: '/labs/packages/demo/img/paris.svg',
          overview: 'The city of light, love and croissants.',
          includes: [
              { icon: 'fa-solid fa-plane', text: 'Return Flights' },
              { icon: 'fa-solid fa-hotel', text: 'Boutique Hotel Central Paris' },
              { icon: 'fa-solid fa-tower-observation', text: 'Eiffel Tower Entry' },
              { icon: 'fa-solid fa-sailboat', text: 'Seine River Cruise' },
              { icon: 'fa-solid fa-landmark', text: 'Louvre Museum' },
              { icon: 'fa-solid fa-van-shuttle', text: 'Transfers' },
          ],
          excludes: ['Schengen visa fees', 'Meals', 'Metro pass'],
          facts: [
              { type: 'visa', icon: 'fa-solid fa-stamp', label: 'Visa', value: 'Schengen required' },
              { type: 'season', icon: 'fa-solid fa-sun', label: 'Best Season', value: 'Apr – Jun, Sep – Oct' },
              { type: 'currency', icon: 'fa-solid fa-money-bill', label: 'Currency', value: 'Euro (EUR)' },
              { type: 'weather', icon: 'fa-solid fa-cloud-sun', label: 'Weather', value: '15–25°C spring' },
          ],
          itinerary: [
              { day: 1, title: 'Arrival', desc: 'Champs-Elysees evening.' },
              { day: 2, title: 'Landmarks', desc: 'Eiffel Tower, Seine cruise.' },
              { day: 3, title: 'Art & Culture', desc: 'Louvre and Montmartre.' },
              { day: 4, title: 'Versailles', desc: 'Optional palace day trip.' },
              { day: 5, title: 'Departure', desc: 'Final transfer.' },
          ],
          todo: ['Eiffel Tower', 'The Louvre', 'Notre-Dame', 'Montmartre', 'Versailles'],
          tab: ['all', 'luxury', 'romantic'], category_label: 'Romance & Culture',
          visa: [{ cls: 'visa-tag-required', text: 'Visa Required (Schengen)' }],
          status: 'published',
      },
  ];

  var VISA = [
      { id: 'dubai-visa', destination: 'Dubai', country: 'UAE', hero: '/labs/packages/demo/img/dubai.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required' }], visa_type: 'Tourist Visa', visa_cost: '$90 USD (approx. ₦140,000)', processing_time: '3–5 business days', where_to_apply: 'Online via UAE ICA portal or through our visa team', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed visa application form', 'Passport photograph (white background)', 'Confirmed hotel booking', 'Return flight itinerary', 'Bank statement (last 3 months)', 'Proof of accommodation'], best_season: 'October – April', currency: 'UAE Dirham (AED) · 1 AED ≈ ₦430', notes: 'UAE tourist visas for Nigerians are processed online. Approval is usually fast but not guaranteed. Ensure your passport has at least 2 blank pages.', status: 'published' },
      { id: 'zanzibar-visa', destination: 'Zanzibar', country: 'Tanzania', hero: '/labs/packages/demo/img/zanzibar.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required' }, { cls: 'visa-tag-insurance', text: '🔒 Insurance Compulsory' }], visa_type: 'Tourist Visa', visa_cost: '$50 USD (approx. ₦78,000)', processing_time: 'On arrival (7–14 days advance recommended)', where_to_apply: 'Tanzania High Commission, Abuja or on arrival at Zanzibar Airport', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed arrival card', 'Return flight ticket', 'Proof of accommodation', 'Compulsory travel insurance certificate', 'Yellow fever vaccination certificate'], best_season: 'June – October (dry season)', currency: 'Tanzanian Shilling (TZS) · USD widely accepted', notes: 'Travel insurance is compulsory for entry into Tanzania. You must carry proof of insurance at the port of entry. Yellow fever vaccination is also required for Nigerian travellers.', status: 'published' },
      { id: 'maldives-visa', destination: 'Maldives', country: 'Maldives', hero: '/labs/packages/demo/img/maldives.svg', visa_tags: [{ cls: 'visa-tag-arrival', text: '🟠 Visa on Arrival' }], visa_type: 'Visa on Arrival (30 days)', visa_cost: 'Free', processing_time: 'On arrival at Velana International Airport', where_to_apply: 'No pre-application required — issued at the airport on arrival', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Confirmed hotel or resort booking', 'Return flight ticket', 'Proof of sufficient funds'], best_season: 'November – April', currency: 'Maldivian Rufiyaa (MVR) · USD widely accepted at resorts', notes: 'Nigerians receive a free 30-day tourist visa on arrival in the Maldives. No pre-application needed. Ensure you have a confirmed resort booking as it may be checked at immigration.', status: 'published' },
      { id: 'capetown-visa', destination: 'Cape Town', country: 'South Africa', hero: '/labs/packages/demo/img/capetown.svg', visa_tags: [{ cls: 'visa-tag-free', text: '✅ Visa Free' }], visa_type: 'Visa Free (30 days)', visa_cost: 'Free', processing_time: 'No visa required', where_to_apply: 'No application required', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Return flight ticket', 'Proof of accommodation', 'Sufficient funds for the trip', 'Yellow fever vaccination certificate (if transiting through yellow fever zone)'], best_season: 'October – April (Southern Hemisphere summer)', currency: 'South African Rand (ZAR) · 1 ZAR ≈ ₦85', notes: 'Nigerian passport holders can visit South Africa visa-free for up to 30 days. Ensure your passport has at least 2 blank pages as immigration officers stamp on entry and exit.', status: 'published' },
      { id: 'paris-visa', destination: 'Paris', country: 'France', hero: '/labs/packages/demo/img/paris.svg', visa_tags: [{ cls: 'visa-tag-required', text: '🛂 Visa Required (Schengen)' }], visa_type: 'Schengen Short-Stay Visa (Type C)', visa_cost: '€80 EUR (approx. ₦160,000)', processing_time: '15–30 business days (apply early)', where_to_apply: 'VFS Global France Visa Application Centre, Lagos or Abuja', documents: ['Valid Nigerian passport (min. 6 months validity)', 'Completed Schengen visa application form', '2 recent passport photographs', 'Confirmed hotel booking for full stay', 'Return flight itinerary', 'Travel insurance (min. €30,000 cover)', 'Bank statement (last 6 months, min. balance equivalent to trip cost)', 'Employment letter or business registration', 'Tax clearance certificate (last 3 years)'], best_season: 'April – June and September – October', currency: 'Euro (EUR) · 1 EUR ≈ ₦2,000', notes: 'The Schengen visa is one of the most document-intensive for Nigerian travellers. Apply at least 6–8 weeks before travel. Strong financial proof and ties to Nigeria significantly improve approval chances. Our visa team can assist with document preparation.', status: 'published' },
  ];

  function store() { try { return window.localStorage; } catch (e) { return null; } }
  var ls = store();
  if (ls) {
    try {
      if (!ls.getItem('ts-packages')) ls.setItem('ts-packages', JSON.stringify(PACKAGES));
      if (!ls.getItem('ts-visa')) ls.setItem('ts-visa', JSON.stringify(VISA));
    } catch (e) { /* storage full or blocked: pages fall back to their empty states */ }
  }

  function reset() {
    ['ts-packages', 'ts-visa', 'ts-cms-users', 'ts-cms-categories'].forEach(function (k) {
      try { ls && ls.removeItem(k); } catch (e) {}
    });
    try { sessionStorage.removeItem('ts-cms-session'); sessionStorage.removeItem('pkgRequest'); } catch (e) {}
    location.reload();
  }

  var CSS = [
    '.pcn-demo-bar{position:relative;z-index:9500;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px 16px;',
    'padding:8px 16px;background:#22022b;color:#fee6fe;font:600 13px/1.4 "Open Sans",system-ui,sans-serif;text-align:center}',
    '.pcn-demo-bar strong{font-weight:700;color:#fbc6d1}',
    '.pcn-demo-bar button,.pcn-demo-bar a{font:inherit;color:#fee6fe;background:none;border:1px solid rgba(254,230,254,.45);',
    'border-radius:999px;padding:3px 12px;cursor:pointer;text-decoration:none;white-space:nowrap}',
    '.pcn-demo-bar button:hover,.pcn-demo-bar a:hover{background:rgba(254,230,254,.12)}',
    '.pcn-demo-bar :focus-visible{outline:2px solid #fbc6d1;outline-offset:2px}',
    /* the floating theme toggle covered the request form's Next button on phones */
    'body:has(.modal-overlay.open) .theme-toggle{display:none!important}',
    /* the CMS is a full-height app: let the bar take its line, then fill the rest */
    'body.pcn-demo-admin{display:flex;flex-direction:column;height:100vh;margin:0}',
    'body.pcn-demo-admin #login-screen{flex:1;min-height:0;overflow:auto;align-items:safe center}',
    'body.pcn-demo-admin #app-shell{flex:1;min-height:0;height:auto}',
    '.pcn-demo-logins{margin-top:22px;padding:14px 16px;border-radius:14px;background:rgba(27,179,245,.08);',
    'border:1px dashed rgba(27,179,245,.5);text-align:left;font-size:13px}',
    '.pcn-demo-logins p{margin:0 0 8px;font-weight:700}',
    '.pcn-demo-logins ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}',
    '.pcn-demo-logins button{width:100%;display:flex;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:10px;',
    'border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;cursor:pointer;text-align:left}',
    '.pcn-demo-logins button:hover{border-color:#1BB3F5}',
    '.pcn-demo-logins button span{flex:1}',
    '.pcn-demo-logins code{font-family:ui-monospace,monospace;opacity:.85;white-space:nowrap;align-self:center}'
  ].join('');

  var LOGINS = [
    ['admin', 'Admin1234', 'Admin: everything, incl. users and categories'],
    ['editor', 'Editor1234', 'Editor: create and publish'],
    ['contributor', 'Contrib1234', 'Contributor: submit for review']
  ];

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  function mount() {
    var style = el('style'); style.textContent = CSS; document.head.appendChild(style);

    var bar = el('div', { 'class': 'pcn-demo-bar', role: 'note' });
    var msg = el('span'); msg.appendChild(el('strong', {}, LABEL));
    var resetBtn = el('button', { type: 'button' }, 'Reset demo data');
    resetBtn.addEventListener('click', reset);
    var about = el('a', { href: ABOUT, target: '_top' }, 'About this prototype');
    bar.appendChild(msg); bar.appendChild(resetBtn); bar.appendChild(about);
    document.body.insertBefore(bar, document.body.firstChild);

    var form = document.getElementById('login-form');
    if (form) {
      document.body.classList.add('pcn-demo-admin');
      var box = el('div', { 'class': 'pcn-demo-logins' });
      box.appendChild(el('p', {}, 'Demo accounts. Front-end only, no real security.'));
      var ul = el('ul', { role: 'list' });
      LOGINS.forEach(function (l) {
        var li = el('li'); var b = el('button', { type: 'button', 'aria-label': 'Sign in as ' + l[0] });
        b.appendChild(el('span', {}, l[2])); b.appendChild(el('code', {}, l[0] + ' / ' + l[1]));
        b.addEventListener('click', function () {
          document.getElementById('login-username').value = l[0];
          document.getElementById('login-pw').value = l[1];
          if (form.requestSubmit) form.requestSubmit(); else form.dispatchEvent(new Event('submit', { cancelable: true }));
        });
        li.appendChild(b); ul.appendChild(li);
      });
      box.appendChild(ul);
      form.parentNode.insertBefore(box, form.nextSibling);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
