// ---------- aplikacja: konwerter jednostek ----------
// Jednostka: [symbol, 'pl|en|de|es|fr', współczynnik względem jednostki bazowej kategorii]
const CVN=['pl','en','de','es','fr','he','zh','szl'];
const CU=a=>a.map(([s,n,f])=>({s,n:n.split('|'),f}));
const C_LEN=CU([
 ['m','metr|metre|Meter|metro|mètre',1],['km','kilometr|kilometre|Kilometer|kilómetro|kilomètre',1000],['cm','centymetr|centimetre|Zentimeter|centímetro|centimètre',.01],['mm','milimetr|millimetre|Millimeter|milímetro|millimètre',.001],
 ['µm','mikrometr|micrometre|Mikrometer|micrómetro|micromètre',1e-6],['nm','nanometr|nanometre|Nanometer|nanómetro|nanomètre',1e-9],['pm','pikometr|picometre|Pikometer|picómetro|picomètre',1e-12],['fm','femtometr (fermi)|femtometre (fermi)|Femtometer (Fermi)|femtómetro (fermi)|femtomètre (fermi)',1e-15],
 ['Å','angstrem|ångström|Ångström|ångström|ångström',1e-10],['in','cal|inch|Zoll|pulgada|pouce',.0254],['ft','stopa|foot|Fuß|pie|pied',.3048],['yd','jard|yard|Yard|yarda|yard',.9144],
 ['mi','mila lądowa|mile|Meile|milla|mille',1609.344],['nmi','mila morska|nautical mile|Seemeile|milla náutica|mille marin',1852],['fur','furlong|furlong|Furlong|furlong|furlong',201.168],['ch','łańcuch (chain)|chain|Chain|cadena|chaîne',20.1168],
 ['rd','pręt (rod)|rod|Rute|vara|perche',5.0292],['ftm','sążeń morski (fathom)|fathom|Faden|braza|brasse',1.8288],['lea','liga (league)|league|League|legua|lieue',4828.032],['hand','dłoń (hand)|hand|Hand|palmo|paume',.1016],
 ['cbt','łokieć (cubit)|cubit|Elle|codo|coudée',.4572],['stad','stadion grecki|Greek stadion|Stadion|estadio|stade',185],['vrs','wiorsta|verst|Werst|versta|verste',1066.8],['pt','punkt typograficzny|typographic point|typografischer Punkt|punto tipográfico|point typographique',.000352778],
 ['ls','sekunda świetlna|light-second|Lichtsekunde|segundo luz|seconde-lumière',299792458],['lmin','minuta świetlna|light-minute|Lichtminute|minuto luz|minute-lumière',17987547480],['lh','godzina świetlna|light-hour|Lichtstunde|hora luz|heure-lumière',1079252848800],
 ['au','jednostka astronomiczna|astronomical unit|astronomische Einheit|unidad astronómica|unité astronomique',149597870700],['ly','rok świetlny|light-year|Lichtjahr|año luz|année-lumière',9460730472580800],
 ['pc','parsek|parsec|Parsec|pársec|parsec',30856775814913673],['kpc','kiloparsek|kiloparsec|Kiloparsec|kiloparsec|kiloparsec',3.0856775814913673e19],['Mpc','megaparsek|megaparsec|Megaparsec|megapársec|mégaparsec',3.0856775814913673e22],
 ['R⊕','promień Ziemi|Earth radius|Erdradius|radio terrestre|rayon terrestre',6371008.8],['R☉','promień Słońca|solar radius|Sonnenradius|radio solar|rayon solaire',695700000],['d☾','odległość Ziemia–Księżyc|Earth–Moon distance|Entfernung Erde–Mond|distancia Tierra–Luna|distance Terre–Lune',384400000],
 ['boisko','boisko piłkarskie (długość)|football pitch (length)|Fußballfeld (Länge)|campo de fútbol (largo)|terrain de football (longueur)',105],['ℓP','długość Plancka|Planck length|Planck-Länge|longitud de Planck|longueur de Planck',1.616255e-35]]);
const C_MASS=CU([
 ['kg','kilogram|kilogram|Kilogramm|kilogramo|kilogramme',1],['g','gram|gram|Gramm|gramo|gramme',.001],['mg','miligram|milligram|Milligramm|miligramo|milligramme',1e-6],['µg','mikrogram|microgram|Mikrogramm|microgramo|microgramme',1e-9],
 ['t','tona|tonne|Tonne|tonelada|tonne',1000],['q','kwintal|quintal|Doppelzentner|quintal|quintal',100],['lb','funt|pound|Pfund|libra|livre',.45359237],['oz','uncja|ounce|Unze|onza|once',.028349523125],
 ['st','stone|stone|Stone|stone|stone',6.35029318],['tn','tona amerykańska (short ton)|US short ton|US-Tonne|tonelada corta|tonne courte',907.18474],['ton','tona brytyjska (long ton)|long ton|britische Tonne|tonelada larga|tonne longue',1016.0469088],
 ['ct','karat|carat|Karat|quilate|carat',.0002],['gr','gran (grain)|grain|Grain|grano|grain',6.479891e-5],['dr','dram|dram|Dram|dracma|gros',.0017718451953125],['ozt','uncja trojańska|troy ounce|Feinunze|onza troy|once troy',.0311034768],
 ['lbt','funt trojański|troy pound|Troy-Pfund|libra troy|livre troy',.3732417216],['dwt','pennyweight|pennyweight|Pennyweight|pennyweight|pennyweight',.00155517384],['slug','slug|slug|Slug|slug|slug',14.5939029372],
 ['u','jednostka masy atomowej (dalton)|atomic mass unit (dalton)|atomare Masseneinheit (Dalton)|unidad de masa atómica (dalton)|unité de masse atomique (dalton)',1.66053906892e-27],['me','masa elektronu|electron mass|Elektronenmasse|masa del electrón|masse de l’électron',9.1093837139e-31],
 ['mp','masa protonu|proton mass|Protonenmasse|masa del protón|masse du proton',1.67262192595e-27],['mP','masa Plancka|Planck mass|Planck-Masse|masa de Planck|masse de Planck',2.176434e-8],
 ['M☾','masa Księżyca|lunar mass|Mondmasse|masa lunar|masse lunaire',7.342e22],['M⊕','masa Ziemi|Earth mass|Erdmasse|masa terrestre|masse terrestre',5.9722e24],['M♃','masa Jowisza|Jupiter mass|Jupitermasse|masa de Júpiter|masse de Jupiter',1.89813e27],['M☉','masa Słońca|solar mass|Sonnenmasse|masa solar|masse solaire',1.98841e30]]);
