/* ZBEUL : cinq jeux de plus — Qui de nous ?, Mot commun, Le menteur, Échelle, Bombe à mots.
   Chargé juste après le script principal de index.html : réutilise ses fonctions et son état
   (names, show, setTheme, passPhone, remoteAsk, onlineIds, addPts, stat…). Écrans, styles et
   tuiles sont injectés ici pour ne pas toucher au reste de la page. */
(function(){
"use strict";

/* ================= CONTENU ================= */
const QD={
 chill:["Qui survivrait le moins longtemps dans un film d'horreur ?","Qui a le pire sens de l'orientation ?","Qui passe le plus de temps sur son téléphone ?","Qui deviendrait célèbre en premier ?","Qui oublie toujours les anniversaires ?","Qui serait le meilleur président ?","Qui pourrait manger n'importe quoi ?","Qui serait le premier à paniquer pendant une panne de courant ?","Qui a la pire playlist ?","Qui raconte les pires blagues ?","Qui ferait le meilleur prof ?","Qui finirait dans une téléréalité ?","Qui serait éliminé en premier à Koh-Lanta ?","Qui a le plus de chances de gagner au loto et de tout perdre en un an ?","Qui est toujours en retard ?","Qui pleure devant les dessins animés ?","Qui parle le plus fort ?","Qui a le plus de photos inutiles dans sa galerie ?","Qui deviendrait millionnaire avec une idée débile ?","Qui serait le meilleur parent ?","Qui ne survivrait pas une semaine sans internet ?","Qui pourrait vivre dans la nature sans rien ?","Qui ferait le pire colocataire ?","Qui serait le meilleur espion ?","Qui croit encore à des trucs bizarres ?","Qui cuisine le moins bien ?","Qui a le plus de chances de se marier en premier ?","Qui s'endort toujours en premier en soirée ?","Qui serait capable d'adopter dix chats ?","Qui envoie les vocaux les plus longs ?","Qui a le meilleur style ?","Qui serait le meilleur influenceur ?","Qui se perdrait dans un IKEA ?","Qui est le plus mauvais perdant ?","Qui rit à ses propres blagues ?","Qui a le plus de chances de devenir prof de yoga ?","Qui a le meilleur rire ?","Qui serait le dernier survivant d'une apocalypse zombie ?","Qui donne les pires conseils ?","Qui serait capable de partir vivre à l'autre bout du monde demain ?"],
 piquant:["Qui finirait en garde à vue ce soir ?","Qui a le plus d'ex ?","Qui stalke encore son ex ?","Qui a déjà menti à quelqu'un ici ce soir ?","Qui envoie des messages dont il a honte le lendemain ?","Qui serait le pire à garder un secret ?","Qui a le plus de crushs en même temps ?","Qui finirait marié à Las Vegas sans s'en souvenir ?","Qui est le plus jaloux ?","Qui ghoste le plus ?","Qui pourrait trahir le groupe pour 1 000 € ?","Qui a la pire réputation en soirée ?","Qui serait capable de séduire n'importe qui ici ?","Qui ment le mieux ?","Qui a l'historique de recherche le plus inavouable ?","Qui finit toujours par vomir en soirée ?","Qui a le plus de dossiers sur les autres ?","Qui serait le plus mauvais en couple ?","Qui se remettrait avec son ex ce soir s'il pouvait ?","Qui a déjà dragué quelqu'un de ce groupe ?","Qui fait semblant d'être occupé pour éviter les gens ?","Qui serait le premier à balancer tout le monde à la police ?","Qui a le pire goût en matière de crush ?","Qui like des photos de 2016 par erreur ?","Qui serait le plus dangereux avec un compte bancaire illimité ?","Qui a le plus de chances de finir en story chez quelqu'un d'autre ce soir ?","Qui a déjà dit « je t'aime » trop vite ?","Qui parle dans le dos de tout le monde ?","Qui serait le gourou d'une secte ?","Qui ferait n'importe quoi pour de la vue sur TikTok ?","Qui finit toujours la soirée en after ?","Qui a la tête de quelqu'un qui cache quelque chose ?","Qui serait le pire témoin de mariage ?","Qui a déjà fait semblant d'être malade pour éviter une soirée ?","Qui pourrait coucher avec quelqu'un juste pour une histoire à raconter ?"]
};
QD.mix=QD.chill.concat(QD.piquant);

const MC=["Un fruit","Une couleur","Un animal de la ferme","Un pays d'Europe","Une marque de voiture","Un légume","Un super-héros","Un sport","Un instrument de musique","Une boisson","Un dessin animé","Un métier","Une ville de France","Un plat qu'on mange au Mcdo","Une marque de téléphone","Un réseau social","Un prénom de chien","Un truc qu'on emporte à la plage","Un fromage","Un dessert","Un personnage Disney","Un truc rouge","Un truc qui pique","Un truc qu'on trouve dans une salle de bain","Un jeu vidéo","Un chanteur ou une chanteuse française","Une série Netflix","Un mot qui rime avec « soirée »","Un insecte","Un signe du zodiaque","Un moyen de transport","Une pièce de la maison","Un vêtement d'hiver","Un parfum de glace","Une matière à l'école","Un animal de la savane","Un pokémon","Un truc qu'on fait le dimanche","Un objet dans une trousse","Une marque de vêtements","Un pays où on rêve de partir","Une fête de l'année","Un truc qui fait peur","Un emoji","Un mot d'amour","Un footballeur","Une appli","Une capitale","Un fast-food","Une planète","Une partie du corps","Un truc qu'on oublie toujours en partant","Une excuse pour être en retard","Un cocktail","Un truc qu'on fait en soirée","Un prénom des années 90","Un film culte","Un truc jaune","Une épice","Un oiseau","Un poisson","Un outil","Une arme de film d'action","Un monument célèbre","Une couleur de cheveux","Un truc qu'on achète chez Ikea","Un personnage de Harry Potter","Un dinosaure","Un plat de grand-mère","Un mot en anglais que tout le monde utilise"];

const MT=["Le pire job que tu as fait ?","Ton surnom quand tu étais petit ?","Le premier concert que tu as vu ?","Ta pire coupe de cheveux ?","Le plat que tu détestes le plus ?","Ton premier téléphone ?","Le pays le plus loin où tu es allé ?","Ta plus grosse blessure ?","Le dernier truc que tu as acheté en ligne ?","Ton film préféré quand tu avais 10 ans ?","La célébrité que tu as déjà croisée ?","Ton talent caché ?","Le pire cadeau que tu as reçu ?","Ta phobie la plus bizarre ?","Le métier dont tu rêvais petit ?","La pire honte de ta vie en un mot ?","Ton premier crush célèbre ?","Le dernier rêve dont tu te souviens ?","Ta pire note à l'école, et dans quelle matière ?","Le truc le plus cher que tu as cassé ?","Ton animal de compagnie d'enfance ?","Le dernier livre que tu as lu ?","Le sport que tu as fait le plus longtemps ?","La chose la plus bizarre que tu as mangée ?","Ton premier compte sur un réseau social, c'était quoi ?","L'appli que tu ouvres le plus ?","La dernière fois que tu as pleuré, c'était pour quoi ?","Ton pire date en un mot ?","Le truc illégal le plus grave que tu as fait ?","La chanson que tu écoutes en boucle en secret ?","Ton plus gros mensonge à tes parents ?","Le prénom de ton premier amour ?","Ton record de jours sans te doucher ?","Ton plus long trajet en voiture ?","La personne célèbre à qui on t'a déjà comparé ?","Le pire objet que tu as perdu ?","Ton déguisement le plus marquant ?","Ta pire chute en public ?","Le dernier truc qui t'a fait rire aux larmes ?","Le plat que tu cuisines le mieux ?","Le jeu vidéo sur lequel tu as passé le plus d'heures ?","Ta pire dispute pour un truc débile ?","La plus grosse somme que tu as dépensée d'un coup ?","Ton premier boulot d'été ?","Le trajet le plus long que tu as fait à pied ?","Le pire endroit où tu as dormi ?","Ton plat de cantine préféré ?","Un truc que tu collectionnais petit ?"];

const EC=[["Nul","Génial"],["Pas cher","Hors de prix"],["Sain","Super gras"],["Facile","Impossible"],["Gênant","Stylé"],["Inutile","Indispensable"],["Ringard","Tendance"],["Calme","Chaos total"],["Romantique","Pas du tout romantique"],["Effrayant","Rassurant"],["Moche","Magnifique"],["Lent","Rapide"],["Dégoûtant","Délicieux"],["Enfant","Adulte"],["Méconnu","Ultra célèbre"],["Triste","Joyeux"],["Ennuyeux","Passionnant"],["Ville","Campagne"],["Petit","Énorme"],["Doux","Piquant"],["Débutant","Expert"],["Froid","Chaud"],["Overrated","Underrated"],["Sobre","Bourré"],["Red flag","Green flag"],["Mauvais film","Chef-d'œuvre"],["Faux","Vrai"],["Mal payé","Bien payé"],["Rare","Partout"],["Bruyant","Silencieux"],["Gentil","Méchant"],["Dangereux","Sans danger"],["Ancien","Moderne"],["Pour les filles","Pour les garçons"],["Fragile","Indestructible"],["Inoubliable","Oubliable"],["Normal","Bizarre"],["Mauvaise idée","Bonne idée"],["Vieux jeu","Gen Z"],["Pas sexy","Très sexy"],["Chill","Stressant"],["Mauvais cadeau","Cadeau parfait"],["Bon le premier jour","Bon après dix ans"],["Talent inutile","Super-pouvoir"],["Mauvaise excuse","Excuse parfaite"],["Fait maison","Industriel"],["À éviter en date","Parfait en date"],["Bas de gamme","Luxe"],["Pas drôle","Hilarant"],["Mou","Dur"],["Sain d'esprit","Complètement fou"],["Peu de gens l'aiment","Tout le monde l'aime"],["Hiver","Été"],["Mauvais prénom de bébé","Super prénom de bébé"]];

const BM=["Marques de voitures","Pays","Fruits","Légumes","Animaux","Prénoms de filles","Prénoms de garçons","Villes de France","Super-héros","Sports","Métiers","Instruments de musique","Personnages Disney","Pokémon","Footballeurs","Chanteurs et chanteuses","Séries","Films","Couleurs","Boissons","Desserts","Fromages","Marques de vêtements","Applis","Jeux vidéo","Choses dans une cuisine","Choses dans une salle de bain","Parties du corps","Vêtements","Capitales","Insectes","Oiseaux","Poissons et animaux marins","Moyens de transport","Mots en anglais","Plats","Épices et condiments","Objets de bureau","Choses rondes","Choses qui volent","Choses qui piquent","Choses froides","Choses vertes","Choses qu'on trouve à la plage","Choses qu'on fait en soirée","Mots qui finissent par « -tion »","Mots qui commencent par « pro »","Mots qui commencent par « B »","Mots qui commencent par « M »","Mots de 3 lettres","Personnages de dessins animés","Fast-foods et chaînes","Rappeurs","Acteurs et actrices","Planètes et trucs de l'espace","Monuments","Émissions de télé","Outils","Armes de films","Gros mots gentils","Insultes de cour de récré","Signes du zodiaque","Matières à l'école","Marques de téléphones","Réseaux sociaux","Dinosaures","Personnages de Harry Potter","Choses qu'on met dans un sac","Fêtes et célébrations","Danses","Jeux de société","Pâtes et plats italiens"];

/* ================= STYLES ================= */
const css=`
/* thèmes des nouveaux jeux */
body[data-game=qd]{--ground:#2A0B45;--on-ground:#FFE7F7;--paper:#FFF4FB;--ink:#22062F;--pink:#FF4FA3;--blue:#6A4CFF;--mint:#3EE8B5;--violet:#B266FF;--muted:#6D4B7D;--shadow:#FF4FA3;
  background-image:radial-gradient(circle at 50% -10%,rgba(255,79,163,.45),transparent 55%),radial-gradient(circle at 0% 100%,rgba(106,76,255,.35),transparent 50%)}
body[data-game=qd] .btn,body[data-game=qd] .big,body[data-game=qd] h2{font-family:"Righteous",sans-serif}
body[data-game=mc]{--ground:#0D5C63;--on-ground:#E6FFF8;--paper:#F2FFFB;--ink:#082D31;--pink:#FFB547;--blue:#2F80ED;--mint:#3DDC97;--violet:#8E7DFF;--muted:#3C6E71;--shadow:#082D31;
  background-image:radial-gradient(circle,rgba(255,255,255,.12) 1.5px,transparent 1.6px);background-size:22px 22px}
body[data-game=mc] .btn,body[data-game=mc] .big,body[data-game=mc] h2{font-family:"Alfa Slab One",serif;font-weight:400}
body[data-game=mt]{--ground:#2B1206;--on-ground:#FBE9D0;--paper:#FFF6E6;--ink:#2B1206;--pink:#F2542D;--blue:#127475;--mint:#7DCE82;--violet:#A35DCB;--muted:#7A5A3A;--shadow:#F2542D;
  background-image:radial-gradient(ellipse at 50% -20%,rgba(255,214,120,.55),transparent 50%),repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 60px)}
body[data-game=mt] .btn,body[data-game=mt] .big,body[data-game=mt] h2{font-family:"Special Elite",monospace;font-weight:400}
body[data-game=ec]{--ground:#DCEBFF;--on-ground:#0F1B3D;--paper:#FFFFFF;--ink:#0F1B3D;--pink:#FF5D73;--blue:#3366FF;--mint:#25C39A;--violet:#7A5CFF;--muted:#4C5B80;--shadow:#3366FF;
  background-image:linear-gradient(90deg,rgba(51,102,255,.12) 1px,transparent 1px);background-size:10% 100%}
body[data-game=ec] .btn,body[data-game=ec] .big,body[data-game=ec] h2{font-family:"Bungee",sans-serif;font-weight:400}
body[data-game=bm]{--ground:#141414;--on-ground:#FFE9D6;--paper:#FFF3E8;--ink:#141414;--pink:#FF3B1F;--blue:#FF8A00;--mint:#FFD23F;--violet:#FF3B1F;--muted:#6E5B4E;--shadow:#FF3B1F;
  background-image:repeating-linear-gradient(45deg,rgba(255,210,63,.07) 0 18px,transparent 18px 36px)}
body[data-game=bm] .btn,body[data-game=bm] .big,body[data-game=bm] h2{font-family:"Bungee",sans-serif;font-weight:400}
body[data-game=bm] .btn.alt{background:var(--paper)}
/* tuiles */
.tile[data-g=qd]{background:#2A0B45;color:#FFE7F7;transform:rotate(1deg);box-shadow:5px 5px 0 #FF4FA3;background-image:radial-gradient(circle at 85% 20%,rgba(255,79,163,.6) 0 16px,transparent 17px)}
.tile[data-g=qd] .t{font-family:"Righteous",sans-serif}
.tile[data-g=mc]{background:#0D5C63;color:#E6FFF8;transform:rotate(-1deg);box-shadow:5px 5px 0 #FFB547}
.tile[data-g=mc] .t{font-family:"Alfa Slab One",serif}
.tile[data-g=mt]{background:#2B1206;color:#FBE9D0;transform:rotate(-1deg);box-shadow:5px 5px 0 #F2542D;background-image:radial-gradient(ellipse at 50% -30%,rgba(255,214,120,.55),transparent 60%)}
.tile[data-g=mt] .t{font-family:"Special Elite",monospace}
.tile[data-g=ec]{background:#DCEBFF;color:#0F1B3D;transform:rotate(1deg);box-shadow:5px 5px 0 #3366FF;background-image:linear-gradient(90deg,#FF5D73,#FFD23F,#25C39A);background-size:100% 8px;background-repeat:no-repeat;background-position:bottom}
.tile[data-g=ec] .t{font-family:"Bungee",sans-serif}
.tile[data-g=bm]{background:#141414;color:#FFE9D6;box-shadow:5px 5px 0 #FF3B1F;background-image:repeating-linear-gradient(45deg,rgba(255,210,63,.12) 0 12px,transparent 12px 24px)}
.tile[data-g=bm] .t{font-family:"Bungee",sans-serif}
#tiles .tile[data-g=bm]{grid-column:1/-1;min-height:0}
#home .tile[data-g=qd]{animation-delay:.42s}#home .tile[data-g=mc]{animation-delay:.49s}#home .tile[data-g=mt]{animation-delay:.56s}#home .tile[data-g=ec]{animation-delay:.63s}#home .tile[data-g=bm]{animation-delay:.7s}
/* réponses secrètes */
.zxin{display:flex;flex-direction:column;gap:10px;grid-column:1/-1}
.zxin input[type=text]{width:100%}
.zxrange{width:100%;height:44px;margin:0;accent-color:var(--pink);cursor:pointer;touch-action:manipulation}
.zxrange::-webkit-slider-thumb{width:34px;height:34px}
.zxlbl{display:flex;justify-content:space-between;gap:10px;font-weight:800;font-size:13px}
.zxlbl span:last-child{text-align:right}
.zxval{font-family:var(--display);font-size:46px;line-height:1;text-align:center;font-variant-numeric:tabular-nums}
.zxst{display:flex;flex-direction:column;gap:6px}
.zxst .li b{font-size:13px}
.zxsm{border:2px solid var(--ink);border-radius:10px;background:var(--paper);color:var(--ink);font-weight:800;font-size:13px;padding:6px 10px;flex:none}
/* échelle */
.ecbar{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:3px}
.ecbar>div{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0}
.ecbar .n{width:100%;text-align:center;font-family:var(--display);font-size:15px;border:2px solid var(--ink);border-radius:8px;padding:4px 0;background:var(--paper);color:var(--ink)}
.ecbar .hit .n{background:var(--mint)}.ecbar .near .n{background:#FFE58A}.ecbar .tg .n{background:var(--pink);color:#fff;transform:scale(1.12)}
.ecbar .g{font-size:18px;line-height:1.05;text-align:center;word-break:break-all}
.ecgrad{height:12px;border-radius:99px;border:2px solid var(--ink);background:linear-gradient(90deg,#FF5D73,#FFD23F,#25C39A)}
/* mot commun */
.mcgrp{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.mcg{border:3px solid var(--ink);border-radius:14px;background:var(--paper);color:var(--ink);padding:10px;text-align:left;display:flex;flex-direction:column;gap:4px;min-width:0}
.mcg b{font-size:18px;overflow-wrap:anywhere}.mcg small{color:var(--muted);font-weight:600;font-size:12px}
.mcg.match{background:var(--mint)}.mcg.sel{outline:4px solid var(--pink);outline-offset:2px}
/* bombe */
.bmzone{min-height:calc(100vh - 170px);display:flex;flex-direction:column;gap:14px}
.bmtheme{font-family:var(--display);font-size:clamp(28px,8.5vw,44px);line-height:1.05;text-align:center;text-wrap:balance;color:var(--ink);overflow-wrap:anywhere}
.bmpass{flex:1;min-height:220px;border:5px solid var(--ink);border-radius:28px;background:radial-gradient(circle at 50% 40%,#FF6A3D,#FF3B1F 60%,#B81800);color:#fff;font-family:"Bungee",sans-serif;font-size:clamp(30px,10vw,52px);box-shadow:0 10px 0 #000;touch-action:manipulation;-webkit-user-select:none;user-select:none}
.bmpass:active{transform:translateY(6px);box-shadow:0 4px 0 #000}
.bmpass small{display:block;font-family:var(--body);font-size:15px;font-weight:700;opacity:.9;margin-top:6px}
@keyframes bmShake{0%,100%{transform:none}20%{transform:translate(-6px,3px) rotate(-1deg)}40%{transform:translate(6px,-3px) rotate(1deg)}60%{transform:translate(-4px,2px)}80%{transform:translate(4px,-2px)}}
@keyframes bmFlash{0%{background:#fff}100%{background:var(--ground)}}
body.bmboom{animation:bmFlash .6s ease-out}
.bmboom .wrap{animation:bmShake .5s linear 2}
.bmbig{font-size:clamp(70px,24vw,120px);text-align:center;line-height:1}
@media (prefers-reduced-motion:reduce){body.bmboom,.bmboom .wrap{animation:none}}
`;
document.head.appendChild(Object.assign(document.createElement("style"),{textContent:css}));

/* ================= ÉCRANS ================= */
const rules=(items)=>`<details class="rules"><summary class="label" style="cursor:pointer">Les règles en 20 secondes</summary><ol>${items.map(x=>`<li>${x}</li>`).join("")}</ol></details>`;
const drinkRow=(id,txt)=>`<div class="setting"><div><b>Mode gorgées</b><small>${txt}</small></div><button type="button" class="toggle" id="${id}" aria-pressed="false" aria-label="Activer le mode gorgées"></button></div>`;
const play=(g)=>`<section id="${g}-play" class="scr" hidden><button class="back" type="button" data-go="${g}-setup">← Réglages</button><div class="card" id="${g}Box"></div><div class="card" id="${g}ScoreCard" hidden><div class="label">Scores</div><div class="list" id="${g}Scores"></div></div></section>`;
const html=`
<section id="qd-setup" class="scr" hidden>
  <button class="back" type="button" data-go="home">← Menu</button>
  <div class="card">
    <h2>Qui de nous ?</h2>
    <p class="hint">Une question tombe. Chacun vote en secret pour la personne du groupe qui colle le mieux. Le résultat s'affiche d'un coup.</p>
    <div class="label">Ambiance</div>
    <div class="seg" id="qdMode"><button type="button" data-m="chill" aria-pressed="true">Chill</button><button type="button" data-m="piquant">Piquant</button><button type="button" data-m="mix">Mix</button></div>
    ${drinkRow("qdDrink","Le plus désigné boit une gorgée par voix")}
    <p id="qdErr" class="err" hidden></p>
    <button id="qdStart" class="btn" type="button">C'est parti</button>
    ${rules(["Une question s'affiche : « Qui de nous… ? ».","Chacun vote en secret, sur son téléphone ou en se passant le tel.","On peut voter pour soi.","Le résultat tombe d'un coup. Le plus désigné se justifie (ou boit)."])}
  </div>
</section>
${play("qd")}
<section id="mc-setup" class="scr" hidden>
  <button class="back" type="button" data-go="home">← Menu</button>
  <div class="card">
    <h2>Mot commun</h2>
    <p class="hint">Un thème tombe. Chacun écrit un mot en secret. Tu marques si quelqu'un d'autre a écrit le même mot que toi.</p>
    <div class="label">Manches</div>
    <div class="seg" id="mcRounds"><button type="button" data-n="5">5</button><button type="button" data-n="8" aria-pressed="true">8</button><button type="button" data-n="12">12</button></div>
    ${drinkRow("mcDrink","Ceux qui tombent seuls boivent une gorgée")}
    <p id="mcErr" class="err" hidden></p>
    <button id="mcStart" class="btn" type="button">C'est parti</button>
    ${rules(["Un thème s'affiche, par exemple « Un fruit ».","Chacun écrit un seul mot, sans le montrer.","+1 point pour chaque autre joueur qui a écrit le même mot que toi.","Deux mots qui veulent dire la même chose ? L'hôte peut les fusionner."])}
  </div>
</section>
${play("mc")}
<section id="mt-setup" class="scr" hidden>
  <button class="back" type="button" data-go="home">← Menu</button>
  <div class="card">
    <h2>Le menteur</h2>
    <p class="hint">Tout le monde répond à une question perso. Un joueur tiré au sort en secret doit inventer sa réponse. Le groupe doit le démasquer.</p>
    <div class="label">Manches</div>
    <div class="seg" id="mtRounds"><button type="button" data-n="3">3</button><button type="button" data-n="5" aria-pressed="true">5</button><button type="button" data-n="8">8</button></div>
    ${drinkRow("mtDrink","Menteur démasqué : 2 gorgées. Sinon, ceux qui se sont trompés boivent.")}
    <p id="mtErr" class="err" hidden></p>
    <button id="mtStart" class="btn" type="button">C'est parti</button>
    ${rules(["Une question perso s'affiche.","Chacun répond en secret. Le menteur, lui, invente une réponse crédible.","On lit toutes les réponses, on débat, puis chacun vote pour le menteur.","+1 point si tu l'as trouvé. Le menteur gagne 1 point par joueur qu'il a berné."])}
  </div>
</section>
${play("mt")}
<section id="ec-setup" class="scr" hidden>
  <button class="back" type="button" data-go="home">← Menu</button>
  <div class="card">
    <h2>Échelle</h2>
    <p class="hint">Un joueur reçoit un chiffre secret de 1 à 10 et une échelle, par exemple « Nul → Génial ». Il donne un indice à voix haute. Les autres placent le curseur.</p>
    <div class="label">Tours de table</div>
    <div class="seg" id="ecTours"><button type="button" data-n="1" aria-pressed="true">1 tour</button><button type="button" data-n="2">2 tours</button></div>
    ${drinkRow("ecDrink","Ceux qui tombent à 3 crans ou plus boivent une gorgée")}
    <p id="ecErr" class="err" hidden></p>
    <button id="ecStart" class="btn" type="button">C'est parti</button>
    ${rules(["Le joueur qui donne l'indice voit son chiffre secret et l'échelle.","Il dit un truc qui vaut ce chiffre : « De nul à génial : Taxi 3 ».","Les autres placent leur curseur, chacun en secret.","Pile dessus : 3 pts. À 1 cran : 2 pts. À 2 crans : 1 pt. L'indice gagne 1 pt par joueur à 1 cran ou moins."])}
  </div>
</section>
${play("ec")}
<section id="bm-setup" class="scr" hidden>
  <button class="back" type="button" data-go="home">← Menu</button>
  <div class="card">
    <h2>Bombe à mots</h2>
    <p class="hint">Le tel passe de main en main. Dis un mot du thème, appuie, passe. Personne ne sait quand la bombe explose.</p>
    <div class="label">Mèche</div>
    <div class="seg" id="bmDur"><button type="button" data-d="s">Courte</button><button type="button" data-d="m" aria-pressed="true">Normale</button><button type="button" data-d="l">Longue</button></div>
    <div class="setting"><div><b>Tic-tac</b><small>Le tic-tac accélère quand ça chauffe. Monte le son.</small></div><button type="button" class="toggle" id="bmTick" aria-pressed="true" aria-label="Activer le tic-tac"></button></div>
    ${drinkRow("bmDrink","Celui qui tient la bombe boit 2 gorgées")}
    <button id="bmStart" class="btn" type="button">Allumer la mèche</button>
    ${rules(["Un thème s'affiche, par exemple « Marques de voitures ».","Celui qui tient le tel dit un mot du thème, appuie sur le gros bouton et passe le tel à sa gauche.","Pas de répétition. Hésiter trop longtemps, c'est risquer de l'avoir en main.","Boum : celui qui tient le tel a perdu la manche."])}
  </div>
</section>
${play("bm")}`;
const foot=document.querySelector(".wrap > .foot");
if(foot)foot.insertAdjacentHTML("beforebegin",html);else document.querySelector(".wrap").insertAdjacentHTML("beforeend",html);
["qd","mc","mt","ec","bm"].forEach(g=>["setup","play"].forEach(s=>SCREENS.push($(g+"-"+s))));

/* tuiles de l'accueil */
[["qd","Qui de nous ?","Un vote secret, un verdict qui tombe d'un coup.","3+ joueurs · vote"],
 ["mc","Mot commun","Un thème, un mot chacun. Pense comme les autres.","3+ joueurs · télépathie"],
 ["mt","Le menteur","Un des joueurs invente sa réponse. Démasquez-le.","3+ joueurs · bluff"],
 ["ec","Échelle","Un chiffre secret, un indice, un curseur à placer.","3+ joueurs · intuition"],
 ["bm","Bombe à mots","Dis un mot, passe le tel. Boum.","3+ joueurs · un seul tel"]].forEach(([g,t,d,m])=>{
  const b=el("button","tile");b.type="button";b.dataset.g=g;b.dataset.go=g+"-setup";b.append(el("span","t",t),el("span","d",d),el("span","m",m));$("tiles").appendChild(b)});

/* thèmes, titres, tournoi, multi */
Object.assign(THEMES,{qd:"le grand jury",mc:"même cerveau",mt:"qui ment ?",ec:"de 1 à 10",bm:"ça va péter"});
Object.assign(TITLES,{qd:["QUI DE","NOUS ?"],mc:["MOT","COMMUN"],mt:["LE","MENTEUR"],ec:["ÉCHELLE",""],bm:["BOMBE","À MOTS"]});
Object.assign(INTROS,{qd:"Le vote est secret. Le verdict, non.",mc:"Pensez pareil, marquez ensemble.",mt:"L'un d'entre vous ment.",ec:"Trouve le bon cran.",bm:"Tic… tac…"});
Object.assign(GAMES,{qd:["Qui de nous ?",3],mc:["Mot commun",3],mt:["Le menteur",3],ec:["Échelle",3],bm:["Bombe à mots",3]});
MULTI_GAMES.splice(MULTI_GAMES.length-1,0,["qd","Qui de nous ?","📱 vote secret"],["mc","Mot commun","📱 réponses"],["mt","Le menteur","📱 réponses + vote"],["ec","Échelle","📱 curseur"]);
MULTI_GAMES.push(["bm","Bombe à mots","sur ton tel"]);
TITLES_DEF.push(["designe","La star du groupe","désignation","désignations"],["bombes","Le démineur raté","bombe","bombes"]);
/* les nouveaux jeux entrent une fois dans le tirage du tournoi */
if(!store.get("zx_tour_added",false)){tourPick=tourPick.concat(["qd","mc","mt","ec","bm"].filter(k=>!tourPick.includes(k)));store.set("tour_games",tourPick);store.set("zx_tour_added",true)}
const COLORS={qd:"#2A0B45",mc:"#0D5C63",mt:"#2B1206",ec:"#DCEBFF",bm:"#141414"};
const _setTheme=setTheme;
setTheme=function(g){_setTheme(g);if(COLORS[g])try{document.querySelector("meta[name=theme-color]").content=COLORS[g]}catch(e){}};

/* ================= OUTILS COMMUNS ================= */
const ZX={qids:new Set()};
const multiOn=()=>typeof host!=="undefined"&&!!host;
function zxClear(){if(multiOn())ZX.qids.forEach(q=>remoteClear(q));ZX.qids.clear()}
function btn(txt,cls,fn){const b=el("button","btn"+(cls?" "+cls:""),txt);b.type="button";b.onclick=fn;return b}
function row(...kids){const r=el("div","row");r.append(...kids);return r}
function bump(node){node.classList.remove("drop");void node.offsetWidth;node.classList.add("drop")}
function scoreList(g,scores){const card=$(g+"ScoreCard"),box=$(g+"Scores");card.hidden=false;box.innerHTML="";
  names.map(n=>[n,scores[n]||0]).sort((a,b)=>b[1]-a[1]).forEach(([n,v],i)=>{const d=el("div","li");d.append(el("span",null,(i===0&&v>0?"👑 ":"")+pn(n)),el("span","score",v));box.appendChild(d)})}
function needPlayers(errId,min){const e=$(errId);if(names.length<min){e.textContent=`Il faut au moins ${min} joueurs. Ajoutez-en sur l'accueil.`;e.hidden=false;return false}e.hidden=true;return true}

/* Champ de réponse : texte, curseur ou choix. Sert sur le tel de l'hôte et sur ceux des joueurs. */
function buildInput(spec,onSubmit,opt){
  opt=opt||{};const box=el("div","zxin");const kind=spec.kind||"choice";const cur=opt.cur;
  if(kind==="text"){
    const inp=el("input");inp.type="text";inp.maxLength=40;inp.autocomplete="off";inp.placeholder=spec.placeholder||"Ta réponse";inp.setAttribute("aria-label",spec.placeholder||"Ta réponse");
    inp.value=opt.draft!=null?opt.draft:(cur!=null?cur:"");
    const go=btn(cur!=null?"Modifier ma réponse":"Valider","mint",()=>{const v=inp.value.trim();if(!v){inp.focus();return}onSubmit(v)});
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")go.click()});if(opt.onDraft)inp.addEventListener("input",()=>opt.onDraft(inp.value));
    box.append(inp,go);if(opt.focus)setTimeout(()=>{try{inp.focus({preventScroll:true})}catch(e){}},60);
  }else if(kind==="scale"){
    const min=spec.min||1,max=spec.max||10;let v=cur!=null?cur:(opt.draft!=null?opt.draft:Math.round((min+max)/2));
    const out=el("div","zxval",String(v));
    const r=el("input","zxrange");r.type="range";r.min=min;r.max=max;r.step=1;r.value=v;r.setAttribute("aria-label","Curseur de "+min+" à "+max);
    r.oninput=()=>{v=+r.value;out.textContent=v;if(opt.onDraft)opt.onDraft(v)};
    const lbl=el("div","zxlbl");lbl.append(el("span",null,`${min} · ${spec.lo||""}`),el("span",null,`${spec.hi||""} · ${max}`));
    box.append(out,r,lbl,btn(cur!=null?"Changer ma réponse":"Valider","mint",()=>onSubmit(v)));
  }else{
    let pick=cur!=null?cur:null;const chips=el("div","chips");
    const opts=(spec.options||[]).filter(o=>!(spec.excludeSelf&&opt.self&&String(o.v).toLowerCase()===String(opt.self).toLowerCase()));
    const go=btn("Valider","mint",()=>{if(pick!=null)onSubmit(pick)});go.disabled=pick==null;
    opts.forEach(o=>{const c=el("button","chip"+(o.v===pick?" on":""),o.label);c.type="button";
      c.onclick=()=>{pick=o.v;chips.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===c));go.disabled=false;if(opt.instant)onSubmit(pick)};chips.appendChild(c)});
    box.append(chips);if(!opt.instant)box.append(go);
  }
  return box;
}

