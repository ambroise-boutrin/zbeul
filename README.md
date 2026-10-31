# ZBEUL

Les jeux de soirée qui mettent le zbeul, sur un seul téléphone ou sur tous les téléphones de la bande.

**Jeux :** Undercover (équipes possibles), Loup-garou (18 rôles, narrateur IA avec bruitages), Dans ta tête (mode inclinaison), Action ou Vérité (gages en cascade), Je n'ai jamais, Blind test (extraits Deezer).

**Autour :** profils joueurs, classement et titres de la soirée, historique, mode tournoi avec traître secret, cartes perso, mode gorgées.

## Multi-téléphones
L'hôte crée une partie sur l'accueil (code + QR code). Chacun rejoint avec `?room=CODE` sur son propre téléphone :
- **Rôles et mots** envoyés en privé (Undercover, Loup-garou, traître du tournoi).
- **Loup-garou** : chaque rôle agit la nuit sur son téléphone (voyante, loups, sorcière, salvateur, cupidon…), vote du village sur les téléphones.
- **Undercover** : vote sur les téléphones.
- **Blind test** : buzzer sur chaque téléphone.
- **Je n'ai jamais** : chacun répond « déjà fait » / « jamais », l'hôte voit qui.
- **Action ou Vérité** : la carte arrive sur le téléphone du joueur concerné. Temps réel via Supabase Realtime (canaux `zbeul:CODE`, broadcast + presence, aucune table).

**Fiabilité :** identité permanente par téléphone, présence réannoncée au retour de veille, ping toutes les 15 s, renvoi automatique des rôles et questions en attente, reprise de la salle si l'hôte recharge l'appli (12 h), retardataires ajoutés aux votes en cours.

**Secret :** rôles, questions et réponses chiffrés de bout en bout (ECDH P-256 + AES-GCM) entre l'hôte et chaque téléphone ; messages leurres la nuit au Loup-garou pour ne pas trahir qui agit.

**Serveur :** le projet Supabase est en offre gratuite (pause après 7 jours sans activité) ; l'appli fait une requête légère par jour pour le garder éveillé.

## Stack
Site 100 % statique, aucun build : `index.html`, `voice.js` (répliques du narrateur), `sw.js` (hors ligne), `manifest.webmanifest`, `lib/` (supabase-js 2.45.4, qrcode-generator 1.4.4), `fonts/`, `icons/`.

## Dev
`npx serve .` puis http://localhost:3000

## Déploiement
Vercel, branché sur ce dépôt : chaque push sur `main` redéploie. Pour forcer la mise à jour du cache hors ligne, incrémenter `VERSION` dans `sw.js`.