const C_VOL=CU([
 ['L','litr|litre|Liter|litro|litre',1],['mL','mililitr|millilitre|Milliliter|mililitro|millilitre',.001],['cL','centylitr|centilitre|Zentiliter|centilitro|centilitre',.01],['dL','decylitr|decilitre|Deziliter|decilitro|décilitre',.1],['hL','hektolitr|hectolitre|Hektoliter|hectolitro|hectolitre',100],
 ['m³','metr sześcienny|cubic metre|Kubikmeter|metro cúbico|mètre cube',1000],['cm³','centymetr sześcienny|cubic centimetre|Kubikzentimeter|centímetro cúbico|centimètre cube',.001],['mm³','milimetr sześcienny|cubic millimetre|Kubikmillimeter|milímetro cúbico|millimètre cube',1e-6],['km³','kilometr sześcienny|cubic kilometre|Kubikkilometer|kilómetro cúbico|kilomètre cube',1e12],
 ['in³','cal sześcienny|cubic inch|Kubikzoll|pulgada cúbica|pouce cube',.016387064],['ft³','stopa sześcienna|cubic foot|Kubikfuß|pie cúbico|pied cube',28.316846592],['yd³','jard sześcienny|cubic yard|Kubikyard|yarda cúbica|yard cube',764.554857984],
 ['gal','galon amerykański|US gallon|US-Gallone|galón estadounidense|gallon américain',3.785411784],['galUK','galon brytyjski|imperial gallon|britische Gallone|galón imperial|gallon impérial',4.54609],
 ['qt','kwarta amerykańska|US quart|US-Quart|cuarto de galón (EE. UU.)|quart américain',.946352946],['pt US','pinta amerykańska|US pint|US-Pint|pinta (EE. UU.)|pinte américaine',.473176473],['pt UK','pinta brytyjska|imperial pint|britische Pinte|pinta imperial|pinte impériale',.56826125],
 ['cup','szklanka amerykańska (cup)|US cup|US-Cup|taza (EE. UU.)|tasse américaine',.2365882365],['gill','gill amerykański|US gill|US-Gill|gill (EE. UU.)|gill américain',.1182941183],['fl oz US','uncja płynu (US)|US fluid ounce|US-Flüssigunze|onza líquida (EE. UU.)|once liquide américaine',.0295735295625],
 ['fl oz UK','uncja płynu (UK)|imperial fluid ounce|britische Flüssigunze|onza líquida imperial|once liquide impériale',.0284130625],['tbsp','łyżka stołowa (US)|US tablespoon|US-Esslöffel|cucharada (EE. UU.)|cuillère à soupe (US)',.01478676478125],['tsp','łyżeczka (US)|US teaspoon|US-Teelöffel|cucharadita (EE. UU.)|cuillère à café (US)',.00492892159375],
 ['łyż','łyżka (15 mL)|metric tablespoon (15 mL)|metrischer Esslöffel (15 ml)|cucharada métrica (15 ml)|cuillère à soupe métrique (15 ml)',.015],['szkl','szklanka (250 mL)|metric cup (250 mL)|metrische Tasse (250 ml)|taza métrica (250 ml)|tasse métrique (250 ml)',.25],
 ['kr','kropla (ok. 0,05 mL)|drop (approx. 0.05 mL)|Tropfen (ca. 0,05 ml)|gota (aprox. 0,05 ml)|goutte (env. 0,05 ml)',5e-5],['bbl','baryłka ropy|oil barrel|Ölfass|barril de petróleo|baril de pétrole',158.987294928],
 ['bu','buszel amerykański|US bushel|US-Bushel|bushel (EE. UU.)|boisseau américain',35.23907016688],['pk','peck amerykański|US peck|US-Peck|peck (EE. UU.)|peck américain',8.80976754172],['hhd','hogshead|hogshead|Hogshead|hogshead|hogshead',238.4809423],
 ['wine','butelka wina (0,75 L)|wine bottle (0.75 L)|Weinflasche (0,75 l)|botella de vino (0,75 l)|bouteille de vin (0,75 l)',.75],['mag','magnum (1,5 L)|magnum (1.5 L)|Magnum (1,5 l)|magnum (1,5 l)|magnum (1,5 l)',1.5],['neb','nabuchodonozor (15 L)|Nebuchadnezzar (15 L)|Nebukadnezar (15 l)|nabucodonosor (15 l)|Nabuchodonosor (15 l)',15],
 ['ac ft','akr-stopa|acre-foot|Acre-Foot|acre-pie|acre-pied',1233481.83754752],['pool','basen olimpijski|Olympic swimming pool|olympisches Schwimmbecken|piscina olímpica|piscine olympique',2500000]]);
