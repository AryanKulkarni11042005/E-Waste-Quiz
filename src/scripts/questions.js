const questions = [
    {
        question: "What is e-waste?",
        choices: [
            "Waste generated from electronic and electrical equipment",
            "Waste generated from energy production",
            "Waste that can be recycled electronically",
            "Waste that cannot be decomposed"
        ],
        answer: 1,
        explanation: "E-waste refers to electronic waste, which includes discarded electronic devices and equipment such as computers, televisions, smartphones, and household appliances."
    },
    {
        question: "Which of the following is NOT typically considered e-waste?",
        choices: [
            "Old smartphones",
            "Broken televisions",
            "Paper documents",
            "Obsolete computer monitors"
        ],
        answer: 3,
        explanation: "Paper documents are not considered e-waste as they are not electronic or electrical equipment."
    },
    {
        question: "What toxic substance is commonly found in older CRT monitors and TVs?",
        choices: [
            "Mercury",
            "Lead",
            "Cadmium",
            "Arsenic"
        ],
        answer: 2,
        explanation: "CRT (Cathode Ray Tube) monitors and TVs contain significant amounts of lead, especially in the glass screen, which can be harmful if not properly disposed of."
    },
    {
        question: "Which country generates the highest volume of e-waste globally?",
        choices: [
            "China",
            "United States",
            "India",
            "Japan"
        ],
        answer: 2,
        explanation: "The United States produces the highest volume of e-waste per country, though China is catching up rapidly."
    },
    {
        question: "What percentage of e-waste is properly recycled worldwide?",
        choices: [
            "About 70-80%",
            "About 50-60%",
            "About 30-40%",
            "Less than 20%"
        ],
        answer: 4,
        explanation: "According to the UN's Global E-waste Monitor, less than 20% of e-waste is formally recycled globally. The rest is improperly disposed of or ends up in landfills."
    },
    {
        question: "Which of the following practices is recommended for proper e-waste management?",
        choices: [
            "Throwing old electronics in regular trash",
            "Burning unwanted electronic devices",
            "Taking electronics to certified e-waste recyclers",
            "Storing old devices indefinitely"
        ],
        answer: 3,
        explanation: "Taking electronics to certified e-waste recyclers ensures that the materials are properly processed and recycled, minimizing environmental impact."
    },
    {
        question: "Which valuable metal is commonly recovered from e-waste?",
        choices: [
            "Titanium",
            "Gold",
            "Platinum",
            "Uranium"
        ],
        answer: 2,
        explanation: "Gold is commonly recovered from electronic circuits and components during e-waste recycling. One ton of circuit boards can contain more gold than one ton of gold ore."
    },
    {
        question: "What is 'urban mining' in the context of e-waste?",
        choices: [
            "Mining operations in urban areas",
            "Extracting valuable metals from e-waste",
            "Digging landfills for buried electronics",
            "Mining beneath city streets"
        ],
        answer: 2,
        explanation: "Urban mining refers to the process of recovering valuable materials from discarded electronics and other waste, essentially treating e-waste as a resource rather than trash."
    },
    {
        question: "Which of the following best describes the concept of 'extended producer responsibility' (EPR)?",
        choices: [
            "Consumers must use electronic products for an extended period",
            "Manufacturers are responsible for properly disposing of their products after consumer use",
            "Recycling companies must extend their services to rural areas",
            "Extended warranty programs for electronic devices"
        ],
        answer: 2,
        explanation: "Extended producer responsibility (EPR) is an approach where manufacturers are responsible for the entire lifecycle of their products, including take-back, recycling, and final disposal."
    },
    {
        question: "What can consumers do to practice the 'reduce' principle with electronics?",
        choices: [
            "Buy new devices only when absolutely necessary",
            "Reduce the amount of time spent using electronics",
            "Use only reduced-size electronics",
            "Always buy reduced-price electronics"
        ],
        answer: 1,
        explanation: "The 'reduce' principle encourages consumers to minimize waste by buying new devices only when necessary, extending the life of current devices, and avoiding unnecessary upgrades."
    },
    {
        question: "Which hazardous substance found in some batteries can contaminate soil and water if improperly disposed?",
        choices: [
            "Sodium",
            "Calcium",
            "Cadmium",
            "Potassium"
        ],
        answer: 3,
        explanation: "Cadmium, found in some rechargeable batteries, is highly toxic and can contaminate soil and water if batteries are improperly disposed of in landfills."
    },
    {
        question: "What is the primary environmental benefit of recycling e-waste?",
        choices: [
            "It creates more landfill space",
            "It reduces the need for mining raw materials",
            "It eliminates the need for electronic devices",
            "It produces energy from waste"
        ],
        answer: 2,
        explanation: "Recycling e-waste reduces the need for mining raw materials, which helps conserve natural resources and reduces environmental damage caused by mining operations."
    }
];


// E-waste riddles for the quiz
const riddles = [
    {
        question: "I once gave power, now I'm flat,<br>Toss me right—don't squash me flat!<br>What am I?",
        answer: "battery",
        hint: "You use me in remotes and many portable devices."
    },
    {
        question: "Old and cracked, I've lost my zing,<br>Don't trash me—I'm a recycling thing!<br>What am I?",
        answer: "mobile",
        hint: "You use me to call and text people."
    },
    {
        question: "I'm not a book, but I have pages,<br>Toss me right, not in cages.<br>What am I?",
        answer: "laptop",
        hint: "I'm portable and have a keyboard."
    },
    {
        question: "Ink is gone, my job is done,<br>But in e-waste, I still belong!<br>What am I?",
        answer: "printer",
        hint: "I put your digital documents on paper."
    },
    {
        question: "I cool your food both day and night,<br>Don't dump me—recycle me right!<br>What am I?",
        answer: "fridge",
        hint: "I keep your food cold and fresh."
    },
    {
        question: "I help you click, I help you scroll,<br>But in the trash? That's not my goal!<br>What am I?",
        answer: "mouse",
        hint: "You move me on your desk to navigate your computer."
    },
    {
        question: "Music's my thing, I play it loud,<br>But recycle me—I'd be proud!<br>What am I?",
        answer: "headphones",
        hint: "I sit on your ears to let you listen privately."
    }
];

export default riddles;