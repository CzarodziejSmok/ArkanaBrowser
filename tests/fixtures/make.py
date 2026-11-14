# Generator danych testowych dla tests/importer.test.js (wymaga Pythona 3 i pakietu cryptography). Pliki są już w repozytorium,
# uruchamiaj tylko, gdy chcesz je odświeżyć:  python tests/fixtures/make.py
import os,json,time
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__))))
for f in os.listdir('.'):
    if f not in ('make.py',): os.remove(f)
import sqlite3,hashlib,random,shutil
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
random.seed(7)
WK=11644473600
def now_wk(): 
    import time; return int((time.time()+WK)*1e6)
# ---- Chromium History (60k rows, duże URL-e => strony przepełnienia, wielopoziomowe B-drzewo)
c=sqlite3.connect('History'); c.execute("PRAGMA page_size=4096")
c.execute("CREATE TABLE urls(id INTEGER PRIMARY KEY AUTOINCREMENT,url LONGVARCHAR,title LONGVARCHAR,visit_count INTEGER DEFAULT 0 NOT NULL,typed_count INTEGER DEFAULT 0 NOT NULL,last_visit_time INTEGER NOT NULL,hidden INTEGER DEFAULT 0 NOT NULL)")
rows=[]
for i in range(3000):
    u='https://example%d.com/p/%d'%(i%500,i)
    if i%997==0: u+='?q='+'x'*6000
    if i==5: u='chrome://settings'
    rows.append((u,'Tytuł żółć %d'%i,1+i%5,0,now_wk()-i*60*10**6,1 if i==7 else 0))
c.executemany("INSERT INTO urls(url,title,visit_count,typed_count,last_visit_time,hidden) VALUES(?,?,?,?,?,?)",rows); c.commit(); c.close()
# ---- Chromium Cookies
key=os.urandom(32)
open('key.bin','wb').write(key)
def enc(val,host,prefix=True,ver=b'v10'):
    iv=os.urandom(12); pt=(hashlib.sha256(host.encode()).digest() if prefix else b'')+val.encode()
    ct=AESGCM(key).encrypt(iv,pt,None); return ver+iv+ct
c=sqlite3.connect('Cookies')
c.execute("CREATE TABLE cookies(creation_utc INTEGER NOT NULL,host_key TEXT NOT NULL,top_frame_site_key TEXT NOT NULL,name TEXT NOT NULL,value TEXT NOT NULL,encrypted_value BLOB NOT NULL,path TEXT NOT NULL,expires_utc INTEGER NOT NULL,is_secure INTEGER NOT NULL,is_httponly INTEGER NOT NULL,last_access_utc INTEGER NOT NULL,has_expires INTEGER NOT NULL,is_persistent INTEGER NOT NULL,priority INTEGER NOT NULL,samesite INTEGER NOT NULL,source_scheme INTEGER NOT NULL,source_port INTEGER NOT NULL,last_update_utc INTEGER NOT NULL,source_type INTEGER NOT NULL,has_cross_site_ancestor INTEGER NOT NULL)")
fut=now_wk()+10**6*86400*3650
def ins(host,name,val,e,exp,sec,ho,ss,hasexp=1,top=''):
    c.execute("INSERT INTO cookies VALUES(?,?,?,?,?,?,?,?,?,?,0,?,?,1,?,2,443,0,0,0)",(1,host,top,name,val,e,'/',exp,sec,ho,hasexp,hasexp,ss))