const C_TIME=CU([
 ['s','sekunda|second|Sekunde|segundo|seconde',1],['ms','milisekunda|millisecond|Millisekunde|milisegundo|milliseconde',.001],['µs','mikrosekunda|microsecond|Mikrosekunde|microsegundo|microseconde',1e-6],['ns','nanosekunda|nanosecond|Nanosekunde|nanosegundo|nanoseconde',1e-9],['ps','pikosekunda|picosecond|Pikosekunde|picosegundo|picoseconde',1e-12],
 ['min','minuta|minute|Minute|minuto|minute',60],['h','godzina|hour|Stunde|hora|heure',3600],['d','doba|day|Tag|día|jour',86400],['wk','tydzień|week|Woche|semana|semaine',604800],['fn','dwa tygodnie (fortnight)|fortnight|vierzehn Tage|quincena|quinzaine',1209600],
 ['mo','miesiąc (średni)|month (average)|Monat (Durchschnitt)|mes (promedio)|mois (moyen)',2629746],['yr','rok (gregoriański)|year (Gregorian)|Jahr (gregorianisch)|año (gregoriano)|année (grégorienne)',31556952],['yrJ','rok juliański|Julian year|julianisches Jahr|año juliano|année julienne',31557600],
 ['yrS','rok gwiazdowy|sidereal year|Sternjahr|año sidéreo|année sidérale',31558149.76],['dec','dekada|decade|Jahrzehnt|década|décennie',315569520],['cen','wiek|century|Jahrhundert|siglo|siècle',3155695200],['mil','tysiąclecie|millennium|Jahrtausend|milenio|millénaire',31556952000],
 ['qh','kwadrans|quarter of an hour|Viertelstunde|cuarto de hora|quart d’heure',900],['sd','doba gwiazdowa|sidereal day|Sternentag|día sidéreo|jour sidéral',86164.0905],['sol','dzień marsjański (sol)|Martian day (sol)|Marstag (Sol)|día marciano (sol)|jour martien (sol)',88775.244],
 ['chk','chelek (hebrajski)|chelek (Hebrew)|Chelek (hebräisch)|jélek (hebreo)|héleq (hébreu)',10/3],['ke','ke (chiński)|ke (Chinese)|Ke (chinesisch)|ke (chino)|ke (chinois)',864],['shk','shake|shake|Shake|shake|shake',1e-8],['jif','jiffy (1/60 s)|jiffy (1/60 s)|Jiffy (1/60 s)|jiffy (1/60 s)|jiffy (1/60 s)',1/60],
 ['tP','czas Plancka|Planck time|Planck-Zeit|tiempo de Planck|temps de Planck',5.391247e-44],['Uni','wiek Wszechświata|age of the Universe|Alter des Universums|edad del Universo|âge de l’Univers',4.3508e17]]);
const C_AREA=CU([
 ['m²','metr kwadratowy|square metre|Quadratmeter|metro cuadrado|mètre carré',1],['km²','kilometr kwadratowy|square kilometre|Quadratkilometer|kilómetro cuadrado|kilomètre carré',1e6],['cm²','centymetr kwadratowy|square centimetre|Quadratzentimeter|centímetro cuadrado|centimètre carré',1e-4],['mm²','milimetr kwadratowy|square millimetre|Quadratmillimeter|milímetro cuadrado|millimètre carré',1e-6],
 ['ha','hektar|hectare|Hektar|hectárea|hectare',1e4],['a','ar|are|Ar|área|are',100],['dun','dunam|dunam|Dunam|dunam|dounam',1000],['ac','akr|acre|Acre|acre|acre',4046.8564224],['rood','rood|rood|Rood|rood|rood',1011.7141056],
 ['in²','cal kwadratowy|square inch|Quadratzoll|pulgada cuadrada|pouce carré',6.4516e-4],['ft²','stopa kwadratowa|square foot|Quadratfuß|pie cuadrado|pied carré',.09290304],['yd²','jard kwadratowy|square yard|Quadratyard|yarda cuadrada|yard carré',.83612736],
 ['mi²','mila kwadratowa|square mile|Quadratmeile|milla cuadrada|mille carré',2589988.110336],['twp','township (36 mi²)|township (36 mi²)|Township (36 mi²)|township (36 mi²)|township (36 mi²)',93239571.972],['morga','morga pruska|Prussian morgen|preußischer Morgen|morgen prusiano|morgen prussien',2553.22],
 ['tsubo','tsubo|tsubo|Tsubo|tsubo|tsubo',3.30578512],['cmil','circular mil|circular mil|Circular Mil|circular mil|circular mil',5.067075e-10],['barn','barn|barn|Barn|barn|barn',1e-28],['shed','shed|shed|Shed|shed|shed',1e-52],['pitch','boisko piłkarskie|football pitch|Fußballfeld|campo de fútbol|terrain de football',7140]]);
const KT={ // temperatura: przeliczenia przez kelwiny
 C:[v=>v+273.15,k=>k-273.15],K:[v=>v,k=>k],F:[v=>(v+459.67)*5/9,k=>k*9/5-459.67],R:[v=>v*5/9,k=>k*9/5],Re:[v=>v*1.25+273.15,k=>(k-273.15)*.8],
 De:[v=>373.15-v*2/3,k=>(373.15-k)*1.5],N:[v=>v*100/33+273.15,k=>(k-273.15)*.33],Ro:[v=>(v-7.5)*40/21+273.15,k=>(k-273.15)*21/40+7.5],TP:[v=>v*1.416784e32,k=>k/1.416784e32]};
const C_TEMP=[['C','stopień Celsjusza|degree Celsius|Grad Celsius|grado Celsius|degré Celsius','°C'],['K','kelwin|kelvin|Kelvin|kelvin|kelvin','K'],['F','stopień Fahrenheita|degree Fahrenheit|Grad Fahrenheit|grado Fahrenheit|degré Fahrenheit','°F'],
 ['R','stopień Rankine’a|degree Rankine|Grad Rankine|grado Rankine|degré Rankine','°R'],['Re','stopień Réaumura|degree Réaumur|Grad Réaumur|grado Réaumur|degré Réaumur','°Ré'],['De','stopień Delisle’a|degree Delisle|Grad Delisle|grado Delisle|degré Delisle','°De'],
 ['N','stopień Newtona|degree Newton|Grad Newton|grado Newton|degré Newton','°N'],['Ro','stopień Rømera|degree Rømer|Grad Rømer|grado Rømer|degré Rømer','°Rø'],['TP','temperatura Plancka|Planck temperature|Planck-Temperatur|temperatura de Planck|température de Planck','T_P']]
 .map(([k,n,s])=>({s,n:n.split('|'),to:KT[k][0],from:KT[k][1]}));