/* Côté joueur : les questions « texte » et « curseur » arrivent sur le téléphone. */
const _renderMyAsk=renderMyAsk,ASK_DONE=$("askDone").textContent;
renderMyAsk=function(){
  if(!myAsk||(myAsk.kind!=="text"&&myAsk.kind!=="scale")){$("askDone").textContent=ASK_DONE;return _renderMyAsk()}
  const box=$("myAsk");box.hidden=false;$("askTitle").textContent=myAsk.title||"";$("askText").textContent=myAsk.text||"";
  $("askBig").hidden=!myAsk.big;$("askBig").textContent=myAsk.big||"";$("askNote").hidden=!myAsk.note;$("askNote").textContent=myAsk.note||"";
  const o=$("askOpts");o.innerHTML="";
  const sent=myAsk.sent!=null&&myAsk.sent!==undefined;
  $("askDone").hidden=!sent;$("askDone").textContent=sent?(myAsk.kind==="text"?`Réponse envoyée : « ${myAsk.sent} » ✓ Tu peux encore la changer.`:`Réponse envoyée : ${myAsk.sent} ✓ Tu peux encore la changer.`):"";
  o.appendChild(buildInput(myAsk,v=>{myAsk.draft=null;answer(v)},{cur:sent?myAsk.sent:null,draft:myAsk.draft,onDraft:v=>{myAsk.draft=v}}));
};

