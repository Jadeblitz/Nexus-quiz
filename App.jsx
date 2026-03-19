import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, Cpu, Trophy, ArrowRight, RotateCcw, ChevronLeft, Swords, 
  Trophy as SportIcon, Languages, Home, Settings, Volume2, VolumeX, 
  Smartphone, BarChart3, GraduationCap, Users, Timer, Zap, Book, BookOpen, Lightbulb, Film 
} from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// ==========================================
// 📚 THE MEGA REPOSITORY (850+ QUESTIONS TOTAL)
// ==========================================
const rawQuizData = {
  futa_eng: {
    foundational: [
      ["What does FUTA stand for?", "Federal University of Technology, Akure", "Federal University of Trade, Akure", "First University of Tech, Akure", "Federal Union of Tech, Akure"],
      ["Which law states Energy cannot be created or destroyed?", "First Law of Thermodynamics", "Newton's Second Law", "Ohm's Law", "Hooke's Law"],
      ["What is the standard unit of Pressure?", "Pascal", "Newton", "Watt", "Joule"],
      ["What is the density of pure water at 4°C?", "1000 kg/m³", "100 kg/m³", "500 kg/m³", "2000 kg/m³"],
      ["Which gate is the main entrance to FUTA?", "North Gate", "South Gate", "West Gate", "East Gate"],
      ["What is the value of the Universal Gas Constant (R)?", "8.314 J/mol·K", "0.0821 J/mol·K", "9.81 J/mol·K", "1.38 J/mol·K"],
      ["In Engineering, what does 'CAD' stand for?", "Computer-Aided Design", "Central Access Data", "Control and Design", "Common Applied Design"],
      ["Which element is the primary component of steel?", "Iron", "Copper", "Aluminum", "Zinc"],
      ["What is the SI unit of work?", "Joule", "Watt", "Newton", "Pascal"],
      ["What is the boiling point of water in Kelvin?", "373.15 K", "100 K", "273.15 K", "212 K"],
      ["Which instrument measures atmospheric pressure?", "Barometer", "Thermometer", "Hygrometer", "Anemometer"],
      ["What is the value of gravity 'g' to two decimal places?", "9.81 m/s²", "9.80 m/s²", "10.0 m/s²", "3.14 m/s²"]
    ],
    intermediate: [
      ["What is the Reynolds number for laminar flow in a pipe?", "Below 2100", "Above 4000", "Exactly 3000", "Over 10,000"],
      ["What is the chemical formula for Methane?", "CH4", "C2H6", "CO2", "H2O"],
      ["Which device is used to measure fluid flow rate?", "Venturi Meter", "Manometer", "Thermometer", "Hygrometer"],
      ["What does 'CSTR' stand for in Reactor Design?", "Continuous Stirred-Tank Reactor", "Chemical Standard Tank", "Cold Static Tank", "Combined State Reactor"],
      ["Which thermodynamic cycle is used in steam power plants?", "Rankine Cycle", "Otto Cycle", "Diesel Cycle", "Carnot Cycle"],
      ["What is the main purpose of a cooling tower?", "Heat rejection to the atmosphere", "Pumping water", "Storing chemicals", "Generating steam"],
      ["What does 'NPSH' stand for in pump selection?", "Net Positive Suction Head", "Net Power Source Head", "Nominal Pump Suction", "New Pressure Source"],
      ["In heat transfer, what is 'Fourier's Law' associated with?", "Conduction", "Convection", "Radiation", "Evaporation"],
      ["What is the molar mass of Carbon Dioxide (CO2)?", "44 g/mol", "32 g/mol", "28 g/mol", "18 g/mol"],
      ["Which dimensionless number relates inertia to viscous forces?", "Reynolds Number", "Nusselt Number", "Prandtl Number", "Froude Number"]
    ],
    advanced: [
      ["Which equation is used for Batch Reactor design?", "Design Equation", "Bernoulli Equation", "Ergun Equation", "Van der Waals"],
      ["What is the 'No-Slip Condition' in fluid mechanics?", "Velocity at wall is zero", "Pressure at wall is zero", "Flow is frictionless", "Temperature is constant"],
      ["What does a P&ID stand for?", "Piping and Instrumentation Diagram", "Pressure and Intake Design", "Process and Internal Draft", "Power and Information Data"],
      ["The 'Arrhenius Equation' calculates the effect of temperature on what?", "Reaction Rate Constant", "Pressure", "Viscosity", "Entropy"],
      ["In Distillation, what does the 'Reflux Ratio' represent?", "Ratio of returned liquid to product", "Boiling point difference", "Vapor to liquid ratio", "Feed to product ratio"],
      ["What is the Fugacity coefficient a measure of?", "Departure from ideal gas behavior", "Volatility", "Heat capacity", "Reaction speed"],
      ["Which law relates the partial pressure of a gas to its mole fraction?", "Raoult's Law", "Henry's Law", "Dalton's Law", "Boyle's Law"]
    ]
  },
  science: {
    foundational: [
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
    ],
    advanced: [
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
    ]
  },
  tech: {
    foundational: [
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
      ["[Math] What is 10 to the power of 3 (10³)?", "1000", "30", "100", "10000"],
      ["[Tech] What is an 'app' short for?", "Application", "Apple", "Apparatus", "Appendix"],
      ["[Math] What is half of 50?", "25", "20", "30", "15"],
      ["[Tech] What do you double-click to open a program?", "An icon", "The screen", "The keyboard", "The cable"],
      ["[Math] How many zeros are in one million?", "6", "5", "7", "8"]
    ],
    intermediate: [
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
    foundational: [
      ["Who was the first President of the United States?", "George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"],
      ["Which ancient civilization built the Great Pyramid of Giza?", "Ancient Egyptians", "Ancient Romans", "Ancient Greeks", "Mayans"],
      ["In what year did Christopher Columbus first reach the Americas?", "1492", "1776", "1607", "1066"],
      ["Who was the Queen of Ancient Egypt?", "Cleopatra", "Nefertiti", "Hatshepsut", "Boudicca"],
      ["Which empire was ruled by Julius Caesar?", "The Roman Empire", "The Ottoman Empire", "The British Empire", "The Mongol Empire"],
      ["What was the name of the ship that brought the Pilgrims to America?", "Mayflower", "Santa Maria", "Nina", "Pinta"],
      ["Which global conflict ended in 1945?", "World War II", "World War I", "The Cold War", "The Vietnam War"],
      ["Who wrote the Declaration of Independence?", "Thomas Jefferson", "Benjamin Franklin", "George Washington", "Alexander Hamilton"],
      ["What wall was torn down in 1989?", "The Berlin Wall", "The Great Wall of China", "Hadrian's Wall", "The Western Wall"],
      ["Which leader was assassinated on the Ides of March?", "Julius Caesar", "Abraham Lincoln", "Alexander the Great", "Napoleon Bonaparte"],
      ["What was the primary language of Ancient Romans?", "Latin", "Greek", "Italian", "Aramaic"],
      ["Who gave the 'I Have a Dream' speech?", "Martin Luther King Jr.", "Malcolm X", "Nelson Mandela", "Frederick Douglass"],
      ["Which civilization is known for Socrates and Plato?", "Ancient Greece", "Ancient Rome", "Ancient Egypt", "Mesopotamia"],
      ["What invention revolutionized information in the 1400s?", "The Printing Press", "The Telegraph", "The Compass", "The Steam Engine"],
      ["Who was the first woman to fly solo across the Atlantic?", "Amelia Earhart", "Bessie Coleman", "Harriet Quimby", "Sally Ride"],
      ["Which country gave the Statue of Liberty to the US?", "France", "Great Britain", "Spain", "Germany"],
      ["What was the first English settlement in North America?", "Jamestown", "Roanoke", "Plymouth", "Williamsburg"],
      ["Who was the founder of modern nursing?", "Florence Nightingale", "Clara Barton", "Mary Seacole", "Dorothea Dix"],
      ["The Titanic sank in which ocean in 1912?", "Atlantic Ocean", "Pacific Ocean", "Indian Ocean", "Arctic Ocean"],
      ["Who was the leader of the Soviet Union in WWII?", "Joseph Stalin", "Vladimir Lenin", "Mikhail Gorbachev", "Leon Trotsky"],
      ["What route was used to trade between China and Europe?", "The Silk Road", "The Spice Route", "The Amber Road", "The Oregon Trail"],
      ["Who conquered an empire from Greece to India?", "Alexander the Great", "Cyrus the Great", "Leonidas", "Pericles"],
      ["Which president issued the Emancipation Proclamation?", "Abraham Lincoln", "Ulysses S. Grant", "Andrew Jackson", "Theodore Roosevelt"],
      ["What French structure was built for the 1889 World Fair?", "The Eiffel Tower", "The Louvre", "The Arc de Triomphe", "Notre-Dame"],
      ["Who was the founder of the Mongol Empire?", "Genghis Khan", "Kublai Khan", "Attila the Hun", "Sun Tzu"],
      ["Which period in Europe was a cultural rebirth?", "The Renaissance", "The Dark Ages", "The Enlightenment", "The Industrial Revolution"],
      ["What ancient wonder was located in Babylon?", "The Hanging Gardens", "The Colosseum", "The Lighthouse of Alexandria", "The Parthenon"],
      ["In what country did the Industrial Revolution begin?", "Great Britain", "United States", "France", "Germany"],
      ["Who was the longest-reigning British monarch before Elizabeth II?", "Queen Victoria", "King George III", "King Henry VIII", "Queen Mary"],
      ["Which explorer first reached India by sea?", "Vasco da Gama", "Ferdinand Magellan", "Marco Polo", "James Cook"]
    ],
    intermediate: [
      ["What document signed in 1215 limited the King's powers?", "Magna Carta", "Bill of Rights", "Constitution", "Treaty of Paris"],
      ["Which war was between the North and South of the US?", "The American Civil War", "The Revolutionary War", "The War of 1812", "The Spanish-American War"],
      ["Who was the primary author of the Communist Manifesto?", "Karl Marx", "Vladimir Lenin", "Friedrich Engels", "Joseph Stalin"],
      ["Which ancient empire was defeated by Hernán Cortés?", "The Aztec Empire", "The Inca Empire", "The Maya Empire", "The Olmec Empire"],
      ["What was the project to develop the atomic bomb?", "The Manhattan Project", "The Apollo Project", "Project Trinity", "The Overlord Project"],
      ["Who was the first Emperor of Rome?", "Augustus", "Julius Caesar", "Nero", "Caligula"],
      ["What battle was the turning point of the US Civil War?", "The Battle of Gettysburg", "The Battle of Antietam", "The Battle of Bull Run", "The Battle of Shiloh"],
      ["The Cold War was between the US and who?", "The Soviet Union", "China", "Germany", "Japan"],
      ["What treaty officially ended World War I?", "The Treaty of Versailles", "The Treaty of Paris", "The Treaty of Ghent", "The Treaty of Tordesillas"],
      ["Who was the French leader in the Reign of Terror?", "Maximilien Robespierre", "Napoleon Bonaparte", "Louis XVI", "Jean-Paul Marat"],
      ["Which dynasty was the last to rule imperial China?", "Qing Dynasty", "Ming Dynasty", "Tang Dynasty", "Han Dynasty"],
      ["What disease wiped out 1/3 of Europe in the 14th century?", "The Black Death", "Smallpox", "Cholera", "Typhus"],
      ["Who crossed the Alps with elephants to attack Rome?", "Hannibal", "Scipio Africanus", "Spartacus", "Attila the Hun"],
      ["What year did the French Revolution begin?", "1789", "1776", "1812", "1799"],
      ["Which Native American guide assisted Lewis and Clark?", "Sacagawea", "Pocahontas", "Sitting Bull", "Geronimo"],
      ["Who led the Indian independence movement?", "Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Bhagat Singh"],
      ["What event sparked World War I?", "Assassination of Franz Ferdinand", "Invasion of Poland", "Sinking of Lusitania", "Bombing of Pearl Harbor"],
      ["The code name for the 1944 Allied invasion was...", "Operation Overlord", "Operation Barbarossa", "Operation Market Garden", "Operation Torch"],
      ["Which war was between Lancaster and York?", "The Wars of the Roses", "The Hundred Years' War", "The English Civil War", "The Thirty Years' War"],
      ["Who was the British PM for most of WWII?", "Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Anthony Eden"],
      ["What empire was conquered by Pizarro?", "The Inca Empire", "The Aztec Empire", "The Maya Empire", "The Toltec Empire"],
      ["Where was Carthage located?", "Tunisia", "Egypt", "Morocco", "Libya"],
      ["What era modernized Japan in 1868?", "Meiji Restoration", "Edo Period", "Tokugawa Shogunate", "Showa Era"],
      ["Who was the last Tsar of Russia?", "Nicholas II", "Alexander III", "Peter the Great", "Ivan the Terrible"],
      ["What was the first artificial satellite?", "Sputnik 1", "Vostok 1", "Explorer 1", "Soyuz 1"],
      ["Which explorer first circumnavigated the globe?", "Ferdinand Magellan", "Francis Drake", "Christopher Columbus", "Vasco da Gama"],
      ["What US scandal led to Nixon's resignation?", "Watergate", "Teapot Dome", "Iran-Contra", "Whitewater"],
      ["Who founded Islam?", "Muhammad", "Abu Bakr", "Ali", "Umar"],
      ["The 'Trail of Tears' relocated which nation?", "The Cherokee", "The Navajo", "The Apache", "The Sioux"],
      ["Who invaded England in 1066?", "William the Conqueror", "Charlemagne", "Richard the Lionheart", "Henry V"]
    ],
    advanced: [
      ["Which treaty concluded the 30 Years' War?", "Peace of Westphalia", "Treaty of Utrecht", "Congress of Vienna", "Treaty of Tordesillas"],
      ["Carthaginian general defeated at Battle of Zama?", "Hannibal Barca", "Hasdrubal", "Hamilcar", "Mago"],
      ["Faction that became the Communist Party?", "The Bolsheviks", "The Mensheviks", "The SRs", "The Kadets"],
      ["King who won 'Pyrrhic victories' against Rome?", "Pyrrhus of Epirus", "Antiochus III", "Philip V", "Mithridates VI"],
      ["Naval battle where Holy League defeated Ottomans?", "Battle of Lepanto", "Battle of Actium", "Battle of Trafalgar", "Battle of Salamis"],
      ["Cause of Defenestration of Prague?", "Religious conflicts", "Tax dispute", "Assassination", "Border dispute"],
      ["Byzantine queen influential in Nika riots?", "Empress Theodora", "Empress Irene", "Empress Zoe", "Empress Eudoxia"],
      ["Social system in France before 1789?", "The Ancien Régime", "The Directory", "The Consulate", "The Bourbon Restoration"],
      ["Athenian general in Sicilian Expedition?", "Alcibiades", "Pericles", "Nicias", "Demosthenes"],
      ["Which dynasty was founded by Kublai Khan?", "The Yuan Dynasty", "The Ming Dynasty", "The Song Dynasty", "The Jin Dynasty"],
      ["City where Popes resided during 'Babylonian Captivity'?", "Avignon", "Paris", "Lyon", "Marseille"],
      ["Dictator who unified Japan before Tokugawa?", "Toyotomi Hideyoshi", "Oda Nobunaga", "Tokugawa Ieyasu", "Takeda Shingen"],
      ["Who led the team that found the Rosetta Stone?", "Pierre-François Bouchard", "Jean-François Champollion", "Howard Carter", "Heinrich Schliemann"],
      ["Purpose of Council of Trent?", "Direct Counter-Reformation", "Excommunicate Luther", "Authorize Crusades", "Translate Bible"],
      ["Battle that established Octavian's sole rule?", "Battle of Actium", "Battle of Philippi", "Battle of Pharsalus", "Battle of Cannae"],
      ["Banking family that ruled Florence?", "The Medici family", "The Borgia family", "The Sforza family", "The Habsburg family"],
      ["Name of 1884 meeting to regulate African colonization?", "The Berlin Conference", "The Congress of Vienna", "The Treaty of Versailles", "The Yalta Conference"],
      ["First king of unified Italy in 1861?", "Victor Emmanuel II", "Giuseppe Garibaldi", "Camillo Cavour", "Umberto I"],
      ["Taiping Rebellion leader claimed to be...", "Brother of Jesus", "Reincarnated Buddha", "Ming Emperor", "Dragon King messenger"],
      ["Emperor who split Rome into the Tetrarchy?", "Diocletian", "Constantine", "Marcus Aurelius", "Trajan"],
      ["Code name for German invasion of USSR?", "Operation Barbarossa", "Operation Sealion", "Operation Citadel", "Operation Felix"],
      ["Who wrote 'The Prince'?", "Niccolò Machiavelli", "Thomas Hobbes", "John Locke", "Thomas More"],
      ["English monarch overthrown in 1688?", "King James II", "King Charles I", "King Charles II", "King Henry VIII"],
      ["System where peasants were tied to the land?", "Serfdom / Manorialism", "Feudalism", "Vassalage", "Mercantilism"],
      ["General who defeated Napoleon at Waterloo?", "Duke of Wellington", "Horatio Nelson", "Gebhard von Blücher", "Mikhail Kutuzov"],
      ["German tactic of rapid concentrated attacks?", "Blitzkrieg", "Schlieffen Plan", "Guerre de Course", "Pincer Movement"],
      ["Edict that granted rights to Huguenots?", "Edict of Nantes", "Edict of Worms", "Edict of Milan", "Edict of Restitution"],
      ["First female PM of the UK?", "Margaret Thatcher", "Theresa May", "Indira Gandhi", "Golda Meir"],
      ["Oldest surviving library city?", "Nineveh", "Babylon", "Ur", "Uruk"],
      ["Event triggered by defenestration in Prague?", "The Thirty Years' War", "The Hussite Wars", "The Bohemian Revolt", "The Seven Years' War"]
    ]
  },
  funfact: {
    foundational: [
      ["Fastest land animal?", "Cheetah", "Lion", "Horse", "Greyhound"],
      ["How many continents are there?", "7", "5", "6", "8"],
      ["Largest organ in human body?", "Skin", "Liver", "Brain", "Heart"],
      ["Which is the 'Red Planet'?", "Mars", "Venus", "Jupiter", "Saturn"],
      ["What animal is a Komodo dragon?", "Lizard", "Snake", "Crocodile", "Dinosaur"],
      ["Colors in a rainbow?", "7", "6", "5", "8"],
      ["Only mammal capable of sustained flight?", "Bat", "Flying squirrel", "Sugar glider", "Lemur"],
      ["Hardest natural substance?", "Diamond", "Gold", "Iron", "Quartz"],
      ["Days in a leap year?", "366", "365", "364", "367"],
      ["United States flag star color?", "White", "Red", "Blue", "Gold"],
      ["Animal with humps?", "Camel", "Elephant", "Rhino", "Hippopotamus"],
      ["Chemical symbol for water?", "H2O", "CO2", "O2", "HO"],
      ["Legs of an octopus?", "8", "6", "10", "12"],
      ["What do bees make?", "Honey", "Nectar", "Wax", "Pollen"],
      ["Tallest animal?", "Giraffe", "Elephant", "Ostrich", "Kangaroo"],
      ["Group of wolves?", "Pack", "Herd", "Flock", "Pride"],
      ["Largest ocean?", "Pacific", "Atlantic", "Indian", "Arctic"],
      ["Opposite of nocturnal?", "Diurnal", "Crepuscular", "Matutinal", "Vespertine"],
      ["Teeth in adult human?", "32", "30", "28", "34"],
      ["Fruit to keep doctor away?", "Apple", "Banana", "Orange", "Grape"],
      ["Guacamole main ingredient?", "Avocado", "Tomato", "Onion", "Lime"],
      ["What do caterpillars turn into?", "Butterflies", "Moths", "Beetles", "Flies"],
      ["Stop sign shape?", "Octagon", "Hexagon", "Pentagon", "Circle"],
      ["Primary colors count?", "3", "4", "5", "2"],
      ["Closest star to Earth?", "The Sun", "Sirius", "Alpha Centauri", "Proxima Centauri"],
      ["Largest bone in human body?", "Femur", "Humerus", "Tibia", "Fibula"],
      ["Panda's main food?", "Bamboo", "Eucalyptus", "Fish", "Berries"],
      ["Freezing point in Fahrenheit?", "32°F", "0°F", "100°F", "212°F"],
      ["Zeros in a million?", "6", "5", "7", "8"],
      ["School bus color?", "Yellow", "Orange", "Red", "Green"]
    ],
    intermediate: [
      ["Letter not in any US state name?", "Q", "Z", "X", "J"],
      ["Animal with fingerprints like humans?", "Koala", "Chimpanzee", "Gorilla", "Orangutan"],
      ["Rarest human blood type?", "AB-negative", "O-negative", "B-negative", "A-negative"],
      ["Group of flamingos name?", "Flamboyance", "Flock", "Murder", "Parliament"],
      ["Fear of spiders?", "Arachnophobia", "Claustrophobia", "Agoraphobia", "Acrophobia"],
      ["Dot over 'i' or 'j'?", "Tittle", "Speck", "Point", "Jot"],
      ["Hearts in an octopus?", "3", "2", "4", "1"],
      ["First toy advertised on US TV?", "Mr. Potato Head", "Barbie", "G.I. Joe", "Slinky"],
      ["National animal of Scotland?", "Unicorn", "Lion", "Stag", "Dragon"],
      ["Fruit that floats because of air?", "Apple", "Orange", "Watermelon", "Grape"],
      ["Planet that rolls on its side?", "Uranus", "Neptune", "Saturn", "Venus"],
      ["Animal with highest BP?", "Giraffe", "Elephant", "Cheetah", "Blue Whale"],
      ["Pneumonoultramicroscopicsilicovolcanoconiosis is?", "Lung disease", "Skin condition", "Metal type", "Plant"],
      ["Fear of long words?", "Hippopotomonstrosesquippedaliophobia", "Verbophobia", "Logophobia", "Lexophobia"],
      ["Bird with eyes larger than brain?", "Ostrich", "Owl", "Emu", "Penguin"],
      ["Rarest M&M color?", "Brown", "Red", "Yellow", "Blue"],
      ["Phenomenon measured by Fujita scale?", "Tornadoes", "Hurricanes", "Earthquakes", "Tsunamis"],
      ["Shoelace tip name?", "Aglet", "Tip", "Cap", "Lace-lock"],
      ["Mammal with thickest fur?", "Sea Otter", "Polar Bear", "Arctic Fox", "Chinchilla"],
      ["Wallpaper cleaner turned toy?", "Play-Doh", "Silly Putty", "Slime", "Magic Eraser"],
      ["Food that doesn't expire?", "Honey", "Salt", "Sugar", "Rice"],
      ["Human blinks per minute?", "15-20", "5-10", "25-30", "30-40"],
      ["Hot water freezes faster effect?", "Mpemba effect", "Doppler effect", "Coriolis effect", "Leidenfrost effect"],
      ["Group of porcupines name?", "Prickle", "Herd", "Pack", "Spine"],
      ["Animal with pink milk?", "Hippopotamus", "Yak", "Water Buffalo", "Flamingo"],
      ["Most common letter in English?", "E", "A", "T", "O"],
      ["Smell of rain name?", "Petrichor", "Ozone", "Geosmin", "Aerosol"],
      ["Body part with most active muscles?", "Eyes", "Heart", "Hands", "Tongue"],
      ["First practical telephone inventor?", "Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"],
      ["Country with most islands?", "Sweden", "Canada", "Norway", "Indonesia"]
    ],
    advanced: [
      ["Protein that makes fireflies glow?", "Luciferin", "Biolumin", "Phosphorin", "Luminol"],
      ["The Golden Ratio is roughly?", "1.618", "3.14", "2.71", "1.41"],
      ["Symbol & name?", "Ampersand", "Octothorpe", "Asterism", "Caret"],
      ["Second most abundant element in universe?", "Helium", "Neon", "Argon", "Krypton"],
      ["Tendency to overestimate abilities?", "Dunning-Kruger", "Baader-Meinhof", "Mandela", "Placebo"],
      ["Scientific name for 'brain freeze'?", "Sphenopalatine ganglioneuralgia", "Cryogenic cephalalgia", "Cerebral hypothermia", "Trigeminal neuralgia"],
      ["Biologically immortal jellyfish?", "Turritopsis dohrnii", "Chironex fleckeri", "Physalia physalis", "Aurelia aurita"],
      ["Deepest point in oceans?", "Challenger Deep", "Mariana Trench", "Sirena Deep", "Tonga Trench"],
      ["Fear of number 13?", "Triskaidekaphobia", "Tetraphobia", "Octophobia", "Hexakosioihexekontahexaphobia"],
      ["Compound that colors blueberries?", "Anthocyanins", "Carotenoids", "Chlorophyll", "Betalains"],
      ["Sentence using every letter of alphabet?", "Pangram", "Anagram", "Palindrome", "Tautogram"],
      ["Paradox: If aliens exist, where are they?", "Fermi Paradox", "Drake Equation", "Olbers Paradox", "Twin Paradox"],
      ["Microscopic 'water bear' name?", "Tardigrade", "Rotifer", "Nematode", "Copepod"],
      ["Liquid metal at room temp?", "Mercury", "Gallium", "Bromine", "Francium"],
      ["Luminous electrical energy in storms?", "Ball lightning", "St Elmo fire", "Sprite lightning", "Auroral sub-storm"],
      ["Funny bone anatomical term?", "Ulnar nerve", "Humerus", "Radius", "Medial epicondyle"],
      ["Word that reads same backwards?", "Palindrome", "Anagram", "Ambigram", "Portmanteau"],
      ["Planet with day longer than year?", "Venus", "Mercury", "Jupiter", "Uranus"],
      ["Word that imitates sound?", "Onomatopoeia", "Alliteration", "Assonance", "Hyperbole"],
      ["Black hole light escape boundary?", "Event horizon", "Singularity", "Accretion disk", "Photon sphere"],
      ["Oldest living tree name?", "Methuselah", "Hyperion", "General Sherman", "Prometheus"],
      ["Potato browning process?", "Enzymatic browning", "Caramelization", "Fermentation", "Maillard reaction"],
      ["Words with same root different meanings?", "Cognates", "Synonyms", "Homophones", "Antonyms"],
      ["Straight lines appear curved illusion?", "Hering illusion", "Müller-Lyer illusion", "Ponzo illusion", "Ebbinghaus illusion"],
      ["Cell programmed death process?", "Apoptosis", "Necrosis", "Autophagy", "Mitosis"],
      ["Theoretical sphere of comets?", "Oort Cloud", "Kuiper Belt", "Asteroid Belt", "Scattered Disc"],
      ["Fear of being without phone?", "Nomophobia", "Technophobia", "Telephonophobia", "Cyberphobia"],
      ["Crust and mantle boundary?", "Moho", "Gutenberg", "Lehmann", "Conrad"],
      ["Remember first and last list items effect?", "Serial position", "Recency", "Primacy", "Von Restorff"],
      ["Dark red liquid non-metallic element?", "Bromine", "Iodine", "Mercury", "Francium"]
    ]
  },
  entertainment: {
    foundational: [
      ["Mickey Mouse creator?", "Walt Disney", "Mighty Mouse", "Jerry", "Stuart Little"],
      ["'Man of Steel'?", "Superman", "Batman", "Iron Man", "Spider-Man"],
      ["Clownfish movie?", "Finding Nemo", "Shark Tale", "Little Mermaid", "Moana"],
      ["'Queen of Pop'?", "Madonna", "Lady Gaga", "Whitney Houston", "Britney Spears"],
      ["Darth Vader lightsaber color?", "Red", "Blue", "Green", "Purple"],
      ["Harry Potter school?", "Hogwarts", "Beauxbatons", "Durmstrang", "Ilvermorny"],
      ["Jack Sparrow actor?", "Johnny Depp", "Orlando Bloom", "Brad Pitt", "Tom Cruise"],
      ["Toy Story cowboy?", "Woody", "Buzz Lightyear", "Jessie", "Andy"],
      ["Glass slipper princess?", "Cinderella", "Snow White", "Ariel", "Belle"],
      ["Building block surviving game?", "Minecraft", "Roblox", "Fortnite", "Terraria"],
      ["Queen lead singer?", "Freddie Mercury", "Mick Jagger", "David Bowie", "Elton John"],
      ["Batman's city?", "Gotham City", "Metropolis", "Star City", "Central City"],
      ["Highest grossing film as of 2024?", "Avatar", "Avengers Endgame", "Titanic", "Force Awakens"],
      ["Who wrote Romeo and Juliet?", "William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain"],
      ["Springfield yellow family?", "The Simpsons", "Family Guy", "Bob's Burgers", "Futurama"],
      ["Lion King villain?", "Scar", "Jafar", "Ursula", "Gaston"],
      ["Pac-Man color?", "Yellow", "Red", "Blue", "Green"],
      ["Drummer plays?", "Drums", "Guitar", "Piano", "Bass"],
      ["Green swamp ogre?", "Shrek", "Donkey", "Lord Farquaad", "Puss in Boots"],
      ["John Paul George Ringo band?", "The Beatles", "Rolling Stones", "The Who", "The Kinks"],
      ["MCU Iron Man actor?", "Robert Downey Jr", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"],
      ["Game of Thrones continent?", "Westeros", "Middle-earth", "Narnia", "Tamriel"],
      ["'Shake It Off' singer?", "Taylor Swift", "Katy Perry", "Ariana Grande", "Miley Cyrus"],
      ["Aladdin lamp source?", "Cave of Wonders", "Agrabah Market", "Sultan Palace", "Magic Carpet"],
      ["Zelda protagonist?", "Link", "Zelda", "Ganon", "Mario"],
      ["Theme park dinosaur movie?", "Jurassic Park", "Godzilla", "King Kong", "Land Before Time"],
      ["Harry Potter author?", "JK Rowling", "Stephen King", "Suzanne Collins", "JR Tolkien"],
      ["Gramophone award?", "Grammy Award", "Oscar", "Emmy", "Tony"],
      [" Spielberg 1982 alien?", "ET", "Alf", "Stitch", "Yoda"],
      ["Avengers publisher?", "Marvel", "DC", "Dark Horse", "Image"]
    ],
    intermediate: [
      ["Inception and Titanic director?", "James Cameron", "Steven Spielberg", "Christopher Nolan", "Quentin Tarantino"],
      ["American Idol season 1 winner?", "Kelly Clarkson", "Carrie Underwood", "Adam Lambert", "Fantasia Barrino"],
      ["'Dark Side of the Moon' band?", "Pink Floyd", "Led Zeppelin", "The Who", "Rolling Stones"],
      ["Neo's wake up pill color?", "Red", "Blue", "Green", "Yellow"],
      ["Black Panther country?", "Wakanda", "Zamunda", "Genosha", "Latveria"],
      ["'Here's Johnny!' improviser?", "Jack Nicholson", "Robert De Niro", "Al Pacino", "Marlon Brando"],
      ["Pulp Fiction director?", "Quentin Tarantino", "Martin Scorsese", "Stanley Kubrick", "David Fincher"],
      ["First feature length animated movie?", "Snow White", "Pinocchio", "Fantasia", "Bambi"],
      ["Most Grammys by female artist?", "Beyoncé", "Taylor Swift", "Adele", "Aretha Franklin"],
      ["Highest selling console?", "PlayStation 2", "Nintendo DS", "Xbox 360", "Nintendo Wii"],
      ["2008 Joker actor?", "Heath Ledger", "Joaquin Phoenix", "Jared Leto", "Jack Nicholson"],
      ["Harry Potter prison?", "Azkaban", "Nurmengard", "Gringotts", "Askaban"],
      ["Star Wars composer?", "John Williams", "Hans Zimmer", "Ennio Morricone", "Alan Silvestri"],
      ["Longest running US live comedy?", "It's Always Sunny", "The Simpsons", "South Park", "Saturday Night Live"],
      ["'21' album singer?", "Adele", "Taylor Swift", "Lady Gaga", "Katy Perry"],
      ["1994 Best Picture starring Tom Hanks?", "Forrest Gump", "Pulp Fiction", "Shawshank Redemption", "Schindler's List"],
      ["Mufasa voice actor?", "James Earl Jones", "Jeremy Irons", "Matthew Broderick", "Rowan Atkinson"],
      ["Stranger Things town?", "Hawkins", "Riverdale", "Sunnydale", "Derry"],
      ["'Stairway to Heaven' band?", "Led Zeppelin", "Pink Floyd", "Eagles", "Doors"],
      ["Walter White actor?", "Bryan Cranston", "Robert Downey Jr", "Chris Evans", "Mark Ruffalo"],
      ["'Princess of Pop'?", "Britney Spears", "Christina Aguilera", "Madonna", "Janet Jackson"],
      ["Captain America shield metal?", "Vibranium", "Adamantium", "Uru", "Nth Metal"],
      ["Grand Budapest Hotel director?", "Wes Anderson", "Tim Burton", "Guillermo del Toro", "Edgar Wright"],
      ["Harry Potter broomstick sport?", "Quidditch", "Quadpot", "Gobstones", "Broom-racing"],
      ["The Matrix Neo actor?", "Keanu Reeves", "Tom Cruise", "Will Smith", "Brad Pitt"],
      ["Wizarding newspaper name?", "The Daily Prophet", "The Quibbler", "The Daily Bugle", "The Wizarding Times"],
      ["'1989' album artist?", "Taylor Swift", "Katy Perry", "Ariana Grande", "Miley Cyrus"],
      ["The Simpsons town?", "Springfield", "Shelbyville", "Quahog", "South Park"],
      ["'Bohemian Rhapsody' band?", "Queen", "Led Zeppelin", "Rolling Stones", "The Beatles"],
      ["Wolverine actor?", "Hugh Jackman", "Patrick Stewart", "Ian McKellen", "Ryan Reynolds"]
    ],
    advanced: [
      ["First Best Animated Feature Oscar winner?", "Shrek", "Monsters Inc", "Jimmy Neutron", "Spirited Away"],
      ["Oscar Emmy Grammy Tony Pulitzer winner?", "Richard Rodgers", "Marvin Hamlisch", "Mel Brooks", "Audrey Hepburn"],
      ["Tolkien Elven language?", "Sindarin", "Dothraki", "Klingon", "Valyrian"],
      ["'Rumours' album band?", "Fleetwood Mac", "Pink Floyd", "Eagles", "Led Zeppelin"],
      ["First movie to gross over $1B?", "Titanic", "Jurassic Park", "Episode I", "Avatar"],
      ["Most Oscar nominations actor?", "Meryl Streep", "Jack Nicholson", "Katharine Hepburn", "Daniel Day-Lewis"],
      ["Highest grossing indie film?", "Passion of Christ", "My Big Fat Greek Wedding", "Slumdog Millionaire", "Juno"],
      ["'Four Seasons' composer?", "Vivaldi", "Mozart", "Beethoven", "Bach"],
      ["First Mario appearance game?", "Donkey Kong", "Super Mario Bros", "Mario Bros", "Space Invaders"],
      ["'Frankly my dear I don't give a damn' movie?", "Gone with the Wind", "Casablanca", "Wizard of Oz", "Citizen Kane"],
      ["TARDIS fuel name?", "Artron Energy", "Dilithium", "Kyber crystals", "Tachyon particles"],
      ["'Purple Rain' artist?", "Prince", "Michael Jackson", "David Bowie", "James Brown"],
      ["First feature length computer animated film?", "Toy Story", "A Bug's Life", "Antz", "Shrek"],
      ["'Reservoir Dogs' director?", "Quentin Tarantino", "Martin Scorsese", "Paul Anderson", "Guy Ritchie"],
      ["Highest grossing Broadway musical?", "The Lion King", "Wicked", "Phantom of Opera", "Hamilton"],
      ["Posthumous Oscar winner for 'Network'?", "Peter Finch", "Heath Ledger", "James Dean", "Massimo Troisi"],
      ["Stephen King fictional town?", "Castle Rock", "Derry", "Jerusalem's Lot", "Haven"],
      ["'Lemonade' artist?", "Beyoncé", "Adele", "Rihanna", "Lady Gaga"],
      ["First film to win 'Big Five' Oscars?", "It Happened One Night", "One Flew Over Cuckoo's Nest", "Silence of Lambs", "Gone with the Wind"],
      ["'Nevermind' band?", "Nirvana", "Pearl Jam", "Soundgarden", "Alice in Chains"],
      ["Arrakis movie?", "Dune", "Tatooine", "Hoth", "Cybertron"],
      ["Symmetrical framing director?", "Wes Anderson", "Stanley Kubrick", "Alfred Hitchcock", "Steven Spielberg"],
      ["First console with built-in HDD?", "Xbox", "PlayStation 2", "GameCube", "Dreamcast"],
      ["'Here's looking at you kid' movie?", "Casablanca", "Gone with the Wind", "Maltese Falcon", "The Big Sleep"],
      ["Avatar language name?", "Na'vi", "Klingon", "Dothraki", "Valyrian"],
      ["'King of Rock and Roll'?", "Elvis Presley", "Chuck Berry", "Little Richard", "Jerry Lee Lewis"],
      ["First animated film nominated for Best Picture?", "Beauty and the Beast", "The Lion King", "Toy Story", "Up"],
      ["'Evil Dead' director?", "Sam Raimi", "Quentin Tarantino", "Robert Rodriguez", "Kevin Smith"],
      ["Highest grossing documentary?", "Fahrenheit 9/11", "March of Penguins", "Super Size Me", "Inconvenient Truth"],
      ["Hannibal Lecter Oscar winner?", "Anthony Hopkins", "Mads Mikkelsen", "Brian Cox", "Gaspard Ulliel"]
    ]
  },
  lore: {
    foundational: [
      ["Who is known as the Prime Creator in the Ordverse?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar Demetrius"],
      ["What name did the protagonist choose to honor his mother?", "Caelestine", "Demetrius", "Zichri", "Chrysealis"],
      ["Who is the current King of Chrysealis?", "King Kailus", "King Tirath", "King Miknelah", "King Ziphus"],
      ["What is the name of the Divine Empire?", "Chrysealis", "The Aetheridom Expanse", "The Supreme Universe", "The House of War"],
      ["Who was reinstated as the Crown Prince of Chrysealis?", "Yveldinjar (Mephistopheles)", "Valthar", "Nicholas", "Astraea"],
      ["What system measures power progression in the Ordverse?", "Reality Factor (RF)", "Power Level (PL)", "Divine Energy", "Aura Points"],
      ["What is the 14th and highest rank?", "True God", "Progenitor", "Primordial", "God"],
      ["What was Nichothéos's human identity?", "Jayden Cameron", "Nicholas Caelestine", "Yveldinjar", "Valthar Demetrius"],
      ["Who did Jayden fall in love with on Earth?", "Michelle", "Astraea", "Aelunira", "He never fell in love"],
      ["Who is the older brother who fell from grace?", "Yveldinjar (Mephistopheles)", "Valthar", "Kailus", "Ziphus"],
      ["How long did the refinement process in Chrysealis take?", "14 days", "7 days", "30 days", "3 days"],
      ["How long did it take to end Mephistopheles's threat?", "Under three minutes", "Fourteen days", "One hour", "He couldn't defeat him"],
      ["What rank corresponds to a 'Saint'?", "Rank 9", "Rank 10", "Rank 7", "Rank 12"],
      ["What rank corresponds to a 'Sage'?", "Rank 10", "Rank 9", "Rank 11", "Rank 8"],
      ["What is the lowest rank (Rank 1)?", "Basic", "Novice", "Advanced", "Expert"],
      ["Who were Jayden's adoptive parents?", "Dr. Steve & Rachel Cameron", "James & Evelyn", "Michael & Aimi", "Draco & Michelle"],
      ["Jayden's superhero moniker at age 13?", "Mystic Kid", "Ultimate Warrior", "Grand Champion", "Kim Hyuk Jae"],
      ["Who was Jayden's biological brother on Earth?", "Draco Cameron", "Bradley Draxler", "Michael Larmarck", "Prince Edmundus"],
      ["What event at age 12 granted Jayden invulnerability?", "A Polyvenium meteorite", "A solar flare", "A magical spell", "A lightning strike"],
      ["When did Jayden vow revenge?", "Age 17.6", "Age 13", "Age 18", "Age 21"],
      ["How old was Jayden when he died saving Earth?", "18", "17", "21", "14"],
      ["Who did Jayden fall in love with at school?", "Michelle", "Aimi", "Evelyn", "Rachel"],
      ["What bound Jayden during the Mephistopheles battle?", "Divine chains", "A gravity spell", "Polyvenium cuffs", "Chrysealean steel"],
      ["Whose murder pushed Jayden to rage?", "James Cameron", "Dr. Steve Cameron", "Evelyn Williams", "Rachel Cameron"],
      ["What activated the forbidden sigil?", "His life-force and his blood", "A Chrysealean incantation", "The power of the Sun", "Aetherium crystals"],
      ["Mephistopheles's true identity?", "Yveldinjar Demetrius", "Valthar", "King Kailus's brother", "A rogue Primordial"],
      ["Where did Jayden wake up after dying?", "Chrysealis", "The Aetheridom Expanse", "The Supreme Universe", "The Void"],
      ["How long for the rematch victory?", "Less than 3 minutes", "Fourteen days", "18 hours", "An entire day"],
      ["Nichothéos's terrifying moniker?", "Crimson-haired God of Death", "The Lost Prince", "The Ultimate Conduit", "The Mystic Kid"],
      ["How did Nichothéos conquer defiant realms?", "Single-handedly without an army", "By leading the Vanguard", "Using six lineages", "Through diplomacy"],
      ["Official reason for banishment?", "He was 'soft'", "Tried to assassinate King", "Lost to a Primordial", "Refused weapons"],
      ["Visual omen of his arrival?", "Sky turned deep bruised red", "Sun instantly set", "Oceans turned to blood", "Gravity reversed"],
      ["Official state rank title?", "Crimson God of War", "Chrysealean God of War", "God of Death", "The Lost Prince"],
      ["What does 'God of Death' represent?", "Finality of his arrival", "Unstoppable armies", "Mastery of dark magic", "Right to throne"],
      ["Who did Nichothéos train?", "Astraea", "Yveldinjar", "Valthar", "King Kailus"],
      ["Kailus's true motive for banishment?", "A better, more obedient son", "A dead legend", "A spy", "To protect him"],
      ["Nicholas's biological daughter?", "Claire Emilia Cameron", "Kira Athlea", "Astraea", "Aelunira"],
      ["Nicholas's adopted daughter?", "Kira Athlea Hunter-Cameron", "Evelyn Williams", "Michelle", "Aimi"],
      ["Kira's name to enemies?", "Kaeltharya", "Astraea", "Mephistopheles", "Aelunira"],
      ["Kailus's relation to Nicholas?", "Father", "Grandfather", "Brother", "Uncle"],
      ["Queen Aelunira Caelestine relation?", "Nicholas's Mother", "Step-sister", "Michelle's Mother", "Goddess of War"],
      ["6th King of Chrysealis?", "King Kailus Demetrius", "King Tirath", "King Ziphus", "King Miknelah"],
      ["Artifact given to Michelle?", "A wedding ring", "Aetherium Crown", "Scepter of Ord", "Polyvenium dagger"],
      ["Who is Evelyn Williams to Jayden?", "Adopted Daughter", "Sister-in-law", "Mother", "Ex-wife"],
      ["1st King of Chrysealis?", "King Demetrius Zichri", "King Klarius", "King Kailus", "Valthar"],
      ["Jayden's primary anchor to humanity?", "Michelle Williams", "Rachel Cameron", "Evelyn Williams", "Aimi"],
      ["Ultimate progenitor of Nicholas?", "Aetherius Dominus", "Supremus Daragvener", "King Kailus", "Valthar"],
      ["Jayden's older brother/Crown Prince?", "Yveldinjar (Mephistopheles)", "Draco Cameron", "Valthar", "Klarius"],
      ["James Cameron relation?", "Earthly Father Figure", "Biological Father", "Uncle", "Older Brother"],
      ["New War-God after banishment?", "Astraea Demetrius", "Valthar", "Yveldinjar", "Miknelah"]
    ],
    intermediate: [
      ["The Triune Symmetry's third pillar?", "τὸ ἄγνωστον (The Unknown)", "Supremus Daragvener", "The Vessel", "The Ultimate Conduit"],
      ["God of Chrysealean Magic?", "King Miknelah", "King Klarius", "King Tirath", "King Zichri"],
      ["Current War-God after Nicholas left?", "Astraea", "Valthar", "Queen Aelunira", "Yveldinjar"],
      ["Penalty for entering Supreme Universe?", "Total Annihilation", "Memory Wipe", "Banishment", "Loss of Domains"],
      ["Remnant of first banishment?", "Brown hair", "Trench coat", "Mortal vulnerability", "Lost memories"],
      ["Three sub-levels within ranks?", "Beginner, Advanced, Peak", "Low, Mid, High", "Initiate, Master, Grandmaster", "Alpha, Beta, Omega"],
      ["Saitama's peak rank?", "Rank 10 (Sage)", "Rank 9 (Saint)", "Rank 11 (Primordial)", "Rank 8 (Emperor)"],
      ["CAS Superman rank?", "Peak Sage (Rank 10)", "Peak Saint (Rank 9)", "Advanced Emperor (Rank 8)", "Beginner God (Rank 13)"],
      ["Transitioning between levels increases what?", "Dimensional Priority", "Physical Mass", "Magical Capacity", "Divine Right"],
      ["Rank 13 Advanced vs Prime Beginners?", "100,000+", "15", "1,000", "1,000,000"],
      ["Who holds the Peak level of Rank 13?", "Jayden", "Valthar", "King Kailus", "Astraea"],
      ["Title stripped and given to Astraea?", "War-God", "Crown Prince", "God of Light", "The Vessel"],
      ["Kailus's demand for reinstatement?", "Give up humanity", "Conquer Earth", "Kill Mephistopheles", "Marry a Chrysealean"],
      ["Base Multiple for Rank 1 Advanced?", "5 Prime Beginners", "10 Prime Beginners", "15 Prime Beginners", "2 Prime Beginners"],
      ["Rank of Chrysealean Immortals?", "Rank 13 (God)", "Rank 12 (Progenitor)", "Rank 11 (Primordial)", "Rank 14 (True God)"],
      ["Alias for swordsmanship victory?", "Kim Hyuk Jae", "Bradley Draxler", "Prince Edmundus", "Draco"],
      ["Who became Jayden's confidante at 13.5?", "Aimi", "Evelyn Williams", "Rachel Cameron", "Bradley Draxler"],
      ["Who ruined Jayden's relationship with Michelle?", "Aimi and Prince Edmundus", "Mephistopheles and Draco", "James and Evelyn", "Bradley and Michael"],
      ["Moved to Detroit to live with?", "His uncle James", "Dr. Steve Cameron", "Japan master", "Prince Edmundus"],
      ["13.25 transport title?", "Grand Champion of Supreme Universe", "Ultimate Warrior", "God of War", "Prime Creator"],
      ["Days of recurring nightmares?", "On his birthdays", "New Year's Eve", "Adoption anniversary", "Meteorite strike day"],
      ["First friends in Denver?", "Bradley Draxler & Michael Larmarck", "Steve & Draco", "Evelyn & Michelle", "Edmundus & Aimi"],
      ["How he drew the forbidden sigil?", "Using battle movements over hours", "A cloaking spell", "James drew it", "Telekinesis"],
      ["How he got the blood needed?", "Intentionally created an opening", "Bit his hand", "Mephistopheles's blood", "Cut himself"],
      ["Gatekeeper who helped recover powers?", "Sethys", "Astraea", "Miknelah", "Klarius"],
      ["Why Kailus wanted Yveldinjar back?", "Favorite queen's son", "Royal Seal", "Defeat Jayden", "Memory Lock"],
      ["How he spent 14 days of 'meditation'?", "Transferring power into his axe", "Praying", "Healing", "Learning Magic"],
      ["Title given to Astraea?", "Chrysealean War-God", "Crown Prince", "God of Light", "Supreme Protector"],
      ["Crown Prince after banishment?", "Astraea", "Yveldinjar", "Valthar", "Ziphus"],
      ["How he dismantled resistance?", "Became X+1", "Drained 50% magic", "Multiplied RF", "Froze time"],
      ["Political reason for banishment?", "Fear of his power", "Refused Earth conquest", "Hide truth of Yveldinjar", "Resource drought"],
      ["Jayden's aversion to 'conquering'?", "Rejection of the monster father made", "James's curse", "Meteor side effect", "Fear of mortality"],
      ["Difference from standard War-Gods?", "His existence dissolved war", "Relied on weapon mastery", "Only fought by day", "Required permission"],
      ["Choosing 'Nicholas' signified?", "Protecting beings he subjugated", "Tribute to Draco", "Insult to Astraea", "Acceptance of destiny"],
      ["Trait inherited from Valthar legacy?", "57:43 crimson-brown hair", "Mastery of every weapon", "Time manipulation", "Polyvenium invulnerability"],
      ["Why Astraea replaced him?", "Control over technique vs existence", "Astraea defeated him", "Astraea higher RF", "He requested it"],
      ["God of Love and Wisdom?", "King Ziphus Demetrius", "King Klarius", "King Tirath", "King Miknelah"],
      ["Miknelah Demetrius domain?", "God of Chrysealean Magic", "Mysteries and Courage", "Light and Purity", "Raw Strength"],
      ["Unique property of Michelle's ring?", "Key to use his divine abilities", "Invisibility", "Chrysealean Magic", "Turns her to True God"],
      ["5th King domain?", "Beauty Charm Wealth Power", "Magic", "Light", "Raw Strength"],
      ["Valthar's title before vanishing?", "The Lost Prince", "The 4th King", "The Crown Prince", "The Founder"],
      ["What does the ring provide for defense?", "Ultimate Defense linked to perfected form", "Complete immortality", "Polyvenium shield", "Triune Symmetry power"],
      ["4th King domain?", "Mysteries and Courage", "Magic", "Light", "Beauty"],
      ["Why 'Caelestine'?", "Honor mother's grace", "James's true name", "Hide from Mephistopheles", "Victory of the people"],
      ["State when forging the ring?", "Perfected combined state", "Mortal state", "Injured state", "0% AD state"],
      ["Biological brother of Mephistopheles?", "Nichothéos", "Draco Cameron", "Valthar", "Klarius"],
      ["Aelunira lineage?", "House Caelestine", "House Demetrius", "House War", "House Williams"],
      ["Nicholas's Great-grandfather?", "King Klarius Demetrius", "King Miknelah", "King Ziphus", "King Tirath"],
      ["Nicholas's Grandfather?", "King Tirath Demetrius", "King Kailus", "King Klarius", "Valthar"],
      ["Kailus generation?", "6th King", "5th King", "4th King", "7th King"]
    ],
    advanced: [
      ["Nicholas's Crimson to Brown ratio?", "57:43", "50:50", "60:40", "43:57"],
      ["Why Aetherius Dominus memories are sealed?", "Prevent Ordverse collapse", "Hide from Daragvener", "Punishment", "To learn mortal ways"],
      ["Valthar domain?", "Raw Strength & Weapons", "Mysteries and Courage", "Beauty Charm Wealth Power", "Creation"],
      ["Percentage of true power Nichothéos uses?", "0%", "1%", "10%", "100%"],
      ["Nicholas height?", "6'3\"", "6'0\"", "6'5\"", "6'1\""],
      ["Rank 14 vs Rank 13 Peak powerhouses?", "A googolplex", "One billion", "Infinite", "One hundred thousand"],
      ["Tool for neutralizing lower threats?", "HIMMAGE", "Memory Lock", "The Vessel", "Triune Symmetry"],
      ["Kailus current Rank 13 level?", "Peak", "Beginner", "Advanced", "He is Rank 14"],
      ["World Breaker Hulk rank?", "Peak Saint (Rank 9)", "Advanced Emperor (Rank 8)", "Beginner King (Rank 7)", "Advanced Knight (Rank 6)"],
      ["Example of Rank 11 Primordial?", "The Void / Cthulhu", "Saitama", "Immortals", "Planetary Lords"],
      ["Mephistopheles's Earth goal?", "A 'Fixed Point' of destruction", "Chrysealean invasion", "Resurrect Valthar", "Destroy Sun"],
      ["How he treats Sages, Saints, Emperors?", "Background noise", "Worthy challengers", "Allies", "Anomalies"],
      ["Rank 2 Advanced Multiple?", "15", "5", "50", "100"],
      ["Why hair randomize to brown?", "Side effect of mortal vessel", "Kailus curse", "Hide from Mephistopheles", "Sign of RF"],
      ["What does 'Multiple' represent?", "Simultaneous lower level victories", "RF gain", "Healing speed", "Dimensional access"],
      [" Lake Michigan contamination material?", "Polyvenium", "Aetherium", "Chrysealean steel", "Void essence"],
      ["James and Michelle's family history?", "James ex-lover of her mother", "James injured her father", "James stole magic", "James was her uncle"],
      ["Military school dismissal reason?", "Uncontrolled power leak", "Fighting", "Disobedience", "Swordsmanship"],
      ["How he undid Mephistopheles's destruction?", "War-spell fueled by life force", "Reversed time", "Transferred immortality", "Absorbed him"],
      ["Items given by James at 13?", "Watch, Cloak, Weapons", "Mask, Ring, Sword", "Staff, Shield, Armor", "Amulet, Boots, Gauntlets"],
      ["Where he met obsessed Aimi?", "Japan", "South Korea", "China", "Tibet"],
      ["Who Evelyn informed of his nightmares?", "Dr. Steve Cameron", "James", "Michelle", "Aimi"],
      ["Final act for Earth before death?", "Undid illusion reversing destruction", "Transferred immortality", "Sealed portal", "Erased memory"],
      ["Jayden's last words?", "\"Earth is safe now.\"", "\"I failed father...\"", "\"Michelle...\"", "\"The Demetrius name dies...\""],
      ["Power conversion rate to Mystic Kid?", "14 days to equal one hour true power", "1:1 ratio", "Lost 50%", "One hour > original power"],
      ["Why Kailus wanted Earth conquered?", "To turn him into a weapon", "Harvest Polyvenium", "War with Primordials", "No longer love Michelle"],
      ["Astraea and Yveldinjar relation?", "Blood sister and brother", "Cousins", "Aunt", "No relation"],
      ["Mephistopheles condition after retreat?", "Severe damage/life-force drain", "Uninjured but terrified", "Trapped in illusion", "Memories locked"],
      ["Kailus's loyalty ultimatum?", "Subdue Earth", "Execute Michelle", "Yield RF", "Fight Astraea"],
      ["Effect of solo conquests on military?", "Made armies redundant/useless", "Inspired training", "Civil war", "Bankrupted empire"],
      ["Rank 3 Authorities view of him?", "Simplified the Omniverse into one empire", "Weak vessel", "Valuable ally", "Myth"],
      ["Difference between Valthar and Nichothéos?", "Nichothéos strongest in existence", "God of Death vs War", "Valthar conquered Earth", "Physical vs Magic"],
      ["Kailus's 'lobotomizing' method?", "Randomization and memory lock", "Extracting core", "Weight of Universes", "Mortality"],
      ["'Crimson God of War' representation?", "Rare-blooded force that fights alone", "Commander of legions", "Finality of death", "Protector of weak"],
      ["Kailus realization of 'One-Man Army'?", "Nothing could stop him", "Triune Symmetry save King", "Astraea defeat him", "Universe collapse"],
      ["Astraea's hold compared to Nicholas?", "Official authority of House Demetrius", "Higher absolute RF", "Title of God of Death", "Control over Authorities"],
      ["Michelle's conduit mechanic?", "His divine scaling power", "14-Rank RF system", "X+1 limit", "HIMMAGE automation"],
      ["Demetrius Zichri relation?", "4x Great-grandfather", "3x Great-grandfather", "5x Great-grandfather", "Great-grandfather"],
      ["Valthar Demetrius relation?", "First son of Klarius", "Son of Tirath", "Son of Kailus", "Son of Miknelah"],
      ["Nicholas 3x Great-grandfather?", "King Ziphus Demetrius", "King Miknelah", "King Zichri", "King Klarius"],
      ["Astraea's relation to both?", "Step-sister to Nicholas, blood sister to Yveldinjar", "Blood sister Nicholas", "Cousin", "Adopted daughter"],
      ["Michelle's ring is a fragment of?", "The Absolute", "The Triune Symmetry", "The Void", "Aetherium"],
      ["What prevents penetration of her defense?", "Link to perfected form", "Mortal Anchor status", "James's spell", "Her own RF"],
      ["Nicholas 2x Great-grandfather?", "King Miknelah Demetrius", "King Klarius", "King Ziphus", "King Tirath"],
      ["Michelle status in Table?", "Mortal Anchor", "Supreme Queen", "Ultimate Conduit", "War-God"],
      ["House Caelestine trait?", "Elegance and celestial grace", "Raw strength", "Magic", "Founders of Demetrius"],
      ["Ring difference from standard artifacts?", "Conduit of authority from his essence", "Rank 13 status", "Bypass Memory Lock", "Neutralize Polyvenium"],
      ["Who is Kaeltharya?", "Kira Athlea Hunter-Cameron", "Claire Emilia Cameron", "Astraea Demetrius", "Aimi"],
      ["Kira and Claire relation?", "Childhood best friend and adopted sister", "Biological sister", "Mother", "Cousin"],
      ["Why Michelle is Jayden's 'primary anchor'?", "Her existence is the reason he protects Earth", "She holds Memory Lock", "She can defeat him", "She is reincarnated God"]
    ]
  },
  sports: {
    foundational: [
      ["Players per team on a football pitch?", "11", "10", "12", "7"],
      ["Most World Cups won?", "Brazil", "Germany", "Italy", "Argentina"],
      ["Three goals in one match?", "Hat-trick", "Brace", "Turkey", "Century"],
      ["Player often called 'CR7'?", "Cristiano Ronaldo", "Lionel Messi", "Neymar", "Ronaldinho"],
      ["Sport using a shuttlecock?", "Badminton", "Tennis", "Squash", "Table Tennis"],
      ["Which city hosts the Wimbledon tennis tournament?", "London", "New York", "Paris", "Melbourne"],
      ["What is the color of the middle ring on the Olympic flag?", "Black", "Red", "Blue", "Green"],
      ["In basketball, how many points is a free throw worth?", "1", "2", "3", "5"],
      ["Which country won the 2022 FIFA World Cup?", "Argentina", "France", "Brazil", "Croatia"],
      ["How many holes are played in a standard round of golf?", "18", "9", "12", "10"]
    ],
    intermediate: [
      ["2023/24 Premier League winners?", "Manchester City", "Arsenal", "Liverpool", "Chelsea"],
      ["Most Champions League titles?", "Real Madrid", "AC Milan", "Liverpool", "Bayern Munich"],
      ["Record for most PL goals in a season (36)?", "Erling Haaland", "Mo Salah", "Alan Shearer", "Luis Suarez"],
      ["2023 African Footballer of the Year?", "Victor Osimhen", "Victor Boniface", "Ademola Lookman", "Alex Iwobi"],
      ["Which tennis player has the most Men's Grand Slam titles?", "Novak Djokovic", "Rafael Nadal", "Roger Federer", "Pete Sampras"],
      ["In American Football, how many points is a touchdown?", "6", "3", "7", "2"],
      ["Which driver holds the record for most Formula 1 titles?", "Lewis Hamilton / Schumacher", "Sebastian Vettel", "Max Verstappen", "Ayrton Senna"],
      ["Who is the current manager of the Nigerian Super Eagles?", "Finidi George", "Jose Peseiro", "Gernot Rohr", "Stephen Keshi"]
    ],
    advanced: [
      ["First African Ballon d'Or winner?", "George Weah", "Samuel Eto'o", "Didier Drogba", "Jay-Jay Okocha"],
      ["First FIFA World Cup winner (1930)?", "Uruguay", "Argentina", "Brazil", "France"],
      ["Premier League all-time top goalscorer?", "Alan Shearer", "Harry Kane", "Wayne Rooney", "Sergio Aguero"],
      ["Who was the first player to be sold for over £100 million?", "Neymar", "Paul Pogba", "Cristiano Ronaldo", "Gareth Bale"],
      ["Which country has the most medals in Olympic history?", "USA", "Russia", "China", "Germany"],
      ["In cricket, what is the term for a batsman being out for zero?", "Duck", "Goose", "Wide", "Dot"]
    ]
  },
  languages: {
    foundational: [
      ["'Thank you' in French?", "Merci", "Gracias", "Obrigado", "Danke"],
      ["Most spoken language in Nigeria?", "English", "Yoruba", "Hausa", "Igbo"],
      ["Official language of Brazil?", "Portuguese", "Spanish", "French", "Italian"],
      ["How do you say 'Hello' in Spanish?", "Hola", "Bonjour", "Ciao", "Namaste"],
      ["Which of these is the most spoken language globally?", "English", "Mandarin", "Spanish", "Hindi"],
      ["What is the official language of Germany?", "German", "Dutch", "Danish", "Swiss"]
    ],
    intermediate: [
      ["'Konnichiwa' meaning?", "Hello", "Goodbye", "Thank you", "I'm sorry"],
      ["English language family?", "Germanic", "Romance", "Slavic", "Semitic"],
      ["Spanish 'Biblioteca' meaning?", "Library", "Discotheque", "School", "Church"],
      ["Which language uses the Cyrillic alphabet?", "Russian", "Greek", "Arabic", "Hebrew"],
      ["What is the official language of Egypt?", "Arabic", "Coptic", "English", "French"]
    ],
    advanced: [
      ["Word that sounds like what it describes?", "Onomatopoeia", "Hyperbole", "Oxymoron", "Palindrome"],
      ["Example of a ConLang?", "Esperanto", "Swahili", "Finnish", "Vietnamese"],
      ["Number of UN official languages?", "6", "5", "4", "7"],
      ["What is a 'portmanteau'?", "A word blending two meanings", "A synonym", "A specific verb tense", "An archaic noun"],
      ["Which language is the root of the Romance languages?", "Latin", "Greek", "Sanskrit", "Hebrew"]
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
  { id: 'futa_eng', title: 'FUTA Engineering', icon: GraduationCap, color: 'text-emerald-400' },
  { id: 'science', title: 'Science', icon: Brain, color: 'text-blue-400' },
  { id: 'tech', title: 'Tech & Math', icon: Cpu, color: 'text-indigo-400' },
  { id: 'history', title: 'History', icon: BookOpen, color: 'text-amber-600' },
  { id: 'funfact', title: 'Fun Facts', icon: Lightbulb, color: 'text-yellow-400' },
  { id: 'entertainment', title: 'Entertainment', icon: Film, color: 'text-purple-400' },
  { id: 'sports', title: 'Sports', icon: SportIcon, color: 'text-orange-500' },
  { id: 'languages', title: 'Languages', icon: Languages, color: 'text-pink-400' },
  { id: 'lore', title: 'Ordverse Lore', icon: Swords, color: 'text-rose-500' }
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

  const bgMusic = useRef(new Audio('/music.mp3'));
  const correctSfx = useRef(new Audio('/correct.mp3'));
  const wrongSfx = useRef(new Audio('/wrong.mp3'));

  useEffect(() => {
    const s1 = localStorage.getItem('nexus_stats');
    const s2 = localStorage.getItem('nexus_settings');
    if (s1) setStats(JSON.parse(s1));
    if (s2) setSettings(JSON.parse(s2));
    bgMusic.current.loop = true;
    bgMusic.current.volume = 0.3;
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

  const startQuiz = (diffId, timeMode = false) => {
    setIsTimeAttack(timeMode);
    setTimeLeft(60);
    setSelectedDifficulty(diffId);
    let qList = quizData[selectedSubject.id][diffId];
    
    // FIX: Pull 10 or 20 questions based on mode, but only as many as exist!
    const limit = Math.min(qList.length, timeMode ? 20 : 10);
    const randomized = [...qList].sort(() => Math.random() - 0.5).slice(0, limit).map(q => ({
      ...q, options: [...q.options].sort(() => Math.random() - 0.5)
    }));
    
    setQuestions(randomized);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  const finishQuiz = (finalScore) => {
    const xpGain = isTimeAttack ? finalScore * 20 : finalScore * 10;
    const newStats = { totalXp: stats.totalXp + xpGain, completed: stats.completed + 1 };
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
      if (settings.sfxEnabled) correctSfx.current.play();
      if (settings.hapticsEnabled) await Haptics.notification({ type: NotificationType.Success });
    } else {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[85vh]">
        <h2 className="text-2xl font-black mb-6 flex items-center">{Icon && <Icon className={`mr-3 ${iconColor}`} />} {title}</h2>
        {children}
        <button onClick={onClose} className="w-full mt-8 py-4 bg-slate-800 rounded-xl font-bold">Close</button>
      </div>
    </div>
  );

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

      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2" onClick={() => setGameState('subject_select')}>
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg"><Brain className="text-white" size={20} /></div>
          <span className="text-xl font-black italic">NexusQuiz</span>
        </div>
        <div className="flex space-x-2">
           <button onClick={() => setShowVault(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Book size={20} className="text-emerald-400"/></button>
           <button onClick={() => setGameState('leaderboard')} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><BarChart3 size={20} className="text-purple-400"/></button>
           <button onClick={() => setShowSettings(true)} className="p-2 bg-slate-900 rounded-xl border border-slate-800"><Settings size={20}/></button>
        </div>
      </div>

      {gameState === 'subject_select' && (
        <div className="w-full max-w-2xl space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 flex justify-around">
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Total XP</p><p className="font-bold text-emerald-400">{stats.totalXp}</p></div>
            <div className="text-center"><p className="text-[10px] text-slate-500 uppercase">Completed</p><p className="font-bold text-blue-400">{stats.completed}</p></div>
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
        </div>
      )}

      {gameState === 'difficulty_select' && (
        <div className="w-full max-w-sm space-y-4 text-center">
           <h2 className="text-2xl font-black mb-6 text-blue-400">{selectedSubject.title}</h2>
           <button onClick={() => startQuiz('foundational', false)} className="w-full p-5 bg-slate-900 border border-slate-800 rounded-2xl font-bold">Standard Mode (10Q)</button>
           <button onClick={() => startQuiz('foundational', true)} className="w-full p-5 bg-orange-500/10 border border-orange-500/40 text-orange-400 rounded-2xl font-bold flex items-center justify-center">
             <Zap size={20} className="mr-2"/> Time Attack (60s)
           </button>
           <button onClick={() => setGameState('subject_select')} className="w-full py-4 text-slate-600 font-bold">Back to Hub</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full max-w-xl text-center">
          <div className="flex justify-between items-center mb-10">
            <div className="h-2 flex-1 bg-slate-800 rounded-full mr-4 overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-300" style={{width: `${(currentIndex/questions.length)*100}%`}} />
            </div>
            {isTimeAttack && <div className="text-orange-400 font-black flex items-center"><Timer size={18} className="mr-1"/>{timeLeft}s</div>}
          </div>
          <h2 className="text-2xl font-bold mb-10 leading-snug">{questions[currentIndex]?.text}</h2>
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
        <div className="text-center p-10 bg-slate-900 border border-slate-800 rounded-[40px] w-full max-w-sm">
          <Trophy className="mx-auto mb-4 text-amber-400" size={80} />
          <h2 className="text-3xl font-black mb-2 text-white">Quiz Over!</h2>
          <p className="text-6xl font-black my-8 text-white">{score}<span className="text-xl text-slate-700">/{questions.length}</span></p>
          <button onClick={() => setGameState('subject_select')} className="w-full py-5 bg-blue-600 rounded-2xl font-black text-xl shadow-lg">Return to Hub</button>
        </div>
      )}

      {gameState === 'leaderboard' && (
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-black mb-8 flex items-center"><Users className="mr-3 text-purple-400" /> Hall of Fame</h2>
          <div className="space-y-3">
            <div className="p-5 bg-blue-500/10 border border-blue-500/40 rounded-3xl flex justify-between items-center text-left">
              <div><p className="font-bold">You (Chemical Engineer)</p><p className="text-xs text-blue-400 italic">Level {Math.floor(stats.totalXp/100)}</p></div>
              <p className="text-2xl font-black text-white">{stats.totalXp} XP</p>
            </div>
            {[{n: "Nichothéos", x: 99999}, {n: "FUTA Dean", x: 25000}, {n: "Akure_Dev", x: 12000}].map((u, i) => (
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
