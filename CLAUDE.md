# Troc’Savoirs – brief pour développer l’appli web

## Le projet en une phrase
Troc’Savoirs est une plateforme web de troc de compétences entre étudiants de l’Université de Lorraine : 1 heure d’aide donnée = 1 crédit = 1 heure d’aide reçue, quelle que soit la matière. Projet étudiant (BUT 2, IUT Nancy-Brabois), slogan : « Donne ce que tu sais, reçois ce qu’il te manque. »

## Règles métier
- Chaque étudiant reçoit **2 crédits** à l’inscription.
- Un échange dure **1 heure** et coûte **1 crédit** à celui qui reçoit l’aide.
- Le crédit passe d’un compte à l’autre quand **les deux étudiants ont validé** l’échange.
- Après un échange, chacun laisse un **avis** (note de 1 à 5 + commentaire court).
- Les heures données débloquent des **badges d’engagement** : « Première aide », « Inter-filières » (aide donnée à une autre filière), « 10 h données ».
- Un étudiant peut télécharger une **attestation d’engagement** (PDF) qui liste ses heures données, pour son CV.
- Les crédits ne sont jamais convertibles en euros.

## Les 4 écrans (maquette déjà validée)
1. **Accueil / connexion** : logo, slogan, le principe « 1 h donnée → +1 crédit → 1 h reçue » sur 3 post-its, la mention « 2 crédits offerts à l’inscription » et un bouton « Me connecter avec mon compte étudiant ».
2. **Explorer** : « Salut [prénom] ! », solde de crédits, barre de recherche « Que veux-tu apprendre ? », filtres (Maths, Langues, Logiciels, Musique, Sport), liste des étudiants qui proposent une compétence (initiales, prénom, filière, compétences, lieu, « 1 h = 1 crédit »), et « Ta demande » en cours.
3. **Réserver un échange** : profil de l’aidant, texte « Ce que je propose », choix d’un créneau (grille de 4 créneaux), choix du lieu (une BU ou en visio), « Coût : 1 crédit », bouton « Réserver 1 h ».
4. **Mon profil** : portefeuille (solde, heures données et reçues), « Je sais » et « Je cherche » (étiquettes), badges (débloqués ou à débloquer), bouton « Attestation d’engagement pour mon CV ».

Navigation du bas : Explorer · Échanges · + (proposer une compétence) · Badges · Profil.

## Identité visuelle
- Style « tableau d’affichage du campus » : en-têtes vert tableau noir, cartes en post-its légèrement inclinés, écriture manuscrite pour les accents.
- Couleurs : vert tableau `#2E4036`, bois `#7A5131`, encre `#1B2A4A`, fond `#F4F6FA`, post-its jaune `#FFE27A`, rose `#F6B7C9`, bleu `#A8D5F2`, vert `#BFE3A2`, orange `#FFC37E`, lilas `#D4C4F2`.
- Polices (Google Fonts) : **Permanent Marker** pour le logo et les titres, **Caveat** pour les accents manuscrits, **Archivo** pour le texte.
- Logo : deux flèches courbes qui s’échangent dans un cercle en pointillés (une jaune, une blanche, point rose au centre).
- Mobile d’abord (390 px de large), mais le site doit aussi marcher sur ordinateur.

## Ce qu’il faut construire en premier (version 1)
1. Inscription et connexion par e-mail. La connexion avec le vrai compte de l’Université de Lorraine demandera un accord de l’université : prévoir de l’ajouter plus tard.
2. Profil : prénom, filière, compétences proposées, compétences cherchées.
3. Explorer : recherche et filtres sur les compétences proposées.
4. Réservation d’un échange (créneau + lieu) avec débit d’1 crédit après validation des deux côtés.
5. Avis après l’échange.
6. Badges et solde de crédits sur le profil.

Plus tard : messagerie entre étudiants, attestation PDF, espace entreprises (défis), tableau de bord pour l’université.

## Données
- `users` : id, prénom, nom, e-mail, filière, crédits (2 au départ), date d’inscription
- `skills` : id, user_id, intitulé, catégorie, type (« propose » ou « cherche »)
- `exchanges` : id, helper_id, learner_id, skill_id, créneau, lieu, statut (demandé, accepté, validé par l’aidant, validé par l’élève, terminé, annulé)
- `credit_transactions` : id, exchange_id, from_user, to_user, montant (1), date
- `reviews` : id, exchange_id, auteur, note, commentaire
- `badges` : id, user_id, type, date d’obtention

## Contraintes
- Données d’étudiants : respecter le RGPD (consentement à l’inscription, pas de données inutiles, suppression du compte possible).
- Bouton de signalement sur les profils et les avis, et une charte de bonne conduite à accepter à l’inscription.
- Tout le texte de l’appli est en français.
