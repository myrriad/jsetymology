// Source: https://en.wiktionary.org/wiki/Module:etymology_languages/data
// 2020/10/01
LANGCODES.etycodes = (function() {
m = {}


// Albanian varieties


m["aln"] = {
    "canonicalName": "Gheg Albanian",
    "aliases": ["Gheg"],
    "parent": "sq"
}

m["aae"] = {
    "canonicalName": "Arbëresh Albanian",
    "aliases": ["Arbëreshë", "Arbëresh"],
    "parent": "sq"
}

m["aat"] = {
    "canonicalName": "Arvanitika Albanian",
    "aliases": ["Arvanitika"],
    "parent": "sq"
}

m["als"] = {
    "canonicalName": "Tosk Albanian",
    "aliases": ["Tosk"],
    "parent": "sq"
}

// Bantu varieties

m["bnt-cmn"] = {
    "canonicalName": "Common Bantu",
    "parent": "bnt-pro"
}

// Semitic varieties

// Akkadian varieties

m["akk-old"] = {
    "canonicalName": "Old Akkadian",
    "parent": "akk"
}

m["akk-obb"] = {
    "canonicalName": "Old Babylonian",
    "parent": "akk"
}

m["akk-oas"] = {
    "canonicalName": "Old Assyrian",
    "parent": "akk"
}

m["akk-mbb"] = {
    "canonicalName": "Middle Babylonian",
    "parent": "akk"
}

m["akk-mas"] = {
    "canonicalName": "Middle Assyrian",
    "parent": "akk"
}

m["akk-nbb"] = {
    "canonicalName": "Neo-Babylonian",
    "parent": "akk"
}

m["akk-nas"] = {
    "canonicalName": "Neo-Assyrian",
    "parent": "akk"
}

m["akk-lbb"] = {
    "canonicalName": "Late Babylonian",
    "parent": "akk"
}

// Aramaic varieties

m["arc-bib"] = {
    "canonicalName": "Biblical Aramaic",
    "parent": "arc"
}

m["arc-imp"] = {
    "canonicalName": "Imperial Aramaic",
    "aliases": ["Official Aramaic"],
    "parent": "arc"
}

m["arc-hat"] = {
    "canonicalName": "Hatran Aramaic",
    "parent": "arc"
}

m["sem-jar"] = {
    "canonicalName": "Jewish Aramaic",
    "aliases": ["Judeo-Aramaic"],
    "parent": "arc"
}

m["arc-pal"] = {
    "canonicalName": "Palmyrene Aramaic",
    "parent": "arc"
}

m["tmr"] = {
    "canonicalName": "Jewish Babylonian Aramaic",
    "parent": "arc"
}

m["jpa"] = {
    "canonicalName": "Jewish Palestinian Aramaic",
    "aliases": ["Galilean Aramaic"],
    "parent": "arc"
}

// Catalan varieties

m["ca-val"] = {
    "canonicalName": "Valencian",
    "parent": "ca"
}

// Central Nicobarese varieties

m["ncb-cam"] = {
    "canonicalName": "Camorta",
    "aliases": ["Kamorta"],
    "parent": "ncb"
}

m["ncb-kat"] = {
    "canonicalName": "Katchal",
    "aliases": ["Tehnu"],
    "parent": "ncb"
}

m["ncb-nan"] = {
    "canonicalName": "Nancowry",
    "aliases": ["Nankwari"],
    "parent": "ncb"
}

// Chinese varieties

m["och-ear"] = {
    "canonicalName": "Early Old Chinese",
    "parent": "och"
}

m["och-lat"] = {
    "canonicalName": "Late Old Chinese",
    "parent": "och"
}

m["ltc-ear"] = {
    "canonicalName": "Early Middle Chinese",
    "parent": "ltc"
}

m["ltc-lat"] = {
    "canonicalName": "Late Middle Chinese",
    "parent": "ltc"
}

m["cmn-ear"] = {
    "canonicalName": "Early Mandarin",
    "parent": "cmn"
}

m["wuu-sha"] = {
    "canonicalName": "Shanghainese",
    "parent": "wuu"
}

m["hsn-old"] = {
    "canonicalName": "Old Xiang",
    "aliases": ["Lou-Shao"],
    "parent": "hsn"
}

m["zhx-pin"] = {
    "canonicalName": "Pinghua",
    "parent": "yue"
}

m["nan-hai"] = {
    "canonicalName": "Hainanese",
    "parent": "nan"
}

m["nan-hok"] = {
    "canonicalName": "Hokkien",
    "parent": "nan"
}

m["nan-xm"] = {
    "canonicalName": "Amoy",
    "aliases": ["Xiamenese"],
    "parent": "nan-hok"
}

m["nan-zz"] = {
    "canonicalName": "Zhangzhou Hokkien",
    "parent": "nan-hok"
}

m["nan-qz"] = {
    "canonicalName": "Quanzhou Hokkien",
    "parent": "nan-hok"
}

m["nan-jj"] = {
    "canonicalName": "Jinjiang Hokkien",
    "parent": "nan-qz"
}

m["nan-ph"] = {
    "canonicalName": "Philippine Hokkien",
    "parent": "nan-jj"
}

// Coptic varieties

m["cop-akh"] = {
    "canonicalName": "Akhmimic Coptic",
    "aliases": ["Akhmimic"],
    "parent": "cop"
}

m["cop-boh"] = {
    "canonicalName": "Bohairic Coptic",
    "aliases": ["Bohairic", "Memphitic Coptic", "Memphitic"],
    "parent": "cop"
}

m["cop-ggg"] = {
    "canonicalName": "Coptic Dialect G",
    "aliases": ["Dialect G", "Mansuric Coptic", "Mansuric"],
    "parent": "cop"
}

m["cop-jjj"] = {
    "canonicalName": "Coptic Dialect J",
    "parent": "cop"
}

m["cop-kkk"] = {
    "canonicalName": "Coptic Dialect K",
    "parent": "cop"
}

m["cop-ppp"] = {
    "canonicalName": "Coptic Dialect P",
    "aliases": ["Proto-Theban Coptic", "Palaeo-Theban Coptic"],
    "parent": "cop"
}

m["cop-fay"] = {
    "canonicalName": "Fayyumic Coptic",
    "aliases": ["Fayyumic", "Faiyumic Coptic", "Faiyumic", "Fayumic Coptic", "Fayumic",
        "Bashmuric Coptic", "Bashmuric"],
    "parent": "cop"
}

m["cop-her"] = {
    "canonicalName": "Hermopolitan Coptic",
    "aliases": ["Hermopolitan", "Coptic Dialect H", "Ashmuninic", "Ashmuninic Coptic"],
    "parent": "cop"
}

m["cop-lyc"] = {
    "canonicalName": "Lycopolitan Coptic",
    "aliases": [
        "Lycopolitan",
        "Assiutic Coptic", "Asyutic Coptic", "Assiutic", "Asyutic",
        "Lyco-Diospolitan Coptic", "Lyco-Diospolitan",
        "Subakhmimic Coptic", "Subakhmimic"
    ],
    "parent": "cop"
}

m["cop-old"] = {
    "canonicalName": "Old Coptic",
    "parent": "cop"
}

m["cop-oxy"] = {
    "canonicalName": "Oxyrhynchite Coptic",
    "aliases": ["Oxyrhynchite", "Mesokemic Coptic", "Mesokemic", "Middle Egyptian Coptic"],
    "parent": "cop"
}

m["cop-ply"] = {
    "canonicalName": "Proto-Lycopolitan Coptic",
    "aliases": ["Coptic Dialect i", "Proto-Lyco-Diospolitan Coptic"],
    "parent": "cop"
}

m["cop-sah"] = {
    "canonicalName": "Sahidic Coptic",
    "aliases": ["Sahidic", "Saidic Coptic", "Saidic", "Thebaic Coptic", "Thebaic"],
    "parent": "cop"
}

// Egyptian varieties

m["egy-old"] = {
    "canonicalName": "Old Egyptian",
    "parent": "egy"
}

m["egy-mid"] = {
    "canonicalName": "Middle Egyptian",
    "aliases": ["Classical Egyptian"],
    "parent": "egy"
}

m["egy-nmi"] = {
    "canonicalName": "Neo-Middle Egyptian",
    "aliases": ["Égyptien de tradition", "Traditional Egyptian"],
    "parent": "egy"
}

m["egy-lat"] = {
    "canonicalName": "Late Egyptian",
    "parent": "egy"
}

// Elamite varieties

m["elx-old"] = {
    "canonicalName": "Old Elamite",
    "parent": "elx"
}

m["elx-mid"] = {
    "canonicalName": "Middle Elamite",
    "parent": "elx"
}

m["elx-neo"] = {
    "canonicalName": "Neo-Elamite",
    "parent": "elx"
}

m["elx-ach"] = {
    "canonicalName": "Achaemenid Elamite",
    "parent": "elx"
}

// English, Scots and Old English varieties

m["en-GB"] = {
    "canonicalName": "British English",
    "parent": "en"
}
m["British English"] = m["en-GB"]
m["BE."] = m["en-GB"]

m["en-US"] = {
    "canonicalName": "American English",
    "parent": "en"
}
m["American English"] = m["en-US"]
m["AE."] = m["en-US"]

m["en-geo"] = {
    "canonicalName": "Geordie English",
    "parent": "en"
}

// Scots varieties

m["sco-osc"] = {
    "canonicalName": "Early Scots",
    "parent": "enm"
}
m["Early Scots"] = m["sco-osc"]
m["Old Scots"] = m["sco-osc"]
m["O.Sc."] = m["sco-osc"]

m["sco-smi"] = {
    "canonicalName": "Middle Scots",
    "parent": "sco-osc"
}
m["Middle Scots"] = m["sco-smi"]
m["Mid.Sc."] = m["sco-smi"]

m["sco-ins"] = {
    "canonicalName": "Insular Scots",
    "parent": "sco"
}
m["Insular Scots"] = m["sco-ins"]
m["Ins.Sc."] = m["sco-ins"]

m["sco-uls"] = {
    "canonicalName": "Ulster Scots",
    "parent": "sco"
}
m["Ulster Scots"] = m["sco-uls"]
m["Uls.Sc."] = m["sco-uls"]

m["sco-nor"] = {
    "canonicalName": "Northern Scots",
    "parent": "sco"
}
m["Northern Scots"] = m["sco-nor"]
m["Nor.Sc."] = m["sco-nor"]

m["sco-sou"] = {
    "canonicalName": "South Scots",
    "parent": "sco"
}
m["Southern Scots"] = m["sco-sou"]
m["Borders Scots"] = m["sco-sou"]
m["Sou.Sc."] = m["sco-sou"]

// Middle English varieties
m["enm-nor"] = {
    "canonicalName": "Northern Middle English",
    "aliases": ["Northumbrian Middle English"],
    "parent": "enm"
}

// Old English varieties

// Includes both Mercian and Northumbrian.
m["ang-ang"] = {
    "canonicalName": "Anglian Old English",
    "parent": "ang"
}

m["ang-mer"] = {
    "canonicalName": "Mercian Old English",
    "parent": "ang"
}

m["ang-nor"] = {
    "canonicalName": "Northumbrian Old English",
    "parent": "ang"
}

//[[
m["ang-wsx"] = {
    "canonicalName": "West Saxon Old English",
    "parent": "ang"
}



// French and Norman varieties

m["fro-nor"] = {
    "canonicalName": "Old Northern French",
    "aliases": ["Old Norman", "Old Norman French"],
    "parent": "fro"
}
m["Old Northern French"] = m["fro-nor"]
m["ONF."] = m["fro-nor"]

m["fro-pic"] = {
    "canonicalName": "Picard Old French",
    "parent": "fro"
}

m["xno"] = {
    "canonicalName": "Anglo-Norman",
    "parent": "fro"
}

m["fr-CA"] = {
    "canonicalName": "Canadian French",
    "parent": "fr"
}
m["Canadian French"] = m["fr-CA"]
m["CF."] = m["fr-CA"]

m["fr-CH"] = {
    "canonicalName": "Switzerland French",
    "parent": "fr"
}
m["Swiss French"] = m["fr-CH"]
m["Switzerland French"] = m["fr-CH"]

m["fr-aca"] = {
    "canonicalName": "Acadian French",
    "parent": "fr"
}
m["Acadian French"] = m["fr-aca"]
m["fra-aca"] = m["fr-aca"]

m["frc"] = {
    "canonicalName": "Cajun French",
    "aliases": ["Louisiana French"],
    "parent": "fr"
}

// Norman varieties

m["roa-grn"] = {
    "canonicalName": "Guernsey Norman",
    "aliases": ["Guernsey"],
    "parent": "nrf"
}
m["nrf-grn"] = m["roa-grn"]

m["roa-jer"] = {
    "canonicalName": "Jersey Norman",
    "aliases": ["Jersey"],
    "parent": "nrf"
}
m["nrf-jer"] = m["roa-jer"]

// Brythonic

m["bry-ear"] = {
    "canonicalName": "Early Brythonic",
    "parent": "cel-bry-pro"
}

m["bry-lat"] = {
    "canonicalName": "Late Brythonic",
    "parent": "cel-bry-pro"
}

// Gaulish

m["xcg"] = {
    "canonicalName": "Cisalpine Gaulish",
    "parent": "cel-gau"
}

m["xtg"] = {
    "canonicalName": "Transalpine Gaulish",
    "parent": "cel-gau"
}

// Portuguese varieties

m["pt-BR"] = {
    "canonicalName": "Brazilian Portuguese",
    "parent": "pt"
}

// Spanish varieties

m["es-MX"] = {
    "canonicalName": "Mexican Spanish",
    "parent": "es"
}

m["es-US"] = {
    "canonicalName": "United States Spanish",
    "aliases": ["US Spanish"],
    "parent": "es"
}
//use label "US Spanish" to put Spanish terms in this category

// Germanic varieties
// (modern) German varieties

m["de-AT"] = {
    "canonicalName": "Austrian German",
    "parent": "de"
}
m["Austrian German"] = m["de-AT"]
m["AG."] = m["de-AT"]

m["de-AT-vie"] = {
    "canonicalName": "Viennese German",
    "parent": "de-AT"
}
m["Viennese German"] = m["de-AT-vie"]
m["VG."] = m["de-AT-vie"]

m["de-CH"] = {
    "canonicalName": "Swiss High German",
    "aliases": ["Schweizer Hochdeutsch", "Swiss Standard German"],
    "parent": "de"
}

m["ksh"] = {
    "canonicalName": "Kölsch",
    "parent": "gmw-cfr"
}
m["Kölsch"] = m["ksh"]

m["pfl"] = {
    "canonicalName": "Palatine German",
    "aliases": ["Pfälzisch", "Pälzisch", "Palatinate German"],
    "parent": "gmw-rfr"
}

m["sli"] = {
    "canonicalName": "Silesian German",
    "aliases": ["Silesian"],
    "parent": "gmw-ecg"
}

m["sxu"] = {
    "canonicalName": "Upper Saxon",
    "	parent": "gmw-ecg"
}

// Old High German varieties

m["lng"] = {
    "canonicalName": "Lombardic",
    "parent": "goh"
}
m["Lombardic"] = m["lng"]
m["goh-lng"] = m["lng"]

// Proto-West Germanic varieties

m["frk"] = {
    "canonicalName": "Frankish",
    "aliases": ["Old Frankish"],
    "parent": "gmw-pro"
}

// Old Norse varieties

m["non-oen"] = {
    "canonicalName": "Old East Norse",
    "parent": "non"
}

m["non-ogt"] = {
    "canonicalName": "Old Gutnish",
    "aliases": ["Old Gotlandic"],
    "parent": "non"
}

m["non-own"] = {
    "canonicalName": "Old West Norse",
    "parent": "non"
}


// Greek varieties

m["qfa-sub-grc"] = {
    "canonicalName": "Pre-Greek",
    "parent": "qfa-sub"
}
m["pregrc"] = m["qfa-sub-grc"]

m["grc-boi"] = {
    "canonicalName": "Boeotian Greek",
    "parent": "grc-aeo"
}

m["grc-koi"] = {
    "canonicalName": "Koine Greek",
    "aliases": ["Hellenistic Greek"],
    "parent": "grc"
}
m["Koine"] = m["grc-koi"]

m["gkm"] = {
    "canonicalName": "Byzantine Greek",
    "aliases": ["Medieval Greek"],
    "parent": "grc"
}
m["Medieval Greek"] = m["gkm"]

m["grc-dor"] = {
    "canonicalName": "Doric Greek",
    "parent": "grc"
}

m["grc-att"] = {
    "canonicalName": "Attic Greek",
    "parent": "grc"
}

m["grc-ion"] = {
    "canonicalName": "Ionic Greek",
    "parent": "grc"
}

m["grc-pam"] = {
    "canonicalName": "Pamphylian Greek",
    "parent": "grc"
}

m["grc-kre"] = { // code used elsewhere: see [[Module:grc:Dialects
    "canonicalName": "Cretan Ancient Greek", // to distinguish from Cretan Greek below
    "parent": "grc-dor"
}

m["grc-arp"] = {
    "canonicalName": "Arcadocypriot Greek",
    "parent": "grc"
}

m["grc-arc"] = {
    "canonicalName": "Arcadian Greek",
    "parent": "grc-arp"
}

m["el-cyp"] = {
    "canonicalName": "Cypriot Greek",
    "aliases": ["Cypriotic Greek"],
    "parent": "el"
}

m["el-pap"] = {
    "canonicalName": "Paphian Greek",
    "parent": "el"
}

m["grc-aeo"] = {
    "canonicalName": "Aeolic Greek",
    "aliases": ["Lesbic Greek", "Lesbian Greek", "Aeolian Greek"],
    "parent": "grc"
}

m["loc-ozo"] = {
    "canonicalName": "Ozolian Locrian",
    "parent": "grc"
}

m["loc-opu"] = {
    "canonicalName": "Opuntian Locrian",
    "parent": "grc"
}

m["grc-ths"] = {
    "canonicalName": "Thessalian Greek",
    "parent": "grc-aeo"
}

m["grc-ela"] = {
    "canonicalName": "Elean Greek",
    "parent": "grc"
}

m["grc-epc"] = {
    "canonicalName": "Epic Greek",
    "aliases": ["Homeric Greek"],
    "parent": "grc"
}

m["el-crt"] = {
    "canonicalName": "Cretan Greek",
    "parent": "el"
}


// Hebrew varieties

m["hbo"] = {
    "canonicalName": "Biblical Hebrew",
    "aliases": ["Classical Hebrew"],
    "parent": "he"
}

m["he-IL"] = {
    "canonicalName": "Modern Israeli Hebrew",
    "parent": "he"
}

m["he-mis"] = {
    "canonicalName": "Mishnaic Hebrew",
    "parent": "he"
}

m["bsh-kat"] = {
    "canonicalName": "Kativiri",
    "aliases": ["Katə́viri"],
    "parent": "bsh"
}

m["bsh-kam"] = {
    "canonicalName": "Kamviri",
    "aliases": ["Kamvíri"],
    "parent": "bsh"
}
m["xvi"] = m["bsh-kam"]

m["bsh-mum"] = {
    "canonicalName": "Mumviri",
    "aliases": ["Mumvíri"],
    "parent": "bsh"
}

// Iranian varieties:

m["qfa-sub-bma"] = {
    "canonicalName": "the BMAC substrate",
    "parent": "qfa-sub"
}

// Historical and current Iranian dialects

m["ae-old"] = {
    "canonicalName": "Old Avestan",
    "aliases": ["Gathic Avestan"],
    "parent": "ae"
}

m["ae-yng"] = {
    "canonicalName": "Younger Avestan",
    "aliases": ["Young Avestan"],
    "parent": "ae-old"
}

m["bcc"] = {
    "canonicalName": "Southern Balochi",
    "aliases": ["Southern Baluchi"],
    "parent": "bal"
}
m["bal-sou"] = m["bcc"]

m["bgp"] = {
    "canonicalName": "Eastern Balochi",
    "aliases": ["Eastern Baluchi"],
    "parent": "bal"
}
m["bal-eas"] = m["bgp"]

m["bgn"] = {
    "canonicalName": "Western Balochi",
    "aliases": ["Western Baluchi"],
    "parent": "bal"
}
m["bal-wes"] = m["bgn"]

m["bgn"] = {
    "canonicalName": "Western Balochi",
    "aliases": ["Western Baluchi"],
    "parent": "bal"
}

m["bsg-ban"] = {
    "canonicalName": "Bandari",
    "parent": "bsg"
}

m["bsg-bas"] = {
    "canonicalName": "Bashkardi",
    "parent": "bsg"
}

m["bsg-hor"] = {
    "canonicalName": "Hormozi",
    "parent": "bsg"
}

m["bsg-min"] = {
    "canonicalName": "Minabi",
    "parent": "bsg"
}

m["ira-mid"] = {
    "canonicalName": "Middle Iranian",
    "parent": "ira"
}
m["MIr."] = m["ira-mid"]

m["ira-old"] = {
    "canonicalName": "Old Iranian",
    "parent": "ira"
}
m["OIr."] = m["ira-old"]

m["kho-old"] = {
    "canonicalName": "Old Khotanese",
    "parent": "kho"
}

m["kho-lat"] = {
    "canonicalName": "Late Khotanese",
    "parent": "kho-old"
}

m["peo-ear"] = {
    "canonicalName": "Early Old Persian",
    "parent": "peo"
}

m["peo-lat"] = {
    "canonicalName": "Late Old Persian",
    "parent": "peo"
}

m["pal-ear"] = {
    "canonicalName": "Early Middle Persian",
    "parent": "pal"
}

m["pal-lat"] = {
    "canonicalName": "Late Middle Persian",
    "parent": "pal"
}

m["ps-nwe"] = {
    "canonicalName": "Northwestern Pashto",
    "parent": "ps"
}

m["ps-cgi"] = {
    "canonicalName": "Central Ghilzay",
    "parent": "ps-nwe"
}

m["ps-mah"] = {
    "canonicalName": "Mahsudi",
    "parent": "ps-nwe"
}

m["ps-nea"] = {
    "canonicalName": "Northeastern Pashto",
    "parent": "ps"
}

m["ps-afr"] = {
    "canonicalName": "Afridi",
    "parent": "ps-nea"
}

m["ps-bng"] = {
    "canonicalName": "Bangash",
    "parent": "ps-nea"
}


m["ps-xat"] = {
    "canonicalName": "Khatak",
    "parent": "ps-nea"
}

m["ps-pes"] = {
    "canonicalName": "Peshawari",
    "parent": "ps-nea"
}

m["ps-sea"] = {
    "canonicalName": "Southeastern Pashto",
    "parent": "ps"
}

m["ps-ban"] = {
    "canonicalName": "Bannu",
    "parent": "ps-sea"
}

m["ps-kak"] = {
    "canonicalName": "Kakari",
    "parent": "ps-sea"
}

m["ps-ser"] = {
    "canonicalName": "Sher",
    "parent": "ps-sea"
}

m["ps-waz"] = {
    "canonicalName": "Waziri",
    "parent": "ps-sea"
}

m["ps-swe"] = {
    "canonicalName": "Southwestern Pashto",
    "parent": "ps"
}

m["ps-kan"] = {
    "canonicalName": "Kandahari",
    "parent": "ps-swe"
}

m["ps-jad"] = {
    "canonicalName": "Jadrani",
    "parent": "ps"
}

m["xme-azr"] = {
    "canonicalName": "Old Azari",
    "aliases": ["Azari", "Azeri", "Āḏarī", "Adari", "Adhari"],
    "aliases": ["Old Azeri"],
    "parent": "xme-ott"
}

m["xme-ttc-cen"] = {
    "canonicalName": "Central Tati",
    "parent": "xme-ott"
}

m["xme-ttc-eas"] = {
    "canonicalName": "Eastern Tati",
    "parent": "xme-ott"
}

m["xme-ttc-nor"] = {
    "canonicalName": "Northern Tati",
    "parent": "xme-ott"
}

m["xme-ttc-sou"] = {
    "canonicalName": "Southern Tati",
    "parent": "xme-ott"
}

m["xme-ttc-wes"] = {
    "canonicalName": "Western Tati",
    "parent": "xme-ott"
}

m["xmn"] = {
    "canonicalName": "Manichaean Middle Persian",
    "parent": "pal"
}

m["fa-ira"] = {
    "canonicalName": "Iranian Persian",
    "aliases": ["Modern Persian"],
    "parent": "fa"
}

m["fa-cls"] = {
    "canonicalName": "Classical Persian",
    "parent": "fa"
}

m["prs"] = {
    "canonicalName": "Dari",
    "aliases": ["Dari Persian", "Eastern Persian", "Afghan Persian"],
    "parent": "fa"
}

m["os-dig"] = {
    "canonicalName": "Digor",
    "aliases": ["Digoron"],
    "parent": "os"
}

m["os-iro"] = {
    "canonicalName": "Iron",
    "parent": "os"
}

m["sog-ear"] = {
    "canonicalName": "Early Sogdian",
    "parent": "sog"
}

m["sog-lat"] = {
    "canonicalName": "Late Sogdian",
    "parent": "sog-ear"
}

m["oru-kan"] = {
    "canonicalName": "Kaniguram",
    "parent": "oru"
}

m["oru-log"] = {
    "canonicalName": "Logar",
    "parent": "oru"
}

m["oos-ear"] = {
    "canonicalName": "Early Old Ossetic",
    "parent": "oos"
}

m["oos-lat"] = {
    "canonicalName": "Late Old Ossetic",
    "parent": "oos"
}

m["xln"] = {
    "canonicalName": "Alanic",
    "parent": "oos"
}

m["rdb-rud"] = {
    "canonicalName": "Rudbari",
    "parent": "rdb"
}

m["rdb-jir"] = {
    "canonicalName": "Jirofti",
    "parent": "rdb"
}

m["rdb-kah"] = {
    "canonicalName": "Kahnuji",
    "parent": "rdb"
}

// Southwestern Fars lects

m["fay-bur"] = {
    "canonicalName": "Burenjani",
    "parent": "fay"
}

m["fay-bsh"] = {
    "canonicalName": "Bushehri",
    "parent": "fay"
}

m["fay-dsh"] = {
    "canonicalName": "Dashtaki",
    "parent": "fay"
}

m["fay-dav"] = {
    "canonicalName": "Davani",
    "parent": "fay"
}

m["fay-eze"] = {
    "canonicalName": "Emamzada Esma’ili",
    "parent": "fay"
}

m["fay-gav"] = {
    "canonicalName": "Gavkoshaki",
    "parent": "fay"
}

m["fay-kho"] = {
    "canonicalName": "Khollari",
    "parent": "fay"
}

m["fay-kon"] = {
    "canonicalName": "Kondazi",
    "parent": "fay"
}

m["fay-kzo"] = {
    "canonicalName": "Old Kazeruni",
    "parent": "fay"
}

m["fay-mas"] = {
    "canonicalName": "Masarami",
    "parent": "fay"
}

m["fay-pap"] = {
    "canonicalName": "Papuni",
    "parent": "fay"
}

m["fay-sam"] = {
    "canonicalName": "Samghani",
    "parent": "fay"
}

m["fay-shr"] = {
    "canonicalName": "Shirazi",
    "parent": "fay"
}

m["fay-sho"] = {
    "canonicalName": "Old Shirazi",
    "parent": "fay"
}

m["fay-sam"] = {
    "canonicalName": "Samghani",
    "parent": "fay"
}

m["fay-kar"] = {
    "canonicalName": "Khargi",
    "parent": "fay"
}

m["fay-sor"] = {
    "canonicalName": "Sorkhi",
    "parent": "fay"
}

// Talysh lects

m["tly-cen"] = {
    "canonicalName": "Central Talysh",
    "parent": "tly"
}

m["tly-asa"] = {
    "canonicalName": "Asalemi",
    "parent": "tly-cen"
}

m["tly-kar"] = {
    "canonicalName": "Karganrudi",
    "parent": "tly-cen"
}

m["tly-tul"] = {
    "canonicalName": "Tularudi",
    "parent": "tly-cen"
}

m["tly-tal"] = {
    "canonicalName": "Taleshdulabi",
    "parent": "tly-cen"
}

m["tly-nor"] = {
    "canonicalName": "Northern Talysh",
    "parent": "tly"
}

m["tly-aze"] = {
    "canonicalName": "Azerbaijani Talysh",
    "parent": "tly-nor"
}

m["tly-anb"] = {
    "canonicalName": "Anbarani",
    "parent": "tly-nor"
}

m["tly-sou"] = {
    "canonicalName": "Southern Talysh",
    "parent": "tly"
}

m["tly-fum"] = {
    "canonicalName": "Fumani",
    "parent": "tly-sou"
}

m["tly-msu"] = {
    "canonicalName": "Masulei",
    "parent": "tly-sou"
}

m["tly-msa"] = {
    "canonicalName": "Masali",
    "parent": "tly-sou"
}

m["tly-san"] = {
    "canonicalName": "Shandarmani",
    "parent": "tly-sou"
}

// Tafreshi lects

m["xme-amo"] = {
    "canonicalName": "Amorehi",
    "parent": "xme-taf"
}

m["xme-ast"] = {
    "canonicalName": "Ashtiani",
    "parent": "xme-taf"
}
m["atn"] = m["xme-ast"]

m["xme-bor"] = {
    "canonicalName": "Borujerdi",
    "parent": "xme-taf"
}

m["xme-ham"] = {
    "canonicalName": "Hamadani",
    "parent": "xme-taf"
}

m["xme-kah"] = {
    "canonicalName": "Kahaki",
    "parent": "xme-taf"
}

m["xme-vaf"] = {
    "canonicalName": "Vafsi",
    "parent": "xme-taf"
}
m["vaf"] = m["xme-vaf"]

// Kermanic lects

m["xme-xun"] = {
    "canonicalName": "Khunsari",
    "parent": "xme-ker"
}
m["kfm"] = m["xme-xun"]

m["xme-mah"] = {
    "canonicalName": "Mahallati",
    "parent": "xme-ker"
}

m["xme-von"] = {
    "canonicalName": "Vonishuni",
    "parent": "xme-ker"
}

m["xme-bdr"] = {
    "canonicalName": "Badrudi",
    "parent": "xme-ker"
}

m["xme-del"] = {
    "canonicalName": "Delijani",
    "parent": "xme-ker"
}

m["xme-kas"] = {
    "canonicalName": "Kashani",
    "parent": "xme-ker"
}

m["xme-kes"] = {
    "canonicalName": "Kesehi",
    "parent": "xme-ker"
}

m["xme-mey"] = {
    "canonicalName": "Meymehi",
    "parent": "xme-ker"
}

m["xme-nat"] = {
    "canonicalName": "Natanzi",
    "parent": "xme-ker"
}
m["ntz"] = m["xme-nat"]

m["xme-abz"] = {
    "canonicalName": "Abuzeydabadi",
    "parent": "xme-ker"
}

m["xme-aby"] = {
    "canonicalName": "Abyanehi",
    "parent": "xme-ker"
}

m["xme-far"] = {
    "canonicalName": "Farizandi",
    "parent": "xme-ker"
}

m["xme-jow"] = {
    "canonicalName": "Jowshaqani",
    "parent": "xme-ker"
}

m["xme-nas"] = {
    "canonicalName": "Nashalji",
    "parent": "xme-ker"
}

m["xme-qoh"] = {
    "canonicalName": "Qohrudi",
    "parent": "xme-ker"
}

m["xme-yar"] = {
    "canonicalName": "Yarandi",
    "parent": "xme-ker"
}

m["xme-soi"] = {
    "canonicalName": "Soi",
    "aliases": ["Sohi"],
    "parent": "xme-ker"
}
m["soj"] = m["xme-soi"]

m["xme-tar"] = {
    "canonicalName": "Tari",
    "parent": "xme-ker"
}

m["xme-gaz"] = {
    "canonicalName": "Gazi",
    "parent": "xme-ker"
}
m["gzi"] = m["xme-gaz"]

m["xme-sed"] = {
    "canonicalName": "Sedehi",
    "parent": "xme-ker"
}

m["xme-ard"] = {
    "canonicalName": "Ardestani",
    "parent": "xme-ker"
}

m["xme-zef"] = {
    "canonicalName": "Zefrehi",
    "parent": "xme-ker"
}

m["xme-isf"] = {
    "canonicalName": "Isfahani",
    "parent": "xme-ker"
}

m["xme-kaf"] = {
    "canonicalName": "Kafroni",
    "parent": "xme-ker"
}

m["xme-vrz"] = {
    "canonicalName": "Varzenehi",
    "parent": "xme-ker"
}

m["xme-xur"] = {
    "canonicalName": "Khuri",
    "parent": "xme-ker"
}

m["xme-nay"] = {
    "canonicalName": "Nayini",
    "parent": "xme-ker"
}
m["nyq"] = m["xme-nay"]

m["xme-ana"] = {
    "canonicalName": "Anaraki",
    "parent": "xme-ker"
}

m["xme-dar"] = {
    "canonicalName": "Zoroastrian Dari",
    "aliases": ["Behdināni", "Gabri", "Gavrŭni", "Gabrōni"],
    "parent": "xme-ker"
}
m["gbz"] = m["xme-dar"]

m["xme-krm"] = {
    "canonicalName": "Kermani",
    "parent": "xme-ker"
}

m["xme-yaz"] = {
    "canonicalName": "Yazdi",
    "parent": "xme-ker"
}

m["xme-bid"] = {
    "canonicalName": "Bidhandi",
    "parent": "xme-ker"
}

m["xme-bij"] = {
    "canonicalName": "Bijagani",
    "parent": "xme-ker"
}

m["xme-cim"] = {
    "canonicalName": "Chimehi",
    "parent": "xme-ker"
}

m["xme-han"] = {
    "canonicalName": "Hanjani",
    "parent": "xme-ker"
}

m["xme-kom"] = {
    "canonicalName": "Komjani",
    "parent": "xme-ker"
}

m["xme-nar"] = {
    "canonicalName": "Naraqi",
    "parent": "xme-ker"
}

m["xme-nus"] = {
    "canonicalName": "Nushabadi",
    "parent": "xme-ker"
}

m["xme-qal"] = {
    "canonicalName": "Qalhari",
    "parent": "xme-ker"
}

m["xme-trh"] = {
    "canonicalName": "Tarehi",
    "parent": "xme-ker"
}

m["xme-val"] = {
    "canonicalName": "Valujerdi",
    "parent": "xme-ker"
}

m["xme-var"] = {
    "canonicalName": "Varani",
    "parent": "xme-ker"
}

m["xme-zor"] = {
    "canonicalName": "Zori",
    "parent": "xme-ker"
}

// Ramandi lects

m["tks-ebr"] = {
    "canonicalName": "Ebrahimabadi",
    "parent": "tks"
}

m["tks-sag"] = {
    "canonicalName": "Sagzabadi",
    "parent": "tks"
}

m["tks-esf"] = {
    "canonicalName": "Esfarvarini",
    "parent": "tks"
}

m["tks-tak"] = {
    "canonicalName": "Takestani",
    "parent": "tks"
}

m["tks-cal"] = {
    "canonicalName": "Chali",
    "parent": "tks"
}

m["tks-dan"] = {
    "canonicalName": "Danesfani",
    "parent": "tks"
}

m["tks-xia"] = {
    "canonicalName": "Khiaraji",
    "parent": "tks"
}

m["tks-xoz"] = {
    "canonicalName": "Khoznini",
    "parent": "tks"
}

// Shughni dialects

m["sgh-bro"] = {
    "canonicalName": "Bartangi-Oroshori",
    "parent": "sgh"
}

m["sgh-bar"] = {
    "canonicalName": "Bartangi",
    "parent": "sgh-bro"
}

m["sgh-oro"] = {
    "canonicalName": "Oroshori",
    "parent": "sgh-bro",
    "aliases": ["Roshorvi"]
}

m["sgh-rsx"] = {
    "canonicalName": "Roshani-Khufi",
    "parent": "sgh"
}

m["sgh-xuf"] = {
    "canonicalName": "Khufi",
    "parent": "sgh-rsx"
}

m["sgh-ros"] = {
    "canonicalName": "Roshani",
    "parent": "sgh-rsx"
}

m["sgh-xgb"] = {
    "canonicalName": "Khughni-Bajui",
    "parent": "sgh"
}

m["sgh-xug"] = {
    "canonicalName": "Khughni",
    "parent": "sgh-xgb"
}

m["sgh-baj"] = {
    "canonicalName": "Bajui",
    "parent": "sgh-xgb"
}

// Indo-Aryan varieties

m["inc-mit"] = {
    "canonicalName": "Mitanni",
    "parent": "inc-pro"
}

m["awa-old"] = {
    "canonicalName": "Old Awadhi",
    "parent": "awa"
}

m["bra-old"] = {
    "canonicalName": "Old Braj",
    "parent": "bra"
}

m["gu-kat"] = {
    "canonicalName": "Kathiyawadi",
    "aliases": ["Kathiyawadi Gujarati", "Kathiawadi"],
    "parent": "gu"
}

m["gu-lda"] = {
    "canonicalName": "Lisan ud-Dawat Gujarati",
    "aliases": ["Lisan ud-Dawat", "LDA"],
    "parent": "gu"
}

m["hi-mum"] = {
    "canonicalName": "Bombay Hindi",
    "aliases": ["Mumbai Hindi", "Bambaiyya Hindi"],
    "parent": "hi"
}

m["hi-mid"] = {
    "canonicalName": "Middle Hindi",
    "parent": "hi"
}

m["pa-old"] = {
    "canonicalName": "Old Punjabi",
    "parent": "pa"
}

m["sa-bhs"] = {
    "canonicalName": "Buddhist Hybrid Sanskrit",
    "parent": "sa"
}

m["sa-bra"] = {
    "canonicalName": "Brahmanic Sanskrit",
    "parent": "sa"
}

m["sa-cls"] = {
    "canonicalName": "Classical Sanskrit",
    "parent": "sa"
}

m["sa-neo"] = {
    "canonicalName": "New Sanskrit",
    "parent": "sa"
}

m["sa-ved"] = {
    "canonicalName": "Vedic Sanskrit",
    "parent": "sa"
}

m["si-med"] = {
    "canonicalName": "Medieval Sinhalese",
    "aliases": ["Medieval Sinhala"],
    "parent": "si"
}

m["kok-mid"] = {
    "canonicalName": "Middle Konkani",
    "aliases": ["Medieval Konkani"],
    "parent": "kok"
}

m["kok-old"] = {
    "canonicalName": "Old Konkani",
    "aliases": ["Early Konkani"],
    "parent": "kok"
}


// Indian subcontinent languages


// Dhivehi varieties

m["mlk-dv"] = {
    "canonicalName": "Mulaku Dhivehi",
    "aliases": ["Mulaku Divehi", "Mulaku Bas"],
    "parent": "dv"
}

m["hvd-dv"] = {
    "canonicalName": "Huvadhu Dhivehi",
    "aliases": ["Huvadhu Divehi", "Huvadhu Bas"],
    "parent": "dv"
}

m["add-dv"] = {
    "canonicalName": "Addu Dhivehi",
    "aliases": ["Addu Divehi", "Addu Bas"],
    "parent": "dv"
}

// Dravidian varieties

m["ta-mid"] = {
    "canonicalName": "Middle Tamil",
    "parent": "ta"
}

// Prakrits

m["prk-avt"] = {
    "canonicalName": "Avanti",
    "aliases": ["Avanti Prakrit"],
    "parent": "sa"
}

m["prc-prk"] = {
    "canonicalName": "Pracya",
    "aliases": ["Pracya Prakrit"],
    "parent": "sa"
}

m["bhl-prk"] = {
    "canonicalName": "Bahliki",
    "aliases": ["Bahliki Prakrit"],
    "parent": "sa"
}

m["dks-prk"] = {
    "canonicalName": "Daksinatya",
    "aliases": ["Daksinatya Prakrit"],
    "parent": "sa"
}

m["skr-prk"] = {
    "canonicalName": "Sakari",
    "aliases": ["Sakari Prakrit"],
    "parent": "sa"
}

m["cnd-prk"] = {
    "canonicalName": "Candali",
    "aliases": ["Candali Prakrit"],
    "parent": "sa"
}

m["sbr-prk"] = {
    "canonicalName": "Sabari",
    "aliases": ["Sabari Prakrit"],
    "parent": "sa"
}

m["abh-prk"] = {
    "canonicalName": "Abhiri",
    "aliases": ["Abhiri Prakrit"],
    "parent": "sa"
}

m["drm-prk"] = {
    "canonicalName": "Dramili",
    "aliases": ["Dramili Prakrit"],
    "parent": "sa"
}

m["odr-prk"] = {
    "canonicalName": "Odri",
    "aliases": ["Odri Prakrit"],
    "parent": "sa"
}


// Italian, Latin and other Italic varieties

m["it-oit"] = {
    "canonicalName": "Old Italian",
    "parent": "it"
}
m["roa-oit"] = m["it-oit"]

m["it-CH"] = {
    "canonicalName": "Switzerland Italian",
    "parent": "it",
}
m["Swiss Italian"] = m["it-CH"]
m["Switzerland Italian"] = m["it-CH"]

// Latin varieties by period

m["la-lat"] = {
    "canonicalName": "Late Latin",
    "parent": "la"
}
m["Late Latin"] = m["la-lat"]
m["LL."] = m["la-lat"]
m["LL"] = m["la-lat"]

m["la-vul"] = {
    "canonicalName": "Vulgar Latin",
    "parent": "la"
}
m["Vulgar Latin"] = m["la-vul"]
m["VL."] = m["la-vul"]

m["la-med"] = {
    "canonicalName": "Medieval Latin",
    "parent": "la"
}
m["Medieval Latin"] = m["la-med"]
m["ML."] = m["la-med"]
m["ML"] = m["la-med"]

m["la-ecc"] = {
    "canonicalName": "Ecclesiastical Latin",
    "aliases": ["Church Latin"],
    "parent": "la"
}
m["Ecclesiastical Latin"] = m["la-ecc"]
m["EL."] = m["la-ecc"]

m["la-ren"] = {
    "canonicalName": "Renaissance Latin",
    "parent": "la"
}
m["Renaissance Latin"] = m["la-ren"]
m["RL."] = m["la-ren"]

m["la-new"] = {
    "canonicalName": "New Latin",
    "aliases": ["Modern Latin"],
    "parent": "la"
}
m["New Latin"] = m["la-new"]
m["NL."] = m["la-new"]

// other Italic lects

m["osc-luc"] = {
    "canonicalName": "Lucanian",
    "parent": "osc"
}

m["osc-sam"] = {
    "canonicalName": "Samnite",
    "parent": "osc"
}

m["xum-her"] = {
    "canonicalName": "Hernician",
    "parent": "xum"
}


// Malay and related varieties

m["ms-old"] = {
    "canonicalName": "Old Malay",
    "parent": "ms"
}

m["ms-cla"] = {
    "canonicalName": "Classical Malay",
    "parent": "ms"
}

m["pse-bsm"] = {
    "canonicalName": "Besemah",
    "parent": "pse"
}

m["bew-kot"] = {
    "canonicalName": "Betawi Kota",
    "parent": "bew"
}

m["bew-ora"] = {
    "canonicalName": "Betawi Ora",
    "parent": "bew"
}

m["bew-udi"] = {
    "canonicalName": "Betawi Udik",
    "parent": "bew"
}


// Mongolic lects

m["xng-ear"] = {
    "canonicalName": "Early Middle Mongolian",
    "parent": "xng"
}

m["xng-lat"] = {
    "canonicalName": "Late Middle Mongolian",
    "parent": "xng"
}

m["mn-kha"] = {
    "canonicalName": "Khalkha Mongolian",
    "aliases": ["Khalkha"],
    "parent": "mn"
}

m["mn-ord"] = {
    "canonicalName": "Ordos Mongolian",
    "aliases": ["Ordos"],
    "parent": "mn"
}

m["mn-cha"] = {
    "canonicalName": "Chakhar Mongolian",
    "aliases": ["Chakhar"],
    "parent": "mn"
}

m["mn-khr"] = {
    "canonicalName": "Khorchin Mongolian",
    "aliases": ["Khorchin"],
    "parent": "mn"
}

m["mjg-huz"] = {
    "canonicalName": "Mongghul",
    "aliases": ["Huzhu Monguor"],
    "parent": "mjg"
}

m["mjg-min"] = {
    "canonicalName": "Mangghuer",
    "aliases": ["Minhe Monguor"],
    "parent": "mjg"
}

// Japanese varieties

m["ja-mid"] = {
    "canonicalName": "Middle Japanese",
    "parent": "ojp"
}

m["ja-mid-ear"] = {
    "canonicalName": "Early Middle Japanese",
    "parent": "ja-mid"
}

m["ja-mid-lat"] = {
    "canonicalName": "Late Middle Japanese",
    "parent": "ja-mid"
}

m["ja-ear"] = {
    "canonicalName": "Early Modern Japanese",
    "parent": "ja"
}

// Korean varieties

m["ko-ear"] = {
    "canonicalName": "Early Modern Korean",
    "parent": "ko"
}

m["okm-ear"] = {
    "canonicalName": "Early Middle Korean",
    "parent": "okm"
}

// Occitan varieties

m["oc-auv"] = {
    "canonicalName": "Auvergnat",
    "aliases": ["Auvernhat", "Auvergnese"],
    "parent": "oc"
}

m["oc-gas"] = {
    "canonicalName": "Gascon",
    "parent": "oc"
}

// standardized dialect of Gascon
m["oc-ara"] = {
    "canonicalName": "Aranese",
    "parent": "oc-gas"
}

m["oc-lan"] = {
    "canonicalName": "Languedocien",
    "aliases": ["Lengadocian"],
    "parent": "oc"
}

m["oc-lim"] = {
    "canonicalName": "Limousin",
    "parent": "oc"
}

m["oc-pro"] = {
    "canonicalName": "Provençal",
    "aliases": ["Provencal"],
    "parent": "oc"
}

m["prv"] = m["oc-pro"]

m["oc-viv"] = {
    "canonicalName": "Vivaro-Alpine",
    "parent": "oc"
}

m["oc-jud"] = {
    "canonicalName": "Shuadit",
    "aliases": [
        "Chouhadite", "Chouhadit", "Chouadite", "Chouadit", "Shuhadit",
        "Judeo-Occitan", "Judæo-Occitan", "Judaeo-Occitan",
        "Judeo-Provençal", "Judæo-Provençal", "Judaeo-Provençal",
        "Judeo-Provencal", "Judaeo-Provencal",
        "Judeo-Comtadin", "Judæo-Comtadin", "Judaeo-Comtadin",
    ],
    "parent": "oc"
}

// Phillipine varieties

m["tl-old"] = {
    "canonicalName": "Old Tagalog",
    "parent": "tl"
}

m["tl-cls"] = {
    "canonicalName": "Classical Tagalog",
    "parent": "tl"
}


// Pre-Roman substrates

m["qfa-sub-ibe"] = {
    "canonicalName": "a pre-Roman substrate of Iberia",
    "parent": "qfa-sub"
}

m["qfa-sub-bal"] = {
    "canonicalName": "a pre-Roman substrate of the Balkans",
    "parent": "qfa-sub"
}

// Sardinian varieties

m["sc-src"] = {
    "canonicalName": "Logudorese",
    "aliases": ["Logudorese Sardinian"],
    "parent": "sc"
}

m["sc-nuo"] = {
    "canonicalName": "Nuorese",
    "aliases": ["Nuorese Sardinian"],
    "parent": "sc-src"
}

m["sc-sro"] = {
    "canonicalName": "Campidanese",
    "aliases": ["Campidanese Sardinian"],
    "parent": "sc"
}

// Rwanda-Rundi varieties

m["rw-kin"] = {
    "canonicalName": "Kinyarwanda",
    "aliases": ["Rwanda"],
    "parent": "rw"
}

m["rw-run"] = {
    "canonicalName": "Kirundi",
    "aliases": ["Rundi"],
    "parent": "rw"
}

// Slavic varieties

m["cs-ear"] = {
    "canonicalName": "Early Modern Czech",
    "parent": "cs"
}

m["zle-oru"] = {
    "canonicalName": "Old Russian",
    "parent": "orv"
}

m["zle-obe"] = {
    "canonicalName": "Old Belarusian",
    "parent": "orv"
}

m["zle-ouk"] = {
    "canonicalName": "Old Ukrainian",
    "parent": "orv"
}

//// Serbo-Croatian varieties

m["sh-cha"] = {
    "canonicalName": "Chakavian Serbo-Croatian",
    "aliases": ["Čakavian"],
    "parent": "sh"
}

m["ckm"] = m["sh-cha"] // ISO 639-3 code

m["sh-kaj"] = {
    "canonicalName": "Kajkavian Serbo-Croatian",
    "parent": "sh"
}

m["kjv"] = m["sh-kaj"] // ISO 639-3 code

m["sh-tor"] = { // Linguist code srp-tor
    "canonicalName": "Torlakian Serbo-Croatian",
    "aliases": ["Torlak"],
    "parent": "sh"
}

// Turkic lects

m["trk-cmn"] = {
    "canonicalName": "Common Turkic",
    "parent": "trk-pro"
}

m["trk-ogz-pro"] = {
    "canonicalName": "Proto-Oghuz",
    "aliases": ["Southwestern Common Turkic"],
    "parent": "trk-pro"
}

m["otk-kir"] = {
    "canonicalName": "Old Kirghiz",
    "parent": "otk"
}

m["klj-arg"] = {
    "canonicalName": "Arghu",
    "parent": "klj"
}

m["qwm-arm"] = {
    "canonicalName": "Armeno-Kipchak",
    "parent": "qwm"
}

m["qwm-mam"] = {
    "canonicalName": "Mamluk-Kipchak",
    "parent": "qwm"
}

// Other lects

m["alv-kro"] = {
    "canonicalName": "Kromanti",
    "parent": "crp"
}

m["bat-pro"] = {
    "canonicalName": "Proto-Baltic",
    "parent": "ine-bsl-pro"
}

m["es-lun"] = {
    "canonicalName": "Lunfardo",
    "parent": "es"
}
m["Lunfardo"] = m["es-lun"]

m["fiu-pro"] = {
    "canonicalName": "Proto-Finno-Ugric",
    "parent": "urj-pro"
}

m["gem-sue"] = {
    "canonicalName": "Suevic",
    "aliases": ["Suebian"],
    "parent": "gmw"
}

m["mkh-okm-A"] = {
    "canonicalName": "Angkorian Old Khmer",
    "parent": "mkh-okm"
}

m["mkh-okm-P"] = {
    "canonicalName": "Pre-Angkorian Old Khmer",
    "parent": "mkh-okm"
}

m["mul-tax"] = {
    "canonicalName": "taxonomic name",
    "parent": "mul"
}
m["Tax."] = m["mul-tax"]

m["qfa-pyg"] = {
    "canonicalName": "a substrate language originally spoken by the Pygmies",
    "parent": "qfa-sub"
}
m["pygmy"] = m["qfa-pyg"]

m["tai-shz"] = {
    "canonicalName": "Shangsi Zhuang",
    "parent": "za"
}

m["tbq-pro"] = {
    "canonicalName": "Proto-Tibeto-Burman",
    "parent": "sit-pro"
}

m["und-idn"] = {
    "canonicalName": "Idiom Neutral",
    "parent": "und" // or "vo"
}

m["und-tdl"] = {
    "canonicalName": "Turduli",
    "parent": "und"
}

m["und-tdt"] = {
    "canonicalName": "Turdetani",
    "parent": "und"
}

m["und-xbi"] = {
    "canonicalName": "Xianbei",
    "parent": "und"
}

m["und-xnu"] = {
    "canonicalName": "Xiongnu",
    "parent": "und"
}

m["urj-fpr-pro"] = {
    "canonicalName": "Proto-Finno-Permic",
    "parent": "urj-pro"
}

m["woy"] = {
    "canonicalName": "Weyto",
    "parent": "und"
}
return m;
})();