import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Swords, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, Users, Timer, Zap, Book, BookOpen, Lightbulb, Film, Flame 
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ==========================================
// 📚 THE MEGA REPOSITORY
// ==========================================
const rawQuizData = {
  lore: {
    foundational: [
      ["Who makes up the Triune Symmetry?", "Aetherius Dominus, Supremus Daragvener, and τὸ ἄγνωστον", "Nicholas, Astraea, and Valthar", "The 1st, 4th, and 6th Kings", "Jayden, Mephistopheles, and Kailus"],
      ["What is a 'Mad God' in the Ordverse?", "A deity corrupted by absorbing too much chaotic dimensional energy", "A god of war who lost a battle", "A ruler of the Supreme Universe", "A human who drank Chrysealean blood"],
      ["What happens when a Reality Breaker enters a lower dimension?", "Their base RF exceeds the dimensional cap, causing space-time tears", "They lose all their powers", "They instantly become the King of that realm", "They trigger a Polyvenium meteor strike"],
      ["Who is known as the Prime Creator?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar Demetrius"],
      ["Matchup: Mystic Kid (Age 13) vs Average Earth Military?", "Mystic Kid wins effortlessly", "The Military wins using Polyvenium", "It's a tie", "Mystic Kid retreats"],
      ["Who are the Rank 3 Authorities?", "Cosmic administrators terrified of Nichothéos's existence", "The personal guard of King Kailus", "Earth's highest superhero team", "The creators of the Memory Lock"]
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
      ["Matchup: Jayden Cameron vs Mephistopheles on Earth?", "Jayden won but died from extreme exhaustion", "Mephistopheles destroyed Earth", "Astraea intervened to save them both", "James Cameron defeated Mephistopheles"],
      ["What defines a 'Destroyer Deity' in Chrysealean history?", "A god whose domain naturally erases matter rather than conquering it", "A rebel who fights the Triune Symmetry", "Any Rank 10 Sage", "A mortal who wields an Aetherium weapon"],
      ["Who is Supremus Daragvener?", "The second pillar of the Triune Symmetry", "The lost 2nd King of Chrysealis", "The creator of the Memory Lock", "The true identity of James Cameron"],
      ["Matchup: Mystic Kid vs a Rank 8 Emperor?", "Mystic Kid neutralizes them instantly using HIMMAGE automation", "The Emperor wins due to higher base stats", "Mystic Kid needs James's help to win", "They destroy the dimension fighting"],
      ["How did the Rank 3 Authorities react when Nichothéos simplified the Omniverse?", "With sheer terror, treating him as an unstoppable anomaly", "They awarded him a seat on their council", "They banished him to Earth", "They created the Rank 14 tier to contain him"],
      ["What makes the 3rd pillar, τὸ ἄγνωστον, unique?", "It is 'The Unknown', an enigmatic force even beyond the Prime Creator's standard vessels", "It is the source of all Polyvenium", "It is the physical embodiment of Earth", "It rules the House of War"]
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
      ["Who is the 4th King of Chrysealis and the God of Mysteries and Courage?", "King Klarius Demetrius", "King Miknelah", "King Ziphus", "King Tirath"],
      ["Why did Jayden choose the surname 'Caelestine'?", "To honor his mother's grace and lineage", "It was James Cameron's true name", "To hide from Mephistopheles", "It means 'Victory of the People'"],
      ["What state was Jayden in when he forged Michelle's wedding ring?", "His perfected combined state", "His mortal state as the Mystic Kid", "His heavily injured state", "His 0% AD state"],
      ["Who is the biological brother of Yveldinjar (Mephistopheles)?", "Nichothéos (Nicholas)", "Draco Cameron", "Valthar", "Klarius"],
      ["What lineage does Queen Aelunira belong to?", "House Caelestine", "House Demetrius", "The House of War", "House Williams"],
      ["Which Chrysealean King is Nicholas's Great-grandfather?", "King Klarius Demetrius", "King Miknelah", "King Ziphus", "King Tirath"],
      ["Which King is Nicholas's Grandfather?", "King Tirath Demetrius", "King Kailus", "King Klarius", "Valthar"],
      ["Which generation of Chrysealean Kings does Kailus Demetrius represent?", "The 6th King", "The 5th King", "The 4th King", "The 7th King"]
    ],
    advanced: [
      ["Matchup: Nichothéos (0% AD) vs Valthar the Lost Prince?", "Nichothéos wins because his 'Existence' overrides Valthar's 'Technique'", "Valthar wins due to mastering all weapons", "It is a perfect stalemate", "Valthar wins using the Triune Symmetry"],
      ["What is the mechanical difference between a Reality Breaker and a True God (Rank 14)?", "A True God naturally encompasses all realities, while a Breaker forcibly shatters them", "A Reality Breaker is Rank 15", "True Gods require a Vessel; Breakers do not", "There is no difference"],
      ["Matchup: The combined armies of Chrysealis vs The Crimson God of War?", "Nichothéos's mere approach dissolves their war, making them functionally useless", "The armies win via attrition", "Kailus uses the Memory Lock to save the army", "The Triune prevents them from fighting"],
      ["Why can't Mad Gods comprehend the Triune Symmetry?", "Their minds are fractured by chaotic energy, making absolute order lethal to their psyche", "They are blind to Aetherium", "They are trapped in the Aetheridom Expanse", "They refuse to acknowledge Aetherius Dominus"],
      ["Matchup: Astraea (Current War-God) vs Nichothéos?", "Nichothéos wins overwhelmingly; Astraea is just a manageable replacement for Kailus", "Astraea wins due to having the official title", "Astraea traps him in a Memory Lock", "They refuse to fight due to bloodlines"],
      ["What is the ultimate purpose of the 'Vessel' in relation to the Triune?", "To ground the infinite power of the Prime Creator into a comprehensible avatar", "To destroy Mad Gods", "To act as a prison for Mephistopheles", "To rewrite the laws of thermodynamics in lower verses"]
      ["What is the exact ratio of Nicholas's Crimson to Brown hair?", "57:43", "50:50", "60:40", "43:57"],
      ["Why are Aetherius Dominus's memories sealed within the Nichothéos persona?", "To prevent the Ordverse from collapsing", "To hide from Supremus Daragvener", "As punishment for creating the Vessel", "To learn the ways of mortals"],
      ["Valthar Demetrius, the 'Lost Prince', was the God of what domain?", "Raw Strength & Weapons", "Mysteries and Courage", "Beauty, Charm, Wealth, and Power", "Creation"],
      ["What percentage of Aetherius Dominus's true power does Nichothéos utilize?", "0%", "1%", "10%", "100%"],
      ["How tall is Nicholas Caelestine?", "6'3\"", "6'0\"", "6'5\"", "6'1\""],
      ["How many Rank 13 Peak powerhouses can a Rank 14 True God overwhelm simultaneously?", "A googolplex", "One billion", "Infinite", "One hundred thousand"],
      ["What ability/tool does Jayden use to automate the neutralization of lower-ranked threats?", "HIMMAGE", "The Memory Lock", "The Vessel", "Triune Symmetry"],
      ["At what specific sub-level of Rank 13 (God) does King Kailus Demetrius currently sit?", "Advanced", "Beginner", "Peak", "He is Rank 14"],
      ["What rank do World Breaker Hulk and the Strongest Wonder Woman occupy?", "Advanced Emperor (Rank 8)", "Peak Saint (Rank 9)", "Beginner King (Rank 7)", "Advanced Knight (Rank 6)"],
      ["Who is an example of a Rank 11 Primordial entity in the Ordverse?", "The Void / Cthulhu", "Saitama", "The Chrysealean Immortals", "Planetary-tier Lords"],
      ["What exactly was Mephistopheles attempting to force on Supreme Earth that led to war?", "A 'Fixed Point' of destruction", "A Chrysealean invasion", "The resurrection of Valthar", "The destruction of the Sun"],
      ["Because of his Administrator Authority, Jayden treats Sages, Saints, and Emperors as what?", "Mere background noise", "Worthy challengers", "Allies in the war", "Unpredictable anomalies"],
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
      ["How do the Rank 3 Authorities view Nichothéos (Jayden)?", "With sheer terror, knowing he simplified the Omniverse into one empire alone", "As a weak, Rank 2 vessel", "As a valuable ally for their own conquests", "As a myth that never truly existed"],
      ["According to the updated lore entry, what is the primary difference between Valthar and Nichothéos?", "Valthar was the strongest in Chrysealean history, but Nichothéos was the strongest in existence", "Valthar was a God of Death, Nichothéos was a God of War", "Valthar conquered Earth, Nichothéos conquered the Expanse", "Valthar relied on magic, Nichothéos relied on physical strength"],
      ["What was the method Kailus used to essentially 'lobotomize' Nichothéos during his banishment?", "The randomization and memory lock of the Supreme Universe", "Extracting his Aetherium core", "Binding him with chains holding the weight of Universes", "Forcing him to live as a mortal infant"],
      ["What does the title 'Crimson God of War' specifically represent from the perspective of the battlefield?", "The unstoppable, rare-blooded force that fights alone", "The official commander of the King's legions", "The absolute end and finality of death", "The merciful protector of the weak"],
      ["What did Kailus realize would happen if Nichothéos ever turned his 'One-Man Army' focus toward the Throne?", "Nothing, not even the combined six lineages, could stop him", "The Triune Symmetry would intervene to save the King", "Astraea would be able to defeat him", "The Supreme Universe would collapse"],
      ["In the context of the looming Arc 2 conflict, what does Astraea hold compared to Nicholas?", "The 'Official' authority of the House of Demetrius", "A higher absolute Reality Factor", "The title of God of Death", "Control over the Rank 3 Authorities"],
      ["Because Michelle's ring acts as a conduit of authority, what specific scaling mechanic can she tap into as a mortal?", "His divine scaling power", "The 14-Rank RF system", "The X+1 limit", "HIMMAGE automation"],
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
      ["Why is Michelle considered Jayden's 'primary anchor'?", "Her existence is the main reason he protects Earth", "She holds the Memory Lock", "She is the only one who can defeat him", "She is the reincarnation of a Chrysealean God"]
    ]
  },
  science: {
    foundational: [
      ["At what temperature does water freeze?", "0°C", "10°C", "32°C", "-10°C"],
      ["Which planet is closest to the Sun?", "Mercury", "Venus", "Earth", "Mars"],
      // ... PASTE PREVIOUS 50 FOUNDATIONAL SCIENCE QUESTIONS HERE
      ["At what temperature does water freeze?", "0°C", "10°C", "32°C", "-10°C"],
      ["Which planet is closest to the Sun?", "Mercury", "Venus", "Earth", "Mars"],
      ["What unseen force pulls objects toward the center of the Earth?", "Gravity", "Magnetism", "Friction", "Inertia"],
      ["What do you call an animal that eats only plants?", "Herbivore", "Carnivore", "Omnivore", "Insectivore"],
      ["What is the hardest naturally occurring substance on Earth?", "Diamond", "Gold", "Iron", "Quartz"],
      ["What gas do plants absorb from the air to make their food?", "Carbon Dioxide", "Oxygen", "Nitrogen", "Hydrogen"],
      ["What is the center part of an atom called?", "Nucleus", "Electron", "Proton", "Molecule"],
      ["What is Earth's only natural satellite?", "The Moon", "The Sun", "Mars", "Europa"],
      ["How many legs does a spider have?", "8", "6", "10", "12"],
      ["What is the process of a caterpillar turning into a butterfly called?", "Metamorphosis", "Photosynthesis", "Evolution", "Shedding"],
      ["Through which of these does sound travel the fastest?", "Solid Wood", "Air", "Water", "Vacuum"],
      ["What is the solid state of water called?", "Ice", "Steam", "Cloud", "Snow"],
      ["What is the main source of light and heat for the Earth?", "The Sun", "The Moon", "Geothermal Energy", "Wind"],
      ["Which organ pumps blood throughout the human body?", "Heart", "Lungs", "Brain", "Liver"],
      ["How many colors are typically seen in a rainbow?", "7", "5", "6", "8"],
      ["A push or a pull acting on an object is called a...", "Force", "Mass", "Weight", "Speed"],
      ["What sweet liquid do bees collect from flowers?", "Nectar", "Pollen", "Honey", "Sap"],
      ["Which state of matter has a fixed shape and a fixed volume?", "Solid", "Liquid", "Gas", "Plasma"],
      ["What instrument is used to look at distant stars and planets?", "Telescope", "Microscope", "Stethoscope", "Periscope"],
      ["What is the largest mammal currently living on Earth?", "Blue Whale", "Elephant", "Giraffe", "Great White Shark"],
      ["What do we call the path a planet takes around the sun?", "Orbit", "Rotation", "Spin", "Axis"],
      ["What part of the plant conducts photosynthesis?", "Leaf", "Root", "Stem", "Flower"],
      ["Which animal is known as the King of the Jungle?", "Lion", "Tiger", "Elephant", "Gorilla"],
      ["What is the main gas found in the air we breathe?", "Nitrogen", "Oxygen", "Carbon Dioxide", "Helium"],
      ["Which of these is a reptile?", "Snake", "Frog", "Salamander", "Toad"],
      ["What do we call frozen rain?", "Hail", "Dew", "Fog", "Mist"],
      ["What gives plants their green color?", "Chlorophyll", "Melanin", "Carotene", "Hemoglobin"],
      ["How many senses do humans generally have?", "5", "4", "6", "7"],
      ["Which of these is a non-renewable energy source?", "Coal", "Solar", "Wind", "Hydroelectric"],
      ["What part of the body contains the most bones?", "Hand", "Skull", "Spine", "Ribcage"],
      ["Which force slows down moving objects when they touch?", "Friction", "Gravity", "Magnetism", "Tension"],
      ["What is the natural habitat of a polar bear?", "Arctic", "Antarctica", "Desert", "Rainforest"],
      ["What type of rock is formed from cooled lava?", "Igneous", "Sedimentary", "Metamorphic", "Fossilized"],
      ["Which bird is famous for its colorful tail feathers?", "Peacock", "Penguin", "Ostrich", "Eagle"],
      ["What are clouds made of?", "Water droplets", "Smoke", "Cotton", "Cotton candy"],
      ["What kind of energy is produced by moving water?", "Hydroelectric", "Geothermal", "Solar", "Nuclear"],
      ["What simple machine is a ramp?", "Inclined Plane", "Lever", "Pulley", "Wedge"],
      ["What tool is used to measure temperature?", "Thermometer", "Barometer", "Speedometer", "Altimeter"],
      ["Which planet is known for its rings?", "Saturn", "Jupiter", "Mars", "Uranus"],
      ["What is a baby frog called?", "Tadpole", "Fry", "Pup", "Cub"],
      ["What gas do humans exhale?", "Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"],
      ["What is the largest ocean on Earth?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
      ["Which of these materials is a good conductor of electricity?", "Copper", "Rubber", "Wood", "Glass"],
      ["What animal is known for having a hump on its back?", "Camel", "Horse", "Rhino", "Giraffe"],
      ["What forms when water vapor cools and turns back into liquid?", "Condensation", "Evaporation", "Precipitation", "Sublimation"],
      ["What do you call a scientist who studies stars?", "Astronomer", "Biologist", "Geologist", "Chemist"],
      ["What is the protective outer layer of a tree called?", "Bark", "Leaf", "Root", "Branch"],
      ["Which of these animals hibernates in winter?", "Bear", "Dog", "Cat", "Bird"],
      ["What shape is a full moon?", "Circle", "Crescent", "Square", "Triangle"],
      ["What makes ocean water taste salty?", "Dissolved minerals/salt", "Fish", "Sand", "Seaweed"]
    ],
    intermediate: [
      ["What organelle is the 'powerhouse' of the cell?", "Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
      ["What is the atomic symbol for Gold?", "Au", "Ag", "Gd", "Go"],
      // ... PASTE PREVIOUS 50 INTERMEDIATE SCIENCE QUESTIONS HERE
      ["The Heisenberg Uncertainty Principle states you cannot know momentum and...", "Position", "Energy", "Spin", "Charge"],
      ["Which enzyme 'unzips' the double helix during DNA replication?", "Helicase", "DNA Polymerase", "Ligase", "Primase"],
      ["Which pure metallic element possesses the highest melting point?", "Tungsten", "Titanium", "Platinum", "Carbon"],
      ["Which fundamental force is responsible for beta decay?", "Weak Nuclear Force", "Strong Nuclear Force", "Electromagnetism", "Gravity"],
      ["What translates mRNA into a sequence of amino acids?", "Translation", "Transcription", "Replication", "Mutation"],
      ["The Schrödinger equation calculates...", "The quantum state of a system", "Orbital velocity", "Gravitational waves", "Relativistic time dilation"],
      ["Non-superimposable mirror image molecules are called...", "Enantiomers", "Diastereomers", "Isotopes", "Polymers"],
      ["What is the most abundant structural protein in humans?", "Collagen", "Hemoglobin", "Keratin", "Myosin"],
      ["Which particle grants mass to other particles (found in 2012)?", "Higgs Boson", "Tau Neutrino", "Up Quark", "Muon"],
      ["What is the chemical name for C6H6?", "Benzene", "Methane", "Toluene", "Phenol"],
      ["During an action potential, depolarization is caused by influx of...", "Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl-)"],
      ["Which equation relates Gibbs Free Energy, Enthalpy, and Entropy?", "ΔG = ΔH - TΔS", "ΔG = ΔH + TΔS", "ΔG = TΔH - ΔS", "ΔG = ΔS - TΔH"],
      ["Bernoulli's principle shows an inverse relationship between fluid speed and...", "Pressure", "Temperature", "Viscosity", "Density"],
      ["Where does the Krebs cycle take place?", "Mitochondrial Matrix", "Cytoplasm", "Golgi Apparatus", "Endoplasmic Reticulum"],
      ["The First Law of Thermodynamics is the conservation of...", "Energy", "Mass", "Momentum", "Entropy"],
      ["An SN2 reaction mechanism proceeds via...", "A concerted 'backside attack'", "A carbocation intermediate", "A radical intermediate", "Elimination of a proton"],
      ["Which elementary particle has zero rest mass?", "Photon", "Electron", "Neutron", "Quark"],
      ["What neurotransmitter triggers muscle contraction?", "Acetylcholine", "Dopamine", "Serotonin", "GABA"],
      ["The Ideal Gas Law is represented by...", "PV = nRT", "P1V1 = P2V2", "V = IR", "E = mc^2"],
      ["What phenomenon describes correlated quantum states regardless of distance?", "Entanglement", "Superposition", "Tunneling", "Decoherence"],
      ["What principle forbids two fermions from occupying the same quantum state?", "Pauli Exclusion Principle", "Hund's Rule", "Aufbau Principle", "Bohr Model"],
      ["Which pathway converts glucose into pyruvate?", "Glycolysis", "Gluconeogenesis", "Beta-oxidation", "Calvin Cycle"],
      ["What is the defining characteristic of an aromatic compound?", "A delocalized pi electron ring", "Triple bonds", "Contains oxygen", "Linear structure"],
      ["Which equation relates wavelength of particle to its momentum?", "De Broglie equation", "Planck's equation", "Rydberg equation", "Maxwell's equations"],
      ["In immunology, which cells produce antibodies?", "B cells", "T cells", "Macrophages", "Neutrophils"],
      ["What phenomenon causes the expansion of universe to accelerate?", "Dark Energy", "Dark Matter", "Black Holes", "Cosmic Microwave Background"],
      ["What is the hybridization of the carbon atom in methane (CH4)?", "sp3", "sp2", "sp", "d2sp3"],
      ["Which organelle is responsible for breaking down cellular waste?", "Lysosome", "Peroxisome", "Endosome", "Centriole"],
      ["Speed of a wave on string depends on tension and...", "Linear mass density", "Amplitude", "Frequency", "Length"],
      ["What type of enzyme cuts DNA at specific recognition nucleotide sequences?", "Restriction enzyme", "DNA ligase", "Reverse transcriptase", "Taq polymerase"],
      ["In standard model, what particles make up a proton?", "2 Up quarks, 1 Down quark", "1 Up quark, 2 Down quarks", "3 Up quarks", "Gluons and Bosons"],
      ["Major product of a Markovnikov addition of HBr to an alkene?", "The more substituted alkyl bromide", "The less substituted alkyl bromide", "An alkane", "An alcohol"],
      ["Which hormone regulates the sleep-wake cycle?", "Melatonin", "Cortisol", "Thyroxine", "Insulin"],
      ["What is measure of disorder or randomness in closed system?", "Entropy", "Enthalpy", "Free Energy", "Heat Capacity"],
      ["Which cells in retina are responsible for color vision?", "Cones", "Rods", "Bipolar cells", "Ganglion cells"],
      ["What is process where a solid changes directly into a gas?", "Sublimation", "Deposition", "Vaporization", "Fusion"],
      ["In molecular cloning, what is a plasmid used for?", "As a vector to introduce foreign DNA", "To sequence proteins", "To destroy viruses", "To measure pH"],
      ["According to general relativity, gravity is described as...", "The curvature of spacetime", "A force carrying particle", "A magnetic attraction", "Quantum entanglement"],
      ["What is principle structural component of plant cell walls?", "Cellulose", "Chitin", "Peptidoglycan", "Glycogen"],
      ["Which rule states aromaticity requires 4n+2 pi electrons?", "Hückel's Rule", "Zaitsev's Rule", "Markovnikov's Rule", "Le Chatelier's Principle"],
      ["What is main inhibitory neurotransmitter in mammalian central nervous system?", "GABA", "Glutamate", "Epinephrine", "Histamine"],
      ["Which thermodynamic potential is minimized at constant temperature and pressure?", "Gibbs Free Energy", "Helmholtz Free Energy", "Internal Energy", "Enthalpy"],
      ["What is the evolutionary process distantly related organisms evolve similar traits?", "Convergent evolution", "Divergent evolution", "Coevolution", "Adaptive radiation"],
      ["In an LC circuit, what oscillates?", "Electric and Magnetic fields", "Temperature and Pressure", "Mass and Velocity", "Protons and Neutrons"],
      ["Which organ responsible for Cori Cycle (lactic acid recycling)?", "Liver", "Kidney", "Pancreas", "Spleen"],
      ["Mathematical operator describes total energy of quantum system?", "Hamiltonian", "Lagrangian", "Laplacian", "Jacobian"],
      ["Term for an allele that only expressed in homozygous state?", "Recessive", "Dominant", "Codominant", "Epistatic"],
      ["What transition metal is at the center of hemoglobin molecule?", "Iron (Fe)", "Magnesium (Mg)", "Copper (Cu)", "Zinc (Zn)"],
      ["Which phenomenon describes light bending around edge of obstacle?", "Diffraction", "Refraction", "Interference", "Polarization"],
      ["What is the limit of strong force's effective range?", "Roughly 1 femtometer", "1 nanometer", "1 millimeter", "Infinite"]
    ],
    advanced: [
      ["The Heisenberg Uncertainty Principle states you cannot know momentum and...", "Position", "Energy", "Spin", "Charge"],
      ["Which enzyme 'unzips' the double helix during DNA replication?", "Helicase", "DNA Polymerase", "Ligase", "Primase"],
      // ... PASTE PREVIOUS 50 ADVANCED SCIENCE QUESTIONS HERE
      ["What organelle is the 'powerhouse' of the cell?", "Mitochondria", "Nucleus", "Ribosome", "Chloroplast"],
      ["What is the atomic symbol for Gold?", "Au", "Ag", "Gd", "Go"],
      ["What is the most abundant gas in Earth's atmosphere?", "Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"],
      ["What is the approximate speed of light in a vacuum?", "3 x 10^8 m/s", "1.5 x 10^8 m/s", "3 x 10^6 m/s", "1 x 10^9 m/s"],
      ["By what biological process do plants convert light into chemical energy?", "Photosynthesis", "Respiration", "Transpiration", "Digestion"],
      ["According to Newton's Second Law, Force equals...", "Mass x Acceleration", "Mass / Acceleration", "Mass x Velocity", "Work / Time"],
      ["What is the pH level of pure water?", "7", "0", "14", "5.5"],
      ["What is the process of cell division resulting in two identical cells?", "Mitosis", "Meiosis", "Fission", "Budding"],
      ["In Chemistry, what is Avogadro's number?", "6.022 x 10^23", "3.14 x 10^15", "1.602 x 10^-19", "2.99 x 10^8"],
      ["What is the standard SI unit of electrical resistance?", "Ohm", "Volt", "Ampere", "Watt"],
      ["What is the chemical formula for standard table salt?", "NaCl", "NaOH", "HCl", "KCl"],
      ["What is the formula for calculating Kinetic Energy?", "1/2 mv^2", "mgh", "mc^2", "Fd"],
      ["Which cell organelle synthesizes proteins?", "Ribosome", "Lysosome", "Golgi Apparatus", "Vacuole"],
      ["The atomic number of an element is determined by the number of...", "Protons", "Neutrons", "Electrons", "Protons and Neutrons"],
      ["The Law of Conservation of Energy states energy cannot be...", "Created or destroyed", "Transferred", "Stored", "Measured"],
      ["An organism's physical appearance is called its...", "Phenotype", "Genotype", "Allele", "Chromosome"],
      ["What chemical bond shares electron pairs between atoms?", "Covalent bond", "Ionic bond", "Metallic bond", "Hydrogen bond"],
      ["What is the acceleration due to gravity on Earth?", "9.8 m/s^2", "3.14 m/s^2", "1.6 m/s^2", "15.2 m/s^2"],
      ["Which blood cells carry oxygen?", "Erythrocytes (Red Blood Cells)", "Leukocytes (White Blood Cells)", "Thrombocytes (Platelets)", "Lymphocytes"],
      ["Group 18 elements are known as...", "Noble Gases", "Alkali Metals", "Halogens", "Transition Metals"],
      ["What type of energy is stored in stretched rubber bands?", "Elastic Potential Energy", "Kinetic Energy", "Thermal Energy", "Chemical Energy"],
      ["What is the main function of white blood cells?", "Fighting infection", "Carrying oxygen", "Clotting blood", "Digesting food"],
      ["What principle states that buoyant force equals the weight of displaced fluid?", "Archimedes' Principle", "Pascal's Principle", "Bernoulli's Principle", "Boyle's Law"],
      ["In genetics, what does DNA stand for?", "Deoxyribonucleic Acid", "Diribonucleic Acid", "Deoxyribose Nitrogen Acid", "Dynamic Nucleic Acid"],
      ["What is a chemical reaction that releases heat called?", "Exothermic", "Endothermic", "Isothermic", "Catalytic"],
      ["Which subatomic particle has a negative charge?", "Electron", "Proton", "Neutron", "Nucleus"],
      ["What phase change occurs when a gas turns into a liquid?", "Condensation", "Evaporation", "Sublimation", "Melting"],
      ["Who is considered the father of modern genetics?", "Gregor Mendel", "Charles Darwin", "Louis Pasteur", "Isaac Newton"],
      ["What wave property determines the pitch of a sound?", "Frequency", "Amplitude", "Wavelength", "Speed"],
      ["What is the half-life of a radioactive isotope?", "Time for half of it to decay", "Time for it to fully decay", "Half its physical lifespan", "Time to double in mass"],
      ["What part of the brain controls balance and coordination?", "Cerebellum", "Cerebrum", "Brainstem", "Hypothalamus"],
      ["What element has the chemical symbol 'Fe'?", "Iron", "Fluorine", "Francium", "Lead"],
      ["Which law states volume of a gas is inversely proportional to its pressure?", "Boyle's Law", "Charles's Law", "Avogadro's Law", "Gay-Lussac's Law"],
      ["What cellular structure contains the genetic material in eukaryotes?", "Nucleus", "Cytoplasm", "Cell Membrane", "Ribosome"],
      ["What type of lens is thicker in the middle and magnifies objects?", "Convex", "Concave", "Plano", "Cylindrical"],
      ["In an ecosystem, fungi and bacteria serve as...", "Decomposers", "Producers", "Primary Consumers", "Apex Predators"],
      ["What type of mixture is visually uniform throughout (like saltwater)?", "Homogeneous", "Heterogeneous", "Suspension", "Colloid"],
      ["What is the unit of power?", "Watt", "Joule", "Newton", "Ampere"],
      ["What blood vessel carries oxygenated blood away from the heart?", "Artery", "Vein", "Capillary", "Venule"],
      ["What is the process traits are passed from parents to offspring?", "Heredity", "Mutation", "Evolution", "Homeostasis"],
      ["Which group on the periodic table contains highly reactive metals like Sodium?", "Alkali Metals", "Alkaline Earth Metals", "Halogens", "Noble Gases"],
      ["What phenomenon causes a prism to split white light into colors?", "Dispersion", "Reflection", "Diffraction", "Interference"],
      ["What is the chemical formula for glucose?", "C6H12O6", "CO2", "H2O", "CH4"],
      ["What is the primary function of the large intestine?", "Absorbing water", "Absorbing nutrients", "Digesting proteins", "Producing bile"],
      ["Which law states that action has an equal opposite reaction?", "Newton's Third Law", "Newton's First Law", "Newton's Second Law", "Law of Gravitation"],
      ["What type of reproduction involves only one parent?", "Asexual", "Sexual", "Meiosis", "Fertilization"],
      ["What is the name for a substance that speeds up a chemical reaction?", "Catalyst", "Inhibitor", "Reactant", "Product"],
      ["What scalar quantity is the rate distance covered?", "Speed", "Velocity", "Acceleration", "Displacement"],
      ["What is the most common isotope of carbon used in radiometric dating?", "Carbon-14", "Carbon-12", "Carbon-13", "Carbon-16"],
      ["What fluid in the human body is primarily made of water, plasma, and cells?", "Blood", "Lymph", "Saliva", "Bile"]
    ]
  },
  tech: {
    foundational: [
      ["What does PC stand for?", "Personal Computer", "Private Computer", "Primary Console", "Portable Computer"],
      // ... PASTE PREVIOUS TECH QUESTIONS HERE
      ["[Tech] What does PC stand for?", "Personal Computer", "Private Computer", "Primary Console", "Portable Computer"],
      ["[Math] What is 8 multiplied by 7?", "56", "54", "64", "42"],
      ["[Tech] What part is considered the 'brain' of the computer?", "CPU", "Hard Drive", "RAM", "Motherboard"],
      ["[Math] Perimeter of rectangle length 5 and width 4?", "18", "20", "9", "24"],
      ["[Tech] Standard keyboard shortcut to 'Copy' text?", "Ctrl + C", "Ctrl + V", "Ctrl + X", "Ctrl + P"],
      ["[Math] A prime number is a number divisible only by 1 and itself", "TRUE", "FALSE", "Ends in 1, 3, 7, 9", "Has exactly three factors"],
      ["[Tech] What is Wi-Fi primarily used for?", "Wireless networking", "Storing data", "Cooling the computer", "Printing documents"],
      ["[Math] Formula for the area of a triangle?", "1/2 x Base x Height", "Base x Height", "Length x Width", "Pi x Radius^2"],
      ["[Tech] One Gigabyte (GB) is roughly equal to...", "1000 Megabytes (MB)", "1000 Kilobytes (KB)", "1000 Terabytes (TB)", "1000 Bytes"],
      ["[Math] Sum of interior angles of standard triangle?", "180 degrees", "90 degrees", "360 degrees", "270 degrees"],
      ["[Tech] Physical, tangible parts of computer are called...", "Hardware", "Software", "Malware", "Shareware"],
      ["[Math] What is 25% of 200?", "50", "25", "75", "100"],
      ["[Tech] Main circuit board of computer called?", "Motherboard", "Fatherboard", "Logic Board", "Central Board"],
      ["[Math] What is the square root of 144?", "12", "14", "16", "10"],
      ["[Tech] A widely used Search Engine?", "Google", "Microsoft Word", "Photoshop", "Linux"],
      ["[Math] What do you call a polygon with exactly 5 sides?", "Pentagon", "Hexagon", "Octagon", "Quadrilateral"],
      ["[Tech] What software protects a computer from malicious programs?", "Antivirus", "Browser", "Operating System", "Word Processor"],
      ["[Math] What is 10 to the power of 3 (10³)?", "1000", "30", "100", "10000"],
      ["[Tech] The global system of interconnected computer networks?", "Internet", "Intranet", "Extranet", "Ethernet"],
      ["[Math] The approximate value of Pi (π) to two decimal places?", "3.14", "3.12", "3.16", "3.18"],
      ["[Tech] What device is used to input text into a computer?", "Keyboard", "Monitor", "Printer", "Speaker"],
      ["[Math] What is 15 + 27?", "42", "32", "52", "40"],
      ["[Tech] What does 'www' at the beginning of a website stand for?", "World Wide Web", "Web World Wide", "Wide World Web", "World Web Wide"],
      ["[Math] If you have 3 apples and buy 4 more, how many do you have?", "7", "6", "8", "12"],
      ["[Tech] Which of these is an output device?", "Monitor", "Mouse", "Microphone", "Webcam"],
      ["[Math] What is 50 divided by 5?", "10", "5", "15", "25"],
      ["[Tech] What is a folder on a computer used for?", "Organizing files", "Running programs", "Cooling the CPU", "Connecting to Wi-Fi"],
      ["[Math] What is the next number in the pattern: 2, 4, 6, 8, ...?", "10", "9", "12", "14"],
      ["[Tech] What does it mean to 'reboot' a computer?", "Restart it", "Kick it", "Delete everything", "Install a game"],
      ["[Math] How many degrees are in a full circle?", "360", "180", "90", "100"],
      ["[Tech] Which program is commonly used to type documents?", "Microsoft Word", "Google Chrome", "Adobe Photoshop", "VLC Player"],
      ["[Math] What is 1/2 written as a decimal?", "0.5", "0.2", "0.12", "1.2"],
      ["[Tech] What does a computer mouse do?", "Moves the cursor", "Types words", "Prints paper", "Plays music"],
      ["[Math] Which is the largest number?", "999", "909", "990", "900"],
      ["[Tech] What is the screen of a computer called?", "Monitor", "Keyboard", "Tower", "Mousepad"],
      ["[Math] How many sides does a hexagon have?", "6", "5", "8", "7"],
      ["[Tech] What is it called when you move a file from the internet to your PC?", "Downloading", "Uploading", "Streaming", "Pinging"],
      ["[Math] What is 9 x 9?", "81", "72", "90", "99"],
      ["[Tech] What does 'USB' normally connect?", "External devices", "Power grids", "Water pipes", "Radio waves"],
      ["[Math] How many minutes are in 2 hours?", "120", "60", "90", "200"],
      ["[Tech] Which of these is an email service?", "Gmail", "Google Docs", "YouTube", "Excel"],
      ["[Math] If a square has a side of 3, what is its area?", "9", "6", "12", "3"],
      ["[Tech] What symbol is used in every email address?", "@", "#", "$", "&"],
      ["[Math] What is 100 minus 37?", "63", "53", "73", "67"],
      ["[Tech] What is a password used for?", "Security", "Speed", "Storage", "Sharing"],
      ["[Math] What shape has 3 equal sides and 3 equal angles?", "Equilateral Triangle", "Isosceles Triangle", "Right Triangle", "Scalene Triangle"],
      ["[Tech] What is an 'app' short for?", "Application", "Apple", "Apparatus", "Appendix"],
      ["[Math] What is half of 50?", "25", "20", "30", "15"],
      ["[Tech] What do you double-click to open a program?", "An icon", "The screen", "The keyboard", "The cable"],
      ["[Math] How many zeros are in one million?", "6", "5", "7", "8"]
    ],
    intermediate: [
      ["What does HTML stand for?", "HyperText Markup Language", "High Tech", "Home Tool", "Hyperlinks"],
      // ... PASTE PREVIOUS TECH QUESTIONS HERE
      ["[Tech] What does HTML stand for?", "HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks Text Markup Language"],
      ["[Math] What is the derivative of x² with respect to x?", "2x", "x", "x³ / 3", "2"],
      ["[Tech] Which language is primarily used to style web pages?", "CSS", "Python", "JavaScript", "C++"],
      ["[Math] In a right triangle, what relates sides a, b, and hypotenuse c?", "a² + b² = c²", "a + b = c", "a * b = c", "sin(a) = b/c"],
      ["[Tech] What does SQL stand for?", "Structured Query Language", "Simple Query Language", "Sequential Query Logic", "System Query Language"],
      ["[Math] What is the sine of 90 degrees (or π/2 radians)?", "1", "0", "0.5", "-1"],
      ["[Tech] Which protocol is used for secure, encrypted web browsing?", "HTTPS", "HTTP", "FTP", "SMTP"],
      ["[Math] What is the discriminant of the quadratic equation ax² + bx + c = 0?", "b² - 4ac", "-b ± √(b² - 4ac)", "2a", "b² + 4ac"],
      ["[Tech] Which programming paradigm organizes software around 'objects'?", "Object-Oriented Programming", "Functional Programming", "Procedural Programming", "Logic Programming"],
      ["[Math] What is the value of Log base 10 of 100? (log₁₀ 100)", "2", "10", "100", "1"],
      ["[Tech] What attack attempts to overwhelm a target with a flood of traffic?", "DDoS", "Phishing", "SQL Injection", "Man-in-the-Middle"],
      ["[Math] What is the standard equation of a circle centered at the origin?", "x² + y² = r²", "y = mx + c", "x² / a² + y² / b² = 1", "y = ax² + bx + c"],
      ["[Tech] What is the primary purpose of an IP address?", "Uniquely identifies a device on a network", "Encrypts internet traffic", "Increases download speed", "Translates domain names"],
      ["[Math] What is the probability of rolling a 4 on a fair 6-sided die?", "1/6", "1/2", "1/4", "4/6"],
      ["[Tech] Git is an example of a...", "Version Control System", "Database Management System", "Operating System", "Web Browser"],
      ["[Math] What is the sum of an infinite geometric series (first term a, ratio r)?", "a / (1 - r)", "a * r^n", "a(1 - r^n) / (1 - r)", "Infinity"],
      ["[Tech] Which data structure operates Last-In, First-Out (LIFO)?", "Stack", "Queue", "Array", "Tree"],
      ["[Math] To multiply two matrices, what condition must be met?", "Inner dimensions must match", "Same number of rows", "Must be square matrices", "Same number of elements"],
      ["[Tech] What does JSON stand for?", "JavaScript Object Notation", "Java Standard Output Network", "Java Serialized Object Notation", "JavaScript Optional Notation"],
      ["[Math] What is the limit of 1/x as x approaches infinity?", "0", "Infinity", "1", "Undefined"],
      ["[Tech] What does RAM stand for?", "Random Access Memory", "Read Access Memory", "Run All Memory", "Random Active Memory"],
      ["[Math] What is the value of cos(0)?", "1", "0", "-1", "undefined"],
      ["[Tech] Which tag is used in HTML to insert an image?", "<img>", "<image>", "<pic>", "<src>"],
      ["[Math] If f(x) = 3x + 2, what is f(4)?", "14", "12", "16", "10"],
      ["[Tech] What is a Boolean variable?", "A True or False value", "A decimal number", "A text string", "An array of items"],
      ["[Math] What is the absolute value of -15?", "15", "-15", "0", "1"],
      ["[Tech] What port does HTTP usually run on?", "80", "443", "21", "22"],
      ["[Math] What is the slope of the line y = 4x - 7?", "4", "-7", "x", "0"],
      ["[Tech] In networking, what does LAN stand for?", "Local Area Network", "Large Area Network", "Logical Access Node", "Light Access Network"],
      ["[Math] What is 5 factorial (5!)?", "120", "60", "25", "15"],
      ["[Tech] What does CSS stand for?", "Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "Color Syntax System"],
      ["[Math] What is the midpoint of the segment between (0,0) and (4,4)?", "(2,2)", "(4,4)", "(0,4)", "(2,0)"],
      ["[Tech] Which is a common relational database?", "MySQL", "MongoDB", "Redis", "Cassandra"],
      ["[Math] What do angles on a straight line add up to?", "180", "90", "360", "270"],
      ["[Tech] What symbol denotes an ID selector in CSS?", "#", ".", "@", "$"],
      ["[Math] What is x if 2x - 6 = 10?", "8", "4", "16", "2"],
      ["[Tech] What does CPU stand for?", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
      ["[Math] A triangle with no equal sides is called...", "Scalene", "Isosceles", "Equilateral", "Right"],
      ["[Tech] What command in Git saves your changes locally?", "git commit", "git push", "git pull", "git clone"],
      ["[Math] What is the median of 1, 3, 3, 6, 7, 8, 9?", "6", "3", "7", "5.2"],
      ["[Tech] What is the brain of a router called?", "Firmware", "Hardware", "Middleware", "Shareware"],
      ["[Math] What is the area of a circle with radius 3?", "9π", "6π", "3π", "12π"],
      ["[Tech] Which language runs natively in web browsers?", "JavaScript", "Python", "Java", "C#"],
      ["[Math] What is the GCF of 12 and 18?", "6", "3", "2", "36"],
      ["[Tech] What does API stand for?", "Application Programming Interface", "Advanced Program Integration", "Active Protocol Interface", "Appliation Process Internet"],
      ["[Math] What is the mode of the set: 2, 4, 4, 5, 6?", "4", "4.2", "5", "2"],
      ["[Tech] Which malware disguises itself as legitimate software?", "Trojan", "Worm", "Spyware", "Ransomware"],
      ["[Math] In algebra, what does 'x' usually represent?", "A variable", "A constant", "An operator", "A fraction"],
      ["[Tech] Which of the following is an Operating System?", "Linux", "Chrome", "Firefox", "Microsoft Office"],
      ["[Math] What is 2^5 (2 to the power of 5)?", "32", "16", "64", "10"]
    ],
    advanced: [
      ["What is the worst-case time complexity of Binary Search?", "O(log n)", "O(1)", "O(n)", "O(n log n)"],
      // ... PASTE PREVIOUS TECH QUESTIONS HERE
      ["[Tech] What is the worst-case time complexity of Binary Search?", "O(log n)", "O(1)", "O(n)", "O(n log n)"],
      ["[Math] In Linear Algebra, Ax = λx represents finding...", "Eigenvalues and Eigenvectors", "Determinant", "Cross Product", "Inverse Matrix"],
      ["[Tech] In CAP Theorem, a distributed system guarantees two out of...", "Consistency, Availability, Partition Tolerance", "Concurrency, Availability, Performance", "Capacity, Atomicity, Persistence", "Computing, Asynchrony, Parallelism"],
      ["[Math] What is the indefinite integral of e^x?", "e^x + C", "x * e^(x-1) + C", "ln(x) + C", "e^(x+1) / (x+1) + C"],
      ["[Tech] Which design pattern restricts a class to one instance?", "Singleton", "Factory", "Observer", "Decorator"],
      ["[Math] The Maclaurin series for sin(x) begins...", "x - x³/3! + x⁵/5! ...", "1 - x²/2! + x⁴/4! ...", "1 + x + x²/2! ...", "x + x²/2 + x³/3 ..."],
      ["[Tech] What consensus mechanism does Bitcoin rely on?", "Proof of Work", "Proof of Stake", "Delegated Proof of Stake", "Byzantine Fault Tolerance"],
      ["[Math] What is the determinant of a 2x2 matrix [a, b; c, d]?", "ad - bc", "a+d - b+c", "ac - bd", "ab - cd"],
      ["[Tech] A JS function remembering variables in its lexical scope is a...", "Closure", "Promise", "Callback", "Generator"],
      ["[Math] Euler's Identity is...", "e^(iπ) + 1 = 0", "a² + b² = c²", "F - E + V = 2", "E = mc²"],
      ["[Tech] What is the purpose of an 'inverted index'?", "Fast full-text searches mapping content to location", "To reverse an array in O(1) time", "To encrypt plain text", "To compress video files"],
      ["[Math] The Laplace transform of the constant function f(t) = 1 is...", "1/s", "s", "1/s²", "e^(-s)"],
      ["[Tech] In database transactions, ACID stands for...", "Atomicity, Consistency, Isolation, Durability", "Asynchrony, Concurrency, Integrity, Data", "Availability, Clustering, Indexing, Distribution", "Array, Character, Integer, Double"],
      ["[Math] Cauchy-Riemann equations are necessary for a complex function to be...", "Holomorphic (Analytic)", "Continuous", "Integrable", "A polynomial"],
      ["[Tech] The 'Halting Problem' proves that...", "It's impossible to build a general algorithm to determine if any program finishes", "Hardware will eventually overheat", "All programs have bugs", "Network packets will always face delay"],
      ["[Math] The Fundamental Theorem of Calculus connects...", "Differentiation and Integration", "Addition and Subtraction", "Limits and Continuity", "Algebra and Geometry"],
      ["[Tech] What does 'thrashing' mean in Operating Systems?", "System spends more time paging memory than executing", "Hard drive physically scratches the disk", "CPU is overclocked too high", "Threads rapidly acquire/release locks"],
      ["[Math] The gradient of a scalar field produces...", "A vector field", "A constant", "Another scalar field", "A tensor"],
      ["[Tech] Which SOLID principle states subclasses must be substitutable for superclasses?", "Liskov Substitution", "Single Responsibility", "Open/Closed", "Dependency Inversion"],
      ["[Math] The Four Color Theorem states the max chromatic number of a planar graph is...", "4", "3", "5", "Infinity"],
      ["[Tech] What data structure is used to implement a Priority Queue?", "Heap", "Linked List", "Stack", "Hash Table"],
      ["[Math] What is the derivative of ln(x)?", "1/x", "e^x", "x", "1/x^2"],
      ["[Tech] What algorithm finds the shortest path in a weighted graph?", "Dijkstra's Algorithm", "Depth First Search", "Merge Sort", "Kruskal's Algorithm"],
      ["[Math] What is the rank of an invertible n x n matrix?", "n", "1", "0", "n-1"],
      ["[Tech] Which layer of the OSI model does TCP operate on?", "Transport Layer", "Network Layer", "Data Link Layer", "Application Layer"],
      ["[Math] The divergence of the curl of any vector field is always...", "0", "1", "Infinity", "Undefined"],
      ["[Tech] Which hashing algorithm is considered cryptographically broken?", "MD5", "SHA-256", "bcrypt", "Argon2"],
      ["[Math] What is the integral of 1/x dx?", "ln|x| + C", "e^x + C", "x^2/2 + C", "-1/x^2 + C"],
      ["[Tech] What is 'memoization'?", "Caching results of expensive function calls", "Storing data on disk", "Translating code to machine language", "A garbage collection technique"],
      ["[Math] A matrix is orthogonal if its transpose is equal to its...", "Inverse", "Determinant", "Eigenvalue", "Trace"],
      ["[Tech] Which HTTP method is used to partially update a resource?", "PATCH", "PUT", "POST", "UPDATE"],
      ["[Math] The Taylor series centered at x = 0 is commonly called the...", "Maclaurin series", "Fourier series", "Laurent series", "Dirichlet series"],
      ["[Tech] What is a Race Condition?", "When output depends on the uncontrollable timing of threads", "When a CPU runs too hot", "A fast sorting algorithm", "When packets drop on a network"],
      ["[Math] Which theorem relates a line integral to a surface integral?", "Stokes' Theorem", "Pythagorean Theorem", "Green's Theorem", "Divergence Theorem"],
      ["[Tech] In Rust or C++, what prevents memory leaks without garbage collection?", "Ownership/RAII", "Pointers", "Global variables", "Virtual machines"],
      ["[Math] The probability of getting exactly k heads in n coin flips uses what distribution?", "Binomial", "Poisson", "Normal", "Exponential"],
      ["[Tech] What is a 'foreign key' in SQL?", "A field referring to a primary key in another table", "A password for the database", "An index for text search", "A key generated outside the country"],
      ["[Math] What is the curl of a conservative vector field?", "0", "1", "The gradient", "The divergence"],
      ["[Tech] What is the space complexity of Depth First Search on a tree of depth d?", "O(d)", "O(1)", "O(2^d)", "O(d^2)"],
      ["[Math] Which equation describes heat diffusion over time?", "Heat Equation", "Wave Equation", "Laplace Equation", "Navier-Stokes Equation"],
      ["[Tech] What does BGP stand for in networking?", "Border Gateway Protocol", "Broadband Gateway Port", "Binary Graph Process", "Base Global Protocol"],
      ["[Math] What are the solutions to the characteristic equation of a differential equation?", "Eigenvalues / Roots", "Derivatives", "Integrals", "Constants"],
      ["[Tech] In cryptography, RSA relies on the difficulty of...", "Factoring large prime numbers", "Reversing a hash", "Sorting large arrays", "Solving symmetric keys"],
      ["[Math] What is the dot product of two orthogonal vectors?", "0", "1", "-1", "Their magnitudes multiplied"],
      ["[Tech] What is the 'Deadlock' state?", "Two or more processes waiting indefinitely for each other", "A server crashing", "A thread finishing execution", "A network timeout"],
      ["[Math] Which theorem classifies closed surfaces?", "Classification Theorem of Surfaces", "Gauss-Bonnet Theorem", "Poincaré Conjecture", "Euler's Formula"],
      ["[Tech] Which command in Linux lists running processes?", "top / ps", "ls", "grep", "chmod"],
      ["[Math] A set with an associative binary operation, an identity, and inverses is a...", "Group", "Ring", "Field", "Vector Space"],
      ["[Tech] What does a 'hypervisor' do?", "Creates and runs virtual machines", "Compiles code", "Balances web traffic", "Encrypts passwords"],
      ["[Math] The trace of a matrix is the sum of its...", "Diagonal elements", "Eigenvalues", "Rows", "Columns"]
    ]
  },
  history: {
    foundational: [["First US President?", "Washington", "Lincoln", "Jefferson", "Adams"] /* ... PASTE HISTORY HERE */["Who was the first President of the United States?", "George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"],
  ["Which ancient civilization built the Great Pyramid of Giza?", "Ancient Egyptians", "Ancient Romans", "Ancient Greeks", "Mayans"],
  ["In what year did Christopher Columbus first reach the Americas?", "1492", "1776", "1607", "1066"],
  ["Who was the famous Queen of Ancient Egypt who had relationships with Julius Caesar and Mark Antony?", "Cleopatra", "Nefertiti", "Hatshepsut", "Boudicca"],
  ["Which empire was ruled by Julius Caesar?", "The Roman Empire", "The Ottoman Empire", "The British Empire", "The Mongol Empire"],
  ["What was the name of the ship that brought the Pilgrims to America in 1620?", "Mayflower", "Santa Maria", "Nina", "Pinta"],
  ["Which global conflict ended in 1945?", "World War II", "World War I", "The Cold War", "The Vietnam War"],
  ["Who wrote the Declaration of Independence?", "Thomas Jefferson", "Benjamin Franklin", "George Washington", "Alexander Hamilton"],
  ["What wall was torn down in 1989, unifying a divided European city?", "The Berlin Wall", "The Great Wall of China", "Hadrian's Wall", "The Western Wall"],
  ["Which famous leader was assassinated on the Ides of March?", "Julius Caesar", "Abraham Lincoln", "Alexander the Great", "Napoleon Bonaparte"],
  ["What was the primary language of the Ancient Romans?", "Latin", "Greek", "Italian", "Aramaic"],
  ["Who was the civil rights leader famous for his 'I Have a Dream' speech?", "Martin Luther King Jr.", "Malcolm X", "Nelson Mandela", "Frederick Douglass"],
  ["Which ancient civilization is known for its philosophers like Socrates and Plato?", "Ancient Greece", "Ancient Rome", "Ancient Egypt", "Mesopotamia"],
  ["What invention by Johannes Gutenberg revolutionized the spread of information in the 1400s?", "The Printing Press", "The Telegraph", "The Compass", "The Steam Engine"],
  ["Who was the first woman to fly solo across the Atlantic Ocean?", "Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Sally Ride"],
  ["Which European country gave the Statue of Liberty to the United States?", "France", "Great Britain", "Spain", "Germany"],
  ["What was the name of the first successful English settlement in North America?", "Jamestown", "Roanoke", "Plymouth", "Williamsburg"],
  ["Which famous nurse saved lives during the Crimean War and is the founder of modern nursing?", "Florence Nightingale", "Clara Barton", "Mary Seacole", "Dorothea Dix"],
  ["The Titanic sank in which ocean in 1912?", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
  ["Who was the leader of the Soviet Union during World War II?", "Joseph Stalin", "Vladimir Lenin", "Mikhail Gorbachev", "Leon Trotsky"],
  ["What historic route was used to travel and trade between China and the Mediterranean?", "The Silk Road", "The Spice Route", "The Amber Road", "The Oregon Trail"],
  ["Which legendary king of Macedon conquered an empire stretching from Greece to northwestern India?", "Alexander the Great", "Cyrus the Great", "Leonidas", "Pericles"],
  ["Which American president issued the Emancipation Proclamation?", "Abraham Lincoln", "Ulysses S. Grant", "Andrew Jackson", "Theodore Roosevelt"],
  ["What iconic French structure was built as the entrance to the 1889 World's Fair?", "The Eiffel Tower", "The Louvre", "The Arc de Triomphe", "Notre-Dame"],
  ["Who was the founder of the Mongol Empire?", "Genghis Khan", "Kublai Khan", "Attila the Hun", "Sun Tzu"],
  ["Which period in European history is known for its cultural, artistic, and scientific rebirth?", "The Renaissance", "The Dark Ages", "The Enlightenment", "The Industrial Revolution"],
  ["What ancient wonder was located in the city of Babylon?", "The Hanging Gardens", "The Colosseum", "The Lighthouse of Alexandria", "The Parthenon"],
  ["In what country did the Industrial Revolution begin?", "Great Britain", "United States", "France", "Germany"],
  ["Who was the longest-reigning British monarch before Queen Elizabeth II?", "Queen Victoria", "King George III", "King Henry VIII", "Queen Mary"],
  ["Which famous explorer was the first European to reach India by sea?", "Vasco da Gama", "Ferdinand Magellan", "Marco Polo", "James Cook"]
                  ],
    intermediate: [["Document signed in 1215?", "Magna Carta", "Bill of Rights", "Constitution", "Treaty"] /* ... PASTE HISTORY HERE */["What was the name of the document signed by King John of England in 1215 that limited his powers?", "Magna Carta", "The Bill of Rights", "The Declaration of Rights", "The Domesday Book"],
  ["Which war was fought between the North and South regions of the United States?", "The American Civil War", "The Revolutionary War", "The War of 1812", "The Spanish-American War"],
  ["Who was the primary author of the Communist Manifesto?", "Karl Marx", "Vladimir Lenin", "Friedrich Engels", "Joseph Stalin"],
  ["Which ancient empire was defeated by Hernán Cortés?", "The Aztec Empire", "The Inca Empire", "The Maya Empire", "The Olmec Empire"],
  ["What was the name of the secret project to develop the atomic bomb during WWII?", "The Manhattan Project", "The Apollo Project", "Project Trinity", "The Overlord Project"],
  ["Who was the first Emperor of Rome?", "Augustus", "Julius Caesar", "Nero", "Caligula"],
  ["Which battle is widely considered the turning point of the American Civil War?", "The Battle of Gettysburg", "The Battle of Antietam", "The Battle of Bull Run", "The Battle of Shiloh"],
  ["The Cold War was primarily a geopolitical standoff between the United States and which other nation?", "The Soviet Union", "China", "Germany", "Japan"],
  ["What famous treaty officially ended World War I?", "The Treaty of Versailles", "The Treaty of Paris", "The Treaty of Ghent", "The Treaty of Tordesillas"],
  ["Who was the leader of the French Revolution known for his role in the Reign of Terror?", "Maximilien Robespierre", "Napoleon Bonaparte", "Louis XVI", "Jean-Paul Marat"],
  ["Which dynasty was the last to rule imperial China?", "Qing Dynasty", "Ming Dynasty", "Tang Dynasty", "Han Dynasty"],
  ["What disease famously wiped out an estimated one-third of Europe's population in the 14th century?", "The Black Death (Bubonic Plague)", "Smallpox", "Cholera", "Typhus"],
  ["Who famously crossed the Alps with elephants to attack Rome during the Second Punic War?", "Hannibal", "Scipio Africanus", "Spartacus", "Attila the Hun"],
  ["In what year did the French Revolution begin with the storming of the Bastille?", "1789", "1776", "1812", "1799"],
  ["Which Native American guide famously assisted the Lewis and Clark expedition?", "Sacagawea", "Pocahontas", "Sitting Bull", "Geronimo"],
  ["Who was the principal leader of the Indian independence movement against British rule?", "Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"],
  ["What event sparked the beginning of World War I?", "The assassination of Archduke Franz Ferdinand", "The invasion of Poland", "The sinking of the Lusitania", "The bombing of Pearl Harbor"],
  ["The code name for the Allied invasion of Normandy in 1944 was...", "Operation Overlord", "Operation Barbarossa", "Operation Market Garden", "Operation Torch"],
  ["Which famous conflict was fought between the houses of Lancaster and York for the English throne?", "The Wars of the Roses", "The Hundred Years' War", "The English Civil War", "The Thirty Years' War"],
  ["Who was the British Prime Minister for most of World War II?", "Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Anthony Eden"],
  ["What empire was conquered by Francisco Pizarro?", "The Inca Empire", "The Aztec Empire", "The Maya Empire", "The Toltec Empire"],
  ["The ancient city of Carthage, a great rival of Rome, was located in what modern-day country?", "Tunisia", "Egypt", "Morocco", "Libya"],
  ["What Japanese era modernized the country and restored practical imperial rule in 1868?", "The Meiji Restoration", "The Edo Period", "The Tokugawa Shogunate", "The Showa Era"],
  ["Who was the last Tsar of Russia before the 1917 revolution?", "Nicholas II", "Alexander III", "Peter the Great", "Ivan the Terrible"],
  ["What was the name of the first artificial Earth satellite, launched by the USSR in 1957?", "Sputnik 1", "Vostok 1", "Explorer 1", "Soyuz 1"],
  ["Which European explorer is credited with the first circumnavigation of the globe?", "Ferdinand Magellan", "Francis Drake", "Christopher Columbus", "Vasco da Gama"],
  ["What prominent US political scandal led to the resignation of President Richard Nixon in 1974?", "Watergate", "Teapot Dome", "Iran-Contra", "Whitewater"],
  ["Who founded the religion of Islam in the 7th century?", "Muhammad", "Abu Bakr", "Ali", "Umar"],
  ["The 'Trail of Tears' refers to the forced relocation of which Native American nation?", "The Cherokee", "The Navajo", "The Apache", "The Sioux"],
  ["In 1066, who successfully invaded England and defeated King Harold at the Battle of Hastings?", "William the Conqueror", "Charlemagne", "Richard the Lionheart", "Henry V"]
                  ],
    advanced: [["Treaty ending 30 Years' War?", "Peace of Westphalia", "Utrecht", "Vienna", "Tordesillas"] /* ... PASTE HISTORY HERE */["Which treaty concluded the Thirty Years' War in 1648 and established the concept of modern state sovereignty?", "The Peace of Westphalia", "The Treaty of Utrecht", "The Congress of Vienna", "The Treaty of Tordesillas"],
  ["Who was the famous Carthaginian general defeated at the Battle of Zama in 202 BC?", "Hannibal Barca", "Hasdrubal", "Hamilcar", "Mago"],
  ["What was the name of the specific faction within the Russian Social Democratic Labour Party that became the Communist Party?", "The Bolsheviks", "The Mensheviks", "The SRs", "The Kadets"],
  ["Which Hellenistic king fought the Romans and won 'Pyrrhic victories' in Italy?", "Pyrrhus of Epirus", "Antiochus III", "Philip V", "Mithridates VI"],
  ["In which naval battle did the Holy League definitively defeat the fleet of the Ottoman Empire in 1571?", "The Battle of Lepanto", "The Battle of Actium", "The Battle of Trafalgar", "The Battle of Salamis"],
  ["What was the primary cause of the Defenestration of Prague in 1618, which sparked the Thirty Years' War?", "Religious conflicts between Protestants and Catholics", "A dispute over taxation", "The assassination of a prince", "A border dispute with Poland"],
  ["Which Byzantine queen and wife of Justinian I was highly influential and famously refused to flee during the Nika riots?", "Empress Theodora", "Empress Irene", "Empress Zoe", "Empress Eudoxia"],
  ["What was the name of the political and social system in France before the Revolution of 1789?", "The Ancien Régime", "The Directory", "The Consulate", "The Bourbon Restoration"],
  ["During the Peloponnesian War, the disastrous Sicilian Expedition was championed by which controversial Athenian general?", "Alcibiades", "Pericles", "Nicias", "Demosthenes"],
  ["Which Chinese dynasty was founded by Kublai Khan?", "The Yuan Dynasty", "The Ming Dynasty", "The Song Dynasty", "The Jin Dynasty"],
  ["The 'Babylonian Captivity of the Papacy' refers to the time when the Popes resided in which French city?", "Avignon", "Paris", "Lyon", "Marseille"],
  ["What Japanese military dictator unified the country, ending the Sengoku period before the Tokugawa shogunate?", "Toyotomi Hideyoshi", "Oda Nobunaga", "Tokugawa Ieyasu", "Takeda Shingen"],
  ["The famous Rosetta Stone was instrumental in deciphering Egyptian hieroglyphs. Who led the team that found it in 1799?", "Pierre-François Bouchard (under Napoleon)", "Jean-François Champollion", "Howard Carter", "Heinrich Schliemann"],
  ["What was the main purpose of the Council of Trent (1545–1563)?", "To direct the Catholic Counter-Reformation", "To excommunicate Martin Luther", "To authorize the First Crusade", "To translate the Bible into Latin"],
  ["Which battle in 31 BC established Octavian as the sole ruler of the Roman world, defeating Antony and Cleopatra?", "The Battle of Actium", "The Battle of Philippi", "The Battle of Pharsalus", "The Battle of Cannae"],
  ["What was the name of the powerful banking family that effectively ruled Florence during the Renaissance?", "The Medici family", "The Borgia family", "The Sforza family", "The Habsburg family"],
  ["In 1884-1885, European powers met to regulate colonization and trade in Africa. What was this meeting called?", "The Berlin Conference", "The Congress of Vienna", "The Treaty of Versailles", "The Yalta Conference"],
  ["Who was the first king of a unified Italy since the 6th century, crowned in 1861?", "Victor Emmanuel II", "Giuseppe Garibaldi", "Camillo Cavour", "Umberto I"],
  ["The Taiping Rebellion (1850–1864) was a massive civil war in China led by a man claiming to be...", "The younger brother of Jesus Christ", "The reincarnation of Buddha", "The true Ming Emperor", "A messenger from the Dragon King"],
  ["Which Roman Emperor famously split the empire into the Tetrarchy (rule of four) to manage its vast size?", "Diocletian", "Constantine", "Marcus Aurelius", "Trajan"],
  ["What was the code name for the German invasion of the Soviet Union during World War II?", "Operation Barbarossa", "Operation Sealion", "Operation Citadel", "Operation Felix"],
  ["Who wrote 'The Prince', a 16th-century political treatise instructing rulers on how to acquire and maintain power?", "Niccolò Machiavelli", "Thomas Hobbes", "John Locke", "Thomas More"],
  ["The 'Glorious Revolution' of 1688 in England resulted in the overthrow of which monarch?", "King James II", "King Charles I", "King Charles II", "King Henry VIII"],
  ["What was the name of the agricultural system in medieval Europe where peasants were tied to the land of a lord?", "Serfdom / Manorialism", "Feudalism", "Vassalage", "Mercantilism"],
  ["Which general decisively defeated Napoleon at the Battle of Waterloo in 1805?", "Arthur Wellesley, Duke of Wellington", "Horatio Nelson", "Gebhard Leberecht von Blücher", "Mikhail Kutuzov"],
  ["What was the specific name of the military tactic utilizing rapid, concentrated attacks that Germany used in WWII?", "Blitzkrieg", "Schlieffen Plan", "Guerre de Course", "Pincer Movement"],
  ["The Edict of Nantes, issued in 1598, granted substantial rights to which religious group in France?", "The Huguenots (Calvinist Protestants)", "The Catholics", "The Jews", "The Eastern Orthodox"],
  ["Who was the first female Prime Minister of the United Kingdom, often called the 'Iron Lady'?", "Margaret Thatcher", "Theresa May", "Indira Gandhi", "Golda Meir"],
  ["The ancient library of Ashurbanipal, one of the oldest surviving libraries, was located in what Assyrian city?", "Nineveh", "Babylon", "Ur", "Uruk"],
  ["Which major historical event was triggered by the defenestration of two imperial governors from a window in Prague in 1618?", "The Thirty Years' War", "The Hussite Wars", "The Bohemian Revolt", "The Seven Years' War"]
              ]
  },
  funfact: {
    foundational: [["Fastest land animal?", "Cheetah", "Lion", "Horse", "Greyhound"] /* ... PASTE FUNFACT HERE */["What is the fastest land animal in the world?", "Cheetah", "Lion", "Horse", "Greyhound"],
  ["How many continents are there on Earth?", "7", "5", "6", "8"],
  ["What is the largest organ of the human body?", "The skin", "The liver", "The brain", "The heart"],
  ["Which planet in our solar system is known as the 'Red Planet'?", "Mars", "Venus", "Jupiter", "Saturn"],
  ["What type of animal is a Komodo dragon?", "A lizard", "A snake", "A crocodile", "A dinosaur"],
  ["How many colors are there in a standard rainbow?", "7", "6", "5", "8"],
  ["What is the only mammal capable of true sustained flight?", "The bat", "The flying squirrel", "The sugar glider", "The lemur"],
  ["What is the hardest natural substance on Earth?", "Diamond", "Gold", "Iron", "Quartz"],
  ["How many days are in a standard leap year?", "366", "365", "364", "367"],
  ["What color are the stars on the United States flag?", "White", "Red", "Blue", "Gold"],
  ["What animal is known to have a trunk (or two) to store fat?", "Camel", "Elephant", "Rhino", "Hippopotamus"],
  ["What is the chemical symbol for water?", "H2O", "CO2", "O2", "HO"],
  ["How many legs does an octopus have?", "8", "6", "10", "12"],
  ["What do bees make that humans eat?", "Honey", "Nectar", "Wax", "Pollen"],
  ["What is the tallest animal in the world?", "Giraffe", "Elephant", "Ostrich", "Kangaroo"],
  ["What do you call a group of wolves?", "A pack", "A herd", "A flock", "A pride"],
  ["Which ocean is the largest on Earth?", "Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
  ["What is the opposite of nocturnal?", "Diurnal", "Crepuscular", "Matutinal", "Vespertine"],
  ["How many teeth does an adult human usually have?", "32", "30", "28", "34"],
  ["What fruit is known for keeping the doctor away?", "Apple", "Banana", "Orange", "Grape"],
  ["What is the main ingredient in guacamole?", "Avocado", "Tomato", "Onion", "Lime"],
  ["What do caterpillars turn into?", "Butterflies", "Moths", "Beetles", "Flies"],
  ["What shape is a stop sign?", "Octagon", "Hexagon", "Pentagon", "Circle"],
  ["How many primary colors are there?", "3", "4", "5", "2"],
  ["What is the closest star to Earth?", "The Sun", "Sirius", "Alpha Centauri", "Proxima Centauri"],
  ["What is the largest bone in the human body?", "Femur (thigh bone)", "Humerus", "Tibia", "Fibula"],
  ["What do giant pandas primarily eat?", "Bamboo", "Eucalyptus", "Fish", "Berries"],
  ["What is the freezing point of water in Fahrenheit?", "32°F", "0°F", "100°F", "212°F"],
  ["How many zeros are in a million?", "6", "5", "7", "8"],
  ["What color is a school bus mostly painted?", "Yellow", "Orange", "Red", "Green"]
                  ],
    intermediate: [["Hearts in an octopus?", "3", "2", "4", "1"] /* ... PASTE FUNFACT HERE */["What is the only letter that doesn't appear in any US state name?", "Q", "Z", "X", "J"],
  ["Which animal is known to have fingerprints almost indistinguishable from humans?", "Koala", "Chimpanzee", "Gorilla", "Orangutan"],
  ["What is the rarest blood type in humans?", "AB-negative", "O-negative", "B-negative", "A-negative"],
  ["A group of crows is called a pack. What is a group of flamingos called?", "A flamboyance", "A flock", "A murder", "A parliament"],
  ["What is the fear of spiders called?", "Arachnophobia", "Claustrophobia", "Agoraphobia", "Acrophobia"],
  ["What is the dot over the lowercase letter 'i' or 'j' called?", "A tittle", "A speck", "A point", "A jot"],
  ["How many hearts does an octopus have?", "3", "2", "4", "1"],
  ["What was the first toy to be advertised on national television?", "Mr. Potato Head", "Barbie", "G.I. Joe", "Slinky"],
  ["What is the national animal of Scotland?", "The Unicorn", "The Lion", "The Stag", "The Dragon"],
  ["Which fruit floats in water because 25% of its volume is air?", "Apple", "Orange", "Watermelon", "Grape"],
  ["What is the only planet in our solar system that rolls on its side like a barrel?", "Uranus", "Neptune", "Saturn", "Venus"],
  ["What animal has the highest blood pressure?", "Giraffe", "Elephant", "Cheetah", "Blue Whale"],
  ["What is the longest officially recognized word in the English dictionary (referring to a lung disease)?", "Pneumonoultramicroscopicsilicovolcanoconiosis", "Supercalifragilisticexpialidocious", "Pseudopseudohypoparathyroidism", "Floccinaucinihilipilification"],
  ["What is the name of the fear of long words?", "Hippopotomonstrosesquippedaliophobia", "Verbophobia", "Logophobia", "Lexophobia"],
  ["Which bird is known to have eyes larger than its brain?", "Ostrich", "Owl", "Emu", "Penguin"],
  ["What is the rarest M&M color?", "Brown", "Red", "Yellow", "Blue"],
  ["What natural phenomenon is measured by the Fujita scale?", "Tornadoes", "Hurricanes", "Earthquakes", "Tsunamis"],
  ["What is the tiny piece of plastic or metal at the end of a shoelace called?", "An aglet", "A tip", "A cap", "A lace-lock"],
  ["Which mammal has the thickest fur of any animal?", "Sea Otter", "Polar Bear", "Arctic Fox", "Chinchilla"],
  ["What common household item was originally invented to clean wallpaper?", "Play-Doh", "Silly Putty", "Slime", "Magic Eraser"],
  ["What is the only food that doesn't expire or go bad?", "Honey", "Salt", "Sugar", "Rice"],
  ["How many times does the average human blink in a minute?", "15-20", "5-10", "25-30", "30-40"],
  ["What do you call the phenomenon where hot water freezes faster than cold water?", "The Mpemba effect", "The Doppler effect", "The Coriolis effect", "The Leidenfrost effect"],
  ["What is the collective noun for a group of porcupines?", "A prickle", "A herd", "A pack", "A spine"],
  ["Which animal's milk is famously pink?", "Hippopotamus", "Yak", "Water Buffalo", "Flamingo"],
  ["What is the most commonly used letter in the English alphabet?", "E", "A", "T", "O"],
  ["What do you call the smell of dust after rain?", "Petrichor", "Ozone", "Geosmin", "Aerosol"],
  ["What part of the body has the most active muscles?", "The eyes", "The heart", "The hands", "The tongue"],
  ["Which inventor is credited with creating the first practical telephone?", "Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
  ["What country has the most islands in the world?", "Sweden", "Canada", "Norway", "Indonesia"]
                  ],
    advanced: [["Protein in fireflies?", "Luciferin", "Biolumin", "Phosphorin", "Luminol"] /* ... PASTE FUNFACT HERE */["What is the name of the protein that makes fireflies glow?", "Luciferin", "Biolumin", "Phosphorin", "Luminol"],
  ["What mathematical constant is roughly equal to 1.618 and is known as the 'Golden Ratio'?", "Phi (φ)", "Pi (π)", "Euler's Number (e)", "Tau (τ)"],
  ["In typography, what is the symbol '&' technically called?", "An ampersand", "An octothorpe", "An asterism", "A caret"],
  ["Which noble gas is the second most abundant element in the universe, yet relatively rare on Earth?", "Helium", "Neon", "Argon", "Krypton"],
  ["What is the psychological term for the tendency to overestimate one's own abilities?", "The Dunning-Kruger effect", "The Baader-Meinhof phenomenon", "The Mandela effect", "The placebo effect"],
  ["What is the scientific name for the 'brain freeze' you get from eating cold food quickly?", "Sphenopalatine ganglioneuralgia", "Cryogenic cephalalgia", "Cerebral hypothermia", "Trigeminal neuralgia"],
  ["What species of jellyfish is biologically immortal?", "Turritopsis dohrnii", "Chironex fleckeri", "Physalia physalis", "Aurelia aurita"],
  ["What is the name of the deepest known point in the Earth's oceans?", "The Challenger Deep", "The Mariana Trench", "The Sirena Deep", "The Tonga Trench"],
  ["What is the official scientific term for the fear of the number 13?", "Triskaidekaphobia", "Tetraphobia", "Octophobia", "Hexakosioihexekontahexaphobia"],
  ["What chemical compound gives raspberries, blackberries, and blueberries their distinct colors?", "Anthocyanins", "Carotenoids", "Chlorophyll", "Betalains"],
  ["In linguistics, a sentence that uses every letter of the alphabet is called a...", "Pangram", "Anagram", "Palindrome", "Tautogram"],
  ["What is the name of the paradox that states if the universe is infinite and old, where are all the aliens?", "The Fermi Paradox", "The Drake Equation", "The Olbers' Paradox", "The Twin Paradox"],
  ["What is the name of the extremely resilient microscopic animal also known as a 'water bear'?", "Tardigrade", "Rotifer", "Nematode", "Copepod"],
  ["What is the only metal that is a liquid at standard room temperature and pressure?", "Mercury", "Gallium", "Bromine", "Francium"],
  ["Which rare meteorological phenomenon involves a ball of luminous electrical energy appearing during a thunderstorm?", "Ball lightning", "St. Elmo's fire", "Sprite lightning", "Auroral sub-storm"],
  ["What is the anatomical term for the 'funny bone'?", "The ulnar nerve", "The humerus", "The radius", "The medial epicondyle"],
  ["What linguistic phenomenon involves a word or phrase that reads the same forwards and backwards?", "Palindrome", "Anagram", "Ambigram", "Portmanteau"],
  ["Which planet's day is longer than its year?", "Venus", "Mercury", "Jupiter", "Uranus"],
  ["What is the term for a word that is an imitation of the sound it describes (e.g., 'buzz' or 'hiss')?", "Onomatopoeia", "Alliteration", "Assonance", "Hyperbole"],
  ["In astronomy, what is the boundary around a black hole beyond which no light or other radiation can escape?", "The event horizon", "The singularity", "The accretion disk", "The photon sphere"],
  ["What is the name of the oldest known living individual tree in the world (a bristlecone pine)?", "Methuselah", "Hyperion", "General Sherman", "Prometheus"],
  ["What chemical process causes cut apples and potatoes to turn brown when exposed to air?", "Enzymatic browning (oxidation)", "Caramelization", "Fermentation", "Maillard reaction"],
  ["What is the term for a group of words that share the same root but have different meanings (e.g., 'produce', 'product')?", "Cognates", "Synonyms", "Homophones", "Antonyms"],
  ["What is the term for the optical illusion that causes straight lines to appear curved or distorted?", "The Hering illusion", "The Müller-Lyer illusion", "The Ponzo illusion", "The Ebbinghaus illusion"],
  ["Which biological process involves a cell programming its own death?", "Apoptosis", "Necrosis", "Autophagy", "Mitosis"],
  ["What is the name of the theoretical sphere of comets that surrounds the solar system?", "The Oort Cloud", "The Kuiper Belt", "The Asteroid Belt", "The Scattered Disc"],
  ["What is the specific phobia of being without a mobile phone or mobile network coverage?", "Nomophobia", "Technophobia", "Telephonophobia", "Cyberphobia"],
  ["In geology, what is the boundary between the Earth's crust and the mantle called?", "The Mohorovičić discontinuity (Moho)", "The Gutenberg discontinuity", "The Lehmann discontinuity", "The Conrad discontinuity"],
  ["What is the name of the effect where people tend to remember the first and last items in a list best?", "The serial position effect", "The recency effect", "The primacy effect", "The von Restorff effect"],
  ["Which element, atomic number 83, is a non-metallic, dark red liquid at room temperature?", "Bromine", "Iodine", "Mercury", "Francium"]
              ]
  },
  entertainment: {
    foundational: [["Mickey Mouse creator?", "Walt Disney", "Jerry", "Stuart Little", "Mighty Mouse"] /* ... PASTE ENTERTAINMENT HERE */["Who is the famous mouse created by Walt Disney?", "Mickey Mouse", "Mighty Mouse", "Jerry", "Stuart Little"],
  ["Which superhero is known as the 'Man of Steel'?", "Superman", "Batman", "Iron Man", "Spider-Man"],
  ["What animated movie features a clownfish looking for his son?", "Finding Nemo", "Shark Tale", "The Little Mermaid", "Moana"],
  ["Which pop singer is known as the 'Queen of Pop' and sang 'Material Girl'?", "Madonna", "Lady Gaga", "Whitney Houston", "Britney Spears"],
  ["What color is the lightsaber typically wielded by Darth Vader in Star Wars?", "Red", "Blue", "Green", "Purple"],
  ["What magical school does Harry Potter attend?", "Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"],
  ["Who plays the character of Jack Sparrow in Pirates of the Caribbean?", "Johnny Depp", "Orlando Bloom", "Brad Pitt", "Tom Cruise"],
  ["What is the name of the cowboy doll in the movie Toy Story?", "Woody", "Buzz Lightyear", "Jessie", "Andy"],
  ["Which Disney princess lost her glass slipper at the ball?", "Cinderella", "Snow White", "Ariel", "Belle"],
  ["What game involves building blocks and surviving monsters at night?", "Minecraft", "Roblox", "Fortnite", "Terraria"],
  ["Who is the lead singer of the band Queen?", "Freddie Mercury", "Mick Jagger", "David Bowie", "Elton John"],
  ["What city is Batman sworn to protect?", "Gotham City", "Metropolis", "Star City", "Central City"],
  ["What is the highest-grossing film of all time (as of 2024)?", "Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
  ["Who wrote the play 'Romeo and Juliet'?", "William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
  ["What animated TV show features a family with yellow skin living in Springfield?", "The Simpsons", "Family Guy", "Bob's Burgers", "Futurama"],
  ["Who is the villain in the movie 'The Lion King'?", "Scar", "Jafar", "Ursula", "Gaston"],
  ["Which video game features a yellow character eating dots and running from ghosts?", "Pac-Man", "Donkey Kong", "Super Mario Bros.", "Sonic the Hedgehog"],
  ["What instrument does a drummer play?", "Drums", "Guitar", "Piano", "Bass"],
  ["Who is the green ogre that lives in a swamp and marries Princess Fiona?", "Shrek", "Donkey", "Lord Farquaad", "Puss in Boots"],
  ["What famous band consisted of John, Paul, George, and Ringo?", "The Beatles", "The Rolling Stones", "The Who", "The Kinks"],
  ["Which actor played Iron Man in the Marvel Cinematic Universe?", "Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
  ["What is the name of the fictional continent where Game of Thrones takes place?", "Westeros", "Middle-earth", "Narnia", "Tamriel"],
  ["Who sings the hit song 'Shake It Off'?", "Taylor Swift", "Katy Perry", "Ariana Grande", "Miley Cyrus"],
  ["What magical item does Aladdin find in the Cave of Wonders?", "A magic lamp", "A flying carpet", "A magical sword", "A spellbook"],
  ["What is the name of the main protagonist in the Legend of Zelda series?", "Link", "Zelda", "Ganon", "Mario"],
  ["Which movie features dinosaurs being brought back to life in a theme park?", "Jurassic Park", "Godzilla", "King Kong", "The Land Before Time"],
  ["Who is the author of the Harry Potter book series?", "J.K. Rowling", "Stephen King", "Suzanne Collins", "J.R.R. Tolkien"],
  ["What famous music award is given a gramophone-shaped trophy?", "The Grammy Award", "The Oscar", "The Emmy Award", "The Tony Award"],
  ["What is the name of the friendly alien from a 1982 Steven Spielberg movie?", "E.T.", "Alf", "Stitch", "Yoda"],
  ["Which comic book publisher created the Avengers?", "Marvel Comics", "DC Comics", "Dark Horse Comics", "Image Comics"]
                  ],
    intermediate: [["Neo's pill color?", "Red", "Blue", "Green", "Yellow"] /* ... PASTE ENTERTAINMENT HERE */["Which director is known for films like 'Inception', 'Titanic', and 'The Terminator'?", "James Cameron", "Steven Spielberg", "Christopher Nolan", "Quentin Tarantino"],
  ["Who won the first season of the TV show 'American Idol'?", "Kelly Clarkson", "Carrie Underwood", "Adam Lambert", "Fantasia Barrino"],
  ["Which classic rock band released the album 'The Dark Side of the Moon'?", "Pink Floyd", "Led Zeppelin", "The Who", "The Rolling Stones"],
  ["In the Matrix, what color pill does Neo take to wake up from the simulation?", "The Red Pill", "The Blue Pill", "The Green Pill", "The Yellow Pill"],
  ["What is the name of the fictional African country ruled by Black Panther?", "Wakanda", "Zamunda", "Genosha", "Latveria"],
  ["Which actor famously improvised the line 'Here's Johnny!' in The Shining?", "Jack Nicholson", "Robert De Niro", "Al Pacino", "Marlon Brando"],
  ["Who directed the 1994 cult classic movie 'Pulp Fiction'?", "Quentin Tarantino", "Martin Scorsese", "Stanley Kubrick", "David Fincher"],
  ["What was the first feature-length animated movie ever released?", "Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Bambi"],
  ["Which artist holds the record for the most Grammy Awards won by a female artist?", "Beyoncé", "Taylor Swift", "Adele", "Aretha Franklin"],
  ["What is the highest-selling video game console of all time?", "PlayStation 2", "Nintendo DS", "Xbox 360", "Nintendo Wii"],
  ["Which iconic actor played the character of the Joker in the 2008 film 'The Dark Knight'?", "Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Jack Nicholson"],
  ["What is the name of the fictional wizarding prison in the Harry Potter series?", "Azkaban", "Nurmengard", "Gringotts", "Askaban"],
  ["Which famous composer is known for his film scores, including Star Wars, Indiana Jones, and Jurassic Park?", "John Williams", "Hans Zimmer", "Ennio Morricone", "Alan Silvestri"],
  ["What is the longest-running live-action comedy series in American television history?", "It's Always Sunny in Philadelphia", "The Simpsons", "South Park", "Saturday Night Live"],
  ["Which female artist released the best-selling album '21'?", "Adele", "Taylor Swift", "Lady Gaga", "Katy Perry"],
  ["What film won the Academy Award for Best Picture in 1994, starring Tom Hanks?", "Forrest Gump", "Pulp Fiction", "The Shawshank Redemption", "Schindler's List"],
  ["Which famous actor voiced the character of Mufasa in the 1994 animated film 'The Lion King'?", "James Earl Jones", "Jeremy Irons", "Matthew Broderick", "Rowan Atkinson"],
  ["What is the name of the fictional town where the show 'Stranger Things' takes place?", "Hawkins", "Riverdale", "Sunnydale", "Derry"],
  ["Which rock band is famous for their hit song 'Stairway to Heaven'?", "Pink Floyd", "Led Zeppelin", "The Eagles", "The Doors"],
  ["What actor played the character of Walter White in the Marvel Cinematic Universe?", "Bryan Cranston", "Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
  ["Which famous female artist is known as the 'Princess of Pop'?", "Britney Spears", "Christina Aguilera", "Madonna", "Janet Jackson"],
  ["What is the name of the fictional metal that Captain America's shield is made of?", "Vibranium", "Adamantium", "Uru", "Nth Metal"],
  ["Which famous director is known for his distinct visual style in films like 'The Grand Budapest Hotel' and 'Isle of Dogs'?", "Wes Anderson", "Tim Burton", "Guillermo del Toro", "Edgar Wright"],
  ["What is the name of the fictional wizarding sport played on flying broomsticks in Harry Potter?", "Quidditch", "Quadpot", "Gobstones", "Broom-racing"],
  ["Which actor played the character of Neo in 'The Matrix'?", "Keanu Reeves", "Tom Cruise", "Will Smith", "Brad Pitt"],
  ["What is the name of the fictional wizarding newspaper in the Harry Potter series?", "The Daily Prophet", "The Quibbler", "The Daily Bugle", "The Wizarding Times"],
  ["Which famous female artist released the hit album '1989'?", "Taylor Swift", "Katy Perry", "Ariana Grande", "Miley Cyrus"],
  ["What is the name of the fictional city where the show 'The Simpsons' takes place?", "Springfield", "Shelbyville", "Quahog", "South Park"],
  ["Which rock band is famous for their hit song 'Bohemian Rhapsody'?", "Queen", "Led Zeppelin", "The Rolling Stones", "The Beatles"],
  ["What actor played the character of Wolverine in the X-Men film series?", "Hugh Jackman", "Patrick Stewart", "Ian McKellen", "Ryan Reynolds"]
                  ],
    advanced: [["Tolkien Elven language?", "Sindarin", "Dothraki", "Klingon", "Valyrian"] /* ... PASTE ENTERTAINMENT HERE */["Which film won the first-ever Academy Award for Best Animated Feature in 2002?", "Shrek", "Monsters, Inc.", "Jimmy Neutron: Boy Genius", "Spirited Away"],
  ["Who is the only person to have won an Oscar, an Emmy, a Grammy, a Tony, and a Pulitzer Prize?", "Richard Rodgers", "Marvin Hamlisch", "Mel Brooks", "Audrey Hepburn"],
  ["What is the name of the fictional language created by J.R.R. Tolkien for the Elves in Lord of the Rings?", "Sindarin", "Dothraki", "Klingon", "Valyrian"],
  ["Which band released the iconic 1977 album 'Rumours'?", "Fleetwood Mac", "Pink Floyd", "The Eagles", "Led Zeppelin"],
  ["What was the first movie to gross over $1 billion worldwide?", "Titanic", "Jurassic Park", "Star Wars: Episode I", "Avatar"],
  ["Which actor holds the record for the most Academy Award nominations?", "Meryl Streep", "Jack Nicholson", "Katharine Hepburn", "Daniel Day-Lewis"],
  ["What is the name of the highest-grossing independent film of all time?", "The Passion of the Christ", "My Big Fat Greek Wedding", "Slumdog Millionaire", "Juno"],
  ["Who composed the famous musical piece 'The Four Seasons'?", "Antonio Vivaldi", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Johann Sebastian Bach"],
  ["What was the first video game to feature the character Mario?", "Donkey Kong", "Super Mario Bros.", "Mario Bros.", "Space Invaders"],
  ["Which classic movie features the famous quote 'Frankly, my dear, I don't give a damn'?", "Gone with the Wind", "Casablanca", "The Wizard of Oz", "Citizen Kane"],
  ["What is the name of the fictional substance that powers the TARDIS in Doctor Who?", "Artron Energy", "Dilithium", "Kyber crystals", "Tachyon particles"],
  ["Which musician was known as the 'High Priest of Pop' and released the album 'Purple Rain'?", "Prince", "Michael Jackson", "David Bowie", "James Brown"],
  ["What was the first feature-length computer-animated film?", "Toy Story", "A Bug's Life", "Antz", "Shrek"],
  ["Which famous director made his feature film debut with 'Reservoir Dogs'?", "Quentin Tarantino", "Martin Scorsese", "Paul Thomas Anderson", "Guy Ritchie"],
  ["What is the name of the highest-grossing Broadway musical of all time?", "The Lion King", "Wicked", "The Phantom of the Opera", "Hamilton"],
  ["Which actor won a posthumous Academy Award for his role as Peter Finch in 'Network'?", "Peter Finch", "Heath Ledger", "James Dean", "Massimo Troisi"],
  ["What is the name of the fictional town in Stephen King's novels where many of his stories are set?", "Castle Rock", "Derry", "Jerusalem's Lot", "Haven"],
  ["Which famous female artist released the critically acclaimed album 'Lemonade'?", "Beyoncé", "Adele", "Rihanna", "Lady Gaga"],
  ["What was the first film to win all five major Academy Awards (Best Picture, Director, Actor, Actress, Screenplay)?", "It Happened One Night", "One Flew Over the Cuckoo's Nest", "The Silence of the Lambs", "Gone with the Wind"],
  ["Which rock band released the iconic 1991 album 'Nevermind'?", "Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"],
  ["What is the name of the fictional planet where the movie 'Dune' primarily takes place?", "Arrakis", "Tatooine", "Hoth", "Cybertron"],
  ["Which famous director is known for his signature use of the 'push-in' shot and symmetrical framing?", "Wes Anderson", "Stanley Kubrick", "Alfred Hitchcock", "Steven Spielberg"],
  ["What was the first video game console to feature a built-in hard drive?", "Original Xbox", "PlayStation 2", "GameCube", "Sega Dreamcast"],
  ["Which classic movie features the famous quote 'Here's looking at you, kid'?", "Casablanca", "Gone with the Wind", "The Maltese Falcon", "The Big Sleep"],
  ["What is the name of the fictional language created for the Na'vi people in the movie 'Avatar'?", "Na'vi", "Klingon", "Dothraki", "Valyrian"],
  ["Which musician was known as the 'King of Rock and Roll'?", "Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"],
  ["What was the first feature-length animated film to be nominated for Best Picture at the Oscars?", "Beauty and the Beast", "The Lion King", "Toy Story", "Up"],
  ["Which famous director made his feature film debut with 'The Evil Dead'?", "Quentin Tarantino", "Robert Rodriguez", "Kevin Smith", "Richard Linklater"],
  ["What is the name of the highest-grossing documentary film of all time?", "Fahrenheit 9/11", "March of the Penguins", "Super Size Me", "An Inconvenient Truth"],
  ["Which actor won an Academy Award for his role as Hannibal Lecter in 'The Silence of the Lambs'?", "Anthony Hopkins", "Mads Mikkelsen", "Brian Cox", "Gaspard Ulliel"]
              ]
  },
  sports: {
    foundational: [
      ["Players per team in football?", "11", "10", "12", "7"], 
      ["World Cup 2022 winner?", "Argentina", "France", "Brazil", "Morocco"],
      ["What do you call three goals in one game?", "Hat-trick", "Brace", "Turkey", "Century"],
      ["Which city hosts Wimbledon?", "London", "Paris", "New York", "Melbourne"],
      ["Points for a free throw in basketball?", "1", "2", "3", "4"]
    ],
    intermediate: [
      ["Most Ballon d'Or awards?", "Messi", "Ronaldo", "Zidane", "Pele"], 
      ["Most UCL titles?", "Real Madrid", "AC Milan", "Liverpool", "Bayern"],
      ["Driver with most F1 titles?", "Hamilton/Schumacher", "Vettel", "Verstappen", "Senna"],
      ["2023/24 Premier League winner?", "Manchester City", "Arsenal", "Liverpool", "Chelsea"],
      ["Record for most PL goals in a season (36)?", "Erling Haaland", "Mo Salah", "Alan Shearer", "Luis Suarez"]
    ],
    advanced: [
      ["First African Ballon d'Or?", "George Weah", "Eto'o", "Drogba", "Okocha"],
      ["First FIFA World Cup winner (1930)?", "Uruguay", "Argentina", "Brazil", "France"],
      ["Premier League all-time top scorer?", "Alan Shearer", "Harry Kane", "Wayne Rooney", "Sergio Aguero"],
      ["First player sold for over £100 million?", "Neymar", "Pogba", "Ronaldo", "Bale"],
      ["Country with the most Olympic medals?", "USA", "Russia", "China", "Germany"]
    ]
  },
  languages: {
    foundational: [
      ["'Thank you' in French?", "Merci", "Gracias", "Obrigado", "Danke"], 
      ["Official language of Brazil?", "Portuguese", "Spanish", "French", "Italian"],
      ["Most spoken language in Nigeria?", "English", "Yoruba", "Hausa", "Igbo"],
      ["'Hello' in Spanish?", "Hola", "Bonjour", "Ciao", "Namaste"],
      ["Most spoken language globally?", "English", "Mandarin", "Spanish", "Hindi"]
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

const parseData = (data) => {
  const parsed = {};
  for (const subject in data) {
    parsed[subject] = {};
    for (const diff in data[subject]) {
      parsed[subject][diff] = data[subject][diff].map((q, idx) => ({
        id: `${subject}_${diff}_${idx}`, text: q[0],
        options: [{text: q[1], isCorrect: true}, {text: q[2], isCorrect: false}, {text: q[3], isCorrect: false}, {text: q[4], isCorrect: false}]
      }));
    }
  }
  return parsed;
};

const quizData = parseData(rawQuizData);

const SUBJECTS = [
  { id: 'science', title: 'Science', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'history', title: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'funfact', title: 'Fun Facts', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'entertainment', title: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-500' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Ordverse Lore', icon: Swords, color: 'text-rose-500' }
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

export default function App() {
  const [gameState, setGameState] = useState('subject_select'); 
  const [showSettings, setShowSettings] = useState(false);
  const [showVault, setShowVault] = useState(false);
  const [settings, setSettings] = useState({ musicEnabled: true, sfxEnabled: true, hapticsEnabled: true });
  const [stats, setStats] = useState({ totalXp: 0, completed: 0 });
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimeAttack, setIsTimeAttack] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  
  // 🔥 NEW STREAK ENGINE
  const [streak, setStreak] = useState(0);
  const [showStreakBonus, setShowStreakBonus] = useState(false);

  const bgMusic = useRef(new Audio('/music.mp3'));
  const correctSfx = useRef(new Audio('/correct.mp3'));
  const wrongSfx = useRef(new Audio('/wrong.mp3'));

  useEffect(() => {
    const s1 = localStorage.getItem('nexus_stats');
    const s2 = localStorage.getItem('nexus_settings');
    if (s1) setStats(JSON.parse(s1));
    if (s2) setSettings(JSON.parse(s2));
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
    let timer;
    if (gameState === 'playing' && isTimeAttack && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      finishQuiz(score);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, isTimeAttack]);

  const shuffle = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startQuiz = (timeMode) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setStreak(0);
    setShowStreakBonus(false);
    
    let pool = quizData[selectedSubject.id][selectedDifficulty.id];
    
    const limit = timeMode ? 20 : 10;
    const randomized = shuffle(pool).slice(0, Math.min(pool.length, limit)).map(q => ({
      ...q, options: shuffle(q.options)
    }));
    
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const finishQuiz = (finalScore) => {
    const baseGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const newStats = { totalXp: stats.totalXp + baseGain, completed: stats.completed + 1 };
    setStats(newStats);
    localStorage.setItem('nexus_stats', JSON.stringify(newStats));
    setGameState('results');
  };

  const handleAnswer = async (index, isCorrect) => {
    if (isChecking) return;
    setSelectedAnswerIndex(index);
    setIsChecking(true);

    if (isCorrect) {
      setScore(s => s + 1);
      
      // 🔥 Streak Logic
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > 0 && newStreak % 5 === 0) {
         setShowStreakBonus(true);
         setTimeout(() => setShowStreakBonus(false), 2000);
         // Bonus XP added immediately
         setStats(prev => {
             const updated = { ...prev, totalXp: prev.totalXp + 50 };
             localStorage.setItem('nexus_stats', JSON.stringify(updated));
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

  const getRank = (xp) => {
    if (xp > 15000) return "Omniverse Legend";
    if (xp > 8000) return "Rank 13 (God)";
    if (xp > 3000) return "Rank 10 (Sage)";
    return "Mortal";
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 flex flex-col items-center">
      {/* --- Settings & Vault Modals --- */}
      {showSettings && (
        <Modal title="Settings" onClose={() => setShowSettings(false)} icon={Settings} iconColor="text-blue-400">
           <div className="space-y-6">
            {['musicEnabled', 'sfxEnabled', 'hapticsEnabled'].map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize">{key.replace('Enabled', '')}</span>
                <button onClick={() => {
                  const ns = {...settings, [key]: !settings[key]};
                  setSettings(ns);
                  localStorage.setItem('nexus_settings', JSON.stringify(ns));
                }} className={`w-12 h-6 rounded-full ${settings[key] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-all ${settings[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
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

      {/* --- Header --- */}
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

      {/* --- State 1: Subject Select --- */}
      {gameState === 'subject_select' && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around">
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Total XP</p><p className="font-bold text-emerald-400">{stats.totalXp}</p></div>
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Rank</p><p className="font-bold text-blue-400">{getRank(stats.totalXp)}</p></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SUBJECTS.map(sub => (
              <button key={sub.id} onClick={() => {setSelectedSubject(sub); setGameState('difficulty_select')}}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-4"><sub.icon size={28} className={sub.color} /><span className="text-lg font-bold">{sub.title}</span></div>
                <ArrowRight className="text-slate-700" size={20} />
              </button>
            ))}
          </div>
          <button onClick={() => setGameState('leaderboard')} className="w-full py-5 bg-blue-600/20 text-blue-400 rounded-2xl font-bold flex items-center justify-center border border-blue-500/30">
            <BarChart3 className="mr-2"/> View Hall of Fame
          </button>
        </div>
      )}

      {/* --- State 2: Difficulty Select --- */}
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

      {/* --- State 3: Mode Select --- */}
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

      {/* --- State 4: Playing --- */}
      {gameState === 'playing' && (
        <div className="w-full max-w-xl relative">
          
          {/* 🔥 STREAK POPUP ANIMATION */}
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

      {/* --- State 5: Results --- */}
      {gameState === 'results' && (
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm">
          <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
          <h2 className="text-3xl font-black mb-2">Quiz Over!</h2>
          <p className="text-6xl font-black my-8">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>
          <button onClick={() => setGameState('subject_select')} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">Return to Hub</button>
        </div>
      )}

      {/* --- State 6: Leaderboard --- */}
      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">You</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "Daragvener", x: 25000}, {n: "Thriller", x: 1200}].map((u, i) => (
              <div key={i} className="p-5 bg-slate-900/50 border border-slate-800 rounded-3xl flex justify-between items-center opacity-60 text-left">
                <p className="font-bold">{u.n}</p><p className="font-black">{u.x} XP</p>
              </div>
            ))}
          </div>
          <button onClick={() => setGameState('subject_select')} className="w-full mt-10 py-4 font-bold text-slate-500 underline">Back Home</button>
        </div>
      )}
    </div>
  );
}

