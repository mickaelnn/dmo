const fs = require('fs');
const path = '/sessions/great-elegant-cori/mnt/dmo/public/dunit.json';
const raw = `Agumon (Classic)|Greymon|MetalGreymon|WarGreymon|VictoryGreymon|Omnimon|Omegamon - Merciful Mode
BlackAgumon|BlackGreymon|BlackMetalGreymon|BlackWarGreymon|Omegamon Zwart|Omegamon Zwart D
BlackAgumon|DarkTyrannomon|MetalTyrannomon|Machinedramon|Millenniummon|Moon Millenniumon|ZeedMillenniummon
Arkadimon (Rookie)|Arkadimon (Champion)|Arkadimon (Ultimate)|Arkadimon (Mega)
Armadillomon|Ankylomon|Shakkoumon|Vikemon|Submarimon
Bearmon|Grizzlymon|GrapLeomon|DinoTigermon|BanchouLeomon|Marsmon
Betamon|Seadramon|MegaSeadramon|MetalSeadramon|GigaSeadramon|Apocalymon
Biyomon|Birdramon|Garudamon|Phoenixmon|Ornismon
Candlemon|Wizardmon|Mystimon|Dynasmon
CommanDramon|SealsDramon|TankDramon|DarkDramon|Chaosmon
DemiDevimon|Bakemon|Pumpkinmon|Boltmon
DemiDevimon|Devimon|Myotismon|VenomMyotismon|MaloMyotismon|Boltboutamon
DemiDevimon|Soulmon|Phantomon|Piedmon|ChaosPiedmon|Apocalymon|Boltboutamon
DemiMeramon|Meramon|SkullMeramon|Boltmon|Gankoomon
Deputymon|SuperStarmon|Justimon|Fujinmon
Dobermon|Cerberumon|Anubismon
Doggymon|Cerberumon|Anubismon
Dokunemon|Dokugumon|Archnemon|Parasimon
Dorumon|DexDorugamon|DexDoruGreymon|DexDorugoramon|Dexmon
Dorumon|Dorugamon|DoruGreymon|Dorugoramon
Dorumon|ReptileDramon|Grademon|Alphamon|Alphamon Ouryuken
Dracmon|Sangloupmon|Matadormon|GranDracmon
Dracomon|Coredramon (Blue)|Wingdramon|Slayerdramon|Examon
Dracomon|Coredramon (Green)|Groundramon|Brakedramon|Examon
Drimogemon|Digmon
Giromon|HiAndromon|Craniamon
Elecmon|Leomon|Panjyamon|SaberLeomon|BanchouLeomon|Chaosmon
FanBeemon|Waspmon|CannonBeemon|TigerVespamon
Gabumon|Garurumon|WereGarurumon|MetalGarurumon|Z'dGarurumon|Omnimon
BlackGabumon|BlackGarurumon|BlackWereGarurumon|BlackMetalGarurumon|Omegamon Zwart|Omegamon Zwart D
Gazimon|Deltamon|Chimairamon|Millenniummon|Moon Millenniumon|ZeedMillenniummon
Gazimon|Devidramon|Mephismon|Gulfmon
Goblimon|Ogremon|Etemon|MetalEtemon|KingEtemon
Gomamon|Ikkakumon|Zudomon|Vikemon|Plesiomon|Aegisdramon|RustTyrannomon
Gotsumon|Icemon|Meteormon|MetalEtemon|KingEtemon
Guilmon|Growlmon|WarGrowlmon|Gallantmon|Gallantmon (Crimson Mode)|Gallantmon (Shin)|Gallantmon (Crimson Mode) (Awaken)
Hagurumon|Gardromon|Andromon|HiAndromon|Craniamon
Hagurumon|MechaNorimon|Megadramon|Machinedramon|Chaosdramon|Apocalymon
Hawkmon|Aquilamon|Silphymon|Phoenixmon|Valdurmon|Halsemon|Toucanmon|Flybeemon
Impmon|IceDevimon|SkullSatamon|Beelzemon|Beelzemon (Blast Mode)|Beelzemon (Blast Mode) (Awaken)
Kamemon|Gwappamon|Shawujingmon|JumboGamemon
Keramon|Chrysalimon|Infermon|Diablomon|Armageddemon
Kiwimon|Shinduramon
Blossommon|Gryphonmon
Kokuwamon|Thundermon|Mamemon|BigMamemon|PrinceMamemon
Kotemon|Gladimon|Knightmon|LordKnightmon
Kotemon|Musyamon|Asuramon|Zanbamon
Kunemon|Flymon|Okuwamon|GranKuwagamon
Lopmon|Wendigomon|Antylamon|Cherubimon
Turuiemon|Antylamon (Deva)|Cherubimon (White)
Monodramon|Strikedramon|Cyberdramon|Justimon|Fujinmon
Mushroomon|Woodmon|Argomon (Ultimate)|Argomon (Mega)
Otamamon|Gekomon|ShogunGekomon|Pukumon
Palmon|Togemon|Lillymon|MarineAngemon
Palmon|Woodmon|Cherrymon|Puppetmon|AncientTroiamon|Apocalymon
Patamon|Angemon|MagnaAngemon|Seraphimon|ShadowSeraphimon|Pegasusmon
PawnChessmon (Black)|KnightChessmon (Black)|RookChessmon|QueenChessmon
Psychemon|Astamon|Belphemon (Sleep Mode)|Belphemon (Rage Mode)
Renamon|Kyuubimon|Taomon|Sakuyamon|Kuzuhamon|Sakuyamon (Awaken)|Kuzuhamon - Miko Mode
Ryuudamon|GinRyuumon|HisyaRyuumon|OuRyuumon|Alphamon Ouryuken
Salamon|BlackGatomon|LadyDevimon|Minervamon|Mervamon|Mastemon|Jet Mervamon|Xros Up Mervamon
Salamon|Gatomon|Angewomon|MagnaDramon|Ophanimon|Ophanimon Falldown Mode|Mastemon|Ordinemon|Nefertimon
Sharmamon|Apemon|Mammothmon|SkullMammothmon
Starmon|SuperStarmon|Justimon|Fujinmon
Swimmon|Tylomon|Whamon|Neptunemon
Syakomon|Gesomon|MarineDevimon|Leviamon
Tentomon|Kabuterimon|MegaKabuterimon|HerculesKabuterimon|TyrantKabuterimon
Tanemon|Tanemon (Champion)|Tanemon (Ultimate)|Tanemon (Mega)
Terriermon|Gargomon|Rapidmon|MegaGargomon|BlackMegaGargomon|MegaGargomon (Awaken)
ToyAgumon (Rookie)|ToyAgumon (Ultimate)
Tsukaimon|Devimon|NeoDevimon|Daemon|Daemon (Beast Mode)
Tsukaimon|Devimon|SkullSatamon|Murmukusmon
Veemon|ExV-mon|Paildramon|Imperialdramon (Dragon Mode)|Imperialdramon (Fighter Mode)|Imperialdramon (Paladin Mode)|Raidramon|Yasyamon
Veemon|Veedramon|AeroVeedramon|UlforceVeedramon|Flamedramon|Magnamon|Gargoylemon
Wormmon|Stingmon|JewelBeemon|GrandisKuwagamon
Azulongmon (Champion)|Azulongmon (Mega)|Fanglongmon|Fanglongmon (Shin)
Baihumon (Champion)|Baihumon (Mega)|Fanglongmon|Fanglongmon (Shin)
Ebonwumon (Champion)|Ebonwumon (Mega)|Fanglongmon|Fanglongmon (Shin)
Zhuqiaomon (Champion)|Zhuqiaomon (Mega)|Fanglongmon|Fanglongmon (Shin)
BlackAgumon|BlackGreymon|BlackMetalGreymon|BlitzGreymon|Omegamon Alter-S|Omegamon Alter-B
Gabumon|Garurumon|WereGarurumon|CresGarurumon|Omegamon Alter-S|Omegamon Alter-B
Gizumon AT|Gizumon XT
Gomamon|Mojyamon|Piximon|Jijimon
Guilmon|Growlmon|WarGrowlmon|ChaosGallantmon|Megidramon
Impmon|IceDevimon|Baalmon|Beelzemon (C)|Xros Up Mervamon
Kudamon|Reppamon|Chirinmon|Kentaurosmon
Lucemon|Lucemon Falldown Mode|Lucemon (Satan Mode)|Lucemon (Satan Mode) (Shin)|Lucemon Larva
PawnChessmon (White)|KnightChessmon (White)|BishopChessmon|KingChessmon
Salamon|Mikemon|Persiamon|Lilithmon
Tsukaimon|Witchmon|Bastemon|Barbamon
Armadillomon|Ankylomon|Shakkoumon|Vikemon|Shakkoumon (Jogress)|SlashAngemon|Digmon (Armor)
Patamon|Angemon|MagnaAngemon|Seraphimon|ShadowSeraphimon|Shakkoumon (Jogress)|SlashAngemon
Hawkmon|Aquilamon|Silphymon|Phoenixmon|Valdurmon|Silphymon (Jogress)|Valkyrimon|Allomon|Shurimon
Salamon|Gatomon|Angewomon|MagnaDramon|Ophanimon|Silphymon (Jogress)|Valkyrimon|Goatmon
Veemon|ExV-mon|Paildramon (Jogress)|Imperialdramon (Dragon Mode)(Jogress)|Imperialdramon (Fighter Mode)(Jogress)|Imperialdramon (Paladin Mode)(Jogress)
Wormmon|Stingmon|Paildramon (Jogress)|Imperialdramon (Dragon Mode)(Jogress)|Imperialdramon (Fighter Mode)(Jogress)|Imperialdramon (Paladin Mode)(Jogress)
Elecmon|Leomon|GrapLeomon|Duftmon
Raremon|Raremon
Hackmon|BaoHackmon|SaviorHackmon|Jesmon
Palmon|Togemon|Lillymon|Rosemon (Original)|Rafflesimon
Floramon|Vegiemon|Blossomon|Lotusmon|Rafflesimon
Meicoomon|Meicrackmon: Vicious Mode|Raguelmon|Ordinemon
Gizamon|DarkTyrannomon|MetalTyrannomon|Machinedramon|RustTyrannomon
Gammamon|BetelGammamon|Canoweissmon|Siriusmon
Jellymon|Tesla Jellymon|Thetismon|Amphimon
Angoramon|SymbareAngoramon|Lamortmon|Diarbbitmon
Ukkomon
Ballistamon|Ballistamon (Mega)|Shoutmon X2|Shoutmon X3|Shoutmon X4|Shoutmon X5
Dorulumon|Dorulumon (Mega)|Shoutmon X3|Shoutmon X4|Shoutmon X5
Greymon (2010)|Greymon (2010) (Mega)|MetalGreymon (C)|ZekeGreymon|Shoutmon DX|Shoutmon X7|Shoutmon X7 Superior Mode
MailBirdramon|MailBirdramon (Mega)|MetalGreymon (C)|ZekeGreymon|Shoutmon DX|Shoutmon X7|Shoutmon X7 Superior Mode
Shoutmon|OmegaShoutmon|Shoutmon (Mega)|Shoutmon X2|Shoutmon X3|Shoutmon X4|Shoutmon X5|Shoutmon DX|Shoutmon X7|Shoutmon X7 Superior Mode
Starmons|Starmons (Mega)|Shoutmon X4|Shoutmon X5
Sparrowmon|Sparrowmon (Mega)|Shoutmon X5|Jet Mervamon
KaiserGreymon|Susanoomon|Susanoomon (Shin)
Agnimon|Vritramon
Arbormon|Petaldramon
Chakkumon|Blizzarmon
Fairimon|Shutsmon
Grotmon|Gigasmon
MagnaGarurumon|Susanoomon|Susanoomon (Shin)
Wolfmon|Garmmon
Blitzmon|Bolgmon
Loweemon|JägerLöwemon
Mercurymon|Sephirotmon
Ranamon|Calmaramon
Gabumon X|Garurumon X|WereGarurumon X|MetalGarurumon X|Omegamon X
Agumon X|Greymon X|MetalGreymon X|WarGreymon X|Gaioumon|Omegamon X
Ryudamon (X-Antibody System)|GinRyumon (X-Antibody System)|HisyaRyumon (X-Antibody System)|OuRyumon (X-Antibody System)|Alphamon Ouryuken (X-Antibody System)|Alphamon Ouryuken (Awaken)
Dorumon (X-Antibody System)|ReptileDramon (X-Antibody System)|Grademon (X-Antibody System)|Alphamon (X-Antibody System)|Alphamon Ouryuken (X-Antibody System)|Alphamon Ouryuken (Awaken)
Dorumon (X-Antibody System)|DexDorugamon (X-Antibody System)|DexDoruGreymon (X-Antibody System)|DexDorugoramon (X-Antibody System)|Dexmon (X-Antibody System)
Dorumon (X-Antibody System)|Dorugamon (X-Antibody System)|DoruGreymon (X-Antibody System)|Dorugoramon (X-Antibody System)
Dracmon (X-Antibody System)|Sangloupmon (X-Antibody System)|Matadormon (X-Antibody System)|GranDracmon (X-Antibody System)
FanBeemon (X-Antibody System)|Waspmon (X-Antibody System)|CannonBeemon (X-Antibody System)|TigerVespamon (X-Antibody System)
DinoTigermon (X-Antibody System)
Guilmon X|Growlmon X|WarGrowlmon X|Gallantmon X|MedievalGallantmon
Magnamon X
Duftmon X
GigaSeadramon X
Dynasmon X
UlforceVeedramon X
GrandisKuwagamon (X-Antibody System)
Jesmon X
Sleipmon X
Beelzemon X
Craniamon X
Megidramon X
Palmon X|Togemon X|Lillymon X|Rosemon X
LordKnightmon X
Chaosdramon X
Minervamon X
Examon X
Lilithmon X
Barbamon X
Demon X
Gankoomon X
Apocalymon (Psychic)
Armageddemon (Conflation)
Ogudomon
Agumon|GeoGreymon|RizeGreymon|ShineGreymon|ShineGreymon (Burst Mode)
Gaomon|Gaogamon|MachGaogamon|MirageGaogamon|MirageGaogamon (Burst Mode)
Lalamon|SunFlowmon|Lilamon|Rosemon|Rosemon (Burst Mode)
Falcomon|Peckmon|Crowmon|Ravemon|Ravemon (Burst Mode)`;

const rows = raw.split('\n').map(l => l.split('|').map(s => s.trim()));
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
if (rows.length !== data.lines.length) {
  console.error('ABORT: rows', rows.length, 'lines', data.lines.length);
  process.exit(1);
}
data.lines.forEach((line, i) => {
  line.rookie = rows[i][0];
  line.forms = rows[i];
});
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('OK merged', rows.length, 'rows');