/* Collecte des réponses secrètes de chaque joueur :
   - téléphones connectés : la question arrive sur le téléphone ;
   - sinon : on se passe le tel de l'hôte, chacun répond à l'abri des regards. */
function collect(o){
  zxClear();
  const st={ans:{},phone:{},done:false};const box=o.box;
  o.players.forEach(n=>{
    const id=multiOn()?onlineIds([n])[0]:null;if(!id)return;
    st.phone[n]=true;
    const q=remoteAsk([id],Object.assign({},o.spec(n)),(pid,v)=>{if(st.done)return;st.ans[n]=v;if(!st.local)draw();check()},{targets:[n]});
    if(q)ZX.qids.add(q);
  });
  const waiting=()=>o.players.filter(n=>!(n in st.ans));
  const offline=()=>waiting().filter(n=>!st.phone[n]);
  function check(){if(st.done||waiting().length)return;st.done=true;zxClear();setTimeout(()=>o.onDone(st.ans),450)}
  function draw(){
    st.local=null;box.innerHTML="";bump(box);
    (o.head?o.head():[]).forEach(x=>box.appendChild(x));
    const w=waiting();
    box.appendChild(el("div","label",`${o.players.length-w.length} / ${o.players.length} réponses`));
    const list=el("div","zxst");
    o.players.forEach(n=>{const d=el("div","li");d.appendChild(el("span",null,pn(n)));
      if(n in st.ans)d.appendChild(el("span","pill r-civil","Prêt ✓"));
      else{const r=el("div","row");r.style.flexWrap="nowrap";r.style.alignItems="center";
        if(st.phone[n])r.appendChild(el("b",null,"📱 …"));
        const b=el("button","zxsm",st.phone[n]?"Ici":"Répondre ici");b.type="button";b.onclick=()=>local(n,draw);r.appendChild(b);d.appendChild(r)}
      list.appendChild(d)});
    box.appendChild(list);
    const off=offline();
    if(off.length)box.appendChild(btn(off.length===o.players.length?"Passer le tel, chacun son tour":off.length===1?`Réponse de ${off[0]} sur ce tel`:`Passer le tel aux ${off.length} sans téléphone`,"",tour));
    if(Object.keys(st.phone).length)box.appendChild(el("p","hint","📱 Les réponses arrivent sur les téléphones. Ceux qui n'en ont pas répondent ici."));
    if(w.length&&o.players.length-w.length>=(o.minAnswers||1))box.appendChild(btn("Continuer sans attendre","alt",()=>{if(st.done)return;st.done=true;zxClear();o.onDone(st.ans)}));
  }
  function tour(){const r=offline();if(!r.length){draw();check();return}local(r[0],tour)}
  function local(n,next){
    st.local=n;box.innerHTML="";bump(box);
    box.append(el("div","label","Passe le tel à"),el("div","big",pn(n)),el("p","hint center","Les autres, regardez ailleurs."),
      btn("C'est moi, je réponds","",()=>{
        const spec=o.spec(n);box.innerHTML="";bump(box);
        box.append(el("div","label",spec.title||""),el("p","cardtxt",spec.text||""));
        if(spec.big)box.appendChild(el("div","big",spec.big));
        if(spec.note)box.appendChild(el("p","hint",spec.note));
        box.appendChild(buildInput(spec,v=>{if(st.done)return;st.ans[n]=v;
          if(!waiting().length){check();box.innerHTML="";box.append(el("div","big","✓"),el("p","hint center","Toutes les réponses sont là."));return}
          next()},{self:n,focus:true}));
        box.appendChild(btn("Retour","alt",draw));
      }),btn("Retour","alt",draw));
  }
  if(!multiOn()||!Object.keys(st.phone).length)tour();else draw();
  return st;
}