const C_SPEED=CU([
 ['m/s','metr na sekundę|metre per second|Meter pro Sekunde|metro por segundo|mètre par seconde',1],['km/h','kilometr na godzinę|kilometre per hour|Kilometer pro Stunde|kilómetro por hora|kilomètre par heure',1/3.6],['mph','mila na godzinę|mile per hour|Meile pro Stunde|milla por hora|mille par heure',.44704],
 ['kn','węzeł|knot|Knoten|nudo|nœud',1852/3600],['ft/s','stopa na sekundę|foot per second|Fuß pro Sekunde|pie por segundo|pied par seconde',.3048],['km/s','kilometr na sekundę|kilometre per second|Kilometer pro Sekunde|kilómetro por segundo|kilomètre par seconde',1000],
 ['cm/s','centymetr na sekundę|centimetre per second|Zentimeter pro Sekunde|centímetro por segundo|centimètre par seconde',.01],['Ma','Mach (poziom morza, 15 °C)|Mach (sea level, 15 °C)|Mach (Meereshöhe, 15 °C)|Mach (nivel del mar, 15 °C)|Mach (niveau de la mer, 15 °C)',340.29],
 ['c','prędkość światła|speed of light|Lichtgeschwindigkeit|velocidad de la luz|vitesse de la lumière',299792458],['v⊕','prędkość ucieczki z Ziemi|Earth escape velocity|Fluchtgeschwindigkeit der Erde|velocidad de escape de la Tierra|vitesse de libération terrestre',11186],
 ['vorb','prędkość orbitalna Ziemi|Earth orbital speed|Bahngeschwindigkeit der Erde|velocidad orbital de la Tierra|vitesse orbitale de la Terre',29780],['f/f','furlong na dwa tygodnie|furlong per fortnight|Furlong pro vierzehn Tage|furlong por quincena|furlong par quinzaine',201.168/1209600]]);
const C_DATA=(()=>{ const B=['bajt|byte|Byte|byte|octet'.split('|'),'bit|bit|Bit|bit|bit'.split('|')], out=[{s:'bit',n:B[1],f:1},{s:'nibble',n:'półbajt (nibble)|nibble|Nibble|nibble|quartet'.split('|'),f:4},{s:'B',n:B[0],f:8}];
  const P=[['k','kilo|kilo|Kilo|kilo|kilo'],['M','mega|mega|Mega|mega|méga'],['G','giga|giga|Giga|giga|giga'],['T','tera|tera|Tera|tera|téra'],['P','peta|peta|Peta|peta|péta'],['E','eksa|exa|Exa|exa|exa']].map(([s,n])=>[s,n.split('|')]);
  const I=['kibi','mebi','gibi','tebi','pebi','exbi'], nm=(p,b,i)=>i===2?p+b.toLowerCase():p+b;
  P.forEach(([s,pn],k)=>{ out.push({s:s+'B',n:B[0].map((b,i)=>nm(pn[i],b,i)),f:8*Math.pow(1000,k+1)}); out.push({s:(s==='k'?'K':s)+'iB',n:B[0].map((b,i)=>(i===2?capF(I[k])+b.toLowerCase():I[k]+b)),f:8*Math.pow(1024,k+1)}); });
  P.forEach(([s,pn],k)=>out.push({s:s+'b',n:B[1].map((b,i)=>nm(pn[i],b,i)),f:Math.pow(1000,k+1)}));
  return out; })();
const C_ENERGY=CU([
 ['J','dżul|joule|Joule|julio|joule',1],['kJ','kilodżul|kilojoule|Kilojoule|kilojulio|kilojoule',1000],['MJ','megadżul|megajoule|Megajoule|megajulio|mégajoule',1e6],['cal','kaloria (mała)|calorie|Kalorie|caloría|calorie',4.184],['kcal','kilokaloria|kilocalorie|Kilokalorie|kilocaloría|kilocalorie',4184],
 ['Wh','watogodzina|watt-hour|Wattstunde|vatio-hora|wattheure',3600],['kWh','kilowatogodzina|kilowatt-hour|Kilowattstunde|kilovatio-hora|kilowattheure',3.6e6],['MWh','megawatogodzina|megawatt-hour|Megawattstunde|megavatio-hora|mégawattheure',3.6e9],
 ['eV','elektronowolt|electronvolt|Elektronenvolt|electronvoltio|électronvolt',1.602176634e-19],['keV','kiloelektronowolt|kiloelectronvolt|Kiloelektronenvolt|kiloelectronvoltio|kiloélectronvolt',1.602176634e-16],['MeV','megaelektronowolt|megaelectronvolt|Megaelektronenvolt|megaelectronvoltio|mégaélectronvolt',1.602176634e-13],
 ['erg','erg|erg|Erg|ergio|erg',1e-7],['BTU','brytyjska jednostka cieplna (BTU)|British thermal unit (BTU)|British Thermal Unit (BTU)|unidad térmica británica (BTU)|British thermal unit (BTU)',1055.05585262],['therm','therm (US)|therm (US)|Therm (US)|therm (EE. UU.)|therm (US)',105480400],
 ['ft·lbf','stopofunt-siła|foot-pound force|Fuß-Pfund-Kraft|libra-pie|pied-livre-force',1.3558179483314004],['L·atm','litroatmosfera|litre-atmosphere|Literatmosphäre|litro-atmósfera|litre-atmosphère',101.325],['hp·h','koń mechaniczny na godzinę|horsepower-hour|Pferdestärkenstunde|caballo de vapor-hora|cheval-vapeur-heure',2684519.537696],
 ['toe','tona ekwiwalentu ropy|tonne of oil equivalent|Tonne Öläquivalent|tonelada equivalente de petróleo|tonne d’équivalent pétrole',4.1868e10],['tTNT','tona trotylu (TNT)|ton of TNT|Tonne TNT|tonelada de TNT|tonne de TNT',4.184e9],['MtTNT','megatona trotylu|megaton of TNT|Megatonne TNT|megatonelada de TNT|mégatonne de TNT',4.184e15],
 ['Eh','hartree|hartree|Hartree|hartree|hartree',4.3597447222e-18],['Ry','rydberg|rydberg|Rydberg|rydberg|rydberg',2.1798723611e-18],['EP','energia Plancka|Planck energy|Planck-Energie|energía de Planck|énergie de Planck',1.9561e9],['foe','foe (10^44 J)|foe (10^44 J)|Foe (10^44 J)|foe (10^44 J)|foe (10^44 J)',1e44]]);