ins('.example.com','sid','',enc('abc123','.example.com'),fut,1,1,1)          # v10 + prefiks SHA-256 (Chrome 130+)
ins('example.org','old','',enc('legacy','example.org',prefix=False),fut,0,0,-1) # v10 bez prefiksu
ins('.claude.ai','sessionKey','',enc('sk-secret','.claude.ai'),fut,1,1,0)
ins('.plain.com','pl','plainval',b'',fut,0,0,1)                              # wartość jawna
ins('.expired.com','ex','',enc('x','.expired.com'),now_wk()-10**6*86400,0,0,1)  # wygasłe
ins('.v20.com','app','',b'v20'+os.urandom(40),fut,1,1,1)                       # szyfrowanie aplikacyjne
ins('.part.com','chips','',enc('p','.part.com'),fut,1,1,0,top='https://top.com')  # partycjonowane
ins('.sess.com','s','',enc('sessionval','.sess.com'),0,0,0,1,hasexp=0)         # sesyjne
c.commit(); c.close()
# ---- Firefox places.sqlite (WAL, nieskasowany)
if os.path.exists('places.sqlite'): os.remove('places.sqlite')
p=sqlite3.connect('places.sqlite'); p.execute("PRAGMA journal_mode=WAL"); p.execute("PRAGMA wal_autocheckpoint=0")
p.execute("CREATE TABLE moz_places(id INTEGER PRIMARY KEY,url LONGVARCHAR,title LONGVARCHAR,rev_host LONGVARCHAR,visit_count INTEGER DEFAULT 0,hidden INTEGER DEFAULT 0 NOT NULL,typed INTEGER DEFAULT 0 NOT NULL,frecency INTEGER DEFAULT -1 NOT NULL,last_visit_date INTEGER)")
p.execute("CREATE TABLE moz_bookmarks(id INTEGER PRIMARY KEY,type INTEGER,fk INTEGER DEFAULT NULL,parent INTEGER,position INTEGER,title LONGVARCHAR,keyword_id INTEGER,folder_type TEXT,dateAdded INTEGER,lastModified INTEGER,guid TEXT)")
t0=int(__import__('time').time()*1e6)
p.executemany("INSERT INTO moz_places(id,url,title,visit_count,last_visit_date) VALUES(?,?,?,?,?)",[(1,'https://pl.wikipedia.org/','Wikipedia',3,t0-1000),(2,'https://github.com/','GitHub',5,t0-2000),(3,'place:sort=8','smart',0,None),(4,'about:config','cfg',1,t0),(5,'https://nigdy.pl/','Tylko zakładka',0,None)])
B=[(1,2,None,0,0,'',None,None,0,0,'root________'),(2,2,None,1,0,'menu',None,None,0,0,'menu________'),(3,2,None,1,1,'Pasek narzędzi',None,None,0,0,'toolbar_____'),(4,2,None,1,2,'tags',None,None,0,0,'tags________'),(5,2,None,1,3,'Inne',None,None,0,0,'unfiled_____'),
 (6,2,None,3,0,'Praca',None,None,0,0,'f1'),(7,1,1,6,0,'Wiki',None,None,0,0,'b1'),(8,1,2,6,1,'GH',None,None,0,0,'b2'),(9,1,3,3,1,'smart',None,None,0,0,'b3'),(10,1,5,5,0,'Nigdy',None,None,0,0,'b4')]
p.executemany("INSERT INTO moz_bookmarks VALUES(?,?,?,?,?,?,?,?,?,?,?)",B); p.commit()
for ext in ('','-wal'):
    if os.path.exists('places.sqlite'+ext): shutil.copy('places.sqlite'+ext,'ffcopy.sqlite'+ext)
p.close()
# ---- Firefox cookies
f=sqlite3.connect('fcookies.sqlite')
f.execute("CREATE TABLE moz_cookies(id INTEGER PRIMARY KEY,originAttributes TEXT NOT NULL DEFAULT '',name TEXT,value TEXT,host TEXT,path TEXT,expiry INTEGER,lastAccessed INTEGER,creationTime INTEGER,isSecure INTEGER,isHttpOnly INTEGER,inBrowserElement INTEGER DEFAULT 0,sameSite INTEGER DEFAULT 0,rawSameSite INTEGER DEFAULT 0,schemeMap INTEGER DEFAULT 0)")
import time
f.executemany("INSERT INTO moz_cookies(originAttributes,name,value,host,path,expiry,isSecure,isHttpOnly,sameSite) VALUES(?,?,?,?,?,?,?,?,?)",[('','a','1','.ff.com','/',int(time.time())+315360000,1,1,1),('','b','2','ff.org','/x',int(time.time()*1000)+315360000000,0,0,0),('^userContextId=2','c','3','.cont.com','/',int(time.time())+315360000,0,0,0),('','d','4','.old.com','/',1000,0,0,0)])
f.commit(); f.close()
json.dump({"roots":{"bookmark_bar":{"name":"Pasek zakładek","type":"folder","children":[{"type":"url","name":"Onet","url":"https://onet.pl/"},{"type":"folder","name":"Dev","children":[{"type":"url","name":"MDN","url":"https://developer.mozilla.org/"},{"type":"url","name":"JS","url":"javascript:void(0)"}]}]},"other":{"name":"Inne","type":"folder","children":[{"type":"url","name":"Gmail","url":"https://mail.google.com/"}]},"synced":{"name":"Mobile","type":"folder","children":[]}}},open('Bookmarks','w',encoding='utf8'),ensure_ascii=False)
open('bm.html','w',encoding='utf8').write('<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><H3 ADD_DATE="1">Pasek &amp; Co</H3><DL><p><DT><A HREF="https://a.com/?x=1&amp;y=2" ADD_DATE="1">Strona &quot;A&quot;</A><DT><H3>Pod</H3><DL><p><DT><A HREF="https://b.com/">B</A></DL><p></DL><p><DT><A HREF="https://luzem.com/">Luźna</A><DT><A HREF="ftp://x">ftp</A></DL><p>')


