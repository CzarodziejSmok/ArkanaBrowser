'use strict';
const { eq, ok } = require('./helpers'), A = require('../adblock');
module.exports = async () => {
  eq(A.hostBlocked('ad.doubleclick.net'), true, 'subdomena domeny reklamowej'); eq(A.hostBlocked('doubleclick.net'), true, 'sama domena'); eq(A.hostBlocked('notdoubleclick.net'), false, 'nie dopasowuje po końcówce tekstu'); eq(A.hostBlocked('example.com'), false, 'zwykła strona');
  eq(A.hostBlocked('bat.bing.com'), true, 'wpis dla konkretnego hosta'); eq(A.hostBlocked('www.bing.com'), false, 'bing.com jako wyszukiwarka nie jest blokowany');
  eq([A.regDomain('www.example.co.uk'), A.regDomain('a.b.example.com'), A.regDomain('localhost')], ['example.co.uk', 'example.com', 'localhost'], 'domena rejestrowana');
  eq(A.shouldBlock('https://ad.doubleclick.net/x.js', 'https://news.pl/a', 'script'), true, 'reklama z innej witryny jest blokowana');
  eq(A.shouldBlock('https://ad.doubleclick.net/', 'https://doubleclick.net/', 'script'), false, 'własna strona domeny nie jest blokowana');
  eq(A.shouldBlock('https://doubleclick.net/', 'https://news.pl/', 'mainFrame'), false, 'przejście na stronę (mainFrame) nigdy nie jest blokowane');
  eq(A.shouldBlock('https://news.pl/app.js', 'https://news.pl/', 'script'), false, 'zwykłe żądania przechodzą'); eq(A.shouldBlock('https://ad.doubleclick.net/x', '', 'script'), false, 'brak strony nadrzędnej: nie blokuj');
  ok(A.HOSTS.length > 100, 'lista ma ponad 100 wpisów'); ok(!A.HOSTS.includes('googletagmanager.com') && !A.HOSTS.includes('connect.facebook.net'), 'lista nie zawiera domen, które często psują strony (GTM, logowanie Facebookiem)');
  let handler; A.install({ webRequest: { onBeforeRequest: (f, h) => { handler = h; } } }); A.state.on = true; A.state.count = 0; let r;
  handler({ url: 'https://x.criteo.com/a', referrer: 'https://shop.pl/', resourceType: 'image' }, v => { r = v; }); eq(r, { cancel: true }, 'handler: blokuje'); eq(A.state.count, 1, 'handler: licznik');
  A.state.on = false; handler({ url: 'https://x.criteo.com/a', referrer: 'https://shop.pl/', resourceType: 'image' }, v => { r = v; }); eq(r, {}, 'handler: po wyłączeniu przepuszcza'); A.state.on = true;
};
