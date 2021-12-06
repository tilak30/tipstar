/* eslint-disable no-undef */
import browser from 'webextension-polyfill';
import { createClient } from '@supabase/supabase-js'

let supabase;

function initSupabase() {
  if (!supabase) {
    const supabaseUrl = 'https://xjspnyouxerhyrahxszg.supabase.co'
    const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODQ0ODkwNSwiZXhwIjoxOTU0MDI0OTA1fQ.J5E5yqcloTfAoc-VKvJLQl2KIcoAti-_ROR5U-SNJKo'
    supabase = createClient(supabaseUrl, publicAnonKey)
  }
}

async function updateUrlCount(url) {
  const userId = await browser.storage.local.get('userId');
  console.log('Incrementing url count', url, userId)
  await supabase
    .from('views')
    .upsert({ 'id': 3, 'user_id': userId, 'url': url })
    .execute();
}

async function updateCount(tabId) {
  initSupabase()

  const tabs = await browser.tabs.query({})
  let length = tabs.length;
  console.log({ tabId })

  // browser.browserAction.setBadgeText({ text: length.toString() });
  // if (length > 2) {
  //   browser.browserAction.setBadgeBackgroundColor({ 'color': 'green' });
  // } else {
  //   browser.browserAction.setBadgeBackgroundColor({ 'color': 'red' });
  // }

  updateUrlCount(tabId.url);
}

browser.tabs.onCreated.addListener(async (tabId) => {
  await updateCount(tabId);
});

updateCount();