import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { App as CapacitorApp } from '@capacitor/app';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Axe, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, Users, Timer, Zap, Book, BookOpen, Lightbulb, Film, Flame, Share2, LogOut, Mail, Lock
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getRank } from './rankEngine';

// Initialize Firebase (using dummy config since google-services.json handles native, but web needs this)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ==========================================
// 📚 THE MEGA REPOSITORY (850+ Questions)
// ==========================================
const rawQuizData = {
  lore: {
    foundational: [
      ["Matchup: Jayden (Age 13) vs a Rank 2 Advanced Warrior?", "Jayden wins instantly via Reality Factor (RF) override", "The Warrior wins using technique", "Stalemate", "Jayden loses his memories"],
      ["Matchup: Michelle (with Ring) vs Standard Chrysealean Steel?", "The Ring provides absolute defense; the steel shatters", "The steel pierces the ring", "The ring turns the steel into Aetherium", "Michelle is forced to retreat"],
      ["What is the primary role of the Prime Creator?", "Maintaining the existence of the Ordverse through the Vessel", "Destroying lower dimensions", "Ruling the House of War", "Training Astraea"],
      ["Matchup: Mystic Kid vs 1,000 Earth Soldiers?", "Mystic Kid wins without taking a scratch", "The soldiers win using tactics", "Mystic Kid is captured", "Mystic Kid reverses time to avoid the fight"],
      ["What happens if a Mortal Anchor is destroyed?", "The connected deity loses their link to humanity and may become a Mad God", "The deity becomes Rank 14", "The Ordverse restarts", "Nothing happens"],
      ["Matchup: Jayden (Pre-Meditation) vs Mephistopheles?", "Jayden wins but dies from exhaustion", "Mephistopheles wins effortlessly", "They become allies", "Jayden erases him from history"],
      ["What is the 'House of War'?", "The lineage responsible for Chrysealis's military dominance", "A prison for Mad Gods", "Jayden's home in Detroit", "The source of the Memory Lock"],
      ["Who is the second pillar of the Triune?", "Supremus Daragvener", "Aetherius Dominus", "τὸ ἄγνωστον", "Valthar"],
      ["Matchup: Nichothéos vs an Army of Rank 7 Kings?", "Nichothéos dissolves their entire war by simply existing near them", "The Kings win by numbers", "Nichothéos is forced to use 100% AD power", "The Kings trap him in a seal"]
      ["Who makes up the Triune Symmetry?", "Aetherius Dominus, Supremus Daragvener, and τὸ ἄγνωστον", "Nicholas, Astraea, and Valthar", "The 1st, 4th, and 6th Kings", "Jayden, Mephistopheles, and Kailus"],
      ["What is a 'Mad God' in the Ordverse?", "A deity corrupted by absorbing too much chaotic dimensional energy", "A god of war who lost a battle", "A ruler of the Supreme Universe", "A human who drank Chrysealean blood"],
      ["Who is known as the Prime Creator?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar Demetrius"],
      ["What is the exact ratio of Nicholas's Crimson to Brown hair?", "57:43", "50:50", "60:40", "43:57"],
      ["What is the name of the Divine Empire?", "Chrysealis", "The Aetheridom Expanse", "The Supreme Universe", "The House of War"],
      ["What system is used to measure power progression in the Ordverse?", "Reality Factor (RF)", "Power Level (PL)", "Divine Energy", "Aura Points"],
      ["What is the 14th and absolute highest rank in the Ordverse hierarchy?", "True God", "Progenitor", "Primordial", "God"],
      ["What was Nichothéos's human identity when he was banished to Earth?", "Jayden Cameron", "Nicholas Caelestine", "Yveldinjar", "Valthar Demetrius"],
      ["Who is the protagonist's older brother who fell from grace?", "Yveldinjar (Mephistopheles)", "Valthar", "Kailus", "Ziphus"],
      ["How long did it take Nichothéos to end Mephistopheles's threat upon returning to Earth?", "Under three minutes", "Fourteen days", "One hour", "He couldn't defeat him"],
      ["What rank corresponds to a 'Saint' in the Ordverse hierarchy?", "Rank 9", "Rank 10", "Rank 7", "Rank 12"],
      ["What is the lowest rank (Rank 1) in the Ordverse hierarchy?", "Basic", "Novice", "Advanced", "Expert"],
      ["What was Jayden's superhero moniker when he debuted at age 13?", "Mystic Kid", "The Ultimate Warrior", "Kim Hyuk Jae", "Grand Champion"],
      ["What celestial event at age 12 granted Jayden invulnerability?", "A Polyvenium meteorite striking Lake Michigan", "A solar flare", "A magical spell", "A lightning strike"]
      ["Who is known as the Prime Creator in the Ordverse?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar Demetrius"],
      ["What name did the protagonist choose to honor his mother?", "Caelestine", "Demetrius", "Zichri", "Chrysealis"],
      ["Who is the current King of Chrysealis?", "King Kailus", "King Tirath", "King Miknelah", "King Ziphus"],
      ["What is the name of the Divine Empire?", "Chrysealis", "The Aetheridom Expanse", "The Supreme Universe", "The House of War"],
      ["Who was reinstated as the Crown Prince of Chrysealis?", "Yveldinjar (Mephistopheles)", "Valthar", "Nicholas", "Astraea"],
      ["What system is used to measure power progression in the Ordverse instead of traditional EXP?", "Reality Factor (RF)", "Power Level (PL)", "Divine Energy", "Aura Points"],
      ["What is the 14th and absolute highest rank in the Ordverse power hierarchy?", "True God", "Progenitor", "Primordial", "God"],
      ["What was Nichothéos's human identity when he was first banished to Earth?", "Jayden Cameron (The Mystic Kid)", "Nicholas Caelestine", "Yveldinjar", "Valthar Demetrius"],
      ["Who did Jayden fall in love with during his time as a mortal on Earth?", "Michelle", "Astraea", "Aelunira", "He never fell in love"],
      ["What is the name of the protagonist's older brother who fell from grace?", "Yveldinjar (Mephistopheles)", "Valthar", "Kailus", "Ziphus"],
      ["How long did Jayden's refinement process in Chrysealis take to achieve his Perfected State?", "14 days", "7 days", "30 days", "3 days"],
      ["How long did it take Nichothéos to end Mephistopheles's threat upon returning to Earth?", "Under three minutes", "Fourteen days", "One hour", "He couldn't defeat him"],
      ["What rank corresponds to a 'Saint' in the Ordverse hierarchy?", "Rank 9", "Rank 10", "Rank 7", "Rank 12"],
      ["What rank corresponds to a 'Sage' in the Ordverse hierarchy?", "Rank 10", "Rank 9", "Rank 11", "Rank 8"],
      ["What is the lowest rank (Rank 1) in the Ordverse hierarchy?", "Basic", "Novice", "Advanced", "Expert"],
      ["Who were Jayden Cameron's adoptive parents on Earth?", "Dr. Steve & Rachel Cameron", "James & Evelyn", "Michael & Aimi", "Draco & Michelle"],
      ["What was Jayden's superhero moniker when he debuted at age 13 by saving students from giants?", "Mystic Kid", "The Ultimate Warrior", "Grand Champion", "Kim Hyuk Jae"],
      ["Who was Jayden's biological brother on Earth?", "Draco Cameron", "Bradley Draxler", "Michael Larmarck", "Prince Edmundus"],
      ["What celestial event at age 12 granted Jayden invulnerability and super-strength?", "A Polyvenium meteorite striking Lake Michigan", "A solar flare", "A magical spell from James", "A lightning strike in Detroit"],
      ["What tragic event pushed Jayden to vow revenge at age 17.6?", "His uncle James was killed in the magical realm", "He lost his powers", "He was expelled from school", "He was banished to Japan"],
      ["How old was Jayden when he died saving Earth from Mephistopheles?", "18", "17", "21", "14"],
      ["Who did Jayden fall in love with during his time at the Michigan Group of Schools?", "Michelle", "Aimi", "Evelyn", "Rachel"],
      ["What bound Jayden to the ground during his grueling battle with Mephistopheles?", "Divine chains with the weight of Universes", "A gravity spell", "Polyvenium cuffs", "Chrysealean steel"],
      ["Whose murder did Mephistopheles confess to, which ultimately sent Jayden into a rage?", "James Cameron", "Dr. Steve Cameron", "Evelyn Williams", "Rachel Cameron"],
      ["What did Jayden need to activate the forbidden sigil against Mephistopheles?", "His life-force and his blood", "A Chrysealean incantation", "The power of the Sun", "Aetherium crystals"],
      ["Who was revealed to be the true identity of Mephistopheles?", "Yveldinjar Demetrius, Jayden's older brother", "Valthar, the Lost Prince", "King Kailus's brother", "A rogue Primordial"],
      ["After his death on Earth, where did Jayden wake up?", "Chrysealis", "The Aetheridom Expanse", "The Supreme Universe", "The Void"],
      ["How long did it take Nichothéos to defeat Mephistopheles during their rematch on Earth?", "Less than 3 minutes", "Fourteen days", "18 hours", "An entire day"],
      ["What terrifying moniker did Nichothéos adopt as he permanently left Chrysealis?", "The Crimson-haired God of Death", "The Lost Prince", "The Ultimate Conduit", "The Mystic Kid"],
      ["How did Nichothéos conquer defiant realms for Chrysealis before his banishment?", "Single-handedly without an army", "By leading the legendary Vanguard", "Using the combined power of the six lineages", "Through political diplomacy"],
      ["What was the 'official' reason given by the Chrysealean courts for Nichothéos's banishment?", "He was 'soft' and needed to learn the value of divine authority", "He tried to assassinate the King", "He lost a battle to a Primordial", "He refused to master weapons"],
      ["What terrifying visual omen appeared in lower verses when the Crimson God of War approached?", "The sky turned a deep, bruised red", "The sun would instantly set", "Oceans would turn to blood", "Gravity would reverse"],
      ["Which title was Nichothéos's official state rank and 'job description' in the House of Demetrius?", "Chrysealean God of War", "Crimson God of War", "God of Death", "The Lost Prince"],
      ["What does the title 'God of Death' specifically represent to the fallen?", "The absolute end and finality of his arrival", "The unstoppable force of his armies", "His mastery of dark magic", "His right to the throne"],
      ["Who did Nichothéos train, passing on his technical mastery of war?", "Astraea", "Yveldinjar", "Valthar", "King Kailus"],
      ["What did King Kailus actually want when he banished Nichothéos to Earth with a memory lock?", "A dead legend", "A better, more obedient son", "A spy in the Supreme Universe", "To protect him from Mephistopheles"],
      ["Who is Nicholas's biological daughter?", "Claire Emilia Cameron", "Kira Athlea", "Astraea", "Aelunira"],
      ["Who is Nicholas's adopted daughter and Claire's childhood best friend?", "Kira Athlea Hunter-Cameron", "Evelyn Williams", "Michelle", "Aimi"],
      ["What name is Kira Athlea Hunter-Cameron known by to her enemies?", "Kaeltharya", "Astraea", "Mephistopheles", "Aelunira"],
      ["Who is King Kailus Demetrius to Nicholas?", "His Father", "His Grandfather", "His Brother", "His Uncle"],
      ["Who is Queen Aelunira Caelestine?", "Nicholas's Mother", "Nicholas's Step-sister", "Michelle's Mother", "The Goddess of War"],
      ["Who is the 6th King of Chrysealis and the God of Light and Purity?", "King Kailus Demetrius", "King Tirath", "King Ziphus", "King Miknelah"],
      ["What special artifact did Jayden give to Michelle?", "A wedding ring forged from his essence", "The Aetherium Crown", "The Scepter of Ord", "A Polyvenium dagger"],
      ["Who is Evelyn Williams to Jayden?", "His Sister-in-law", "His Adopted Daughter", "His Mother", "His Ex-wife"],
      ["Who is the 1st King of Chrysealis and God of Creation?", "King Demetrius Zichri", "King Klarius", "King Kailus", "Valthar"],
      ["What is the name of the mortal who is Jayden's primary anchor to humanity?", "Michelle Williams", "Rachel Cameron", "Evelyn Williams", "Aimi"],
      ["Who is considered the 'True Source' and ultimate progenitor of Nicholas?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar"],
      ["Who is Jayden's older brother and the current Crown Prince?", "Yveldinjar (Mephistopheles)", "Draco Cameron", "Valthar", "Klarius"],
      ["What is the relation of James Cameron to Jayden?", "Earthly Father Figure / Guardian", "Biological Father", "Uncle from Chrysealis", "Older Brother"],
      ["Who is the new Chrysealean War-God following Nicholas's banishment?", "Astraea Demetrius", "Valthar", "Yveldinjar", "Miknelah"]
    ],
    intermediate: [
      ["What is the defining trait of a 'Reality Breaker'?", "Their presence alone cracks the space-time of lower-priority dimensions", "They can eat Polyvenium", "They are Rank 15", "They created the 1st King"],
      ["What is the Triune Symmetry?", "The fundamental three-fold Godhead of the Ordverse", "A weapon used by Kailus", "A ranking system for soldiers", "A bridge between Earth and Chrysealis"],
      ["Matchup: Astraea vs Nichothéos (0% AD)?", "Nichothéos wins; Astraea is just a 'manageable' version of his power", "Astraea wins as the current War-God", "They are exactly equal", "The King stops the fight"],
      ["What is the 'Perfected Combined State'?", "The synchronization of Jayden’s humanity and Nichothéos’s divinity", "Rank 14 status", "The result of the Memory Lock breaking", "A state only Valthar achieved"],
      ["What is the 'Aetheridom Expanse'?", "The infinite divine territory ruled by Chrysealis", "A desert on Earth", "The gap between the Triune pillars", "Mephistopheles's prison"],
      ["Matchup: Valthar the Lost Prince vs Rank 13 Beginner?", "Valthar wins effortlessly due to God of Raw Strength status", "The Rank 13 wins", "It's a stalemate", "Valthar is banished"],
      ["What represents 'Finality' in the title God of Death?", "The arrival of Nichothéos means the war is already over", "His ability to kill immortals", "His rule over the afterlife", "His black trench coat"]
      ["Matchup: Jayden vs Mephistopheles on Earth?", "Jayden won but died from extreme exhaustion", "Mephistopheles destroyed Earth", "Astraea intervened to save them both", "James Cameron defeated Mephistopheles"],
      ["What defines a 'Destroyer Deity' in Chrysealean history?", "A god whose domain naturally erases matter rather than conquering it", "A rebel who fights the Triune Symmetry", "Any Rank 10 Sage", "A mortal who wields an Aetherium weapon"],
      ["Who is Supremus Daragvener?", "The second pillar of the Triune Symmetry", "The lost 2nd King of Chrysealis", "The creator of the Memory Lock", "The true identity of James Cameron"],
      ["What makes the 3rd pillar, τὸ ἄγνωστον, unique?", "It is 'The Unknown', an enigmatic force beyond standard vessels", "It is the source of all Polyvenium", "It is the physical embodiment of Earth", "It rules the House of War"],
      ["At Rank 13 (God), an Advanced warrior can defeat how many Prime Beginners?", "100,000+", "15", "1,000", "1,000,000"],
      ["Who currently holds the absolute highest Peak level of Rank 13 (God)?", "Jayden", "Valthar", "King Kailus", "Astraea"],
      ["What is the base 'Multiple' for a newly promoted Advanced warrior at Rank 1 (Basic)?", "Can defeat 5 Prime Beginners", "Can defeat 10 Prime Beginners", "Can defeat 15 Prime Beginners", "Can defeat 2 Prime Beginners"],
      ["Which rank is occupied by the Chrysealean Immortals?", "Rank 12 (Progenitor)", "Rank 13 (God)", "Rank 11 (Primordial)", "Rank 14 (True God)"],
      ["Who connived to ruin Jayden's relationship with Michelle?", "Aimi and Prince Edmundus", "Mephistopheles and Draco", "James and Evelyn", "Bradley and Michael"],
      ["Who were Jayden's first friends in Denver, Colorado?", "Bradley Draxler & Michael Larmarck", "Steve & Draco", "Evelyn & Michelle", "Edmundus & Aimi"],
      ["How did Jayden secretly draw the forbidden sigil?", "He used his battle movements over several hours", "He used a cloaking spell", "He had James draw it before he died", "He used his telekinesis"],
      ["Which powerful Chrysealean gatekeeper helped Jayden recover his powers?", "Sethys", "Astraea", "Miknelah", "Klarius"],
      ["What title was stripped from Nichothéos and given to Astraea?", "Chrysealean War-God", "Crown Prince", "God of Light", "Supreme Protector"]
      ["Who is the third, enigmatic pillar of the Triune Symmetry?", "τὸ ἄγνωστον (The Unknown)", "Supremus Daragvener", "The Vessel", "The Ultimate Conduit"],
      ["Which King is known as the God of Chrysealean Magic?", "King Miknelah", "King Klarius", "King Tirath", "King Zichri"],
      ["Who is the current Chrysealean War-God following Nicholas's departure?", "Astraea", "Valthar", "Queen Aelunira", "Yveldinjar"],
      ["What is the penalty for a Chrysealean entering the Supreme Universe?", "Total Annihilation", "Memory Wipe", "Banishment to Earth", "Loss of Divine Domains"],
      ["What was the remnant of Nicholas's first Earth banishment?", "His brown hair", "His trench coat", "His mortal vulnerability", "His lost memories"],
      ["Except for Rank 14, what are the three sub-levels within each power rank?", "Beginner, Advanced, Peak", "Low, Mid, High", "Initiate, Master, Grandmaster", "Alpha, Beta, Omega"],
      ["Which rank does Saitama occupy at his Peak in the Ordverse scaling?", "Rank 10 (Sage)", "Rank 9 (Saint)", "Rank 11 (Primordial)", "Rank 8 (Emperor)"],
      ["Where do Cosmic Armor Superman and Rune King Thor sit in the Ordverse hierarchy?", "Peak-level Saint (Rank 9)", "Peak-level Sage (Rank 10)", "Advanced-level Emperor (Rank 8)", "Beginner-level God (Rank 13)"],
      ["In the Ordverse, transitioning between levels is not just a strength gain, but an increase in what?", "Dimensional Priority", "Physical Mass", "Magical Capacity", "Divine Right"],
      ["At Rank 13 (God), a newly promoted Advanced warrior can simultaneously defeat how many Prime Beginners?", "100,000+", "15", "1,000", "1,000,000"],
      ["Who currently holds the absolute highest Peak level of Rank 13 (God)?", "Jayden", "Valthar", "King Kailus", "Astraea"],
      ["What title was stripped from Nichothéos and given to his stepsister Astraea?", "War-God", "Crown Prince", "God of Light", "The Vessel"],
      ["What did King Kailus demand Nichothéos do to be reinstated in Chrysealis?", "Conquer Earth", "Kill Mephistopheles", "Marry a Chrysealean", "Give up his humanity"],
      ["What is the base 'Multiple' for a newly promoted Advanced warrior at Rank 1 (Basic)?", "Can defeat 5 Prime Beginners", "Can defeat 10 Prime Beginners", "Can defeat 15 Prime Beginners", "Can defeat 2 Prime Beginners"],
      ["Which rank is occupied by the Chrysealean Immortals?", "Rank 12 (Progenitor)", "Rank 11 (Primordial)", "Rank 13 (God)", "Rank 14 (True God)"],
      ["At age 11, Jayden won the World Swordsmanship Competition in South Korea under what alias?", "Kim Hyuk Jae", "Bradley Draxler", "Prince Edmundus", "Draco"],
      ["Who became Jayden's confidante after he revealed his identity as the Mystic Kid at age 13.5?", "Evelyn Williams", "Aimi", "Rachel Cameron", "Bradley Draxler"],
      ["Which two characters connived to successfully ruin Jayden's relationship with Michelle?", "Aimi and Prince Edmundus", "Mephistopheles and Draco", "James and Evelyn", "Bradley and Michael"],
      ["After 'The Incident' at age 7 in Denver, who did Jayden move to Detroit to live with?", "His uncle, James Cameron", "Dr. Steve Cameron", "A martial arts master in Japan", "Prince Edmundus"],
      ["At age 13.25, Jayden was forcibly transported to a higher dimension and won what title?", "Grand Champion of the Supreme Universe", "The Ultimate Warrior", "God of War", "Prime Creator"],
      ["On what specific days did Jayden experience recurring nightmares of dying to Mephistopheles?", "On his birthdays", "On New Year's Eve", "On the anniversary of his adoption", "On the day the meteorite struck"],
      ["Who were Jayden's first friends in Denver, Colorado?", "Bradley Draxler & Michael Larmarck", "Steve & Draco", "Evelyn & Michelle", "Edmundus & Aimi"],
      ["How did Jayden secretly draw the forbidden sigil without drawing Mephistopheles's attention?", "He used his battle movements over several hours", "He used a cloaking spell", "He had James draw it before he died", "He used his telekinesis"],
      ["How did Jayden acquire the blood needed to activate his forbidden sigil?", "He intentionally created an opening to be stabbed", "He bit his own hand", "He used Mephistopheles's blood", "He cut himself with his own sword"],
      ["After dying from exhaustion, which powerful Chrysealean gatekeeper helped Jayden recover his powers and memories?", "Sethys", "Astraea", "Miknelah", "Klarius"],
      ["Why did King Kailus so desperately want Yveldinjar brought back?", "He was his firstborn and son of his favorite queen", "He possessed the Royal Seal", "He was the only one who could defeat Jayden", "He needed him to activate the Memory Lock"],
      ["How did Jayden actually spend his 14 days of 'meditation' in Chrysealis?", "Secretly transferring his godly power into his axe to absorb as Jayden", "Praying to Aetherius Dominus", "Healing his mortal wounds", "Learning Chrysealean Magic"],
      ["What title was stripped from Nichothéos and given to Astraea?", "Chrysealean War-God", "Crown Prince", "God of Light", "Supreme Protector"],
      ["Who was given the title of Crown Prince after King Kailus disowned Nichothéos?", "Yveldinjar", "Astraea", "Valthar", "Ziphus"],
      ["How did Nichothéos mathematically guarantee the dismantling of resistance upon entering a new realm?", "He became X+1, where X is the realm's upper power limit", "He drained 50% of the realm's magic", "He multiplied his RF by the number of enemies", "He froze time indefinitely"],
      ["What was the true, political reason King Kailus banished Nichothéos?", "Fear of his overwhelming power and potential rebellion", "Nichothéos refused to conquer Earth", "To hide the truth about Yveldinjar", "To save Chrysealis from a resource drought"],
      ["Jayden's aversion to 'conquering' on Earth actually stemmed from what?", "Subconscious guilt and rejection of the monster his father made him", "A magical curse placed by James Cameron", "A side effect of the Polyvenium meteor", "Fear of his own mortality"],
      ["How did the title 'Crimson God of War' differ from standard War-Gods like Ares or Yveldinjar?", "He didn't use armies or tactics; his mere existence dissolved the enemy's war", "He relied entirely on weapon mastery rather than magic", "He only fought during the day", "He required the King's permission to strike"],
      ["What did choosing the name 'Nicholas' (Victory of the People) signify for the protagonist?", "Choosing to protect the very beings he once subjugated", "A tribute to his biological brother Draco", "An insult to Astraea", "Acceptance of his Chrysealean destiny"],
      ["What specific trait did Nichothéos inherit from the legacy of Valthar?", "The mastery of every weapon in the Expanse", "His 57:43 crimson-to-brown hair ratio", "The ability to manipulate time", "His invulnerability to Polyvenium"],
      ["Why did Kailus replace Nichothéos with Astraea as the Chrysealean God of War?", "He wanted a God of Technique he could control, rather than a God of Existence", "Astraea defeated Nichothéos in combat", "Astraea had a higher Reality Factor", "Nichothéos requested the transfer"],
      ["Which King was the God of Love and Wisdom?", "King Ziphus Demetrius", "King Klarius", "King Tirath", "King Miknelah"],
      ["King Miknelah Demetrius (the 3rd King) held which divine domain?", "God of Chrysealean Magic", "God of Mysteries and Courage", "God of Light and Purity", "God of Raw Strength"],
      ["What is the unique property of Michelle's wedding ring regarding Jayden's power?", "It acts as a key allowing her to use his divine abilities", "It makes her invisible", "It grants her Chrysealean Magic", "It turns her into a True God"],
      ["Who was the 5th King and the God of Beauty, Charm, Wealth, and Power?", "King Tirath Demetrius", "King Klarius", "King Ziphus", "King Zichri"],
      ["What was Valthar Demetrius's title and domain before he vanished?", "The Lost Prince and God of Raw Strength", "The 4th King and God of Courage", "The Crown Prince and God of Light", "The Founder and God of Creation"],
      ["What does Michelle's ring provide that ordinary weapons in the Supreme Universe cannot penetrate?", "The Ultimate Defense directly linked to his perfected form", "Complete immortality", "A shield of Polyvenium", "The power of the Triune Symmetry"],
      ["Who is the 4th King of Chrysealis and the God of Mysteries and Courage?", "King Klarius Demetrius", "King Miknelah", "King Ziphus", "King Tirath"],      ["Why did Jayden choose the surname 'Caelestine'?", "To honor his mother's grace and lineage", "It was James Cameron's true name", "To hide from Mephistopheles", "It means 'Victory of the People'"],
      ["What state was Jayden in when he forged Michelle's wedding ring?", "His perfected combined state", "His mortal state as the Mystic Kid", "His heavily injured state", "His 0% AD state"],
      ["Who is the biological brother of Yveldinjar (Mephistopheles)?", "Nichothéos (Nicholas)", "Draco Cameron", "Valthar", "Klarius"],
      ["What lineage does Queen Aelunira belong to?", "House Caelestine", "House Demetrius", "The House of War", "House Williams"],
      ["Which Chrysealean King is Nicholas's Great-grandfather?", "King Klarius Demetrius", "King Miknelah", "King Ziphus", "King Tirath"],
      ["Which King is Nicholas's Grandfather?", "King Tirath Demetrius", "King Kailus", "King Klarius", "Valthar"],
      ["Which generation of Chrysealean Kings does Kailus Demetrius represent?", "The 6th King", "The 5th King", "The 4th King", "The 7th King"]
    ],
    advanced: [
      ["Matchup: Nichothéos (1% AD Power) vs The 666 Mad Gods?", "Nichothéos overrides their chaotic RF and erases them", "The Mad Gods win by corruption", "The Triune Symmetry intervenes", "Nichothéos becomes a Mad God"],
      ["What is τὸ ἄγνωστον?", "The Unknown—the pillar of the Triune that defies even divine logic", "The name of the Memory Lock", "The planet Jayden was born on", "Mephistopheles's real name"],
      ["Matchup: Aetherius Dominus vs Supremus Daragvener?", "They are balanced pillars of the same Symmetry; no winner exists", "Aetherius wins", "Supremus wins", "The Ordverse collapses if they clash"],
      ["What is the mechanical function of the 'Vessel'?", "To process infinite power into finite actions without destroying the universe", "To store Polyvenium", "To shield the King from the Mad Gods", "To allow mortals to become gods"],
      ["Matchup: Nichothéos vs The Concept of Time?", "Nichothéos exists as a Reality Breaker beyond temporal priority", "Time slows him down", "He is trapped in a loop", "He uses a watch to control it"],
      ["Why did Kailus choose Astraea over Nicholas?", "He wanted a War-God of 'Technique' he could control, not a God of 'Existence'", "Astraea was stronger", "Nicholas refused to fight", "Nicholas was dead"],
      ["Matchup: The Prime Creator vs a Rank 14 Progenitor?", "The Prime Creator is the source; the Progenitor is merely a reflection", "The Progenitor wins", "It is a fair fight", "They cannot interact"],
      ["What is the 'X+1' Scaling Logic?", "Nichothéos becomes exactly one level higher than any resistance he meets", "It’s a math formula for XP", "The rule for the Memory Lock", "How Polyvenium is mined"],
      ["Matchup: Jayden (Detroit Era) vs A Reality Breaker?", "Jayden loses unless he breaks the Memory Lock to become Nichothéos", "Jayden wins with his sword", "The Breaker ignores him", "James Cameron saves him"],
      ["What is the 'Supreme Universe' randomization?", "A security measure that stripped Nichothéos of his specific identity upon banishment", "A game mode in NexusQuiz", "The way stars are born", "How Mephistopheles was created"]
      ["What happens when a Reality Breaker enters a lower dimension?", "Their base RF exceeds the dimensional cap, causing space-time tears", "They lose all their powers", "They instantly become the King of that realm", "They trigger a Polyvenium meteor strike"],
      ["Matchup: Nichothéos (0% AD) vs Valthar the Lost Prince?", "Nichothéos wins because his 'Existence' overrides Valthar's 'Technique'", "Valthar wins due to mastering all weapons", "It is a perfect stalemate", "Valthar wins using the Triune Symmetry"],
      ["What is the mechanical difference between a Reality Breaker and a True God (Rank 14)?", "A True God naturally encompasses all realities, while a Breaker forcibly shatters them", "A Reality Breaker is Rank 15", "True Gods require a Vessel; Breakers do not", "There is no difference"],
      ["Matchup: The combined armies of Chrysealis vs The Crimson God of War?", "Nichothéos's mere approach dissolves their war, making them functionally useless", "The armies win via attrition", "Kailus uses the Memory Lock to save the army", "The Triune prevents them from fighting"],
      ["Matchup: Astraea (Current War-God) vs Nichothéos?", "Nichothéos wins overwhelmingly; Astraea is just a manageable replacement for Kailus", "Astraea wins due to having the official title", "Astraea traps him in a Memory Lock", "They refuse to fight due to bloodlines"],
      ["What is the ultimate purpose of the 'Vessel' in relation to the Triune?", "To ground the infinite power of the Prime Creator into a comprehensible avatar", "To destroy Mad Gods", "To act as a prison for Mephistopheles", "To rewrite the laws of thermodynamics"],
      ["How did Nichothéos mathematically guarantee the dismantling of resistance?", "He became X+1, where X is the realm's upper power limit", "He drained 50% of the realm's magic", "He multiplied his RF by the number of enemies", "He froze time indefinitely"],
      ["What was the true, political reason King Kailus banished Nichothéos?", "Fear of his overwhelming power and potential rebellion", "Nichothéos refused to conquer Earth", "To hide the truth about Yveldinjar", "To save Chrysealis from a resource drought"],
      ["Why did Kailus replace Nichothéos with Astraea as War-God?", "He wanted a God of Technique he could control, rather than a God of Existence", "Astraea defeated Nichothéos", "Astraea had a higher RF", "Nichothéos requested it"],
      ["Who is the 3rd King and God of Chrysealean Magic?", "King Miknelah Demetrius", "King Klarius", "King Ziphus", "King Tirath"],
      ["What does Michelle's ring provide that ordinary weapons cannot penetrate?", "The Ultimate Defense directly linked to his perfected form", "Complete immortality", "A shield of Polyvenium", "The power of the Triune Symmetry"],
      ["What was Valthar Demetrius's title and domain before he vanished?", "The Lost Prince and God of Raw Strength", "The 4th King and God of Courage", "The Crown Prince and God of Light", "The Founder and God of Creation"],
      ["What was the power conversion rate when Nichothéos transferred his energy to Mystic Kid?", "One hour of transfer was greater than his original power as Mystic Kid", "It was a 1:1 ratio", "He lost 50% of his power", "It required 14 days to equal one hour"],
      ["Why did Nichothéos realize King Kailus actually wanted him to conquer Earth?", "To forever curb him by turning him into the King's weapon", "To harvest Earth's Polyvenium", "To prepare for a war against the Primordials", "To prove he no longer loved Michelle"],
      ["What was Mephistopheles's condition when he retreated from the blood sigil?", "He took severe damage and had a bit of his life-force drained", "He was completely uninjured but terrified", "He was trapped in an illusion", "His memories were locked"],
      ["How did Nichothéos's solo conquests politically affect the Chrysealean military?", "They made the King's armies and generals functionally useless and redundant", "They inspired the army to train harder", "They caused a civil war", "They bankrupted the empire"],
      ["How does Michelle's ring differ from a standard magical artifact in the Ordverse?", "It is a conduit of authority forged from his own essence", "It grants the user a Rank 13 status", "It bypasses the Memory Lock", "It neutralizes Polyvenium"]
      ["What is the exact ratio of Nicholas's Crimson to Brown hair?", "57:43", "50:50", "60:40", "43:57"],
      ["Why are Aetherius Dominus's memories sealed within the Nichothéos persona?", "To prevent the Ordverse from collapsing", "To hide from Supremus Daragvener", "As punishment for creating the Vessel", "To learn the ways of mortals"],
      ["Valthar Demetrius, the 'Lost Prince', was the God of what domain?", "Raw Strength & Weapons", "Mysteries and Courage", "Beauty, Charm, Wealth, and Power", "Creation"],
      ["What percentage of Aetherius Dominus's true power does Nichothéos utilize?", "0%", "1%", "10%", "100%"],
      ["How tall is Nicholas Caelestine?", "6'3\"", "6'0\"", "6'5\"", "6'1\""],
      ["How many Rank 13 Peak powerhouses can a Rank 14 True God overwhelm simultaneously?", "A googolplex", "One billion", "Infinite", "One hundred thousand"],
      ["At what specific sub-level of Rank 13 (God) does King Kailus Demetrius currently sit?", "Advanced", "Beginner", "Peak", "He is Rank 14"],
      ["What rank do World Breaker Hulk and the Strongest Wonder Woman occupy?", "Advanced Emperor (Rank 8)", "Peak Saint (Rank 9)", "Beginner King (Rank 7)", "Advanced Knight (Rank 6)"],
      ["Who is an example of a Rank 11 Primordial entity in the Ordverse?", "The Void / Cthulhu", "Saitama", "The Chrysealean Immortals", "Planetary-tier Lords"],
      ["What exactly was Mephistopheles attempting to force on Supreme Earth that led to war?", "A 'Fixed Point' of destruction", "A Chrysealean invasion", "The resurrection of Valthar", "The destruction of the Sun"],
      ["At Rank 2 (Advanced), what is the 'Multiple' for a newly promoted Advanced warrior against Prime Beginners?", "15", "5", "50", "100"],
      ["Why did Jayden's hair randomize to include brown during his first banishment?", "As a side effect of transitioning to a mortal vessel", "It was a curse from King Kailus", "To hide his identity from Mephistopheles", "It was a sign of his growing RF"],
      ["What does the 'Multiple' represent in the RF progression system?", "The number of lower sub-level warriors a newly promoted warrior can defeat simultaneously", "The amount of RF gained per battle", "The speed at which a warrior heals", "The number of dimensions a warrior can access"],
      ["What specific material struck Lake Michigan, contaminating Jayden and granting him his powers?", "Polyvenium", "Aetherium", "Chrysealean steel", "Void essence"],
      ["What was the secret, tragic history between James Cameron and Michelle's family?", "James was an ex-lover of Michelle's mother", "James accidentally injured Michelle's father", "James stole magic from their bloodline", "James was secretly Michelle's uncle"],
      ["What triggered Jayden's dismissal from military school between the ages of 9 and 10?", "An uncontrolled power leak during a commander incident", "Fighting with other cadets", "Refusing to follow orders", "Sneaking out to practice swordsmanship"],
      ["How did Mystic Kid undo the destruction caused by Mephistopheles at the cost of his own life?", "He used a war-spell fueled by his life force", "He reversed time using the Polyvenium", "He transferred his immortality to the Earth", "He absorbed Mephistopheles into his soul"],
      ["Which items did James give Jayden at age 13 to help him debut as the Mystic Kid?", "A Watch, Cloak, and Weapons", "A Mask, Ring, and Sword", "A Staff, Shield, and Armor", "An Amulet, Boots, and Gauntlets"],
      ["Where did Jayden travel at age 8 to train in Ninjutsu, subsequently meeting an obsessed Aimi?", "Japan", "South Korea", "China", "Tibet"],
      ["Who did Evelyn inform about Jayden's recurring death dreams, only to be dismissed?", "Michelle", "James", "Dr. Steve Cameron", "Aimi"],
      ["What was Jayden's final heroic act for Earth before he succumbed to exhaustion and died?", "He undid the illusion, reversing the destruction of the world", "He transferred his immortality to the planet", "He sealed the portal to Chrysealis", "He erased humanity's memory of the war"],
      ["What were Jayden's whispered last words before drawing his final breath?", "\"I failed father, I was not strong enough to avenge you completely.\"", "\"Michelle, I will always love you.\"", "\"The Demetrius name dies with me.\"", "\"Earth is safe now.\""],
      ["What was the power conversion rate when Nichothéos transferred his energy to his Mystic Kid form via his axe?", "One hour of transfer was greater than his original power as Mystic Kid", "It was a 1:1 ratio of power transfer", "He lost 50% of his power in the transfer", "It required 14 days to equal one hour of his true power"],
      ["Why did Nichothéos realize King Kailus actually wanted him to conquer Earth?", "To forever curb him by turning him into the King's weapon", "To harvest Earth's Polyvenium", "To prepare for a war against the Primordials", "To prove he no longer loved Michelle"],
      ["What is the exact blood relationship between Astraea and Yveldinjar (Mephistopheles)?", "They are blood sister and brother", "They are cousins", "Astraea is his aunt", "They share no blood relation"],
      ["When Mephistopheles retreated from the blood sigil, what was his condition?", "He took severe damage and had a bit of his life-force drained", "He was completely uninjured but terrified", "He was trapped in an illusion", "His memories were locked"],
      ["What ultimatum did King Kailus use to test Nichothéos's loyalty before stripping his titles?", "He ordered him to subdue Earth and bring it under Chrysealean rule", "He ordered him to execute Michelle", "He ordered him to yield 100% of his RF to Yveldinjar", "He ordered him to fight Astraea to the death"],
      ["How did Nichothéos's solo conquests politically affect the Chrysealean military?", "They made the King's armies and generals functionally useless and redundant", "They inspired the army to train harder", "They caused a civil war among the ranks", "They bankrupted the empire"],
      ["According to the updated lore entry, what is the primary difference between Valthar and Nichothéos?", "Valthar was the strongest in Chrysealean history, but Nichothéos was the strongest in existence", "Valthar was a God of Death, Nichothéos was a God of War", "Valthar conquered Earth, Nichothéos conquered the Expanse", "Valthar relied on magic, Nichothéos relied on physical strength"],
      ["What was the method Kailus used to essentially 'lobotomize' Nichothéos during his banishment?", "The randomization and memory lock of the Supreme Universe", "Extracting his Aetherium core", "Binding him with chains holding the weight of Universes", "Forcing him to live as a mortal infant"],
      ["What does the title 'Crimson God of War' specifically represent from the perspective of the battlefield?", "The unstoppable, rare-blooded force that fights alone", "The official commander of the King's legions", "The absolute end and finality of death", "The merciful protector of the weak"],
      ["What did Kailus realize would happen if Nichothéos ever turned his 'One-Man Army' focus toward the Throne?", "Nothing, not even the combined six lineages, could stop him", "The Triune Symmetry would intervene to save the King", "Astraea would be able to defeat him", "The Supreme Universe would collapse"],
      ["King Demetrius Zichri is exactly how many generations removed from Nicholas?", "4x Great-grandfather", "3x Great-grandfather", "5x Great-grandfather", "Great-grandfather"],
      ["Valthar Demetrius is the first son of which Chrysealean King?", "King Tirath Demetrius", "King Klarius", "King Kailus", "King Miknelah"],
      ["Which King is Nicholas's 3x Great-grandfather?", "King Ziphus Demetrius", "King Miknelah", "King Zichri", "King Klarius"],
      ["How is Astraea related to Yveldinjar and Nichothéos?", "Step-sister to Nichothéos and blood sister to Yveldinjar", "Blood sister to Nichothéos and step-sister to Yveldinjar", "Cousin to both", "Adopted daughter of Kailus"],
      ["The wedding ring given to Michelle is described as a literal fragment of what?", "The Absolute", "The Triune Symmetry", "The Void", "Aetherium"],
      ["What prevents any weapon in Chrysealis from penetrating Michelle's defense?", "The ring's direct link to Jayden's perfected form", "Her status as the Mortal Anchor", "A spell cast by James Cameron", "Her own Reality Factor"],
      ["Who is the 2x Great-grandfather of Nicholas?", "King Miknelah Demetrius", "King Klarius", "King Ziphus", "King Tirath"],
      ["What specific status does Michelle hold in the Character Summary Table?", "Mortal Anchor", "The Supreme Queen", "The Ultimate Conduit", "Chrysealean War-God"],
      ["What trait defines the noble House Caelestine, according to Queen Aelunira's origin?", "High-tier status known for elegance and celestial grace", "The mastery of raw strength and weapons", "Absolute control over Chrysealean magic", "Being the true founders of the Demetrius line"],
      ["How does the ring differ from a standard magical artifact in the Ordverse?", "It is a conduit of authority forged from his own essence", "It grants the user a Rank 13 status", "It bypasses the Memory Lock", "It neutralizes Polyvenium"],
      ["Who is known as Kaeltharya by her enemies?", "Kira Athlea Hunter-Cameron", "Claire Emilia Cameron", "Astraea Demetrius", "Aimi"],
      ["What relation is Kira Athlea to Claire Emilia Cameron?", "Childhood best friend and adopted sister", "Biological sister", "Mother", "Cousin"],
      ["Why is Michelle considered Jayden's 'primary anchor'?", "Her existence is the main reason he protects Earth", "She holds the Memory Lock", "She is the only one who can defeat him", "She is the reincarnation of a Chrysealean God"],["What is the signature weapon wielded by Nichothéos in the Ordverse?", "The Golden Axe", "The Infinity Blade", "The Crimson Staff", "The Void Spear"],["What is the distinct color of the aura emitted by Nichothéos's Golden Axe?", "Divine Crimson (Red)", "Electric Blue", "Emerald Green", "Void Purple"],["Nichothéos's Golden Axe is primarily known for its ability to cut through:", "Anything and Everything", "Physical armor only", "Magical barriers only", "Space-time and Realities"],["Who is the current bearer of the Golden Axe with the red tint?", "Nichothéos", "Jayden", "The Rank 2 Warrior", "Mephistopheles"],["The red tint on Nichothéos's weapon represents which type of energy?", "Aetherius Essence", "Primordial Divine Energy", "Kinetic Force", "Solar Radiation"],["What material was used to forge the handle of the Golden Axe?", "It's Unknown", "Infinity Steel", "Obsidian", "Mythril"],["Nichothéos used the Golden Axe to end the threat of which antagonist?", "Mephistopheles", "The Shadow King", "The Prime Hunter", "The Void Nomad"],["The weight of the Golden Axe is said to be equivalent to:", "All of Existence", "A mountain", "The weight of ten dying stars", "It has no weight because it is divine"],["Which studio logo features elements inspired by Nichothéos's divine power?", "THE INFINITY STUDIOS™", "Nexus Graphics", "Ord-Gen", "Crimson Arts"]
    ]
  },
  science: {
    foundational: [["At what temperature does water freeze?", "0°C", "10°C", "32°C", "-10°C"],["Which planet is closest to the Sun?", "Mercury", "Venus", "Earth", "Mars"],["What unseen force pulls objects toward the center of the Earth?", "Gravity", "Magnetism", "Friction", "Inertia"],["What do you call an animal that eats only plants?", "Herbivore", "Carnivore", "Omnivore", "Insectivore"],["What is the hardest naturally occurring substance on Earth?", "Diamond", "Gold", "Iron", "Quartz"],["What gas do plants absorb from the air to make their food?", "Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],["What is the center part of an atom called?", "Nucleus", "Electron", "Proton", "Molecule"],["What is Earth's only natural satellite?", "The Moon", "The Sun", "Mars", "Europa"],["How many legs does a spider have?", "8", "6", "10", "12"],["What is the process of a caterpillar turning into a butterfly called?", "Metamorphosis", "Photosynthesis", "Evolution", "Shedding"],["Through which of these does sound travel the fastest?", "Solid Wood", "Air", "Water", "Vacuum"],["What is the solid state of water called?", "Ice", "Steam", "Cloud", "Snow"],["What is the main source of light and heat for the Earth?", "The Sun", "The Moon", "Geothermal Energy", "Wind"],["Which organ pumps blood throughout the human body?", "Heart", "Lungs", "Brain", "Liver"],["How many colors are typically seen in a rainbow?", "7", "5", "6", "8"],["A push or a pull acting on an object is called a...", "Force", "Mass", "Weight", "Speed"],["What sweet liquid do bees collect from flowers?", "Nectar", "Pollen", "Honey", "Sap"],["Which state of matter has a fixed shape and a fixed volume?", "Solid", "Liquid", "Gas", "Plasma"],["What instrument is used to look at distant stars and planets?", "Telescope", "Microscope", "Stethoscope", "Periscope"],["What is the largest mammal currently living on Earth?", "Blue Whale", "Elephant", "Giraffe", "Great White Shark"],["What do we call the path a planet takes around the sun?", "Orbit", "Rotation", "Spin", "Axis"],["What part of the plant conducts photosynthesis?", "Leaf", "Root", "Stem", "Flower"],["Which animal is known as the King of the Jungle?", "Lion", "Tiger", "Elephant", "Gorilla"],["What is the main gas found in the air we breathe?", "Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],["Which of these is a reptile?", "Snake", "Frog", "Salamander", "Toad"],["What do we call frozen rain?", "Hail", "Dew", "Fog", "Mist"],["What gives plants their green color?", "Chlorophyll", "Melanin", "Carotene", "Hemoglobin"],["How many senses do humans generally have?", "5", "4", "6", "7"],["Which of these is a non-renewable energy source?", "Coal", "Solar", "Wind", "Hydroelectric"],["What part of the body contains the most bones?", "Hand", "Skull", "Spine", "Ribcage"],["Which force slows down moving objects when they touch?", "Friction", "Gravity", "Magnetism", "Tension"],["What is the natural habitat of a polar bear?", "Arctic", "Antarctica", "Desert", "Rainforest"],["What type of rock is formed from cooled lava?", "Igneous", "Sedimentary", "Metamorphic", "Fossilized"],["Which bird is famous for its colorful tail feathers?", "Peacock", "Penguin", "Ostrich", "Eagle"],["What are clouds made of?", "Water droplets", "Smoke", "Cotton", "Cotton candy"],["What kind of energy is produced by moving water?", "Hydroelectric", "Geothermal", "Solar", "Nuclear"],["What simple machine is a ramp?", "Inclined Plane", "Lever", "Pulley", "Wedge"],["What tool is used to measure temperature?", "Thermometer", "Barometer", "Speedometer", "Altimeter"],["Which planet is known for its rings?", "Saturn", "Jupiter", "Mars", "Uranus"],["What is a baby frog called?", "Tadpole", "Fry", "Pup", "Cub"],["What gas do humans exhale?", "Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],["What is the largest ocean on Earth?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],["Which of these materials is a good conductor of electricity?", "Copper", "Rubber", "Wood", "Glass"],["What animal is known for having a hump on its back?", "Camel", "Horse", "Rhino", "Giraffe"],["What forms when water vapor cools and turns back into liquid?", "Condensation", "Evaporation", "Precipitation", "Sublimation"],["What do you call a scientist who studies stars?", "Astronomer", "Biologist", "Geologist", "Chemist"],["What is the protective outer layer of a tree called?", "Bark", "Leaf", "Root", "Branch"],["Which of these animals hibernates in winter?", "Bear", "Dog", "Cat", "Bird"],["What shape is a full moon?", "Circle", "Crescent", "Square", "Triangle"],["What makes ocean water taste salty?", "Dissolved minerals", "Fish", "Sand", "Seaweed"],["The Heisenberg Uncertainty Principle states you cannot know momentum and...", "Position", "Energy", "Spin", "Charge"],["Which enzyme 'unzips' the double helix during DNA replication?", "Helicase", "DNA Polymerase", "Ligase", "Primase"],["Which pure metallic element possesses the highest melting point?", "Tungsten", "Titanium", "Platinum", "Carbon"],["Which fundamental force is responsible for beta decay?", "Weak Nuclear Force", "Strong Nuclear Force", "Electromagnetism", "Gravity"],["What translates mRNA into a sequence of amino acids?", "Translation", "Transcription", "Replication", "Mutation"],["The Schrödinger equation calculates...", "The quantum state of a system", "Orbital velocity", "Gravitational waves", "Relativistic time dilation"],["Non-superimposable mirror image molecules are called...", "Enantiomers", "Diastereomers", "Isotopes", "Polymers"],["What is the most abundant structural protein in humans?", "Collagen", "Hemoglobin", "Keratin", "Myosin"],["Which particle grants mass to other particles (found in 2012)?", "Higgs Boson", "Tau Neutrino", "Up Quark", "Muon"],["What is the chemical name for C6H6?", "Benzene", "Methane", "Toluene", "Phenol"],["During an action potential, depolarization is caused by influx of...", "Sodium", "Potassium", "Calcium", "Chloride"],["Which equation relates Gibbs Free Energy, Enthalpy, and Entropy?", "ΔG = ΔH - TΔS", "ΔG = ΔH + TΔS", "ΔG = TΔH - ΔS", "ΔG = ΔS - TΔH"],["Bernoulli's principle shows an inverse relationship between fluid speed and...", "Pressure", "Temperature", "Viscosity", "Density"],["Where does the Krebs cycle take place?", "Mitochondrial Matrix", "Cytoplasm", "Golgi Apparatus", "Endoplasmic Reticulum"],["The First Law of Thermodynamics is the conservation of...", "Energy", "Mass", "Momentum", "Entropy"],["An SN2 reaction mechanism proceeds via...", "A concerted 'backside attack'", "A carbocation intermediate", "A radical intermediate", "Elimination of a proton"],["Which elementary particle has zero rest mass?", "Photon", "Electron", "Neutron", "Quark"],["What neurotransmitter triggers muscle contraction?", "Acetylcholine", "Dopamine", "Serotonin", "GABA"],["The Ideal Gas Law is represented by...", "PV = nRT", "P1V1 = P2V2", "V = IR", "E = mc^2"],["What phenomenon describes correlated quantum states regardless of distance?", "Entanglement", "Superposition", "Tunneling", "Decoherence"],["What principle forbids two fermions from occupying the same quantum state?", "Pauli Exclusion Principle", "Hund's Rule", "Aufbau Principle", "Bohr Model"],["Which pathway converts glucose into pyruvate?", "Glycolysis", "Gluconeogenesis", "Beta-oxidation", "Calvin Cycle"],["What is the defining characteristic of an aromatic compound?", "A delocalized pi electron ring", "Triple bonds", "Contains oxygen", "Linear structure"],["Which equation relates wavelength of particle to its momentum?", "De Broglie equation", "Planck's equation", "Rydberg equation", "Maxwell's equations"],["In immunology, which cells produce antibodies?", "B cells", "T cells", "Macrophages", "Neutrophils"]],
    intermediate: [["What organelle is the 'powerhouse' of the cell?", "Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],["What is the atomic symbol for Gold?", "Au", "Ag", "Gd", "Go"],["What is the most abundant gas in Earth's atmosphere?", "Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],["What is the approximate speed of light in a vacuum?", "3 x 10^8 m/s", "1.5 x 10^8 m/s", "3 x 10^6 m/s", "1 x 10^9 m/s"],["By what biological process do plants convert light into chemical energy?", "Photosynthesis", "Respiration", "Transpiration", "Digestion"],["According to Newton's Second Law, Force equals...", "Mass x Acceleration", "Mass / Acceleration", "Mass x Velocity", "Work / Time"],["What is the pH level of pure water?", "7", "0", "14", "5.5"],["What is the process of cell division resulting in two identical cells?", "Mitosis", "Meiosis", "Fission", "Budding"],["In Chemistry, what is Avogadro's number?", "6.022 x 10^23", "3.14 x 10^15", "1.602 x 10^-19", "2.99 x 10^8"],["What is the standard SI unit of electrical resistance?", "Ohm", "Volt", "Ampere", "Watt"],["What is the chemical formula for standard table salt?", "NaCl", "NaOH", "HCl", "KCl"],["What is the formula for calculating Kinetic Energy?", "1/2 mv^2", "mgh", "mc^2", "Fd"],["Which cell organelle synthesizes proteins?", "Ribosome", "Lysosome", "Golgi Apparatus", "Vacuole"],["The atomic number of an element is determined by the number of...", "Protons", "Neutrons", "Electrons", "Protons and Neutrons"],["The Law of Conservation of Energy states energy cannot be...", "Created or destroyed", "Transferred", "Stored", "Measured"],["An organism's physical appearance is called its...", "Phenotype", "Genotype", "Allele", "Chromosome"],["What chemical bond shares electron pairs between atoms?", "Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],["What is the acceleration due to gravity on Earth?", "9.8 m/s^2", "3.14 m/s^2", "1.6 m/s^2", "15.2 m/s^2"],["Which blood cells carry oxygen?", "Red Blood Cells", "White Blood Cells", "Platelets", "Lymphocytes"],["Group 18 elements are known as...", "Noble Gases", "Alkali Metals", "Halogens", "Transition Metals"],["What type of energy is stored in stretched rubber bands?", "Elastic Potential Energy", "Kinetic Energy", "Thermal Energy", "Chemical Energy"],["What is the main function of white blood cells?", "Fighting infection", "Carrying oxygen", "Clotting blood", "Digesting food"],["What principle states that buoyant force equals the weight of displaced fluid?", "Archimedes' Principle", "Pascal's Principle", "Bernoulli's Principle", "Boyle's Law"],["In genetics, what does DNA stand for?", "Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Nitrogen Acid", "Dynamic Nucleic Acid"],["What is a chemical reaction that releases heat called?", "Exothermic", "Endothermic", "Isothermic", "Catalytic"],["Which subatomic particle has a negative charge?", "Electron", "Proton", "Neutron", "Nucleus"],["What phase change occurs when a gas turns into a liquid?", "Condensation", "Evaporation", "Sublimation", "Melting"],["Who is considered the father of modern genetics?", "Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Isaac Newton"],["What wave property determines the pitch of a sound?", "Frequency", "Amplitude", "Wavelength", "Speed"],["What is the half-life of a radioactive isotope?", "Time for half of it to decay", "Time for it to fully decay", "Half its physical lifespan", "Time to double in mass"],["What part of the brain controls balance and coordination?", "Cerebellum", "Cerebrum", "Brainstem", "Hypothalamus"],["What element has the chemical symbol 'Fe'?", "Iron", "Fluorine", "Francium", "Lead"],["Which law states volume of a gas is inversely proportional to its pressure?", "Boyle's Law", "Charles's Law", "Avogadro's Law", "Gay-Lussac's Law"],["What cellular structure contains the genetic material in eukaryotes?", "Nucleus", "Cytoplasm", "Cell Membrane", "Ribosome"],["What type of lens is thicker in the middle and magnifies objects?", "Convex", "Concave", "Plano", "Cylindrical"],["In an ecosystem, fungi and bacteria serve as...", "Decomposers", "Producers", "Primary Consumers", "Apex Predators"],["What type of mixture is visually uniform throughout (like saltwater)?", "Homogeneous", "Heterogeneous", "Suspension", "Colloid"],["What is the unit of power?", "Watt", "Joule", "Newton", "Ampere"],["What blood vessel carries oxygenated blood away from the heart?", "Artery", "Vein", "Capillary", "Venule"],["What is the process traits are passed from parents to offspring?", "Heredity", "Mutation", "Evolution", "Homeostasis"],["Which group on the periodic table contains highly reactive metals like Sodium?", "Alkali Metals", "Alkaline Earth Metals", "Halogens", "Noble Gases"],["What phenomenon causes a prism to split white light into colors?", "Dispersion", "Reflection", "Diffraction", "Interference"],["What is the chemical formula for glucose?", "C6H12O6", "CO2", "H2O", "CH4"],["What is the primary function of the large intestine?", "Absorbing water", "Absorbing nutrients", "Digesting proteins", "Producing bile"],["Which law states that action has an equal opposite reaction?", "Newton's Third Law", "Newton's First Law", "Newton's Second Law", "Law of Gravitation"],["What type of reproduction involves only one parent?", "Asexual", "Sexual", "Meiosis", "Fertilization"],["What is the name for a substance that speeds up a chemical reaction?", "Catalyst", "Inhibitor", "Reactant", "Product"],["What scalar quantity is the rate distance covered?", "Speed", "Velocity", "Acceleration", "Displacement"],["What is the most common isotope of carbon used in radiometric dating?", "Carbon-14", "Carbon-12", "Carbon-13", "Carbon-16"],["What fluid in the human body is primarily made of water, plasma, and cells?", "Blood", "Lymph", "Saliva", "Bile"],["What phenomenon causes the expansion of universe to accelerate?", "Dark Energy", "Dark Matter", "Black Holes", "Cosmic Microwave Background"],["What is the hybridization of the carbon atom in methane (CH4)?", "sp3", "sp2", "sp", "d2sp3"],["Which organelle is responsible for breaking down cellular waste?", "Lysosome", "Peroxisome", "Endosome", "Centriole"],["Speed of a wave on string depends on tension and...", "Linear mass density", "Amplitude", "Frequency", "Length"],["What type of enzyme cuts DNA at specific recognition nucleotide sequences?", "Restriction enzyme", "DNA ligase", "Reverse transcriptase", "Taq polymerase"],["In standard model, what particles make up a proton?", "2 Up quarks, 1 Down quark", "1 Up quark, 2 Down quarks", "3 Up quarks", "Gluons and Bosons"],["Major product of a Markovnikov addition of HBr to an alkene?", "The more substituted alkyl bromide", "The less substituted alkyl bromide", "An alkane", "An alcohol"],["Which hormone regulates the sleep-wake cycle?", "Melatonin", "Cortisol", "Thyroxine", "Insulin"],["What is measure of disorder or randomness in closed system?", "Entropy", "Enthalpy", "Free Energy", "Heat Capacity"],["Which cells in retina are responsible for color vision?", "Cones", "Rods", "Bipolar cells", "Ganglion cells"],["What is process where a solid changes directly into a gas?", "Sublimation", "Deposition", "Vaporization", "Fusion"],["In molecular cloning, what is a plasmid used for?", "As a vector to introduce foreign DNA", "To sequence proteins", "To destroy viruses", "To measure pH"],["According to general relativity, gravity is described as...", "The curvature of spacetime", "A force carrying particle", "A magnetic attraction", "Quantum entanglement"],["What is principle structural component of plant cell walls?", "Cellulose", "Chitin", "Peptidoglycan", "Glycogen"],["Which rule states aromaticity requires 4n+2 pi electrons?", "Hückel's Rule", "Zaitsev's Rule", "Markovnikov's Rule", "Le Chatelier's Principle"],["What is main inhibitory neurotransmitter in mammalian central nervous system?", "GABA", "Glutamate", "Epinephrine", "Histamine"],["Which thermodynamic potential is minimized at constant temperature and pressure?", "Gibbs Free Energy", "Helmholtz Free Energy", "Internal Energy", "Enthalpy"],["What is the evolutionary process distantly related organisms evolve similar traits?", "Convergent evolution", "Divergent evolution", "Coevolution", "Adaptive radiation"],["In an LC circuit, what oscillates?", "Electric and Magnetic fields", "Temperature and Pressure", "Mass and Velocity", "Protons and Neutrons"],["Which organ responsible for Cori Cycle (lactic acid recycling)?", "Liver", "Kidney", "Pancreas", "Spleen"],["Mathematical operator describes total energy of quantum system?", "Hamiltonian", "Lagrangian", "Laplacian", "Jacobian"],["Term for an allele that only expressed in homozygous state?", "Recessive", "Dominant", "Codominant", "Epistatic"],["What transition metal is at the center of hemoglobin molecule?", "Iron (Fe)", "Magnesium (Mg)", "Copper (Cu)", "Zinc (Zn)"],["Which phenomenon describes light bending around edge of obstacle?", "Diffraction", "Refraction", "Interference", "Polarization"],["What is the limit of strong force's effective range?", "Roughly 1 femtometer", "1 nanometer", "1 millimeter", "Infinite"]],
    advanced: [["Which law relates the rate of heat transfer by radiation to the fourth power of the absolute temperature?", "Stefan-Boltzmann Law", "Fourier's Law", "Newton's Law of Cooling", "Planck's Law"],["In mass transfer, the ratio of the boundary layer thickness to the thermal boundary layer is the:", "Prandtl Number", "Lewis Number", "Schmidt Number", "Nusselt Number"],["The fugacity of a component in an ideal gas mixture is equal to its:", "Partial pressure", "Mole fraction", "Total pressure", "Chemical potential"],["A PID controller's 'Integral' action is primarily used to eliminate:", "Steady-state offset", "Overshoot", "System noise", "Response lag"],["In fluid flow, the 'Fanning friction factor' is exactly what fraction of the 'Darcy friction factor'?", "1/4", "1/2", "2", "4"],["For a zero-order reaction, the time required for 50% conversion is proportional to:", "Initial concentration", "Inverse of initial concentration", "Square root of concentration", "Temperature"],["Which unit operation is used to remove a solute from a solid using a liquid solvent?", "Leaching", "Absorption", "Adsorption", "Distillation"],["In thermodynamics, which Maxwell relation is derived from the Gibbs free energy (G)?", "(dV/dT)p = -(dS/dP)T", "(dT/dP)s = (dV/dS)p", "(dS/dV)t = (dP/dT)v", "(dT/dV)s = -(dP/dS)v"],["What is the term for the maximum possible conversion in a reversible exothermic reaction?", "Equilibrium conversion", "Stoichiometric conversion", "Limit conversion", "Adiabatic conversion"],["In process economics, the 'Net Present Value' (NPV) must be ______ for a project to be considered profitable.", "Greater than zero", "Less than zero", "Equal to one", "Constant"],["Which type of valve is best for precise throttling of flow?", "Globe valve", "Gate valve", "Check valve", "Ball valve"],["In heat transfer, 'Fouling' in a heat exchanger results in an increase of:", "Thermal resistance", "Heat transfer coefficient", "Fluid velocity", "Log Mean Temperature Difference"],["The 'Ergun Equation' is used to calculate pressure drop in which type of system?", "Packed bed", "Pipe flow", "Open channel", "Fluidized bed"],["Which dimensionless number represents the ratio of reaction rate to the mass transfer rate?", "Hatta Number", "Damkohler Number", "Thiele Modulus", "Sherwood Number"],["In distillation, the 'Feed Line' (q-line) for a saturated liquid feed has a slope of:", "Vertical (Infinite)", "Horizontal (Zero)", "Negative", "Positive"],["Which property is minimized when a system reaches equilibrium at constant T and V?", "Helmholtz Free Energy", "Gibbs Free Energy", "Entropy", "Enthalpy"],["The 'Arrhenius Equation' shows that the rate constant k increases ______ with temperature.", "Exponentially", "Linearly", "Logarithmically", "Inversely"],["In a cooling tower, the lowest temperature to which water can be cooled is the:", "Wet-bulb temperature", "Dry-bulb temperature", "Dew point", "Ambient temperature"],["Which pump type is most suitable for handling highly viscous fluids like polymers?", "Positive Displacement Pump", "Centrifugal Pump", "Axial Flow Pump", "Eductor Pump"],["In mass transfer, 'Equimolar Counter-Diffusion' occurs when mass flux Na is equal to:", "-Nb", "Nb", "Zero", "One"],["In petroleum refining, 'API Gravity' is inversely proportional to which fluid property?", "Specific Gravity", "Viscosity", "Boiling Point", "Refractive Index"],["Which process is used to convert low-octane linear alkanes into high-octane branched alkanes?", "Isomerization", "Alkylation", "Hydrotreating", "Visbreaking"],["The 'Octane Number' is a measure of a fuel's resistance to:", "Knocking", "Freezing", "Evaporation", "Soot formation"],["In a refinery, 'Sweetening' refers to the removal of which impurity?", "Hydrogen Sulfide (H2S)", "Nitrogen", "Oxygen", "Heavy Metals"],["Which distillation process is used for heavy atmospheric residues to prevent thermal cracking?", "Vacuum Distillation", "Flash Distillation", "Extractive Distillation", "Azeotropic Distillation"],["The 'Cetane Number' is a primary quality indicator for which type of fuel?", "Diesel", "Gasoline", "Aviation Fuel", "Kerosene"],["Which catalytic process uses a zeolite catalyst to break long-chain hydrocarbons into gasoline?", "Fluid Catalytic Cracking (FCC)", "Hydrocracking", "Coking", "Reforming"],["The 'Cloud Point' of a petroleum oil is the temperature at which:", "Wax crystals begin to form", "The oil ceases to flow", "Vapors ignite", "Moisture evaporates"],["In 'Catalytic Reforming', the main goal is to increase the content of:", "Aromatics", "Olefins", "Naphthenes", "Paraffins"],["Which refining process involves the reaction of light olefins with isobutane to produce high-octane components?", "Alkylation", "Polymerization", "Hydrotreating", "Cracking"],["In safety engineering, 'BLEVE' stands for:", "Boiling Liquid Expanding Vapor Explosion", "Binary Liquid Evaporation Velocity Equation", "Basic Level Emergency Valve Entry", "Batch Liquid Extraction Vacuum Effect"],["The 'Flash Point' of a liquid is the lowest temperature at which it produces:", "Enough vapor to ignite in air", "A continuous flame", "Spontaneous combustion", "Smoke"],["Which term refers to the concentration of a toxic substance to which a worker can be exposed for 8 hours a day without ill effects?", "TLV-TWA", "LD50", "IDLH", "PEL-C"],["In the fire triangle, what are the three essential components for a fire?", "Fuel, Oxygen, Heat", "Fuel, Carbon Dioxide, Spark", "Nitrogen, Fuel, Heat", "Oxygen, Water, Fuel"],["A 'HAZOP' study is a structured technique used to identify:", "Process deviations and hazards", "Financial losses", "Equipment shipping costs", "Employee salaries"],["The 'Lower Explosive Limit' (LEL) is the minimum concentration of fuel in air required for:", "Combustion to occur", "The fuel to become too rich to burn", "The fuel to auto-ignite", "Toxicity to be lethal"],["Which safety device is designed to burst at a specific pressure to protect a vessel from over-pressurization?", "Rupture Disk", "Globe Valve", "Check Valve", "Rotameter"],["An 'Exothermic Runaway' reaction occurs when the rate of heat generation:", "Exceeds the rate of heat removal", "Equals the rate of heat removal", "Is less than the rate of heat removal", "Is zero"],["In the 'Galvanic Series', a metal that is more 'Noble' is:", "More resistant to corrosion", "More likely to corrode", "A better anode", "More reactive"],["Which safety protocol involves locking a power source to prevent accidental machine start-up?", "LOTO (Lock-Out Tag-Out)", "HAZID", "MSDS", "PPE"],["In wastewater treatment, 'BOD5' refers to the Biochemical Oxygen Demand measured over how many days?", "5 days", "1 day", "7 days", "10 days"],["Which parameter is typically higher in a wastewater sample, COD or BOD?", "COD", "BOD", "They are equal", "TSS"],["What is the primary mechanism for removing fine particulate matter in an Electrostatic Precipitator (ESP)?", "Electric field charging", "Centrifugal force", "Gravity settling", "Filter media"],["In the 'Activated Sludge Process', the recycled solids from the clarifier are known as:", "RAS (Return Activated Sludge)", "WAS (Waste Activated Sludge)", "MLSS", "Primary Sludge"],["Which process is primarily used for the desalination of seawater to produce potable water?", "Reverse Osmosis", "Sedimentation", "Flocculation", "Chlorination"],["The atmospheric layer where most weather events occur and temperature decreases with altitude is the:", "Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],["Which heavy metal is associated with 'Minamata Disease' due to water contamination?", "Mercury", "Lead", "Arsenic", "Cadmium"],["In air pollution control, a 'Venturi Scrubber' is most effective at removing:", "Fine particulates and gases", "Large grit", "Odors only", "Nitrogen gas"],["Which gas is the most significant contributor to the enhanced greenhouse effect?", "Carbon Dioxide", "Nitrogen", "Argon", "Helium"],["The 'Lapse Rate' refers to the rate of change of which variable with altitude?", "Temperature", "Pressure", "Density", "Humidity"],["Which type of polymer can be repeatedly softened by heating and hardened by cooling?", "Thermoplastic", "Thermoset", "Elastomer", "Resin"],["In polymer rheology, a fluid whose viscosity decreases as the shear rate increases is:", "Pseudoplastic (Shear-thinning)", "Dilatant (Shear-thickening)", "Bingham Plastic", "Newtonian"],["The process of heating raw rubber with sulfur to improve its strength and elasticity is:", "Vulcanization", "Polymerization", "Extrusion", "Annealing"],["In an extruder screw, which zone is responsible for building up pressure before the die?", "Metering Zone", "Feed Zone", "Compression Zone", "Transition Zone"],["Which processing method is most suitable for producing hollow plastic bottles?", "Blow Molding", "Injection Molding", "Compression Molding", "Calendering"],["The 'Glass Transition Temperature' (Tg) is the point where a polymer transitions from:", "Brittle/Glassy to Rubbery/Flexible", "Liquid to Solid", "Amorphous to Crystalline", "Monomer to Polymer"],["Which dimensionless number represents the ratio of elastic forces to viscous forces in polymer flow?", "Weissenberg Number", "Reynolds Number", "Prandtl Number", "Peclet Number"],["A 'Thermosetting' polymer undergoes which type of chemical change during curing?", "Cross-linking", "Linear chain growth", "Depolymerization", "Dissolution"],["The 'Melt Flow Index' (MFI) is an indirect measure of a polymer's:", "Molecular weight and viscosity", "Density", "Tensile strength", "Glass transition"],["In injection molding, the 'Sprue' is the channel through which the melt enters the:", "Runner system", "Cavity", "Hopper", "Ejector pin"],["The Clapeyron equation relates the slope of the vapor pressure curve to the:", "Enthalpy of vaporization and molar volume change", "Entropy of fusion and temperature", "Specific heat capacity and pressure", "Internal energy and density"],["Which property represents the deviation of a real gas property from that of an ideal gas at the same T and P?", "Residual Property", "Excess Property", "Partial Molar Property", "Molar Property"],["The 'Acentric Factor' (omega) is a measure of the non-sphericity of a molecule's:", "Force field", "Mass distribution", "Electron cloud", "Dipole moment"],["For a binary mixture, the 'Wilson Equation' is primarily used to calculate:", "Activity coefficients", "Fugacity coefficients", "Virial coefficients", "Vapor pressures"],["Which thermodynamic relation is used to check the consistency of experimental VLE data?", "Gibbs-Duhem Equation", "Maxwell Relations", "Van der Waals Equation", "Redlich-Kwong Equation"],["The 'Exergy' of a system represents the maximum:", "Useful work obtainable", "Heat transferable", "Entropy produced", "Internal energy stored"],["Which model is most suitable for VLE of highly non-ideal liquid mixtures like alcohol-water?", "NRTL (Non-Random Two Liquid)", "Ideal Solution Model", "Raoult's Law", "Peng-Robinson EOS"],["The chemical potential (mu_i) of a component is defined as the partial molar:", "Gibbs Free Energy", "Enthalpy", "Entropy", "Internal Energy"],["In the context of 'Residual Properties', the residual Gibbs energy is directly related to the:", "Fugacity coefficient", "Activity coefficient", "Compressibility factor", "Virial coefficient"],["The 'Clausius-Clapeyron' equation is a simplified version of the Clapeyron equation assuming:", "Ideal gas vapor and negligible liquid volume", "Constant pressure and temperature", "Real gas behavior", "No phase change"],["Which ratio determines whether an oxide film on a metal is protective or non-protective?", "Pilling-Bedworth Ratio", "Poisson's Ratio", "Aspect Ratio", "Reflux Ratio"],["In a galvanic cell, the metal that undergoes corrosion is the:", "Anode", "Cathode", "Electrolyte", "Salt bridge"],["Which of these is commonly used as a 'Sacrificial Anode' to protect steel structures underwater?", "Magnesium", "Copper", "Silver", "Platinum"],["Corrosion that occurs in narrow gaps or under gaskets where oxygen is depleted is:", "Crevice Corrosion", "Pitting Corrosion", "Galvanic Corrosion", "Erosion Corrosion"],["The 'Tafel Equation' relates the overpotential (eta) to the logarithm of the:", "Current density", "Temperature", "Pressure", "Concentration"],["'Passivity' in metals like Aluminum and Stainless Steel is due to the formation of a:", "Protective oxide film", "Porous coating", "Sulfide layer", "Carbonate film"],["Which type of corrosion is characterized by the formation of deep, small-diameter holes?", "Pitting Corrosion", "Uniform Corrosion", "Intergranular Corrosion", "De-alloying"],["In 'Cathodic Protection' by impressed current, the structure is connected to the:", "Negative terminal of a DC source", "Positive terminal of a DC source", "Ground wire", "AC power line"],["Corrosion caused by the simultaneous action of tensile stress and a corrosive environment is:", "Stress Corrosion Cracking", "Fatigue Corrosion", "Fretting Corrosion", "Erosion"],["According to Faraday's Law, the mass of metal lost to corrosion (m) is directly proportional to:", "Quantity of electricity (Q)", "Electrolyte volume", "Atmospheric pressure", "Surface roughness"],["What is the Laplace transform of a unit step function?", "1/s", "s", "1/s^2", "exp(-s)"],["In plant design, the 'Six-Tenths Rule' is used to estimate:", "Equipment cost scaling", "Reflux ratio", "Pipe diameter", "Reaction order"],["Which type of polymerization produces a small molecule like water as a byproduct?", "Condensation Polymerization", "Addition Polymerization", "Bulk Polymerization", "Solution Polymerization"],["In process control, which action is known as 'anticipatory' control?", "Derivative Action", "Proportional Action", "Integral Action", "On-Off Action"],["The temperature at which a polymer transitions from a brittle state to a rubbery state is the:", "Glass Transition Temperature", "Melting Point", "Flash Point", "Cloud Point"],["Which control system compensates for disturbances before they affect the process output?", "Feedforward Control", "Feedback Control", "Ratio Control", "Cascade Control"],["In a centrifugal pump, the separating force is proportional to the square of the:", "Angular velocity", "Pipe diameter", "Fluid density", "Impeller weight"],["The 'Breakeven Point' in chemical plant economics is reached when:", "Total revenue equals total costs", "Gross profit is maximized", "Net present value is zero", "Depreciation ends"],["What is the primary purpose of a steam trap in a chemical plant?", "Remove condensate without losing steam", "Increase steam pressure", "Control steam flow rate", "Superheat the steam"],["The transfer function of a first-order system with time constant tau is:", "1 / (tau*s + 1)", "tau / (s + 1)", "1 / (s + tau)", "s / (tau + 1)"],["In drying operations, the 'Constant Rate Period' ends at the:", "Critical moisture content", "Equilibrium moisture content", "Saturation point", "Free moisture limit"],["In a P&ID, the abbreviation 'LC' typically stands for:", "Level Controller", "Liquid Catalyst", "Low Concentration", "Linear Compensator"],["Which material is highly resistant to chloride-induced stress corrosion cracking?", "Titanium", "Carbon Steel", "Aluminum", "304 Stainless Steel"],["In process control, 'Transportation Lag' is also commonly referred to as:", "Dead Time", "Offset", "Overshoot", "Decay Ratio"],["What is the Polydispersity Index (PDI) of a perfectly monodisperse polymer?", "1.0", "0.0", "0.5", "Infinite"],["In a filtration process, the resistance offered by the filter cake:", "Increases with time", "Decreases with time", "Stays constant", "Is independent of pressure"],["A 'Bode Plot' is a graphical tool used to analyze a system's:", "Frequency response", "Heat duty", "Mass balance", "Phase equilibrium"],["In plant safety, 'HAZOP' stands for:", "Hazard and Operability Study", "Heat and Zone Operating Protocol", "High Altitude Zone of Pressure", "Hazardous Acid Oxidation Process"],["Which type of control valve is most suitable for 'On-Off' service rather than throttling?", "Gate Valve", "Globe Valve", "Needle Valve", "Butterfly Valve"],["The 'Gain' of a proportional controller is represented by the symbol:", "Kc", "tau_i", "tau_d", "zeta"],["Which dimensionless number represents the ratio of convective to conductive heat transfer?", "Nusselt Number", "Prandtl Number", "Reynolds Number", "Sherwood Number"],["In a second-order reaction, what are the units of the rate constant k?", "L/(mol·s)", "1/s", "mol/(L·s)", "L^2/(mol^2·s)"],["At constant temperature and pressure, a process is spontaneous if the change in Gibbs Free Energy (Delta G) is:", "Negative", "Positive", "Zero", "Constant"],["Which equation relates the friction factor to the Reynolds number and pipe roughness?", "Colebrook-White Equation", "Bernoulli Equation", "Hagen-Poiseuille", "Fanning Equation"],["In binary distillation, the thermal state of the feed is represented by which parameter?", "q-value", "Reflux ratio", "HETP", "Murphree Efficiency"],["What is the emissivity of a perfect black body in radiation heat transfer?", "1.0", "0.0", "0.5", "Infinite"],["Which dimensionless number represents the ratio of momentum diffusivity to thermal diffusivity?", "Prandtl Number", "Schmidt Number", "Lewis Number", "Peclet Number"],["In the design of a CSTR, the 'Space Time' is the ratio of reactor volume to:", "Volumetric flow rate", "Mass flow rate", "Conversion rate", "Catalyst weight"],["Which law states that the total vapor pressure of an ideal solution is dependent on the vapor pressure of each chemical component and its mole fraction?", "Raoult's Law", "Henry's Law", "Dalton's Law", "Amagat's Law"],["What occurs when the local pressure in a pump falls below the vapor pressure of the liquid?", "Cavitation", "Priming", "Water Hammer", "Throttling"],["The 'HETP' concept in packed distillation columns stands for:", "Height Equivalent to a Theoretical Plate", "Heat Energy Transfer Protocol", "High Efficiency Thermal Process", "Height of Equilibrium Total Pressure"],["In an exothermic reaction, increasing the temperature will cause the equilibrium constant (K_eq) to:", "Decrease", "Increase", "Remain unchanged", "Double"],["Which type of heat exchanger is most commonly used in large-scale industrial chemical plants?", "Shell and Tube", "Double Pipe", "Plate and Frame", "Spiral"],["In Mass Transfer, the 'Film Theory' assumes that the resistance to transfer lies entirely within:", "A stagnant thin film", "The bulk fluid", "The interface", "The turbulent core"],["What is the term for a mixture that boils at a constant temperature and has the same composition in the vapor and liquid phases?", "Azeotrope", "Eutectic", "Isotrope", "Ideal solution"],["The 'McCabe-Thiele' method is used to graphically determine the number of:", "Theoretical stages in distillation", "Plates in an absorber", "Heat transfer coefficients", "Reactor residence times"],["Which thermodynamic property is defined as H - TS?", "Gibbs Free Energy", "Helmholtz Energy", "Internal Energy", "Enthalpy"],["In fluid flow, a 'Newtonian fluid' is one where the shear stress is linearly proportional to the:", "Velocity gradient", "Pressure drop", "Density", "Viscosity"],["Which reactor type is best suited for highly exothermic reactions that require precise temperature control?", "Fluidized Bed Reactor", "Batch Reactor", "PFR", "CSTR"],["In Chemical Engineering economics, the 'Payback Period' is the time required for:", "Cumulative cash flow to equal investment", "The plant to reach full capacity", "Depreciation to reach zero", "Interest rates to stabilize"]]
  },
  tech: {
    foundational: [["What does PC stand for?","Personal Computer","Private Computer","Primary Console","Portable Computer"],["What is 8 multiplied by 7?","56","54","64","42"],["What part is considered the 'brain' of the computer?","CPU","Hard Drive","RAM","Motherboard"],["Perimeter of rectangle length 5 and width 4?","18","20","9","24"],["Standard keyboard shortcut to 'Copy' text?","Ctrl + C","Ctrl + V","Ctrl + X","Ctrl + P"],["A prime number is a number divisible only by 1 and itself","TRUE","FALSE","Ends in 1, 3, 7, 9","Has exactly three factors"],["What is Wi-Fi primarily used for?","Wireless networking","Storing data","Cooling the computer","Printing documents"],["Formula for the area of a triangle?","1/2 x Base x Height","Base x Height","Length x Width","Pi x Radius^2"],["One Gigabyte (GB) is roughly equal to...","1000 Megabytes (MB)","1000 Kilobytes (KB)","1000 Terabytes (TB)","1000 Bytes"],["Sum of interior angles of standard triangle?","180 degrees","90 degrees","360 degrees","270 degrees"],["Physical, tangible parts of computer are called...","Hardware","Software","Malware","Shareware"],["What is 25% of 200?","50","25","75","100"],["Main circuit board of computer called?","Motherboard","Fatherboard","Logic Board","Central Board"],["What is the square root of 144?","12","14","16","10"],["A widely used Search Engine?","Google","Microsoft Word","Photoshop","Linux"],["What do you call a polygon with exactly 5 sides?","Pentagon","Hexagon","Octagon","Quadrilateral"],["What software protects a computer from malicious programs?","Antivirus","Browser","Operating System","Word Processor"],["What is 10 to the power of 3 (10³)?","1000","30","100","10000"],["The global system of interconnected computer networks?","Internet","Intranet","Extranet","Ethernet"],["The approximate value of Pi to two decimal places?","3.14","3.12","3.16","3.18"],["What device is used to input text into a computer?","Keyboard","Monitor","Printer","Speaker"],["What is 15 + 27?","42","32","52","40"],["What does 'www' at the beginning of a website stand for?","World Wide Web","Web World Wide","Wide World Web","World Web Wide"],["If you have 3 apples and buy 4 more, how many do you have?","7","6","8","12"],["Which of these is an output device?","Monitor","Mouse","Microphone","Webcam"],["What is 50 divided by 5?","10","5","15","25"],["What is a folder on a computer used for?","Organizing files","Running programs","Cooling the CPU","Connecting to Wi-Fi"],["What is the next number in the pattern: 2, 4, 6, 8, ...?","10","9","12","14"],["What does it mean to 'reboot' a computer?","Restart it","Kick it","Delete everything","Install a game"],["How many degrees are in a full circle?","360","180","90","100"],["Which program is commonly used to type documents?","Microsoft Word","Google Chrome","Adobe Photoshop","VLC Player"],["What is 1/2 written as a decimal?","0.5","0.2","0.12","1.2"],["What does a computer mouse do?","Moves the cursor","Types words","Prints paper","Plays music"],["Which is the largest number?","999","909","990","900"],["What is the screen of a computer called?","Monitor","Keyboard","Tower","Mousepad"],["How many sides does a hexagon have?","6","5","8","7"],["What is it called when you move a file from the internet to your PC?","Downloading","Uploading","Streaming","Pinging"],["What is 9 x 9?","81","72","90","99"],["What does 'USB' normally connect?","External devices","Power grids","Water pipes","Radio waves"],["How many minutes are in 2 hours?","120","60","90","200"],["Which of these is an email service?","Gmail","Google Docs","YouTube","Excel"],["If a square has a side of 3, what is its area?","9","6","12","3"],["What symbol is used in every email address?","@","#","$","&"],["What is 100 minus 37?","63","53","73","67"],["What is a password used for?","Security","Speed","Storage","Sharing"],["What shape has 3 equal sides and 3 equal angles?","Equilateral Triangle","Isosceles Triangle","Right Triangle","Scalene Triangle"],["What is an 'app' short for?","Application","Apple","Apparatus","Appendix"],["What is half of 50?","25","20","30","15"],["What do you double-click to open a program?","An icon","The screen","The keyboard","The cable"],["How many zeros are in one million?","6","5","7","8"]],
    intermediate: [["What does HTML stand for?","HyperText Markup Language","High Tech Modern Language","Home Tool Markup Language","Hyperlinks Text Markup Language"],["What is the derivative of x² with respect to x?","2x","x","x³ / 3","2"],["Which language is primarily used to style web pages?","CSS","Python","JavaScript","C++"],["In a right triangle, what relates sides a, b, and hypotenuse c?","a² + b² = c²","a + b = c","a * b = c","sin(a) = b/c"],["What does SQL stand for?","Structured Query Language","Simple Query Language","Sequential Query Logic","System Query Language"],["What is the sine of 90 degrees?","1","0","0.5","-1"],["Which protocol is used for secure, encrypted web browsing?","HTTPS","HTTP","FTP","SMTP"],["What is the discriminant of the quadratic equation ax² + bx + c = 0?","b² - 4ac","-b ± √(b² - 4ac)","2a","b² + 4ac"],["Which programming paradigm organizes software around 'objects'?","Object-Oriented Programming","Functional Programming","Procedural Programming","Logic Programming"],["What is the value of Log base 10 of 100?","2","10","100","1"],["What attack attempts to overwhelm a target with a flood of traffic?","DDoS","Phishing","SQL Injection","Man-in-the-Middle"],["What is the standard equation of a circle centered at the origin?","x² + y² = r²","y = mx + c","x² / a² + y² / b² = 1","y = ax² + bx + c"],["What is the primary purpose of an IP address?","Uniquely identifies a device on a network","Encrypts internet traffic","Increases download speed","Translates domain names"],["What is the probability of rolling a 4 on a fair 6-sided die?","1/6","1/2","1/4","4/6"],["Git is an example of a...","Version Control System","Database Management System","Operating System","Web Browser"],["What is the sum of an infinite geometric series (first term a, ratio r)?","a / (1 - r)","a * r^n","a(1 - r^n) / (1 - r)","Infinity"],["Which data structure operates Last-In, First-Out (LIFO)?","Stack","Queue","Array","Tree"],["To multiply two matrices, what condition must be met?","Inner dimensions must match","Same number of rows","Must be square matrices","Same number of elements"],["What does JSON stand for?","JavaScript Object Notation","Java Standard Output Network","Java Serialized Object Notation","JavaScript Optional Notation"],["What is the limit of 1/x as x approaches infinity?","0","Infinity","1","Undefined"],["What does RAM stand for?","Random Access Memory","Read Access Memory","Run All Memory","Random Active Memory"],["What is the value of cos(0)?","1","0","-1","undefined"],["Which tag is used in HTML to insert an image?","<img />","<image>","<pic>","<src>"],["If f(x) = 3x + 2, what is f(4)?","14","12","16","10"],["What is a Boolean variable?","A True or False value","A decimal number","A text string","An array of items"],["What is the absolute value of -15?","15","-15","0","1"],["What port does HTTP usually run on?","80","443","21","22"],["What is the slope of the line y = 4x - 7?","4","-7","x","0"],["In networking, what does LAN stand for?","Local Area Network","Large Area Network","Logical Access Node","Light Access Network"],["What is 5 factorial (5!)?","120","60","25","15"],["What does CSS stand for?","Cascading Style Sheets","Computer Style Sheets","Creative Style System","Color Syntax System"],["What is the midpoint of the segment between (0,0) and (4,4)?","(2,2)","(4,4)","(0,4)","(2,0)"],["Which is a common relational database?","MySQL","MongoDB","Redis","Cassandra"],["What do angles on a straight line add up to?","180","90","360","270"],["What symbol denotes an ID selector in CSS?","#",".","@","$"],["What is x if 2x - 6 = 10?","8","4","16","2"],["What does CPU stand for?","Central Processing Unit","Computer Personal Unit","Central Program Utility","Core Processing Unit"],["A triangle with no equal sides is called...","Scalene","Isosceles","Equilateral","Right"],["What command in Git saves your changes locally?","git commit","git push","git pull","git clone"],["What is the median of 1, 3, 3, 6, 7, 8, 9?","6","3","7","5.2"],["What is the brain of a router called?","Firmware","Hardware","Middleware","Shareware"],["What is the area of a circle with radius 3?","9π","6π","3π","12π"],["Which language runs natively in web browsers?","JavaScript","Python","Java","C#"],["What is the GCF of 12 and 18?","6","3","2","36"],["What does API stand for?","Application Programming Interface","Advanced Program Integration","Active Protocol Interface","Appliation Process Internet"],["What is the mode of the set: 2, 4, 4, 5, 6?","4","4.2","5","2"],["Which malware disguises itself as legitimate software?","Trojan","Worm","Spyware","Ransomware"],["In algebra, what does 'x' usually represent?","A variable","A constant","An operator","A fraction"],["Which of the following is an Operating System?","Linux","Chrome","Firefox","Microsoft Office"],["What is 2^5 (2 to the power of 5)?","32","16","64","10"]],
    advanced: [["What is the worst-case time complexity of Binary Search?","O(log n)","O(1)","O(n)","O(n log n)"],["In Linear Algebra, Ax = λx represents finding...","Eigenvalues and Eigenvectors","Determinant","Cross Product","Inverse Matrix"],["In CAP Theorem, a distributed system guarantees two out of...","Consistency, Availability, Partition Tolerance","Concurrency, Availability, Performance","Capacity, Atomicity, Persistence","Computing, Asynchrony, Parallelism"],["What is the indefinite integral of e^x?","e^x + C","x * e^(x-1) + C","ln(x) + C","e^(x+1) / (x+1) + C"],["Which design pattern restricts a class to one instance?","Singleton","Factory","Observer","Decorator"],["The Maclaurin series for sin(x) begins...","x - x³/3! + x⁵/5! ...","1 - x²/2! + x⁴/4! ...","1 + x + x²/2! ...","x + x²/2 + x³/3 ..."],["What consensus mechanism does Bitcoin rely on?","Proof of Work","Proof of Stake","Delegated Proof of Stake","Byzantine Fault Tolerance"],["What is the determinant of a 2x2 matrix [a, b; c, d]?","ad - bc","a+d - b+c","ac - bd","ab - cd"],["A JS function remembering variables in its lexical scope is a...","Closure","Promise","Callback","Generator"],["Euler's Identity is...","e^(iπ) + 1 = 0","a² + b² = c²","F - E + V = 2","E = mc²"],["What is the purpose of an 'inverted index'?","Fast full-text searches mapping content to location","To reverse an array in O(1) time","To encrypt plain text","To compress video files"],["The Laplace transform of the constant function f(t) = 1 is...","1/s","s","1/s²","e^(-s)"],["In database transactions, ACID stands for...","Atomicity, Consistency, Isolation, Durability","Asynchrony, Concurrency, Integrity, Data","Availability, Clustering, Indexing, Distribution","Array, Character, Integer, Double"],["Cauchy-Riemann equations are necessary for a complex function to be...","Holomorphic (Analytic)","Continuous","Integrable","A polynomial"],["The 'Halting Problem' proves that...","It's impossible to build a general algorithm to determine if any program finishes","Hardware will eventually overheat","All programs have bugs","Network packets will always face delay"],["The Fundamental Theorem of Calculus connects...","Differentiation and Integration","Addition and Subtraction","Limits and Continuity","Algebra and Geometry"],["What does 'thrashing' mean in Operating Systems?","System spends more time paging memory than executing","Hard drive physically scratches the disk","CPU is overclocked too high","Threads rapidly acquire/release locks"],["The gradient of a scalar field produces...","A vector field","A constant","Another scalar field","A tensor"],["Which SOLID principle states subclasses must be substitutable for superclasses?","Liskov Substitution","Single Responsibility","Open/Closed","Dependency Inversion"],["The Four Color Theorem states the max chromatic number of a planar graph is...","4","3","5","Infinity"],["What data structure is used to implement a Priority Queue?","Heap","Linked List","Stack","Hash Table"],["What is the derivative of ln(x)?","1/x","e^x","x","1/x^2"],["What algorithm finds the shortest path in a weighted graph?","Dijkstra's Algorithm","Depth First Search","Merge Sort","Kruskal's Algorithm"],["What is the rank of an invertible n x n matrix?","n","1","0","n-1"],["Which layer of the OSI model does TCP operate on?","Transport Layer","Network Layer","Data Link Layer","Application Layer"],["The divergence of the curl of any vector field is always...","0","1","Infinity","Undefined"],["Which hashing algorithm is considered cryptographically broken?","MD5","SHA-256","bcrypt","Argon2"],["What is the integral of 1/x dx?","ln|x| + C","e^x + C","x^2/2 + C","-1/x^2 + C"],["What is 'memoization'?","Caching results of expensive function calls","Storing data on disk","Translating code to machine language","A garbage collection technique"],["A matrix is orthogonal if its transpose is equal to its...","Inverse","Determinant","Eigenvalue","Trace"],["Which HTTP method is used to partially update a resource?","PATCH","PUT","POST","UPDATE"],["The Taylor series centered at x = 0 is commonly called the...","Maclaurin series","Fourier series","Laurent series","Dirichlet series"],["What is a Race Condition?","When output depends on the uncontrollable timing of threads","When a CPU runs too hot","A fast sorting algorithm","When packets drop on a network"],["Which theorem relates a line integral to a surface integral?","Stokes' Theorem","Pythagorean Theorem","Green's Theorem","Divergence Theorem"],["In Rust or C++, what prevents memory leaks without garbage collection?","Ownership/RAII","Pointers","Global variables","Virtual machines"],["The probability of getting exactly k heads in n coin flips uses what distribution?","Binomial","Poisson","Normal","Exponential"],["What is a 'foreign key' in SQL?","A field referring to a primary key in another table","A password for the database","An index for text search","A key generated outside the country"],["What is the curl of a conservative vector field?","0","1","The gradient","The divergence"],["What is the space complexity of Depth First Search on a tree of depth d?","O(d)","O(1)","O(2^d)","O(d^2)"],["Which equation describes heat diffusion over time?","Heat Equation","Wave Equation","Laplace Equation","Navier-Stokes Equation"],["What does BGP stand for in networking?","Border Gateway Protocol","Broadband Gateway Port","Binary Graph Process","Base Global Protocol"],["What are the solutions to the characteristic equation of a differential equation?","Eigenvalues / Roots","Derivatives","Integrals","Constants"],["In cryptography, RSA relies on the difficulty of...","Factoring large prime numbers","Reversing a hash","Sorting large arrays","Solving symmetric keys"],["What is the dot product of two orthogonal vectors?","0","1","-1","Their magnitudes multiplied"],["What is the 'Deadlock' state?","Two or more processes waiting indefinitely for each other","A server crashing","A thread finishing execution","A network timeout"],["Which theorem classifies closed surfaces?","Classification Theorem of Surfaces","Gauss-Bonnet Theorem","Poincaré Conjecture","Euler's Formula"],["Which command in Linux lists running processes?","top / ps","ls","grep","chmod"],["A set with an associative binary operation, an identity, and inverses is a...","Group","Ring","Field","Vector Space"],["What does a 'hypervisor' do?","Creates and runs virtual machines","Compiles code","Balances web traffic","Encrypts passwords"],["The trace of a matrix is the sum of its...","Diagonal elements","Eigenvalues","Rows","Columns"]]
  },
  history: {
    foundational: [["Who was the first President of the United States?","George Washington","Abraham Lincoln","Thomas Jefferson","John Adams"],["Which ancient civilization built the Great Pyramid of Giza?","Ancient Egyptians","Ancient Romans","Ancient Greeks","Mayans"],["In what year did Christopher Columbus first reach the Americas?","1492","1776","1607","1066"],["Who was the Queen of Ancient Egypt?","Cleopatra","Nefertiti","Hatshepsut","Boudicca"],["Which empire was ruled by Julius Caesar?","The Roman Empire","The Ottoman Empire","The British Empire","The Mongol Empire"],["What was the name of the ship that brought the Pilgrims to America?","Mayflower","Santa Maria","Nina","Pinta"],["Which global conflict ended in 1945?","World War II","World War I","The Cold War","The Vietnam War"],["Who wrote the Declaration of Independence?","Thomas Jefferson","Benjamin Franklin","George Washington","Alexander Hamilton"],["What wall was torn down in 1989?","The Berlin Wall","The Great Wall of China","Hadrian's Wall","The Western Wall"],["Which leader was assassinated on the Ides of March?","Julius Caesar","Abraham Lincoln","Alexander the Great","Napoleon Bonaparte"],["What was the primary language of Ancient Romans?","Latin","Greek","Italian","Aramaic"],["Who gave the 'I Have a Dream' speech?","Martin Luther King Jr.","Malcolm X","Nelson Mandela","Frederick Douglass"],["Which civilization is known for Socrates and Plato?","Ancient Greece","Ancient Rome","Ancient Egypt","Mesopotamia"],["What invention revolutionized information in the 1400s?","The Printing Press","The Telegraph","The Compass","The Steam Engine"],["Who was the first woman to fly solo across the Atlantic?","Amelia Earhart","Bessie Coleman","Harriet Quimby","Sally Ride"],["Which country gave the Statue of Liberty to the US?","France","Great Britain","Spain","Germany"],["What was the first English settlement in North America?","Jamestown","Roanoke","Plymouth","Williamsburg"],["Who was the founder of modern nursing?","Florence Nightingale","Clara Barton","Mary Seacole","Dorothea Dix"],["The Titanic sank in which ocean in 1912?","Atlantic Ocean","Pacific Ocean","Indian Ocean","Arctic Ocean"],["Who was the leader of the Soviet Union in WWII?","Joseph Stalin","Vladimir Lenin","Mikhail Gorbachev","Leon Trotsky"],["What route was used to trade between China and Europe?","The Silk Road","The Spice Route","The Amber Road","The Oregon Trail"],["Who conquered an empire from Greece to India?","Alexander the Great","Cyrus the Great","Leonidas","Pericles"],["Which president issued the Emancipation Proclamation?","Abraham Lincoln","Ulysses S. Grant","Andrew Jackson","Theodore Roosevelt"],["What French structure was built for the 1889 World Fair?","The Eiffel Tower","The Louvre","The Arc de Triomphe","Notre-Dame"],["Who was the founder of the Mongol Empire?","Genghis Khan","Kublai Khan","Attila the Hun","Sun Tzu"],["Which period in Europe was a cultural rebirth?","The Renaissance","The Dark Ages","The Enlightenment","The Industrial Revolution"],["What ancient wonder was located in Babylon?","The Hanging Gardens","The Colosseum","The Lighthouse of Alexandria","The Parthenon"],["In what country did the Industrial Revolution begin?","Great Britain","United States","France","Germany"],["Who was the longest-reigning British monarch before Elizabeth II?","Queen Victoria","King George III","King Henry VIII","Queen Mary"],["Which explorer first reached India by sea?","Vasco da Gama","Ferdinand Magellan","Marco Polo","James Cook"]],
    intermediate: [["What document signed in 1215 limited the King's powers?","Magna Carta","Bill of Rights","Constitution","Treaty of Paris"],["Which war was between the North and South of the US?","The American Civil War","The Revolutionary War","The War of 1812","The Spanish-American War"],["Who was the primary author of the Communist Manifesto?","Karl Marx","Vladimir Lenin","Friedrich Engels","Joseph Stalin"],["Which ancient empire was defeated by Hernán Cortés?","The Aztec Empire","The Inca Empire","The Maya Empire","The Olmec Empire"],["What was the project to develop the atomic bomb?","The Manhattan Project","The Apollo Project","Project Trinity","The Overlord Project"],["Who was the first Emperor of Rome?","Augustus","Julius Caesar","Nero","Caligula"],["What battle was the turning point of the US Civil War?","The Battle of Gettysburg","The Battle of Antietam","The Battle of Bull Run","The Battle of Shiloh"],["The Cold War was between the US and who?","The Soviet Union","China","Germany","Japan"],["What treaty officially ended World War I?","The Treaty of Versailles","The Treaty of Paris","The Treaty of Ghent","The Treaty of Tordesillas"],["Who was the French leader in the Reign of Terror?","Maximilien Robespierre","Napoleon Bonaparte","Louis XVI","Jean-Paul Marat"],["Which dynasty was the last to rule imperial China?","Qing Dynasty","Ming Dynasty","Tang Dynasty","Han Dynasty"],["What disease wiped out 1/3 of Europe in the 14th century?","The Black Death","Smallpox","Cholera","Typhus"],["Who crossed the Alps with elephants to attack Rome?","Hannibal","Scipio Africanus","Spartacus","Attila the Hun"],["What year did the French Revolution begin?","1789","1776","1812","1799"],["Which Native American guide assisted Lewis and Clark?","Sacagawea","Pocahontas","Sitting Bull","Geronimo"],["Who led the Indian independence movement?","Mahatma Gandhi","Jawaharlal Nehru","Subhas Chandra Bose","Bhagat Singh"],["What event sparked World War I?","Assassination of Franz Ferdinand","Invasion of Poland","Sinking of Lusitania","Bombing of Pearl Harbor"],["The code name for the 1944 Allied invasion was...","Operation Overlord","Operation Barbarossa","Operation Market Garden","Operation Torch"],["Which war was between Lancaster and York?","The Wars of the Roses","The Hundred Years' War","The English Civil War","The Thirty Years' War"],["Who was the British PM for most of WWII?","Winston Churchill","Neville Chamberlain","Clement Attlee","Anthony Eden"],["What empire was conquered by Pizarro?","The Inca Empire","The Aztec Empire","The Maya Empire","The Toltec Empire"],["Where was Carthage located?","Tunisia","Egypt","Morocco","Libya"],["What era modernized Japan in 1868?","Meiji Restoration","Edo Period","Tokugawa Shogunate","Showa Era"],["Who was the last Tsar of Russia?","Nicholas II","Alexander III","Peter the Great","Ivan the Terrible"],["What was the first artificial satellite?","Sputnik 1","Vostok 1","Explorer 1","Soyuz 1"],["Which explorer first circumnavigated the globe?","Ferdinand Magellan","Francis Drake","Christopher Columbus","Vasco da Gama"],["What US scandal led to Nixon's resignation?","Watergate","Teapot Dome","Iran-Contra","Whitewater"],["Who founded Islam?","Muhammad","Abu Bakr","Ali","Umar"],["The 'Trail of Tears' relocated which nation?","The Cherokee","The Navajo","The Apache","The Sioux"],["Who invaded England in 1066?","William the Conqueror","Charlemagne","Richard the Lionheart","Henry V"]],
    advanced: [["Which treaty concluded the 30 Years' War?","Peace of Westphalia","Treaty of Utrecht","Congress of Vienna","Treaty of Tordesillas"],["Carthaginian general defeated at Battle of Zama?","Hannibal Barca","Hasdrubal","Hamilcar","Mago"],["Faction that became the Communist Party?","The Bolsheviks","The Mensheviks","The SRs","The Kadets"],["King who won 'Pyrrhic victories' against Rome?","Pyrrhus of Epirus","Antiochus III","Philip V","Mithridates VI"],["Naval battle where Holy League defeated Ottomans?","Battle of Lepanto","Battle of Actium","Battle of Trafalgar","Battle of Salamis"],["Cause of Defenestration of Prague?","Religious conflicts","Tax dispute","Assassination","Border dispute"],["Byzantine queen influential in Nika riots?","Empress Theodora","Empress Irene","Empress Zoe","Empress Eudoxia"],["Social system in France before 1789?","The Ancien Régime","The Directory","The Consulate","The Bourbon Restoration"],["Athenian general in Sicilian Expedition?","Alcibiades","Pericles","Nicias","Demosthenes"],["Which dynasty was founded by Kublai Khan?","The Yuan Dynasty","The Ming Dynasty","The Song Dynasty","The Jin Dynasty"],["City where Popes resided during 'Babylonian Captivity'?","Avignon","Paris","Lyon","Marseille"],["Dictator who unified Japan before Tokugawa?","Toyotomi Hideyoshi","Oda Nobunaga","Tokugawa Ieyasu","Takeda Shingen"],["Who led the team that found the Rosetta Stone?","Pierre-François Bouchard","Jean-François Champollion","Howard Carter","Heinrich Schliemann"],["Purpose of Council of Trent?","Direct Counter-Reformation","Excommunicate Luther","Authorize Crusades","Translate Bible"],["Battle that established Octavian's sole rule?","Battle of Actium","Battle of Philippi","Battle of Pharsalus","Battle of Cannae"],["Banking family that ruled Florence?","The Medici family","The Borgia family","The Sforza family","The Habsburg family"],["Name of 1884 meeting to regulate African colonization?","The Berlin Conference","The Congress of Vienna","The Treaty of Versailles","The Yalta Conference"],["First king of unified Italy in 1861?","Victor Emmanuel II","Giuseppe Garibaldi","Camillo Cavour","Umberto I"],["Taiping Rebellion leader claimed to be...","Brother of Jesus","Reincarnated Buddha","Ming Emperor","Dragon King messenger"],["Emperor who split Rome into the Tetrarchy?","Diocletian","Constantine","Marcus Aurelius","Trajan"],["Code name for German invasion of USSR?","Operation Barbarossa","Operation Sealion","Operation Citadel","Operation Felix"],["Who wrote 'The Prince'?","Niccolò Machiavelli","Thomas Hobbes","John Locke","Thomas More"],["English monarch overthrown in 1688?","King James II","King Charles I","King Charles II","King Henry VIII"],["System where peasants were tied to the land?","Serfdom / Manorialism","Feudalism","Vassalage","Mercantilism"],["General who defeated Napoleon at Waterloo?","Duke of Wellington","Horatio Nelson","Gebhard von Blücher","Mikhail Kutuzov"],["German tactic of rapid concentrated attacks?","Blitzkrieg","Schlieffen Plan","Guerre de Course","Pincer Movement"],["Edict that granted rights to Huguenots?","Edict of Nantes","Edict of Worms","Edict of Milan","Edict of Restitution"],["First female PM of the UK?","Margaret Thatcher","Theresa May","Indira Gandhi","Golda Meir"],["Oldest surviving library city?","Nineveh","Babylon","Ur","Uruk"],["Event triggered by defenestration in Prague?","The Thirty Years' War","The Hussite Wars","The Bohemian Revolt","The Seven Years' War"]]
  },
  funfact: {
    foundational: [["Fastest land animal?","Cheetah","Lion","Horse","Greyhound"],["How many continents are there?","7","5","6","8"],["Largest organ in human body?","Skin","Liver","Brain","Heart"],["Which is the 'Red Planet'?","Mars","Venus","Jupiter","Saturn"],["What animal is a Komodo dragon?","Lizard","Snake","Crocodile","Dinosaur"],["Colors in a rainbow?","7","6","5","8"],["Only mammal capable of sustained flight?","Bat","Flying squirrel","Sugar glider","Lemur"],["Hardest natural substance?","Diamond","Gold","Iron","Quartz"],["Days in a leap year?","366","365","364","367"],["United States flag star color?","White","Red","Blue","Gold"],["Animal with humps?","Camel","Elephant","Rhino","Hippopotamus"],["Chemical symbol for water?","H2O","CO2","O2","HO"],["Legs of an octopus?","8","6","10","12"],["What do bees make?","Honey","Nectar","Wax","Pollen"],["Tallest animal?","Giraffe","Elephant","Ostrich","Kangaroo"],["Group of wolves?","Pack","Herd","Flock","Pride"],["Largest ocean?","Pacific","Atlantic","Indian","Arctic"],["Opposite of nocturnal?","Diurnal","Crepuscular","Matutinal","Vespertine"],["Teeth in adult human?","32","30","28","34"],["Fruit to keep doctor away?","Apple","Banana","Orange","Grape"],["Guacamole main ingredient?","Avocado","Tomato","Onion","Lime"],["What do caterpillars turn into?","Butterflies","Moths","Beetles","Flies"],["Stop sign shape?","Octagon","Hexagon","Pentagon","Circle"],["Primary colors count?","3","4","5","2"],["Closest star to Earth?","The Sun","Sirius","Alpha Centauri","Proxima Centauri"],["Largest bone in human body?","Femur","Humerus","Tibia","Fibula"],["Panda's main food?","Bamboo","Eucalyptus","Fish","Berries"],["Freezing point in Fahrenheit?","32°F","0°F","100°F","212°F"],["Zeros in a million?","6","5","7","8"],["School bus color?","Yellow","Orange","Red","Green"]],
    intermediate: [["Letter not in any US state name?","Q","Z","X","J"],["Animal with fingerprints like humans?","Koala","Chimpanzee","Gorilla","Orangutan"],["Rarest human blood type?","AB-negative","O-negative","B-negative","A-negative"],["Group of flamingos name?","Flamboyance","Flock","Murder","Parliament"],["Fear of spiders?","Arachnophobia","Claustrophobia","Agoraphobia","Acrophobia"],["Dot over 'i' or 'j'?","Tittle","Speck","Point","Jot"],["Hearts in an octopus?","3","2","4","1"],["First toy advertised on US TV?","Mr. Potato Head","Barbie","G.I. Joe","Slinky"],["National animal of Scotland?","Unicorn","Lion","Stag","Dragon"],["Fruit that floats because of air?","Apple","Orange","Watermelon","Grape"],["Planet that rolls on its side?","Uranus","Neptune","Saturn","Venus"],["Animal with highest BP?","Giraffe","Elephant","Cheetah","Blue Whale"],["Pneumonoultramicroscopicsilicovolcanoconiosis is?","Lung disease","Skin condition","Metal type","Plant"],["Fear of long words?","Hippopotomonstrosesquippedaliophobia","Verbophobia","Logophobia","Lexophobia"],["Bird with eyes larger than brain?","Ostrich","Owl","Emu","Penguin"],["Rarest M&M color?","Brown","Red","Yellow","Blue"],["Phenomenon measured by Fujita scale?","Tornadoes","Hurricanes","Earthquakes","Tsunamis"],["Shoelace tip name?","Aglet","Tip","Cap","Lace-lock"],["Mammal with thickest fur?","Sea Otter","Polar Bear","Arctic Fox","Chinchilla"],["Wallpaper cleaner turned toy?","Play-Doh","Silly Putty","Slime","Magic Eraser"],["Food that doesn't expire?","Honey","Salt","Sugar","Rice"],["Human blinks per minute?","15-20","5-10","25-30","30-40"],["Hot water freezes faster effect?","Mpemba effect","Doppler effect","Coriolis effect","Leidenfrost effect"],["Group of porcupines name?","Prickle","Herd","Pack","Spine"],["Animal with pink milk?","Hippopotamus","Yak","Water Buffalo","Flamingo"],["Most common letter in English?","E","A","T","O"],["Smell of rain name?","Petrichor","Ozone","Geosmin","Aerosol"],["Body part with most active muscles?","Eyes","Heart","Hands","Tongue"],["First practical telephone inventor?","Alexander Graham Bell","Thomas Edison","Nikola Tesla","Guglielmo Marconi"],["Country with most islands?","Sweden","Canada","Norway","Indonesia"]],
    advanced: [["Protein that makes fireflies glow?","Luciferin","Biolumin","Phosphorin","Luminol"],["The Golden Ratio is roughly?","1.618","3.14","2.71","1.41"],["Symbol & name?","Ampersand","Octothorpe","Asterism","Caret"],["Second most abundant element in universe?","Helium","Neon","Argon","Krypton"],["Tendency to overestimate abilities?","Dunning-Kruger","Baader-Meinhof","Mandela","Placebo"],["Scientific name for 'brain freeze'?","Sphenopalatine ganglioneuralgia","Cryogenic cephalalgia","Cerebral hypothermia","Trigeminal neuralgia"],["Biologically immortal jellyfish?","Turritopsis dohrnii","Chironex fleckeri","Physalia physalis","Aurelia aurita"],["Deepest point in oceans?","Challenger Deep","Mariana Trench","Sirena Deep","Tonga Trench"],["Fear of number 13?","Triskaidekaphobia","Tetraphobia","Octophobia","Hexakosioihexekontahexaphobia"],["Compound that colors blueberries?","Anthocyanins","Carotenoids","Chlorophyll","Betalains"],["Sentence using every letter of alphabet?","Pangram","Anagram","Palindrome","Tautogram"],["Paradox: If aliens exist, where are they?","Fermi Paradox","Drake Equation","Olbers Paradox","Twin Paradox"],["Microscopic 'water bear' name?","Tardigrade","Rotifer","Nematode","Copepod"],["Liquid metal at room temp?","Mercury","Gallium","Bromine","Francium"],["Luminous electrical energy in storms?","Ball lightning","St Elmo fire","Sprite lightning","Auroral sub-storm"],["Funny bone anatomical term?","Ulnar nerve","Humerus","Radius","Medial epicondyle"],["Word that reads same backwards?","Palindrome","Anagram","Ambigram","Portmanteau"],["Planet with day longer than year?","Venus","Mercury","Jupiter","Uranus"],["Word that imitates sound?","Onomatopoeia","Alliteration","Assonance","Hyperbole"],["Black hole light escape boundary?","Event horizon","Singularity","Accretion disk","Photon sphere"],["Oldest living tree name?","Methuselah","Hyperion","General Sherman","Prometheus"],["Potato browning process?","Enzymatic browning","Caramelization","Fermentation","Maillard reaction"],["Words with same root different meanings?","Cognates","Synonyms","Homophones","Antonyms"],["Straight lines appear curved illusion?","Hering illusion","Müller-Lyer illusion","Ponzo illusion","Ebbinghaus illusion"],["Cell programmed death process?","Apoptosis","Necrosis","Autophagy","Mitosis"],["Theoretical sphere of comets?","Oort Cloud","Kuiper Belt","Asteroid Belt","Scattered Disc"],["Fear of being without phone?","Nomophobia","Technophobia","Telephonophobia","Cyberphobia"],["Crust and mantle boundary?","Moho","Gutenberg","Lehmann","Conrad"],["Remember first and last list items effect?","Serial position","Recency","Primacy","Von Restorff"],["Dark red liquid non-metallic element?","Bromine","Iodine","Mercury","Francium"]]
  },
  entertainment: {
    foundational: [["Mickey Mouse creator?","Walt Disney","Mighty Mouse","Jerry","Stuart Little"],["'Man of Steel'?","Superman","Batman","Iron Man","Spider-Man"],["Clownfish movie?","Finding Nemo","Shark Tale","Little Mermaid","Moana"],["'Queen of Pop'?","Madonna","Lady Gaga","Whitney Houston","Britney Spears"],["Darth Vader lightsaber color?","Red","Blue","Green","Purple"],["Harry Potter school?","Hogwarts","Beauxbatons","Durmstrang","Ilvermorny"],["Jack Sparrow actor?","Johnny Depp","Orlando Bloom","Brad Pitt","Tom Cruise"],["Toy Story cowboy?","Woody","Buzz Lightyear","Jessie","Andy"],["Glass slipper princess?","Cinderella","Snow White","Ariel","Belle"],["Building block surviving game?","Minecraft","Roblox","Fortnite","Terraria"],["Queen lead singer?","Freddie Mercury","Mick Jagger","David Bowie","Elton John"],["Batman's city?","Gotham City","Metropolis","Star City","Central City"],["Highest grossing film as of 2024?","Avatar","Avengers Endgame","Titanic","Force Awakens"],["Who wrote Romeo and Juliet?","William Shakespeare","Charles Dickens","Jane Austen","Mark Twain"],["Springfield yellow family?","The Simpsons","Family Guy","Bob's Burgers","Futurama"],["Lion King villain?","Scar","Jafar","Ursula","Gaston"],["Pac-Man color?","Yellow","Red","Blue","Green"],["Drummer plays?","Drums","Guitar","Piano","Bass"],["Green swamp ogre?","Shrek","Donkey","Lord Farquaad","Puss in Boots"],["John Paul George Ringo band?","The Beatles","Rolling Stones","The Who","The Kinks"],["MCU Iron Man actor?","Robert Downey Jr","Chris Evans","Chris Hemsworth","Mark Ruffalo"],["Game of Thrones continent?","Westeros","Middle-earth","Narnia","Tamriel"],["'Shake It Off' singer?","Taylor Swift","Katy Perry","Ariana Grande","Miley Cyrus"],["Aladdin lamp source?","Cave of Wonders","Agrabah Market","Sultan Palace","Magic Carpet"],["Zelda protagonist?","Link","Zelda","Ganon","Mario"],["Theme park dinosaur movie?","Jurassic Park","Godzilla","King Kong","Land Before Time"],["Harry Potter author?","JK Rowling","Stephen King","Suzanne Collins","JR Tolkien"],["Gramophone award?","Grammy Award","Oscar","Emmy","Tony"],[" Spielberg 1982 alien?","ET","Alf","Stitch","Yoda"],["Avengers publisher?","Marvel","DC","Dark Horse","Image"]],
    intermediate: [["Inception and Titanic director?","James Cameron","Steven Spielberg","Christopher Nolan","Quentin Tarantino"],["American Idol season 1 winner?","Kelly Clarkson","Carrie Underwood","Adam Lambert","Fantasia Barrino"],["'Dark Side of the Moon' band?","Pink Floyd","Led Zeppelin","The Who","Rolling Stones"],["Neo's wake up pill color?","Red","Blue","Green","Yellow"],["Black Panther country?","Wakanda","Zamunda","Genosha","Latveria"],["'Here's Johnny!' improviser?","Jack Nicholson","Robert De Niro","Al Pacino","Marlon Brando"],["Pulp Fiction director?","Quentin Tarantino","Martin Scorsese","Stanley Kubrick","David Fincher"],["First feature length animated movie?","Snow White","Pinocchio","Fantasia","Bambi"],["Most Grammys by female artist?","Beyoncé","Taylor Swift","Adele","Aretha Franklin"],["Highest selling console?","PlayStation 2","Nintendo DS","Xbox 360","Nintendo Wii"],["2008 Joker actor?","Heath Ledger","Joaquin Phoenix","Jared Leto","Jack Nicholson"],["Harry Potter prison?","Azkaban","Nurmengard","Gringotts","Askaban"],["Star Wars composer?","John Williams","Hans Zimmer","Ennio Morricone","Alan Silvestri"],["Longest running US live comedy?","It's Always Sunny","The Simpsons","South Park","Saturday Night Live"],["'21' album singer?","Adele","Taylor Swift","Lady Gaga","Katy Perry"],["1994 Best Picture starring Tom Hanks?","Forrest Gump","Pulp Fiction","Shawshank Redemption","Schindler's List"],["Mufasa voice actor?","James Earl Jones","Jeremy Irons","Matthew Broderick","Rowan Atkinson"],["Stranger Things town?","Hawkins","Riverdale","Sunnydale","Derry"],["'Stairway to Heaven' band?","Led Zeppelin","Pink Floyd","Eagles","Doors"],["Walter White actor?","Bryan Cranston","Robert Downey Jr","Chris Evans","Mark Ruffalo"],["'Princess of Pop'?","Britney Spears","Christina Aguilera","Madonna","Janet Jackson"],["Captain America shield metal?","Vibranium","Adamantium","Uru","Nth Metal"],["Grand Budapest Hotel director?","Wes Anderson","Tim Burton","Guillermo del Toro","Edgar Wright"],["Harry Potter broomstick sport?","Quidditch","Quadpot","Gobstones","Broom-racing"],["The Matrix Neo actor?","Keanu Reeves","Tom Cruise","Will Smith","Brad Pitt"],["Wizarding newspaper name?","The Daily Prophet","The Quibbler","The Daily Bugle","The Wizarding Times"],["'1989' album artist?","Taylor Swift","Katy Perry","Ariana Grande","Miley Cyrus"],["The Simpsons town?","Springfield","Shelbyville","Quahog","South Park"],["'Bohemian Rhapsody' band?","Queen","Led Zeppelin","Rolling Stones","The Beatles"],["Wolverine actor?","Hugh Jackman","Patrick Stewart","Ian McKellen","Ryan Reynolds"]],
    advanced: [["First Best Animated Feature Oscar winner?","Shrek","Monsters Inc","Jimmy Neutron","Spirited Away"],["Oscar Emmy Grammy Tony Pulitzer winner?","Richard Rodgers","Marvin Hamlisch","Mel Brooks","Audrey Hepburn"],["Tolkien Elven language?","Sindarin","Dothraki","Klingon","Valyrian"],["'Rumours' album band?","Fleetwood Mac","Pink Floyd","Eagles","Led Zeppelin"],["First movie to gross over $1B?","Titanic","Jurassic Park","Episode I","Avatar"],["Most Oscar nominations actor?","Meryl Streep","Jack Nicholson","Katharine Hepburn","Daniel Day-Lewis"],["Highest grossing indie film?","Passion of Christ","My Big Fat Greek Wedding","Slumdog Millionaire","Juno"],["'Four Seasons' composer?","Vivaldi","Mozart","Beethoven","Bach"],["First Mario appearance game?","Donkey Kong","Super Mario Bros","Mario Bros","Space Invaders"],["'Frankly my dear I don't give a damn' movie?","Gone with the Wind","Casablanca","Wizard of Oz","Citizen Kane"],["TARDIS fuel name?","Artron Energy","Dilithium","Kyber crystals","Tachyon particles"],["'Purple Rain' artist?","Prince","Michael Jackson","David Bowie","James Brown"],["First feature length computer animated film?","Toy Story","A Bug's Life","Antz","Shrek"],["'Reservoir Dogs' director?","Quentin Tarantino","Martin Scorsese","Paul Anderson","Guy Ritchie"],["Highest grossing Broadway musical?","The Lion King","Wicked","Phantom of Opera","Hamilton"],["Posthumous Oscar winner for 'Network'?","Peter Finch","Heath Ledger","James Dean","Massimo Troisi"],["Stephen King fictional town?","Castle Rock","Derry","Jerusalem's Lot","Haven"],["'Lemonade' artist?","Beyoncé","Adele","Rihanna","Lady Gaga"],["First film to win 'Big Five' Oscars?","It Happened One Night","One Flew Over Cuckoo's Nest","Silence of Lambs","Gone with the Wind"],["'Nevermind' band?","Nirvana","Pearl Jam","Soundgarden","Alice in Chains"],["Arrakis movie?","Dune","Tatooine","Hoth","Cybertron"],["Symmetrical framing director?","Wes Anderson","Stanley Kubrick","Alfred Hitchcock","Steven Spielberg"],["First console with built-in HDD?","Xbox","PlayStation 2","GameCube","Dreamcast"],["'Here's looking at you kid' movie?","Casablanca","Gone with the Wind","Maltese Falcon","The Big Sleep"],["Avatar language name?","Na'vi","Klingon","Dothraki","Valyrian"],["'King of Rock and Roll'?","Elvis Presley","Chuck Berry","Little Richard","Jerry Lee Lewis"],["First animated film nominated for Best Picture?","Beauty and the Beast","The Lion King","Toy Story","Up"],["'Evil Dead' director?","Sam Raimi","Quentin Tarantino","Robert Rodriguez","Kevin Smith"],["Highest grossing documentary?","Fahrenheit 9/11","March of Penguins","Super Size Me","Inconvenient Truth"],["Hannibal Lecter Oscar winner?","Anthony Hopkins","Mads Mikkelsen","Brian Cox","Gaspard Ulliel"]]
  },
  sports: {
    foundational: [
      ["Players per team in football?", "11", "10", "12", "7"], 
      ["World Cup 2022 winner?", "Argentina", "France", "Brazil", "Morocco"],
      ["What do you call three goals in one game?", "Hat-trick", "Brace", "Turkey", "Century"],
      ["Which city hosts Wimbledon?", "London", "Paris", "New York", "Melbourne"],
      ["Points for a free throw in basketball?", "1", "2", "3", "4"],
      ["Which sport uses a shuttlecock?", "Badminton", "Tennis", "Squash", "Table Tennis"],
      ["Color of the middle ring on the Olympic flag?", "Black", "Red", "Blue", "Green"]
      ["Which sport is known as the 'Beautiful Game'?", "Football", "Basketball", "Tennis", "Golf"],
      ["How many players are on a standard basketball team on the court?", "5", "6", "11", "7"],
      ["What color is the middle ring on the Olympic flag?", "Black", "Red", "Blue", "Green"],
      ["In which sport would you use a shuttlecock?", "Badminton", "Tennis", "Table Tennis", "Squash"],
      ["Which country has won the most FIFA World Cups?", "Brazil", "Germany", "Italy", "Argentina"],
      ["How many minutes is a standard professional football match (excluding extra time)?", "90", "45", "60", "100"],
      ["What is the highest possible break in a standard game of Snooker?", "147", "155", "140", "160"],
      ["Which city hosts the Wimbledon tennis tournament?", "London", "Paris", "New York", "Melbourne"],
      ["In American Football, how many points is a touchdown worth?", "6", "3", "7", "2"],
      ["Which planet-themed team does LeBron James currently play for?", "Lakers", "Warriors", "Heat", "Cavaliers"]
      ["Which Super Eagle was known as 'The Bull'?", "Daniel Amokachi", "Rashidi Yekini", "Jay-Jay Okocha", "Finidi George"],
      ["In what year did Nigeria win the Olympic Gold in football?", "1996", "1994", "2000", "1992"],
      ["Who scored Nigeria's first-ever World Cup goal?", "Rashidi Yekini", "Amuneke", "Siasia", "Ikpeba"],
      ["How many AFCON titles has Nigeria won as of 2024?", "3", "2", "4", "5"],
      ["Who is the most capped Super Eagles player?", "Ahmed Musa", "Vincent Enyeama", "Joseph Yobo", "Mikel Obi"]
    ],
    intermediate: [
      ["Most Ballon d'Or awards?", "Messi", "Ronaldo", "Zidane", "Pele"], 
      ["Most UCL titles?", "Real Madrid", "AC Milan", "Liverpool", "Bayern"],
      ["Driver with most F1 titles?", "Hamilton/Schumacher", "Vettel", "Verstappen", "Senna"],
      ["2023/24 Premier League winner?", "Manchester City", "Arsenal", "Liverpool", "Chelsea"],
      ["Record for most PL goals in a season (36)?", "Erling Haaland", "Mo Salah", "Alan Shearer", "Luis Suarez"],
      ["2023 African Footballer of the Year?", "Victor Osimhen", "Victor Boniface", "Ademola Lookman", "Alex Iwobi"]
      ["Who is the all-time top scorer for the Nigerian Super Eagles?", "Rashidi Yekini", "Segun Odegbami", "Yakubu Aiyegbeni", "Obafemi Martins"],
      ["Which club has won the most UEFA Champions League titles?", "Real Madrid", "AC Milan", "Liverpool", "Bayern Munich"],
      ["Who won the 2023 African Footballer of the Year award?", "Victor Osimhen", "Mohamed Salah", "Sadio Mane", "Riyad Mahrez"],
      ["In which year did Nigeria's 'Dream Team' win Olympic Football gold?", "1996", "1994", "2000", "1992"],
      ["Which manager led Leicester City to their miracle Premier League title in 2016?", "Claudio Ranieri", "Jose Mourinho", "Pep Guardiola", "Arsene Wenger"],
      ["Who holds the record for the most goals in a single Premier League season (38-game)?", "Erling Haaland", "Mohamed Salah", "Alan Shearer", "Luis Suarez"],
      ["Which tennis player is known as the 'King of Clay'?", "Rafael Nadal", "Roger Federer", "Novak Djokovic", "Andy Murray"],
      ["How many AFCON titles has Nigeria won?", "3", "2", "4", "5"],
      ["Which stadium is the home of the Super Eagles?", "Godswill Akpabio Stadium", "Teslim Balogun Stadium", "Lagos National Stadium", "Nnamdi Azikiwe Stadium"],
      ["Who was the first African to play in the English Premier League?", "Peter Ndlovu", "Jay-Jay Okocha", "Nwankwo Kanu", "George Weah"]
    ],
    advanced: [
      ["First African Ballon d'Or?", "George Weah", "Eto'o", "Drogba", "Okocha"],
      ["First FIFA World Cup winner (1930)?", "Uruguay", "Argentina", "Brazil", "France"],
      ["Premier League all-time top scorer?", "Alan Shearer", "Harry Kane", "Wayne Rooney", "Sergio Aguero"],
      ["First player sold for over £100 million?", "Neymar", "Pogba", "Ronaldo", "Bale"],
      ["Country with the most Olympic medals?", "USA", "Russia", "China", "Germany"],
      ["In cricket, what is a batsman being out for zero called?", "Duck", "Goose", "Wide", "Dot"]
      ["Who is the most expensive football player in history (transfer fee)?", "Neymar Jr", "Kylian Mbappé", "Philippe Coutinho", "Enzo Fernández"],
      ["Which player holds the record for most assists in a single Premier League season?", "Kevin De Bruyne / Thierry Henry", "Cesc Fabregas", "Mesut Ozil", "Frank Lampard"],
      ["Who was the first African to win the Ballon d'Or?", "George Weah", "Samuel Eto'o", "Didier Drogba", "Abedi Pele"],
      ["Which country hosted the first-ever FIFA World Cup in 1930?", "Uruguay", "Italy", "France", "Brazil"],
      ["Which goalkeeper has the most clean sheets in Premier League history?", "Petr Cech", "David James", "Mark Schwarzer", "David De Gea"],
      ["Who won the first-ever Formula 1 World Championship in 1950?", "Giuseppe Farina", "Juan Manuel Fangio", "Alberto Ascari", "Stirling Moss"],
      ["Which player scored the 'Hand of God' goal?", "Diego Maradona", "Pele", "Zico", "Lionel Messi"],
      ["Which club was the first to win 'The Treble' in English football?", "Manchester United", "Manchester City", "Liverpool", "Arsenal"],
      ["How many Grand Slam titles did Serena Williams win in her career?", "23", "22", "24", "21"],
      ["Who is the youngest player to ever score in a World Cup final?", "Pelé", "Kylian Mbappé", "Lionel Messi", "Cristiano Ronaldo"]
      ["Which player has the most goals in UCL history?", "Cristiano Ronaldo", "Lionel Messi", "Robert Lewandowski", "Karim Benzema"],
      ["Which club won 3 consecutive UCL titles between 2016-2018?", "Real Madrid", "Barcelona", "Bayern Munich", "Liverpool"],
      ["Who is the most expensive football player of all time?", "Neymar Jr", "Kylian Mbappé", "Philippe Coutinho", "Ousmane Dembélé"],
      ["Which team won the first-ever Premier League title in 1992?", "Manchester United", "Blackburn Rovers", "Arsenal", "Leeds United"],
      ["Who holds the record for most goals in a single calendar year (91)?", "Lionel Messi", "Cristiano Ronaldo", "Pele", "Gerd Müller"]
    ]
  },
  languages: {
    foundational: [
      ["'Thank you' in French?", "Merci", "Gracias", "Obrigado", "Danke"], 
      ["Official language of Brazil?", "Portuguese", "Spanish", "French", "Italian"],
      ["Most spoken language in Nigeria?", "English", "Yoruba", "Hausa", "Igbo"],
      ["'Hello' in Spanish?", "Hola", "Bonjour", "Ciao", "Namaste"],
      ["Most spoken language globally?", "English", "Mandarin", "Spanish", "Hindi"],
      ["Official language of Germany?", "German", "Dutch", "Danish", "Swiss"]
    ],
    intermediate: [
      ["'Konnichiwa' meaning?", "Hello", "Goodbye", "Thank you", "Sorry"], 
      ["English language family?", "Germanic", "Romance", "Slavic", "Semitic"],
      ["Language using Cyrillic alphabet?", "Russian", "Greek", "Arabic", "Hebrew"],
      ["Official language of Egypt?", "Arabic", "Coptic", "English", "French"],
      ["'Biblioteca' in Spanish?", "Library", "Discotheque", "School", "Church"]
    ],
    advanced: [
      ["UN official languages count?", "6", "5", "4", "7"],
      ["Word that sounds like noise?", "Onomatopoeia", "Hyperbole", "Oxymoron", "Palindrome"],
      ["Example of a ConLang?", "Esperanto", "Swahili", "Finnish", "Vietnamese"],
      ["What is a 'portmanteau'?", "A word blending two meanings", "A synonym", "A specific verb tense", "An archaic noun"],
      ["Root of the Romance languages?", "Latin", "Greek", "Sanskrit", "Hebrew"]
    ]
  }
};

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'science', title: 'Science & Engineering', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'history', title: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'funfact', title: 'Fun Facts', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'entertainment', title: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-500' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Ordverse', icon: Axe, color: 'text-amber-400', glow: 'drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]' // This gives it the "Golden" base
  // To add the red tint/glow, add this to your icon className:
  // "drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]" 
}

];

const DIFFICULTIES = [
  { id: 'foundational', title: 'Foundational', color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'intermediate', title: 'Intermediate', color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'advanced', title: 'Advanced', color: 'text-rose-400', border: 'border-rose-500/30' }
];

const VAULT_CONSTANTS = [
  { name: "Gas Constant (R)", value: "8.314 J/(mol·K)", formula: "PV = nRT" },
  { name: "Gravity (g)", value: "9.81 m/s²", formula: "F = mg" },
  { name: "Water Density (ρ)", value: "1000 kg/m³", formula: "at 4°C" },
  { name: "Faraday (F)", value: "96,485 C/mol", formula: "Q = nF" }
];

const XP_PER_RANK_STEP = 1250;

export default function App() {
  // --- 📦 CORE STATES ---
  const [gameState, setGameState] = useState('login');
  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [settings, setSettings] = useState({ musicEnabled: true, sfxEnabled: true, hapticsEnabled: true });
  const [stats, setStats] = useState({ totalXp: 0, completed: 0 });
  const [user, setUser] = useState(null);

  // --- 🔐 AUTH STATES ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    FirebaseAuthentication.addListener('authStateChange', (result) => {
      if (result.user) {
        setGameState('subject_select');
      } else {
        setGameState('login');
      }
      setIsLoading(false);
    });

    // Check initial auth state
    FirebaseAuthentication.getCurrentUser().then((result) => {
      if (result.user) {
        setGameState('subject_select');
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const handleEmailAuth = async () => {
    try {
      setIsLoading(true);
      if (isRegistering) {
        await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
      } else {
        await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
      }
    } catch (error) {
      alert(`Email Auth Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await FirebaseAuthentication.signInWithGoogle();
    } catch (error) {
      alert(`Google Login Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      await FirebaseAuthentication.signInWithFacebook();
    } catch (error) {
      alert(`Facebook Login Failed: ${error.message}`);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      setGameState('login');
    } catch (error) {
      alert(`Logout Failed: ${error.message}`);
    }
  };

  // --- 🌟 ANIMATION STATES ---
  const [showRankUp, setShowRankUp] = useState(false);
  const [newRankInfo, setNewRankInfo] = useState({ title: '', level: '' });

  // --- 🔥 STREAK ENGINE ---
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  // --- 🔐 AUTH ENGINE ---
  const handleLogin = async (provider) => {
    try {
      let result;
      if (provider === 'google') {
        result = await FirebaseAuthentication.signInWithGoogle();
      } else if (provider === 'facebook') {
        result = await FirebaseAuthentication.signInWithFacebook();
      } else {
        await handleEmailAuth();
        return;
      }

      const userObj = result.user;
      setUser(userObj);
      setGameState('subject_select');

      // Save to Firestore
      const rankData = getRank(stats.totalXp);
      await setDoc(doc(db, "users", userObj.uid), {
        uid: userObj.uid,
        displayName: userObj.displayName || "Unknown Warrior",
        rank: rankData.level,
        score: stats.totalXp
      }, { merge: true });

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    FirebaseAuthentication.getCurrentUser().then(result => {
      if (result.user) {
        setUser(result.user);
      } else {
        setGameState('login');
      }
    });
  }, []);


  // --- 🕹️ GAMEPLAY STATES ---
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);

  const bgMusic = useRef(new Audio('/music.mp3'));
  const correctSfx = useRef(new Audio('/correct.mp3'));
  const wrongSfx = useRef(new Audio('/wrong.mp3'));

  useEffect(() => {
    try {
      const s1 = localStorage.getItem(NEXUS_STATS_KEY);
      const s2 = localStorage.getItem(NEXUS_SETTINGS_KEY);
      if (s1) setStats(JSON.parse(s1));
      if (s2) setSettings(JSON.parse(s2));
    } catch (e) {
      console.log("Corrupted save data detected. Resetting.");
      localStorage.removeItem(NEXUS_STATS_KEY);
      localStorage.removeItem(NEXUS_SETTINGS_KEY);
    }
    bgMusic.current.loop = true;
  }, []);

  useEffect(() => {
    if (settings.musicEnabled && gameState !== 'playing') {
      bgMusic.current.play().catch(() => {});
    } else {
      bgMusic.current.pause();
    }
  }, [settings.musicEnabled, gameState]);
  
  useEffect(() => {
    const setupAppStateListener = async () => {
      await CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        if (!isActive) {
          // Screen turned off or app minimized
          bgMusic.current.pause();
        } else {
          // App opened back up
          if (settings.musicEnabled && gameState !== 'playing') {
            bgMusic.current.play().catch(() => {});
          }
        }
      });
    };

    setupAppStateListener();

    return () => {
      CapacitorApp.removeAllListeners();
    };
  }, [settings.musicEnabled, gameState]);

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishQuiz(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const startQuiz = (timeMode) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setStreak(0);
    setShowStreakBonus(false);
    
    const subjectData = quizData[selectedSubject.id];
    if (!subjectData || !subjectData[selectedDifficulty.id] || subjectData[selectedDifficulty.id].length === 0) {
       alert("No questions available for this level yet!");
       setGameState('subject_select');
       return;
    }

    let pool = subjectData[selectedDifficulty.id];
    const limit = timeMode ? 20 : 10;
    const actualLimit = Math.min(pool.length, limit);

    const randomized = [];
    const usedIndices = new Set();
    while (randomized.length < actualLimit) {
      const idx = Math.floor(Math.random() * pool.length);
      if (!usedIndices.has(idx)) {
        usedIndices.add(idx);
        randomized.push({
          ...pool[idx],
          options: shuffle(pool[idx].options)
        });
      }
    }
    
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const handleAnswer = async (index, isCorrect) => {
    if (isChecking) return;
    setSelectedAnswerIndex(index);
    setIsChecking(true);

    if (isCorrect) {
      setScore(s => s + 1);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) {
         setShowStreakBonus(true);
         setTimeout(() => setShowStreakBonus(false), 2000);
         setStats(prev => {
             const updated = { ...prev, totalXp: prev.totalXp + 50 };
             localStorage.setItem(NEXUS_STATS_KEY, JSON.stringify(updated));
             return updated;
         });
      }

      if (settings.sfxEnabled) correctSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success });
    } else {
      setStreak(0);
      if (settings.sfxEnabled) wrongSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.impact({ style: ImpactStyle.Heavy });
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(c => c + 1);
        setSelectedAnswerIndex(null);
        setIsChecking(false);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0));
        setIsChecking(false);
        setSelectedAnswerIndex(null);
      }
    }, isTimeAttack ? 500 : 1200);
  };

  const Modal = ({ title, children, onClose, icon: Icon, iconColor }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-black mb-6 flex items-center">{Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}</h2>
        {children}
        <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 rounded-xl font-bold">Close</button>
      </div>
    </div>
  );

  // --- 📲 THE SHARE ENGINE ---
  const handleShare = async () => {
    const rankData = getRank(stats.totalXp);
    const streakMsg = streak >= 5 ? `🔥 Max Streak: ${streak}` : '';
    const shareText = `I just reached ${rankData.title}: ${rankData.level} on NexusQuiz! 🏆\n${streakMsg}\n✨ Total XP: ${stats.totalXp}\n\nCan you beat an Engineering Legend? #NexusQuiz #Ordverse`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'NexusQuiz Achievement', text: shareText });
      } catch (err) { console.log("Cancelled"); }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Score copied to clipboard!");
    }
  };

  // YOUR PASTE ENDS HERE - THE NEXT LINE SHOULD BE: return (

    // --- 🏁 THE FINISH LINE LOGIC ---
  const finishQuiz = (finalScore) => {
    const { newXp, hasRankedUp, newRankData } = calculateQuizResults(finalScore, isTimeAttack, stats.totalXp);

    if (hasRankedUp) {
      setNewRankInfo(newRankData); // Load the Rank Up screen info
      setShowRankUp(true);      // Trigger the gold flash animation
      setTimeout(() => setShowRankUp(false), 4000); // Hide after 4 seconds
    }

    // 3. Save the new progress
    const newStats = { ...stats, totalXp: newXp, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem(NEXUS_STATS_KEY, JSON.stringify(newStats));
    
    // Auto-Sync to Firestore
    if (user) {
      const rankData = getRank(newXp);
      setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        rank: rankData.level,
        score: newXp
      }, { merge: true }).catch(err => console.error("Sync failed", err));
    }

    // 4. Move to the results screen
    setGameState('results');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {showSettings && (
        <Modal title="Settings" onClose={() => setShowSettings(false)} icon={Settings} iconColor="text-blue-400">
           <div className="space-y-6">
            {['musicEnabled', 'sfxEnabled', 'hapticsEnabled'].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace('Enabled', '')}</span>
                <button onClick={() => {
                  const ns = {...settings, [key]: !settings[key]};
                  setSettings(ns);
                  localStorage.setItem(NEXUS_SETTINGS_KEY, JSON.stringify(ns));
                }} className={`w-12 h-6 rounded-full ${settings[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}

            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowSettings(false);
                  handleLogout();
                }}
                className="w-full py-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl font-bold flex items-center justify-center transition-colors border border-rose-500/30"
              >
                <LogOut className="mr-2" size={20} />
                Log Out
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showVault && (
        <Modal title="Formula Vault" onClose={() => setShowVault(false)} icon={Book} iconColor="text-emerald-400">
          <div className="space-y-4 text-left">
            {VAULT_CONSTANTS.map((c, i) => (
              <div key={i} className="p-4 bg-slate-800/40 border border-slate-700 rounded-2xl">
                <p className="text-[10px] text-emerald-400 font-bold uppercase">{c.name}</p>
                <p className="text-lg font-black">{c.value}</p>
                <p className="text-xs text-slate-500 italic mt-1">{c.formula}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"><Brain className="text-white" size={20} /></div>
          <span className="text-xl font-black italic tracking-tighter">NexusQuiz</span>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Book size={20} className="text-emerald-400"/></button>
           <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20}/></button>
        </div>
      </div>


      {gameState === 'login' && (
        <div className="w-full max-w-sm space-y-6 text-center animate-in zoom-in duration-300">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl inline-block mb-4 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
            <Brain className="text-white" size={60} />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">NexusQuiz</h1>
          <p className="text-slate-400 mb-8">Prove your knowledge across the Ordverse.</p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-slate-800 text-white rounded-2xl outline-none border border-slate-700 focus:border-blue-500 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-slate-800 text-white rounded-2xl outline-none border border-slate-700 focus:border-blue-500 transition-colors"
            />
            <button onClick={() => handleLogin('google')} className="w-full p-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center hover:bg-gray-100 transition-colors">
              <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>
            <button onClick={() => handleLogin('facebook')} className="w-full p-4 bg-[#1877F2] text-white rounded-2xl font-bold flex items-center justify-center hover:bg-[#166FE5] transition-colors">
              <svg className="w-6 h-6 mr-3 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Continue with Facebook
            </button>
            <button onClick={() => handleLogin('email')} className="w-full p-4 bg-slate-800 text-white border border-slate-700 rounded-2xl font-bold flex items-center justify-center hover:bg-slate-700 transition-colors">
              {isRegistering ? "Sign Up" : "Login"}
            </button>
            <button onClick={() => setGameState('subject_select')} className="w-full p-4 bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center hover:bg-slate-600 transition-colors">
              Play as Guest
            </button>
            <button onClick={() => setIsRegistering(!isRegistering)} className="w-full p-4 text-slate-400 font-bold hover:text-white transition-colors">
              {isRegistering ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      )}

      {gameState === 'subject_select' && (() => {
        const rankData = getRank(stats.totalXp);
        return (
        <div className="w-full max-w-2xl space-y-6">
          {/* --- 👑 Power Hierarchy Header --- */}
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around items-center">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Power Level</p>
              {/* ✅ Fixed: Backticks + Closing > */}
              <p className={`font-black text-lg ${rankData.color}`}>
                {rankData.title}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Status</p>
              <p className="font-bold text-white">
                {rankData.level}
              </p>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Total XP</p>
              <p className="font-bold text-emerald-400">{stats.totalXp}</p>
            </div>
          </div>

          {/* --- 📚 Subjects Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBJECTS.map(sub => (
              <button key={sub.id} onClick={() => {setSelectedSubject(sub); setGameState('difficulty_select')}}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between active:scale-95 transition-all">
                <div className="flex items-center space-x-4">
                  <sub.icon size={28} className={`${sub.color} ${sub.glow || ''}`} />
                  <span className="text-lg font-bold">{sub.title}</span>
                </div>
                <ArrowRight className="text-slate-700" size={20} />
              </button>
            ))}
          </div>

          <button onClick={() => setGameState('leaderboard')} className="w-full py-5 bg-blue-600/20 text-blue-400 rounded-2xl font-bold flex items-center justify-center border border-blue-500/30">
            <BarChart3 className="mr-2" size={20}/> View Hall of Fame
          </button>
        </div>
        );
      })()}

      {gameState === 'difficulty_select' && (
        <div className="w-full max-w-sm space-y-4">
           <button onClick={() => setGameState('subject_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
           <h2 className="text-2xl font-black mb-6 text-center">{selectedSubject.title}</h2>
           {DIFFICULTIES.map(diff => (
             <button key={diff.id} onClick={() => {setSelectedDifficulty(diff); setGameState('mode_select')}}
               className={`w-full p-6 bg-slate-900 border ${diff.border} rounded-2xl flex items-center justify-between`}>
               <span className={`text-xl font-bold ${diff.color}`}>{diff.title}</span>
               <ArrowRight size={20} className="text-slate-700" />
             </button>
           ))}
        </div>
      )}

      {gameState === 'mode_select' && (
        <div className="w-full max-w-sm space-y-4 text-center">
           <button onClick={() => setGameState('difficulty_select')} className="text-slate-500 flex items-center mb-4"><ChevronLeft size={16}/> Back</button>
           <h2 className={`text-2xl font-black ${selectedSubject.color}`}>{selectedSubject.title}</h2>
           <p className="text-slate-500 mb-8 uppercase text-xs font-bold tracking-widest">{selectedDifficulty.title} Level</p>
           <button onClick={() => startQuiz(false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold">Standard Mode (10Q)</button>
           <button onClick={() => startQuiz(true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/40 text-orange-400 rounded-2xl font-bold flex items-center justify-center">
             <Zap size={20} className="mr-2"/> Time Attack (60s)
           </button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-xl relative">
          {showStreakBonus && (
             <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 text-orange-400 font-black flex items-center bg-orange-500/20 px-4 py-2 rounded-full border border-orange-500/50 animate-bounce">
               <Flame className="mr-2" size={20}/> +50 XP STREAK!
             </div>
          )}

          <div className="flex justify-between items-center mb-10">
            <div className="h-2 flex-1 bg-slate-800 rounded-full mr-4 overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(currentIndex/questions.length)*100}%`}} />
            </div>
            
            <div className="flex items-center space-x-4">
              {streak > 2 && <div className="text-orange-500 font-black flex items-center"><Flame size={16} className="mr-1"/> {streak}</div>}
              {isTimeAttack && <div className="text-orange-400 font-black flex items-center"><Timer size={18} className="mr-1"/>{timeLeft}s</div>}
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-10 text-center leading-snug">{questions[currentIndex]?.text}</h2>
          
          <div className="grid gap-3">
            {questions[currentIndex]?.options.map((opt, i) => (
              <button key={i} disabled={isChecking} onClick={() => handleAnswer(i, opt.isCorrect)}
                className={`p-5 rounded-2xl border text-left transition-all font-medium ${isChecking ? (opt.isCorrect ? 'bg-emerald-500/20 border-emerald-500' : i === selectedAnswerIndex ? 'bg-rose-500/20 border-rose-500' : 'opacity-20') : 'bg-slate-900 border-slate-800'}`}>
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

            {gameState === 'results' && (
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm animate-in zoom-in duration-300 shadow-2xl">
          <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
          <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
          <p className="text-6xl font-black my-8 text-white">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>
          
          <div className="space-y-3">
            {/* THIS IS THE NEW SHARE BUTTON */}
            <button onClick={handleShare} className="w-full py-4 bg-emerald-600 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg">
              <Share2 className="mr-2" size={20}/> Share My Score
            </button>
            <button onClick={() => setGameState('subject_select')} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">
              Return to Hub
            </button>
          </div>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">You</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "Daragvener", x: 25000}, {n: "Thril_ler", x: 12000}].map((u, i) => (
              <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60 text-left">
                <p className="font-bold">{u.n}</p><p className="font-black">{u.x} XP</p>
              </div>
            ))}
          </div>
          <button onClick={() => setGameState('subject_select')} className="w-full mt-10 py-4 font-bold text-slate-500 underline">Back Home</button>
        </div>
      )}
            {/* 🌟 CELESTIAL RANK UP OVERLAY */}
      {showRankUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-amber-500/10 animate-pulse" />
          <div className="relative text-center p-12 rounded-[50px] border-2 border-amber-400/50 bg-slate-900 shadow-[0_0_50px_rgba(251,191,36,0.4)] animate-in zoom-in duration-700">
            <Zap className="mx-auto mb-6 text-amber-400 animate-bounce" size={80} />
            <h2 className="text-sm font-black text-amber-500 uppercase tracking-[0.3em] mb-2 text-center">Evolution Complete</h2>
            <h1 className="text-5xl font-black text-white mb-4 italic text-center">RANK UP!</h1>
            <div className="h-px w-32 bg-amber-400/30 mx-auto mb-6" />
            <p className="text-2xl font-bold text-white mb-1 text-center">{newRankInfo.title}</p>
            <p className="text-lg text-amber-400 italic text-center">{newRankInfo.level}</p>
          </div>
        </div>
      )}

    </div>
  );
}