/* nettoyage des questions quand on quitte un jeu */
const _show=show;
show=function(id){const g=id.split("-")[0];
  if(!(["qd","mc","mt","ec","bm"].includes(g)&&id.endsWith("-play"))&&!["remote","pass"].includes(id))zxClear();
  _show(id);
  if(id!=="bm-play")bmStop();
};

/* ================= QUI DE NOUS ? ================= */
const qdMode=bindSeg($("qdMode"),"qd_mode","m");
bindToggle($("qdDrink"),"qd_drink");
let qd=null;
$("qdStart").onclick=()=>{if(!needPlayers("qdErr",3))return;qd={n:0,d:deck(QD[qdMode()]),drink:isOn($("qdDrink")),tally:{}};show("qd-play");qdNext()};
function qdNext(){
  qd.n++;qd.q=qd.d();$("qdScoreCard").hidden=true;
  collect({box:$("qdBox"),players:names.slice(),
    spec:()=>({title:"Qui de nous ?",text:qd.q,kind:"choice",options:names.map(x=>({v:x,label:x})),note:"Vote secret. Tu peux voter pour toi."}),
    head:()=>[el("div","label","Question "+qd.n),el("p","cardtxt",qd.q)],
    onDone:qdReveal});
}
function qdReveal(ans){
  const box=$("qdBox");box.innerHTML="";bump(box);
  const t={};Object.values(ans).forEach(v=>{if(names.includes(v))t[v]=(t[v]||0)+1});
  const arr=names.map(n=>[n,t[n]||0]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]);
  box.append(el("div","label","Question "+qd.n),el("p","cardtxt",qd.q));
  if(!arr.length){box.append(el("p","hint","Aucun vote."),btn("Question suivante","",qdNext));return}
  const top=arr.filter(x=>x[1]===arr[0][1]);
  const ban=el("div","banner pop");ban.style.background="var(--pink)";
  ban.append(el("div","label",top.length>1?"Égalité":"Le groupe a désigné"),el("div","big",top.map(x=>pn(x[0])).join(" & ")),el("div","score",`${arr[0][1]} voix`));
  box.appendChild(ban);
  const list=el("div","list");const max=arr[0][1];
  arr.forEach(([n,v])=>{const r=el("div","gbar");r.append(el("span","rk",String(v)),el("span","nm",pn(n)),el("span",null,""));const tr=el("div","tr"),bar=el("i");tr.appendChild(bar);r.appendChild(tr);list.appendChild(r);requestAnimationFrame(()=>bar.style.width=(v/max*100)+"%")});
  box.appendChild(list);
  top.forEach(([n,v])=>{stat(n,"designe");qd.tally[n]=(qd.tally[n]||0)+1;if(qd.drink)stat(n,"gorgees",v)});
  if(qd.drink)box.appendChild(el("p","drink",top.map(([n,v])=>`${n} boit ${v} gorgée${v>1?"s":""}.`).join(" ")));
  box.appendChild(btn("Question suivante","",qdNext));
  if(top.length===1)confetti(["#FF4FA3","#B266FF","#FFE7F7"]);
  scoreList("qd",qd.tally);$("qdScoreCard").querySelector(".label").textContent="Les plus désignés";
}

