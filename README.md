# ZBEUL

Les jeux de soirée qui mettent le zbeul, sur un seul téléphone ou sur tous les téléphones de la bande.

**Jeux :** Undercover (équipes possibles), Loup-garou (18 rôles, narrateur IA avec bruitages), Dans ta tête (mode inclinaison), Action ou Vérité (gages en cascade), Je n'ai jamais, Blind test (extraits Deezer).

**Autour :** profils joueurs, classement et titres de la soirée, historique, mode tournoi avec traître secret, cartes perso, mode gorgées.

## Multi-téléphones
L'hôte crée une partie sur l'accueil (code + QR code). Chacun rejoint avec `?room=CODE` et reçoit son rôle ou son mot sur son propre téléphone (Undercover, Loup-garou, traître du tournoi). Temps réel via Supabase Realtime (canaux `zbeul:CODE`, broadcast + presence, aucune table).

## Stack
Site 100 % statique, aucun build : `index.html`, `voice.js` (répliques du narrateur), `sw.js` (hors ligne), `manifest.webmanifest`, `lib/` (supabase-js 2.45.4, qrcode-generator 1.4.4), `fonts/`, `icons/`.

## Dev
`npx serve .` puis http://localhost:3000

## Déploiement
Vercel, branché sur ce dépôt : chaque push sur `main` redéploie. Pour forcer la mise à jour du cache hors ligne, incrémenter `VERSION` dans `sw.js`.
