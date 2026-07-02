export const portfolioData = {
  explorer: {
    nom: "Tchonang Ngangoum Christoph Peclard",
    titre: "Étudiant en Systèmes & Réseaux | Futur Ingénieur en Robotique",
    image:"/christoph.jpeg",
    description: "Passionné par l'interconnexion des systèmes, le développement IoT et l'administration réseau. J'aime concevoir des solutions intelligentes qui lient le code au monde physique.",
    github: "https://github.com/tchonang237",
    linkedin: "https://www.linkedin.com/in/tchonang",
    email: "christophtchonang90@gmail.com"
  },
  competences: [
    { categorie: "Réseaux & Systèmes", technologies: ["Cisco (CCNA3)", "Huawei", "OSPF/VLAN/STP", "MPLS"] },
    { categorie: "IoT & Robotique", technologies: ["Arduino", "ESP32", "ESP32-CAM", "Capteurs & Actionneurs"] },
    { categorie: "Développement", technologies: ["Python (Django)", "JavaScript (Vue 3)", "React Native", "C++ / CMake", "OpenCV"] },
    { categorie: "DevOps & Big Data", technologies: ["Docker", "Hadoop (Virtual Clusters)"] }
  ],
  parcours: [
    {
      id: 1,
      periode: "2026 – Présent",
      diplome: "Diplôme d'Ingénieur des Travaux Informatiques & Licence 3",
      etablissement: "Institut Africain d'Informatique (IAI)",
      lieu: "Yaoundé, Cameroun",
      description: "Spécialisation Systèmes et Réseaux. Administration réseau (OSPF, BGP, VLANs), architecture logicielle et développement d'applications, Internet des Objets (IOT)",
      type: "etude" // Utilisé pour afficher l'icône de chapeau de diplômé
    },
    {
      id: 2,
      periode: "2024 – 2025",
      diplome: "Diplôme de Technicien Supérieur",
      etablissement: "Institut Africain d'Informatique (IAI)",
      lieu: "Yaoundé, Cameroun",
      description: "Bases solides en algorithmique, maintenance des systèmes, réseaux informatiques locaux et développement d'applications web et mobiles.",
      type: "certif" // Utilisé pour afficher l'icône de badge/médaille
    },
     {
      id: 3,
      periode: "2023 – 2024",
      diplome: "Baccalauréat scientifique ",
      etablissement: "Collège la Perle Plus",
      lieu: "Yaoundé, Cameroun",
      description: "Bases solides en Mathématique, Physique, Chimie et informatique",
      type: "certif" // Utilisé pour afficher l'icône de badge/médaille
    }
  ],
  projets: [
    {
      id: 1,
      titre: "Couveuse Connectée Intelligente",
      categorie: "IoT / Aviculture",
      image:"/couveuse.png",
      description: "Conception et développement d'un incubateur automatisé pour l'aviculture. Gestion automatique du retournement des œufs, régulation précise de la température et suivi de l'humidité via ESP32.",
      technologies: ["Arduino", "ESP32", "Capteurs", "Gestion d'Énergie"]
    },
    {
      id: 2,
      titre: "Robot de Télésurveillance & Reconnaissance Faciale",
      categorie: "Robotique / IA",
      image:"/image.png",
      description: "Création d'une voiture robotisée de supervision à distance équipée d'un module ESP32-CAM, transmettant un flux vidéo en temps réel à un script PC exploitant l'intelligence artificielle pour la reconnaissance faciale.",
      technologies: ["ESP32-CAM", "C++", "OpenCV", "Python"]
    },
    {
      id: 3,
      titre: "Cluster Virtuel Big Data",
      categorie: "Systèmes & DevOps",
      image:"/reseau.png",
      description: "Simulation d'un cluster distribué complet pour le traitement de données volumineuses en utilisant Docker pour orchestrer des conteneurs Hadoop.",
      technologies: ["Docker", "Hadoop", "Architecture Réseau", "Linux"]
    }
  ],
  certifications: [
    {
      id: 1,
      titre: "Introduction à l'Internet des Objets (IOT)",
      organisme: "Cisco Networking Academy",
      image: "/iot (2).png", 
      lienVerification: "https://www.credly.com/badges/8831ceb2-1a48-439a-9cd8-76c98d64cfb8/public_url", // Votre lien de vérification officiel
      description: "Comprendre comment les objets et les systèmes embarqués font pour communiquer."
    },
    {
      id: 2,
      titre: "Introduction à la cybersécurité",
      organisme: "Cisco Networking Academy",
      image: "/cyber.png", 
      lienVerification: "https://www.credly.com/badges/8a1c0278-66a1-484a-be9c-891da124660b/public_url",
      description: "Présentation des nouvelles techniques de sécurité propices pour les entreprises."
    },
     {
      id: 3,
      titre: "ELABORATION ET MISE EN OEUVRE DE POLITIQUES ET PROCEDURES",
      organisme: "ONUDC",
      image: "/onu2.png", 
      lienVerification: "https://elearningunodc.org/pluginfile.php/1/tool_certificate/issues/1778236314/9085631332CT.pdf", // Votre lien de vérification officiel
      description: "Comprendre les techniques de protection contre les hackers. Maîtrise des outils de politique de sécurité."
    },
    {
      id: 4,
      titre: "CYBERSECURITE et CYBERCRIMINALITE",
      organisme: "ONUDC",
      image: "/onu1.png", 
      lienVerification: "https://elearningunodc.org/pluginfile.php/1/tool_certificate/issues/1776212787/7450635609CT.pdf",
      description: "Comprendre les techniques de protection contre les hackers. Maîtrise des outils de politique de sécurité."
    },
    {
      id: 5,
      titre: "INTRODUCTIO A LA SCIENCE DES DONNEES",
      organisme: "Cisco Networking Academy",
      image: "/data.png", 
      lienVerification: "https://www.credly.com/badges/1cdcb390-e773-4830-af39-e629c0e62b6f/public_url",
      description: "Maîtriser les outils de visualisation et de traitement des données."
    },
    {
      id: 6,
      titre: "SECURITE DES TERMINAUX",
      organisme: "Cisco Networking Academy",
      image: "/secu.png", 
      lienVerification: "https://www.credly.com/badges/38366dc1-d14e-47df-9aa8-4fb7f3297b50/public_url",
      description: "Maîtrise des types de réseau et topologies et leur sécurité."
    },
    {
      id: 7,
      titre: "CERTIFICATION C++ ",
      organisme: "Cisco Networking Academy",
      image: "/C++.png", 
      lienVerification: "https://www.credly.com/badges/eaec2490-3ad9-46df-a821-ea0e49fab350/public_url",
      description: "Maîtriser le langage C++ pour la programmation des cartes Arduino, ESP32..."
    },
    {
      id: 8,
      titre: "CERTIFICATION PYTHON ",
      organisme: "Cisco Networking Academy",
      image: "/C++.png", 
      lienVerification: "https://www.credly.com/badges/f0e5a433-537b-40d1-8702-1f90778eaad5/public_url",
      description: "Maîtriser les bases du langage Python pour des applications en science de données, IA et robotique."
    }
  ]
}