/* ================= MOT COMMUN ================= */
const mcRounds=bindSeg($("mcRounds"),"mc_rounds","n");
bindToggle($("mcDrink"),"mc_drink");
let mc=null;
$("mcStart").onclick=()=>{if(!needPlayers("mcErr",3))return;mc={round:0,total:+mcRounds(),scores:{},d:deck(MC),drink:isOn($("mcDrink"))};show("mc-play");mcNext()};
const mcKey=w=>{let k=norm(String(w));if(k.length>3)k=k.replace(/(s|x)$/,"");return k};
function mcNext(){
  mc.round++;mc.theme=mc.d();scoreList("mc",mc.scores);
  collect({box:$("mcBox"),players:names.slice(),
    spec:()=>({title:`Mot commun · manche ${mc.round}/${mc.total}`,text:mc.theme,kind:"text",placeholder:"Un seul mot",note:"Écris le mot que les autres vont écrire aussi."}),
    head:()=>[el("div","label",`Manche ${mc.round} / ${mc.total}`),el("div","big",mc.theme)],
    onDone:mcReveal});
}
function mcReveal(ans){
  const groups=[];
  Object.entries(ans).forEach(([n,w])=>{const k=mcKey(w);if(!k)return;let g=groups.find(x=>x.k===k);if(!g)groups.push(g={k,label:String(w).trim(),who:[]});g.who.push(n)});
  let sel=null;
  const box=$("mcBox");
  function draw(){
    box.innerHTML="";bump(box);
    box.append(el("div","label",`Manche ${mc.round} / ${mc.total}`),el("div","big",mc.theme));
    groups.sort((a,b)=>b.who.length-a.who.length);
    const grid=el("div","mcgrp");
    groups.forEach(g=>{const c=el("button","mcg"+(g.who.length>1?" match":"")+(g===sel?" sel":""));c.type="button";
      c.append(el("b",null,g.label),el("small",null,g.who.join(", ")),el("span","pill",g.who.length>1?`+${g.who.length-1} chacun`:"seul"));
      c.onclick=()=>{if(!sel){sel=g;draw();return}if(sel===g){sel=null;draw();return}
        g.who.push(...sel.who);g.label=g.label.length<=sel.label.length?g.label:sel.label;groups.splice(groups.indexOf(sel),1);sel=null;draw()};
      grid.appendChild(c)});
    box.appendChild(grid);
    box.appendChild(el("p","hint",sel?`Touche le mot à fusionner avec « ${sel.label} », ou re-touche-le pour annuler.`:"Deux réponses qui veulent dire la même chose ? Touche-les l'une après l'autre pour les fusionner."));
    const missing=names.filter(n=>!(n in ans));if(missing.length)box.appendChild(el("p","hint","Pas de réponse : "+missing.join(", ")));
    box.appendChild(btn("Valider les points","",score));
  }
  function score(){
    const lonely=[];
    groups.forEach(g=>{const p=g.who.length-1;g.who.forEach(n=>{if(p>0){mc.scores[n]=(mc.scores[n]||0)+p;addPts(n,p,"mc");stat(n,"mots")}else lonely.push(n)})});
    if(mc.drink)lonely.forEach(n=>stat(n,"gorgees"));
    box.innerHTML="";bump(box);
    const best=groups[0]&&groups[0].who.length>1?groups[0]:null;
    box.append(el("div","label",`Manche ${mc.round} / ${mc.total}`),el("p","cardtxt pop",best?`« ${best.label} » : ${best.who.length} esprits connectés !`:"Personne n'a pensé pareil. Gros malaise télépathique."));
    if(mc.drink&&lonely.length)box.appendChild(el("p","drink",`${lonely.join(", ")} : 1 gorgée, vous étiez seuls.`));
    if(best)confetti(["#FFB547","#3DDC97","#E6FFF8"]);
    scoreList("mc",mc.scores);
    if(mc.round>=mc.total)box.appendChild(btn("Voir le gagnant","",()=>final("mc",mc.scores,"Les plus connectés",()=>$("mcStart").click())));
    else box.appendChild(btn("Manche suivante","",mcNext));
  }
  draw();
}