import sqlite3,struct
# --- minimalny kompresor LZ4 (blok) do testów dekodera: dopasowania, nakładanie, długości >= 15 i >= 270
def lz4c(data):
    out=bytearray(); i=0; anchor=0; h={}
    def emit(lits,mlen,off):
        tok=(min(len(lits),15)<<4)|(min(mlen-4,15) if mlen else 0); out.append(tok)
        n=len(lits)-15
        if len(lits)>=15:
            while n>=255: out.append(255); n-=255
            out.append(n)
        out.extend(lits)
        if mlen:
            out.extend(struct.pack('<H',off)); m=mlen-4-15
            if mlen-4>=15:
                while m>=255: out.append(255); m-=255
                out.append(m)
    while i+4<=len(data)-5:
        k=data[i:i+4]; j=h.get(k); h[k]=i
        if j is not None and i-j<65535:
            m=4
            while i+m<len(data)-5 and data[j+m]==data[i+m]: m+=1
            emit(data[anchor:i],m,i-j); i+=m; anchor=i
        else: i+=1
    emit(data[anchor:],0,0); return bytes(out)
def mozlz4(obj,path):
    raw=json.dumps(obj).encode(); open(path,'wb').write(b'mozLz40\0'+struct.pack('<I',len(raw))+lz4c(raw))
pad='x'*600
mozlz4({'version':6,'engines':[{'id':'google@search.mozilla.org','_name':'Google','_isAppProvided':True}],'metaData':{'defaultEngineId':'ddg@search.mozilla.org','pad':pad}},'ff_app.mozlz4')
mozlz4({'version':6,'engines':[{'id':'abc-123','_name':'MojaSzukajka','_isAppProvided':False,'_urls':[{'template':'https://szukaj.example.org/find','method':'GET','params':[{'name':'q','value':'{searchTerms}'},{'name':'lang','value':'pl'},{'name':'x','value':'1','purpose':'contextmenu'}],'rels':[]}]}],'metaData':{'defaultEngineId':'abc-123'}},'ff_custom.mozlz4')
mozlz4({'version':1,'engines':[{'_name':'Bing','_isAppProvided':True}],'metaData':{'current':'Bing'}},'ff_old.mozlz4')
open('ff_bad.mozlz4','wb').write(b'nope')
# --- Chromium Web Data
if os.path.exists('WebData'): os.remove('WebData')
c=sqlite3.connect('WebData')
c.execute("CREATE TABLE meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR)")
c.execute("CREATE TABLE keywords(id INTEGER PRIMARY KEY,short_name VARCHAR NOT NULL,keyword VARCHAR NOT NULL,favicon_url VARCHAR NOT NULL,url VARCHAR NOT NULL,safe_for_autoreplace INTEGER,date_created INTEGER DEFAULT 0)")
c.executemany("INSERT INTO keywords(id,short_name,keyword,favicon_url,url,safe_for_autoreplace) VALUES(?,?,?,?,?,0)",[(2,'Google','google.com','','{google:baseURL}search?q={searchTerms}&{google:RLZ}{google:originalQueryForSuggestion}sourceid=chrome&ie={inputEncoding}'),(5,'Bing','bing.com','','https://www.bing.com/search?q={searchTerms}&PC=U316&FORM=CHROMN'),(9,'Moja','m','','https://moja.pl/s?query={searchTerms}&hl={language}'),(11,'Post','p','','https://post.example/{searchTerms}/{weird}')])
c.execute("INSERT INTO meta VALUES('Default Search Provider ID','9')"); c.commit(); c.close()
json.dump({'default_search_provider_data':{'template_url_data':{'short_name':'DuckDuckGo','url':'https://duckduckgo.com/?q={searchTerms}'}}},open('Preferences','w'))


json.dump({'now_ms':int(time.time()*1000)},open('meta.json','w'))
print('fixtures ok')