const C_PRES=CU([
 ['Pa','paskal|pascal|Pascal|pascal|pascal',1],['hPa','hektopaskal|hectopascal|Hektopascal|hectopascal|hectopascal',100],['kPa','kilopaskal|kilopascal|Kilopascal|kilopascal|kilopascal',1000],['MPa','megapaskal|megapascal|Megapascal|megapascal|mégapascal',1e6],['GPa','gigapaskal|gigapascal|Gigapascal|gigapascal|gigapascal',1e9],
 ['bar','bar|bar|Bar|bar|bar',1e5],['mbar','milibar|millibar|Millibar|milibar|millibar',100],['atm','atmosfera fizyczna|standard atmosphere|physikalische Atmosphäre|atmósfera estándar|atmosphère normale',101325],['at','atmosfera techniczna|technical atmosphere|technische Atmosphäre|atmósfera técnica|atmosphère technique',98066.5],
 ['mmHg','milimetr słupa rtęci|millimetre of mercury|Millimeter Quecksilbersäule|milímetro de mercurio|millimètre de mercure',133.322387415],['Torr','tor|torr|Torr|torr|torr',101325/760],['inHg','cal słupa rtęci|inch of mercury|Zoll Quecksilbersäule|pulgada de mercurio|pouce de mercure',3386.389],
 ['psi','funt na cal kwadratowy (psi)|pound per square inch (psi)|Pfund pro Quadratzoll (psi)|libra por pulgada cuadrada (psi)|livre par pouce carré (psi)',6894.757293168],['ksi','kilofunt na cal kwadratowy (ksi)|kilopound per square inch (ksi)|Kilopfund pro Quadratzoll (ksi)|kilolibra por pulgada cuadrada (ksi)|kilolivre par pouce carré (ksi)',6894757.293168],
 ['inH₂O','cal słupa wody|inch of water|Zoll Wassersäule|pulgada de agua|pouce d’eau',249.08891],['mmH₂O','milimetr słupa wody|millimetre of water|Millimeter Wassersäule|milímetro de agua|millimètre d’eau',9.80665],['Ba','barie|barye|Barye|baria|barye',.1]]);
const CATS=[
 {id:'len',ic:'📏',n:'Długość',u:C_LEN,df:['km','mi']},{id:'mass',ic:'⚖️',n:'Waga i masa',u:C_MASS,df:['kg','lb']},{id:'vol',ic:'🧪',n:'Objętość',u:C_VOL,df:['L','gal']},
 {id:'time',ic:'⏳',n:'Czas',u:C_TIME,df:['h','min']},{id:'area',ic:'🗺️',n:'Powierzchnia',u:C_AREA,df:['m²','ft²']},{id:'temp',ic:'🌡️',n:'Temperatura',u:C_TEMP,df:['C','F'],tmp:1},
 {id:'speed',ic:'🚀',n:'Prędkość',u:C_SPEED,df:['km/h','mph']},{id:'data',ic:'💾',n:'Dane',u:C_DATA,df:['GB','MiB']},{id:'en',ic:'⚡',n:'Energia',u:C_ENERGY,df:['kcal','kJ']},{id:'pres',ic:'🎈',n:'Ciśnienie',u:C_PRES,df:['bar','psi']},{id:'fx',ic:'💱',n:'Waluty',u:[],df:['PLN','USD']}];
// temperatura ma symbole ze znakiem stopnia; df wskazuje klucze C/F, więc mapujemy je na symbole
CATS.find(c=>c.id==='temp').df=['°C','°F'];
const IUN={m:'meter',km:'kilometer',cm:'centimeter',mm:'millimeter','in':'inch',ft:'foot',yd:'yard',mi:'mile',kg:'kilogram',g:'gram',lb:'pound',oz:'ounce',st:'stone',L:'liter',mL:'milliliter',gal:'gallon','fl oz US':'fluid-ounce',
  s:'second',ms:'millisecond','µs':'microsecond',ns:'nanosecond',min:'minute',h:'hour',d:'day',wk:'week',mo:'month',yr:'year',ha:'hectare',ac:'acre','°C':'celsius','°F':'fahrenheit','km/h':'kilometer-per-hour',mph:'mile-per-hour','m/s':'meter-per-second',
  bit:'bit',B:'byte',kB:'kilobyte',MB:'megabyte',GB:'gigabyte',TB:'terabyte',PB:'petabyte',kb:'kilobit',Mb:'megabit',Gb:'gigabit',Tb:'terabit'};
const IUC={};
function unitIntl(sym,loc){ const id=IUN[sym]; if(!id) return null; const k=loc+'|'+id; if(k in IUC) return IUC[k]; let r=null;
  try{ const p=new Intl.NumberFormat(loc,{style:'unit',unit:id,unitDisplay:'long'}).formatToParts(1).find(x=>x.type==='unit'); r=(p&&p.value.trim())||null; }catch{} return IUC[k]=r; }