/* ================= LE MENTEUR ================= */
const mtRounds=bindSeg($("mtRounds"),"mt_rounds","n");
bindToggle($("mtDrink"),"mt_drink");
let mt=null;
$("mtStart").onclick=()=>{if(!needPlayers("mtErr",3))return;mt={round:0,total:+mtRounds(),scores:{},d:deck(MT),drink:isOn($("mtDrink")),last:null};show("mt-play");mtNext()};
function mtNext(){
  mt.round++;mt.q=mt.d();
  const pool=names.length>2&&mt.last?names.filter(n=>n!==mt.last):names;mt.liar=rand(pool);mt.last=mt.liar;
  scoreList("mt",mt.scores);
  collect({box:$("mtBox"),players:names.slice(),
    spec:n=>n===mt.liar
      ?{title:"🤥 Tu es le menteur",text:mt.q,kind:"text",placeholder:"Ta fausse réponse",note:"Invente une réponse fausse mais crédible. Cache ton écran."}
      :{title:"Le menteur",text:mt.q,kind:"text",placeholder:"Ta vraie réponse",note:"Réponds la vérité. Un des joueurs va mentir."},
    head:()=>[el("div","label",`Manche ${mt.round} / ${mt.total}`),el("p","cardtxt",mt.q),el("p","hint","Chacun répond en secret. L'un de vous a reçu l'ordre de mentir.")],
    onDone:mtAnswers});
}
function mtAnswers(ans){
  mt.ans=ans;const box=$("mtBox");box.innerHTML="";bump(box);
  box.append(el("div","label",`Manche ${mt.round} / ${mt.total}`),el("p","cardtxt",mt.q));
  const list=el("div","list");
  shuffle(Object.keys(ans)).forEach(n=>{const d=el("div","li");const a=el("span",null,"« "+ans[n]+" »");a.style.textAlign="right";a.style.fontWeight="800";d.append(el("span",null,pn(n)),a);list.appendChild(d)});
  box.append(list,el("p","hint","Lisez tout à voix haute. Posez des questions, débattez. Qui ment ?"),btn("On vote","",mtVote));
}
function mtVote(){
  collect({box:$("mtBox"),players:names.slice(),
    spec:()=>({title:"Le menteur",text:"Qui a menti ? « "+mt.q+" »",kind:"choice",options:names.map(x=>({v:x,label:x})),excludeSelf:true,note:"Vote secret."}),
    head:()=>[el("div","label","Vote"),el("h2",null,"Qui a menti ?")],
    onDone:mtResult});
}
function mtResult(votes){
  const box=$("mtBox");box.innerHTML="";bump(box);const L=mt.liar;
  const t={};Object.entries(votes).forEach(([n,v])=>{if(n!==L)t[v]=(t[v]||0)+1});
  const max=Math.max(0,...Object.values(t));const found=(t[L]||0)===max&&max>0&&Object.values(t).filter(x=>x===max).length===1;
  const right=Object.entries(votes).filter(([n,v])=>n!==L&&v===L).map(x=>x[0]);
  const fooled=Object.entries(votes).filter(([n,v])=>n!==L&&v!==L).map(x=>x[0]);
  right.forEach(n=>{mt.scores[n]=(mt.scores[n]||0)+1;addPts(n,1,"mt")});
  if(fooled.length){mt.scores[L]=(mt.scores[L]||0)+fooled.length;addPts(L,fooled.length,"mt")}
  if(!found)stat(L,"mensonges");
  if(mt.drink){if(found)stat(L,"gorgees",2);else fooled.forEach(n=>stat(n,"gorgees"))}
  const ban=el("div","banner pop");ban.style.background=found?"var(--mint)":"var(--pink)";
  ban.append(el("div","label",found?"Démasqué !":"Il vous a bien eus"),el("div","big",pn(L)),el("p",null,`Sa fausse réponse : « ${mt.ans[L]||"—"} »`));
  box.appendChild(ban);
  const list=el("div","list");
  Object.entries(t).sort((a,b)=>b[1]-a[1]).forEach(([n,v])=>{const d=el("div","li");d.append(el("span",null,pn(n)+(n===L?" 🤥":"")),el("span","score",v+" voix"));list.appendChild(d)});
  box.appendChild(list);
  box.appendChild(el("p","hint",(right.length?`+1 pour ${right.join(", ")}. `:"Personne ne l'a trouvé. ")+(fooled.length?`+${fooled.length} pour ${L}, qui a berné ${fooled.join(", ")}.`:"")));
  if(mt.drink)box.appendChild(el("p","drink",found?`${L} boit 2 gorgées.`:fooled.length?`${fooled.join(", ")} : 1 gorgée chacun.`:"Personne ne boit."));
  confetti(found?["#7DCE82","#FFF6E6","#127475"]:["#F2542D","#FBE9D0","#2B1206"]);
  scoreList("mt",mt.scores);
  if(mt.round>=mt.total)box.appendChild(btn("Voir le gagnant","",()=>final("mt",mt.scores,"Les meilleurs détecteurs de mensonges",()=>$("mtStart").click())));
  else box.appendChild(btn("Manche suivante","",mtNext));
}

