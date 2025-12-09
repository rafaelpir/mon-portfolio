#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const categories = [
  'Design Graphique',
  'Développement Web',
  'Audiovisuel',
  'Motion Design',
  'UI/UX',
  'Autre'
];

console.log('\n🎨 AJOUTER UN NOUVEAU PROJET\n');

(async () => {
  try {
    // Questions
    const title = await question('📝 Titre du projet : ');
    const description = await question('📄 Description : ');

    console.log('\n📁 Catégories disponibles :');
    categories.forEach((cat, i) => console.log(`  ${i + 1}. ${cat}`));
    const categoryIndex = await question('\nNuméro de catégorie : ');
    const category = categories[parseInt(categoryIndex) - 1] || categories[0];

    const thumbnail = await question('\n🖼️  Chemin de la miniature (ex: /images/projects/mon-projet.jpg) : ');
    const video = await question('🎥 Chemin de la vidéo (ex: /videos/mon-projet.mp4) : ');

    const tags = await question('🏷️  Tags (séparés par des virgules) : ');
    const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);

    const year = await question('📅 Année (Enter pour année actuelle) : ');
    const projectYear = year || new Date().getFullYear().toString();

    // Créer l'objet projet
    const newProject = {
      id: Date.now(),
      title: title,
      description: description,
      category: category,
      thumbnail: thumbnail,
      video: video,
      tags: tagArray,
      year: projectYear
    };

    // Lire le fichier projects.js
    const projectsPath = path.join(__dirname, '../src/data/projects.js');
    let projectsContent = fs.readFileSync(projectsPath, 'utf8');

    // Extraire le tableau projects
    const projectsMatch = projectsContent.match(/export const projects = \[([\s\S]*?)\];/);
    if (!projectsMatch) {
      throw new Error('Impossible de trouver le tableau projects');
    }

    // Ajouter le nouveau projet
    const projectString = JSON.stringify(newProject, null, 2)
      .split('\n')
      .map((line, i) => i === 0 ? '  ' + line : '  ' + line)
      .join('\n');

    const updatedProjects = projectsContent.replace(
      /export const projects = \[([\s\S]*?)\];/,
      (match, content) => {
        const trimmedContent = content.trim();
        const hasProjects = trimmedContent.length > 0;
        return `export const projects = [\n${hasProjects ? content + ',\n' : ''}${projectString}\n];`;
      }
    );

    // Écrire le fichier
    fs.writeFileSync(projectsPath, updatedProjects, 'utf8');

    console.log('\n✅ Projet ajouté avec succès !');
    console.log(`\n📦 Détails :`);
    console.log(`   Titre: ${title}`);
    console.log(`   Catégorie: ${category}`);
    console.log(`   Tags: ${tagArray.join(', ')}`);
    console.log(`\n💡 N'oublie pas de placer tes fichiers :`);
    console.log(`   Miniature → public${thumbnail}`);
    console.log(`   Vidéo → public${video}`);
    console.log(`\n🚀 Relance ton serveur pour voir le nouveau projet !`);

  } catch (error) {
    console.error('\n❌ Erreur :', error.message);
  } finally {
    rl.close();
  }
})();