function cvFmt(n,L,sig){ sig=sig||12; if(!isFinite(n)) return '—'; if(n===0) return '0'; const a=Math.abs(n), dec=(1.1).toLocaleString(L).charAt(1);
  if(a>=1e15||a<1e-6) return n.toExponential(6).replace(/\.?0+e/,'e').replace('e+','e').replace('.',dec);
  return n.toLocaleString(L,{maximumSignificantDigits:sig}); }
// ---------- waluty: kursy pobiera proces główny (bez CORS), wynik trafia do pamięci podręcznej w S ----------
// Waluty o kursie ustalonym prawnie: [waluta bazowa, ile jednostek bazowych to 1 taka jednostka]
const FIXED={PLZ:['PLN',1e-4],DEM:['EUR',1/1.95583],FRF:['EUR',1/6.55957],ITL:['EUR',1/1936.27],ESP:['EUR',1/166.386],NLG:['EUR',1/2.20371],ATS:['EUR',1/13.7603],BEF:['EUR',1/40.3399],FIM:['EUR',1/5.94573],
 IEP:['EUR',1/.787564],PTE:['EUR',1/200.482],GRD:['EUR',1/340.75],LUF:['EUR',1/40.3399],SIT:['EUR',1/239.64],CYP:['EUR',1/.585274],MTL:['EUR',1/.4293],SKK:['EUR',1/30.126],EEK:['EUR',1/15.6466],LVL:['EUR',1/.702804],
 LTL:['EUR',1/3.4528],HRK:['EUR',1/7.5345],RUR:['RUB',1e-3],TRL:['TRY',1e-6],ROL:['RON',1e-4],BYR:['BYN',1e-4],AZM:['AZN',1/5000],TMM:['TMT',1/5000],MZM:['MZN',1e-3],GHC:['GHS',1e-4],SRG:['SRD',1e-3],MGF:['MGA',1/5]};