/* ================= ÉCHELLE ================= */
const ecTours=bindSeg($("ecTours"),"ec_tours","n");
bindToggle($("ecDrink"),"ec_drink");
let ec=null;
$("ecStart").onclick=()=>{if(!needPlayers("ecErr",3))return;ec={turn:0,total:names.length*+ecTours(),scores:{},d:deck(EC),drink:isOn($("ecDrink")),first:Math.floor(Math.random()*names.length)};ecNext()};
function ecBar(target,guesses){
  const bar=el("div","ecbar");
  for(let i=1;i<=10;i++){const c=el("div");const d=target==null?null:Math.abs(i-target);
    if(d===0)c.classList.add("tg");else if(d===1)c.classList.add("hit");else if(d===2)c.classList.add("near");
    c.appendChild(el("div","n",String(i)));
    if(guesses){const g=Object.entries(guesses).filter(([n,v])=>+v===i).map(([n])=>prof(n).e).join("");if(g)c.appendChild(el("div","g",g))}
    bar.appendChild(c)}
  return bar;
}
function ecScale(pair){const w=el("div");w.style.display="flex";w.style.flexDirection="column";w.style.gap="6px";
  const l=el("div","zxlbl");l.append(el("span",null,"1 · "+pair[0]),el("span",null,pair[1]+" · 10"));w.append(l,el("div","ecgrad"));return w}
function ecNext(){
  ec.turn++;ec.giver=names[(ec.first+ec.turn-1)%names.length];ec.pair=ec.d();ec.target=1+Math.floor(Math.random()*10);
  const [lo,hi]=ec.pair;
  passPhone([{name:ec.giver,kicker:`Ton chiffre secret · ${lo} → ${hi}`,word:`${ec.target} / 10`,note:`Trouve un truc qui vaut ${ec.target} entre « ${lo} » (1) et « ${hi} » (10), et dis-le à voix haute.`}],
    ()=>{show("ec-play");ecClue()});
}
function ecClue(){
  const box=$("ecBox");box.innerHTML="";bump(box);scoreList("ec",ec.scores);
  box.append(el("div","label",`Manche ${ec.turn} / ${ec.total}`),ecScale(ec.pair),ecBar(null),
    el("p","cardtxt",`🗣️ ${ec.giver} donne son indice à voix haute.`),el("p","hint","Par exemple : « De nul à génial : un film… Taxi 3 ». Une fois l'indice donné, chacun place son curseur."),
    btn("Placer les curseurs","",()=>{
      const guessers=names.filter(n=>n!==ec.giver);
      collect({box,players:guessers,minAnswers:1,
        spec:()=>({title:`Échelle · indice de ${ec.giver}`,text:`${ec.pair[0]} (1) → ${ec.pair[1]} (10)`,kind:"scale",min:1,max:10,lo:ec.pair[0],hi:ec.pair[1],note:"Place le curseur sur le chiffre secret."}),
        head:()=>[el("div","label",`Manche ${ec.turn} / ${ec.total} · indice de ${ec.giver}`),ecScale(ec.pair)],
        onDone:ecReveal})}));
}
function ecReveal(g){
  const box=$("ecBox");box.innerHTML="";bump(box);const T=ec.target;
  box.append(el("div","label",`Manche ${ec.turn} / ${ec.total}`),ecScale(ec.pair),ecBar(T,g));
  const ban=el("div","banner pop");ban.style.background="var(--mint)";ban.append(el("div","label",`Le chiffre de ${ec.giver}`),el("div","big",String(T)));box.appendChild(ban);
  const list=el("div","list");let close=0;const far=[];
  Object.entries(g).sort((a,b)=>Math.abs(a[1]-T)-Math.abs(b[1]-T)).forEach(([n,v])=>{const d=Math.abs(+v-T);const p=d===0?3:d===1?2:d===2?1:0;
    if(d<=1)close++;if(d>=3)far.push(n);
    if(p){ec.scores[n]=(ec.scores[n]||0)+p;addPts(n,p,"ec");stat(n,"mots")}
    const r=el("div","li");r.append(el("span",null,`${pn(n)} · ${v}`),el("span","pill "+(p?"r-civil":"r-white"),p?`+${p}`:"raté"));list.appendChild(r)});
  if(close){ec.scores[ec.giver]=(ec.scores[ec.giver]||0)+close;addPts(ec.giver,close,"ec")}
  box.appendChild(list);
  box.appendChild(el("p","hint",close?`+${close} pour ${ec.giver}, qui a mis ${close} joueur${close>1?"s":""} à 1 cran ou moins.`:`Aucun point pour ${ec.giver} : l'indice n'a parlé à personne.`));
  if(ec.drink&&far.length){far.forEach(n=>stat(n,"gorgees"));box.appendChild(el("p","drink",`${far.join(", ")} : 1 gorgée, trop loin.`))}
  if(Object.values(g).some(v=>+v===T))confetti(["#FF5D73","#FFD23F","#25C39A","#3366FF"]);
  scoreList("ec",ec.scores);
  if(ec.turn>=ec.total)box.appendChild(btn("Voir le gagnant","",()=>final("ec",ec.scores,"Les meilleures intuitions",()=>$("ecStart").click())));
  else box.appendChild(btn(`Au tour de ${names[(ec.first+ec.turn)%names.length]}`,"",ecNext));
}

/* ================= BOMBE À MOTS ================= */
const bmDur=bindSeg($("bmDur"),"bm_dur","d");
bindToggle($("bmTick"),"bm_tick");bindToggle($("bmDrink"),"bm_drink");
const BM_RANGE={s:[10,25],m:[20,45],l:[35,70]};
let bm=null,bmAc=null,bmWake=null;
function bmAudio(){try{if(!bmAc)bmAc=new (window.AudioContext||window.webkitAudioContext)();if(bmAc.state==="suspended")bmAc.resume()}catch(e){bmAc=null}return bmAc}
function bmBeep(f,dur,vol){const a=bmAc;if(!a)return;const t=a.currentTime,o=a.createOscillator(),g=a.createGain();o.type="square";o.frequency.value=f;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.02)}
function bmBoom(){const a=bmAc;if(!a)return;const t=a.currentTime,len=a.sampleRate*1.6,b=a.createBuffer(1,len,a.sampleRate),d=b.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2);
  const s=a.createBufferSource();s.buffer=b;const lp=a.createBiquadFilter();lp.type="lowpass";lp.frequency.setValueAtTime(1800,t);lp.frequency.exponentialRampToValueAtTime(120,t+1.4);
  const g=a.createGain();g.gain.setValueAtTime(1,t);g.gain.exponentialRampToValueAtTime(.001,t+1.6);s.connect(lp);lp.connect(g);g.connect(a.destination);s.start(t);
  const o=a.createOscillator(),og=a.createGain();o.frequency.setValueAtTime(90,t);o.frequency.exponentialRampToValueAtTime(30,t+.8);og.gain.setValueAtTime(.9,t);og.gain.exponentialRampToValueAtTime(.001,t+.9);o.connect(og);og.connect(a.destination);o.start(t);o.stop(t+1)}
function bmStop(){if(!bm)return;clearTimeout(bm.tk);clearTimeout(bm.boomT);bm.live=false;try{bmWake&&bmWake.release()}catch(e){}bmWake=null;document.removeEventListener("keydown",bmKey)}
function bmKey(e){if(!bm||!bm.live)return;if(e.code==="Space"||e.key==="Enter"){e.preventDefault();bmPass()}}
$("bmStart").onclick=()=>{bmAudio();bm=Object.assign(bm&&bm.scores?{scores:bm.scores,round:bm.round}:{scores:{},round:0},{d:bm&&bm.d||deck(BM),tick:isOn($("bmTick")),drink:isOn($("bmDrink")),range:BM_RANGE[bmDur()]});show("bm-play");bmIntro()};
function bmIntro(){
  bmStop();bm.theme=bm.d();const box=$("bmBox");box.innerHTML="";bump(box);scoreList("bm",bm.scores);
  box.append(el("div","label",`Manche ${bm.round+1} · le thème`),el("div","big",bm.theme),
    el("p","hint","Le premier joueur prend le tel. Dès que la mèche est allumée : un mot du thème, on appuie, on passe à gauche."),
    btn("💣 Allumer la mèche","",bmGo),btn("Changer de thème","alt",bmIntro));
}
async function bmGo(){
  bmAudio();bm.round++;bm.passes=0;bm.live=true;
  const [a,b]=bm.range;bm.total=(a+Math.random()*(b-a))*1000;bm.t0=performance.now();
  try{bmWake=await navigator.wakeLock?.request("screen")}catch(e){}
  const box=$("bmBox");box.innerHTML="";
  const z=el("div","bmzone");
  const p=el("button","bmpass");p.type="button";p.innerHTML="PASSE ➜<small>Dis un mot, appuie, passe le tel</small>";p.onclick=bmPass;
  const cnt=el("p","hint center","0 mot");cnt.id="bmCount";
  z.append(el("div","label","Thème"),el("div","bmtheme",bm.theme),p,cnt);box.appendChild(z);
  document.addEventListener("keydown",bmKey);
  const tick=()=>{if(!bm.live)return;const left=bm.total-(performance.now()-bm.t0);
    if(bm.tick)bmBeep(left<4000?1500:1100,.035,.25);
    const gap=left<3000?140:left<7000?260:left<14000?420:600;bm.tk=setTimeout(tick,Math.max(90,Math.min(gap,left)))};
  tick();bm.boomT=setTimeout(bmExplode,bm.total);
}
function bmPass(){if(!bm||!bm.live)return;bm.passes++;const c=$("bmCount");if(c)c.textContent=bm.passes+(bm.passes>1?" mots":" mot");try{navigator.vibrate?.(25)}catch(e){}
  const p=document.querySelector(".bmpass");if(p){p.classList.remove("pop");void p.offsetWidth;p.classList.add("pop")}}
function bmExplode(){
  if(!bm||!bm.live)return;bmStop();bmBoom();try{navigator.vibrate?.([400,80,250])}catch(e){}
  document.body.classList.remove("bmboom");void document.body.offsetWidth;document.body.classList.add("bmboom");setTimeout(()=>document.body.classList.remove("bmboom"),1200);
  const box=$("bmBox");box.innerHTML="";bump(box);
  box.append(el("div","bmbig","💥"),el("div","big","BOUM !"),el("p","hint center",`Thème : ${bm.theme} · ${bm.passes} mot${bm.passes>1?"s":""}`),el("div","label","Qui tenait la bombe ?"));
  const chips=el("div","chips");
  names.forEach(n=>{const c=el("button","chip",pn(n));c.type="button";c.onclick=()=>bmLoser(n);chips.appendChild(c)});
  box.appendChild(chips);
}
function bmLoser(n){
  stat(n,"bombes");if(bm.drink)stat(n,"gorgees",2);
  names.filter(x=>x!==n).forEach(x=>{bm.scores[x]=(bm.scores[x]||0)+1;addPts(x,1,"bm")});
  const box=$("bmBox");box.innerHTML="";bump(box);
  box.append(el("div","bmbig","💀"),el("div","big",pn(n)),el("p","cardtxt center",`a sauté sur « ${bm.theme} ».`),el("p","hint center","+1 point pour tous les autres."));
  if(bm.drink)box.appendChild(el("p","drink",`${n} boit 2 gorgées.`));
  box.append(btn("Manche suivante","",bmIntro),btn("Réglages","alt",()=>show("bm-setup")));
  scoreList("bm",bm.scores);
}
$("bm-setup").querySelector(".back").addEventListener("click",()=>{bm=null});

/* ================= FIN DE PARTIE ================= */
function final(g,scores,label,again){
  zxClear();const box=$(g+"Box");box.innerHTML="";bump(box);
  const list=names.map(n=>[n,scores[n]||0]).sort((a,b)=>b[1]-a[1]);
  const top=list.filter(x=>x[1]===list[0][1]&&x[1]>0);
  const ban=el("div","banner pop");ban.style.background="var(--mint)";
  ban.append(el("div","label","Fin de partie · "+label),el("div","big",top.length?top.map(x=>pn(x[0])).join(" & "):"Personne"),el("div","score",(list[0]?list[0][1]:0)+" pts"));
  box.appendChild(ban);scoreList(g,scores);
  box.append(row(btn("Rejouer","",again),btn("Menu","alt",()=>show("home"))));
  confetti(["#FFC93C","#FFE14D","#FF3D8B","#fff"]);
}

/* lien direct vers un écran de réglages (#qd-setup…) */
{const h=location.hash.slice(1);if(/^(qd|mc|mt|ec|bm)-setup$/.test(h)&&!document.body.dataset.guest)show(h)}
})();