const PLZN=['złoty przed denominacją (do 1994)','Polish złoty before redenomination (to 1994)','Złoty vor der Denominierung (bis 1994)','esloti antes de la desnominación (hasta 1994)','złoty avant la dénomination (jusqu’en 1994)','זלוטי פולני לפני הדנומינציה (עד 1994)','波蘭茲羅提（1994 年面額改革前）','złoty przed denominacyjōm (do 1994)'];
const FXPRI=['PLN','PLZ','USD','EUR','GBP','CHF','CZK','UAH','NOK','SEK','DKK','HUF','JPY','CNY','CAD','AUD','TRY','RUB'];
const FXR=[['1M',30],['3M',90],['1R',365],['5L',1825]];
const FXCH=new Map();
const CVORD=['len','area','vol','mass','time','speed','temp','pres','en','data','fx'];   // kolejność tematyczna w panelu   // wykresy w pamięci na czas sesji
function mountConv(el,w){
  const LC=S.settings.ui.lang, L=IL(), li=Math.max(0,CVN.indexOf(LC)), D=(S.aw.data.conv=S.aw.data.conv||{cat:'len',f:{},t:{},v:'1'});
  if(!CATS.find(c=>c.id===D.cat)) D.cat='len'; if(D.slot!=='f'&&D.slot!=='t') D.slot='f'; if(!D.rg) D.rg=30;
  el.innerHTML=`<div class="cvw"><div class="cv" tabindex="0"><div class="cv-top"><button class="cv-mn" title="Kategorie">☰</button><b class="cv-cn"></b></div><div class="cv-main">
    <div class="cv-row" data-slot="f"><input class="cv-in" inputmode="decimal" spellcheck="false" autocomplete="off"><button class="cv-u" data-slot="f"></button></div>
    <button class="cv-sw" title="Zamień jednostki">⇅</button>
    <div class="cv-row" data-slot="t"><div class="cv-out"></div><button class="cv-u" data-slot="t"></button><button class="cv-cp" title="Kopiuj wynik">⧉</button></div>
    <div class="cv-eq"></div></div><div class="cv-fx"></div>
    <div class="cv-all"><div class="cv-ah"><b class="cv-hd"></b><input class="cv-q" placeholder="Szukaj jednostki…" spellcheck="false"></div><div class="cv-al"></div></div></div><div class="cv-bk"></div><div class="cv-dr"><div class="cv-dh">Kategorie</div><div class="cv-di"></div></div></div>`;
  const wrap=el.firstElementChild, root=wrap.querySelector('.cv'), cats=wrap.querySelector('.cv-di'), cname=wrap.querySelector('.cv-cn'), inp=root.querySelector('.cv-in'), out=root.querySelector('.cv-out'), eq=root.querySelector('.cv-eq'), fxb=root.querySelector('.cv-fx'), al=root.querySelector('.cv-al'), q=root.querySelector('.cv-q'), hd=root.querySelector('.cv-hd');
  const cat=()=>CATS.find(c=>c.id===D.cat), nm=u=>u.n[li]||unitIntl(u.s,L)||(LC==='szl'?u.n[0]:(u.n[1]||u.n[0])), un=(c,s)=>c.u.find(x=>x.s===s)||c.u[0], cur=slot=>un(cat(),D[slot][D.cat]);
  const conv=(v,c,a,b)=>c.tmp?b.from(a.to(v)):v*a.f/b.f;
  const num=()=>{ const s=D.v.trim().replace(/\s/g,'').replace(',','.'); return s===''||s==='-'?NaN:Number(s); };
  const F=()=>D.fx||(D.fx={});
  let fxBusy=false, fxErr='', tok=0;
  // --- lista walut z kursów ---
  function fxBuild(){
    const C=CATS.find(c=>c.id==='fx'), R=F().rates; if(!R){ C.u=[]; return; }
    let dn=null; try{ dn=new Intl.DisplayNames([L],{type:'currency'}); }catch{}
    const name=c=>{ if(c==='PLZ') return PLZN[li]; let n=c; try{ n=(dn&&dn.of(c))||c; }catch{} return capF(n); }, u=[];
    Object.keys(R).forEach(c=>{ if(!FIXED[c]&&R[c]>0) u.push({s:c,n:[name(c)],f:1/R[c]}); });
    Object.keys(FIXED).forEach(c=>{ const [b,m]=FIXED[c]; if(R[b]>0) u.push({s:c,n:[name(c)],f:m/R[b]}); });
    u.sort((a,b)=>{ const x=FXPRI.indexOf(a.s), y=FXPRI.indexOf(b.s); if(x>=0||y>=0) return (x<0?99:x)-(y<0?99:y); return a.n[0].localeCompare(b.n[0],L); });
    C.u=u;
  }
  async function fxFetch(force){
    const f=F(); if(!force&&f.rates&&Date.now()-(f.ts||0)<6*3600e3) return;
    fxBusy=true; fxErr=''; fxPanel();
    try{ const r=await window.api.httpGet('https://open.er-api.com/v6/latest/USD'); if(!r||!r.ok) throw new Error(r&&r.err||'net');
      const j=JSON.parse(r.body); if(j.result!=='success'||!j.rates) throw new Error('bad'); f.rates=j.rates; f.ts=Date.now(); f.upd=j.time_last_update_utc||''; save(); }
    catch(e){ fxErr=String(e.message||e); }
    fxBusy=false; if(!el.isConnected) return; fxBuild(); if(D.cat==='fx'){ drawSel(); run(); renderList(false); fxPanel(); }
  }
  const mk=c=>FIXED[c]?{code:FIXED[c][0],m:FIXED[c][1]}:{code:c,m:1};
  async function fxSeries(a,b,days){
    const A=mk(a.s), B=mk(b.s); if(A.code===B.code) return {flat:1};
    const key=A.code+B.code+days; if(FXCH.has(key)) return FXCH.get(key);
    const f=F(); if(!f.ecb){ const r=await window.api.httpGet('https://api.frankfurter.dev/v1/currencies'); if(!r||!r.ok) throw new Error('net'); f.ecb=Object.keys(JSON.parse(r.body)); if(!f.ecb.includes('EUR')) f.ecb.push('EUR'); save(); }
    if(!f.ecb.includes(A.code)||!f.ecb.includes(B.code)) return {none:1};
    const r=await window.api.httpGet(`https://api.frankfurter.dev/v1/${dkey(new Date(Date.now()-days*864e5))}..${dkey(new Date())}?base=${A.code}&symbols=${B.code}`); if(!r||!r.ok) throw new Error('net');
    const j=JSON.parse(r.body), pts=Object.keys(j.rates||{}).sort().map(d=>[d,j.rates[d][B.code]*A.m/B.m]); const o=pts.length>1?{pts}:{none:1}; FXCH.set(key,o); return o;
  }
  function chartSvg(pts){
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1, n=pts.length, X=i=>i/(n-1)*300, Y=v=>6+(1-(v-mn)/sp)*88;
    const path=pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(p[1]).toFixed(1)).join('');
    return `<div class="cv-cw"><div class="cv-sv"><svg class="cv-svg" viewBox="0 0 300 100" preserveAspectRatio="none"><defs><linearGradient id="cvg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--acc);stop-opacity:.35"/><stop offset="1" style="stop-color:var(--acc);stop-opacity:0"/></linearGradient></defs>
      <path d="${path}L300 100L0 100Z" fill="url(#cvg)"/><path d="${path}" class="cv-ln"/><line class="cv-xl" y1="0" y2="100" x1="-9" x2="-9"/></svg><i class="cv-dot"></i></div><div class="cv-ya"><span>${cvFmt(mx,L,5)}</span><span>${cvFmt(mn,L,5)}</span></div></div><div class="cv-tt"> </div>`;
  }
  function bindChart(host,pts){
    const sv=host.querySelector('.cv-sv'); if(!sv) return; const dot=host.querySelector('.cv-dot'), xl=host.querySelector('.cv-xl'), tt=host.querySelector('.cv-tt'), n=pts.length, b=cur('t');
    const vs=pts.map(p=>p[1]), mn=Math.min(...vs), mx=Math.max(...vs), sp=(mx-mn)||mx*.01||1;
    const show=i=>{ const p=pts[i], x=i/(n-1); dot.style.left=(x*100)+'%'; dot.style.top=(6+(1-(p[1]-mn)/sp)*88)+'%'; xl.setAttribute('x1',x*300); xl.setAttribute('x2',x*300);
      tt.textContent=new Date(p[0]+'T12:00').toLocaleDateString(L,{day:'numeric',month:'short',year:'numeric'})+' · '+cvFmt(p[1],L,6)+' '+b.s; };
    show(n-1);
    sv.addEventListener('mousemove',e=>{ const r=sv.getBoundingClientRect(); show(Math.max(0,Math.min(n-1,Math.round((e.clientX-r.left)/r.width*(n-1))))); });
    sv.addEventListener('mouseleave',()=>show(n-1));
  }
  async function loadChart(){
    const host=fxb.querySelector('.cv-chart'); if(!host) return; const c=cat(), a=un(c,D.f.fx), b=un(c,D.t.fx), my=++tok; host.innerHTML='<p class="hint">…</p>';
    try{ const o=await fxSeries(a,b,D.rg); if(my!==tok||!el.isConnected) return;
      if(o.flat) host.innerHTML=`<p class="hint">${t('Kurs stały (wartość ustalona prawnie).')}</p>`; else if(o.none) host.innerHTML=`<p class="hint">${t('Wykres niedostępny dla tej pary walut.')}</p>`; else { host.innerHTML=chartSvg(o.pts); bindChart(host,o.pts); } }
    catch{ if(my===tok&&el.isConnected) host.innerHTML=`<p class="hint">${t('Nie udało się pobrać wykresu.')}</p>`; }
  }
  function fxPanel(){
    if(D.cat!=='fx'){ fxb.innerHTML=''; return; }
    const c=cat(), f=F();
    if(!c.u.length){ fxb.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):t('Brak kursów. Sprawdź połączenie z internetem.')}</p>${fxBusy?'':`<button class="cv-rt">${t('Spróbuj ponownie')}</button>`}`; return; }
    const a=un(c,D.f.fx), b=un(c,D.t.fx), when=f.ts?new Date(f.ts).toLocaleString(L,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'';
    fxb.innerHTML=`<div class="cv-fa">${esc(t('{a} to w przeliczeniu').replace('{a}','1 '+nm(a)))}</div><div class="cv-fb">${esc(cvFmt(a.f/b.f,L,6))} ${esc(nm(b))}</div>
      <div class="cv-fc">${esc(fxErr?t('Kursy z pamięci (brak połączenia)')+' · '+when:t('Aktualizacja: {d}').replace('{d}',when))} · Rates By Exchange Rate API</div>
      <div class="cv-rg">${FXR.map(([k,d])=>`<button data-r="${d}" class="${D.rg===d?'on':''}">${t(k)}</button>`).join('')}</div><div class="cv-chart"></div>`;
    loadChart();
  }
  // --- widok ---
  function drawCats(){ cats.innerHTML=CVORD.map(id=>CATS.find(c=>c.id===id)).map(c=>`<button data-c="${c.id}" class="${c.id===D.cat?'on':''}"><i>${c.ic}</i><span>${t(c.n)}</span></button>`).join(''); const c=cat(); cname.textContent=c.ic+' '+t(c.n); }
  function drawSel(){ const c=cat(); if(!c.u.length){ root.querySelectorAll('.cv-u').forEach(b=>{ b.textContent='—'; }); return; }
    D.f[c.id]=un(c,D.f[c.id]||c.df[0]).s; D.t[c.id]=un(c,D.t[c.id]||c.df[1]).s;
    root.querySelectorAll('.cv-u').forEach(b=>{ const u=cur(b.dataset.slot); b.textContent=`${nm(u)} (${u.s})`; }); }
  function setSlotUI(){ root.querySelectorAll('.cv-row').forEach(r=>r.classList.toggle('act',r.dataset.slot===D.slot)); hd.textContent=t(D.slot==='f'?'Przeliczasz z:':'Przeliczasz na:'); }
  function run(){ const c=cat(); if(!c.u.length){ out.textContent='—'; eq.textContent=''; return; }
    const a=cur('f'), b=cur('t'), v=num(), r=conv(v,c,a,b);
    out.textContent=isNaN(v)?'—':cvFmt(r,L); out.classList.toggle('big',out.textContent.length>11); eq.textContent=`1 ${a.s} = ${cvFmt(conv(1,c,a,b),L)} ${b.s}`; }
  function renderList(scroll){ const c=cat(), sel=c.u.length?D[D.slot][c.id]:'', f=q.value.trim().toLowerCase();
    if(!c.u.length){ al.innerHTML=`<p class="hint">${fxBusy?t('Pobieranie kursów…'):'—'}</p>`; return; }
    al.innerHTML=c.u.filter(u=>!f||nm(u).toLowerCase().includes(f)||u.s.toLowerCase().includes(f)).map(u=>`<div class="cv-r${u.s===sel?' on':''}" data-s="${esc(u.s)}"><span>${esc(nm(u))}</span><small>${esc(u.s)}</small></div>`).join('')||'<p class="hint">—</p>';
    const on=al.querySelector('.on'); if(scroll&&on) al.scrollTop=Math.max(0,on.offsetTop-al.clientHeight/2+on.offsetHeight/2); }
  function setSlot(s){ if(D.slot===s) return; D.slot=s; saveSoon(); setSlotUI(); renderList(true); }
  function full(){ drawCats(); drawSel(); inp.value=D.v; run(); setSlotUI(); renderList(true); fxPanel(); if(D.cat==='fx') fxFetch(false); }
  inp.addEventListener('input',()=>{ D.v=inp.value; saveSoon(); run(); });
  inp.addEventListener('focus',()=>setSlot('f'));
  q.addEventListener('input',()=>renderList(false));
  root.addEventListener('mousedown',e=>{ if(!e.target.closest('input')) e.preventDefault(); });
  root.addEventListener('click',e=>{
    const r=e.target.closest('.cv-r');
    if(r){ D[D.slot][D.cat]=r.dataset.s; saveSoon(); drawSel(); run(); renderList(false); fxPanel(); return; }
    const b=e.target.closest('button');
    if(b){
      if(b.dataset.c){ D.cat=b.dataset.c; saveSoon(); q.value=''; return full(); }
      if(b.classList.contains('cv-sw')){ const c=D.cat, x=D.f[c]; D.f[c]=D.t[c]; D.t[c]=x; saveSoon(); drawSel(); run(); renderList(true); return fxPanel(); }
      if(b.classList.contains('cv-cp')){ const s=out.textContent; if(s==='—') return; try{ navigator.clipboard.writeText(s).then(()=>toast(t('Skopiowano'))).catch(()=>{}); }catch{} return; }
      if(b.dataset.r){ D.rg=+b.dataset.r; saveSoon(); return fxPanel(); }
      if(b.classList.contains('cv-rt')) return fxFetch(true);
    }
    const row=e.target.closest('.cv-row'); if(row) setSlot(row.dataset.slot);
  });
  wrap.addEventListener('click',e=>{
    if(e.target.closest('.cv-mn')){ wrap.classList.toggle('dopen'); return; }
    if(e.target.closest('.cv-bk')){ wrap.classList.remove('dopen'); return; }
    const b=e.target.closest('.cv-di button'); if(b){ D.cat=b.dataset.c; saveSoon(); q.value=''; wrap.classList.remove('dopen'); full(); } });
  fxBuild(); full();
}

