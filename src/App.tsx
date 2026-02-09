import logo from "./assets/logo.png";
import Header from "./components/Header";
import { useState, useEffect } from "react";
import {
    BookOpen,
    Award,
    CheckCircle,
    Edit2,
    Save,
    X,
    Clock,
    Plus,
    Lock,
    Unlock,
} from "lucide-react";

interface PaystackResponse {
    reference: string;
    status: string;
    message: string;
    trans: string;
    transaction: string;
    trxref: string;
}

declare global {
    interface Window {
        PaystackPop: {
            setup: (config: {
                key: string;
                email: string;
                amount: number;
                currency: string;
                reference: string;
                onClose: () => void;
                callback: (response: PaystackResponse) => void;
            }) => { openIframe: () => void };
        };
    }
}

type BibleVersions = {
    KJV: string;
    NKJV: string;
    NIV: string;
    ESV: string;
    AMP: string;
    NLT: string;
};

type ScriptureDB = Record<string, BibleVersions>;

const initialScriptureDB: ScriptureDB = {
  "Matthew 7:7": {
    KJV: "7 Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you:",
    NKJV: "7 “Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.",
    NIV: "7 “Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.",
    ESV: "7 “Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.",
    AMP: "7 “Ask and keep on asking and it will be given to you; seek and keep on searching and you will find; knock and keep on knocking and the door will be opened to you.",
    NLT: "7 “Keep on asking, and you will receive what you ask for. Keep on seeking, and you will find. Keep on knocking, and the door will be opened to you."
  },
  "Matthew 7:8": {
    KJV: "8 For every one that asketh receiveth; and he that seeketh findeth; and to him that knocketh it shall be opened.",
    NKJV: "8 For everyone who asks receives, and he who seeks finds, and to him who knocks it will be opened.",
    NIV: "8 For everyone who asks receives; the one who seeks finds; and to the one who knocks, the door will be opened.",
    ESV: "8 For everyone who asks receives, and the one who seeks finds, and to the one who knocks it will be opened.",
    AMP: "8 For everyone who keeps on asking receives, and he who keeps on seeking finds, and to him who keeps on knocking, it will be opened.",
    NLT: "8 For everyone who asks, receives. Everyone who seeks, finds. And to everyone who knocks, the door will be opened."
  },
  "1 Kings 18:41": {
    KJV: "41 And Elijah said unto Ahab, Get thee up, eat and drink; for there is a sound of abundance of rain.",
    NKJV: "41 Then Elijah said to Ahab, “Go up, eat and drink; for there is the sound of abundance of rain.”",
    NIV: "41 And Elijah said to Ahab, “Go, eat and drink, for there is the sound of a heavy rain.”",
    ESV: "41 And Elijah said to Ahab, “Go up, eat and drink, for there is a sound of the rushing of rain.”",
    AMP: "41 Elijah said to Ahab, “Go up, eat and drink, for there is the sound of the roar of an abundance of rain.”",
    NLT: "41 Then Elijah said to Ahab, “Go on up and have a food and drink, for I hear a mighty rainstorm coming!”"
  },
  "1 Kings 18:42": {
    KJV: "42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he cast himself down upon the earth, and put his face between his knees,",
    NKJV: "42 So Ahab went up to eat and drink. And Elijah went up to the top of Carmel; then he bowed down on the ground, and put his face between his knees,",
    NIV: "42 So Ahab went off to eat and drink, but Elijah climbed to the top of Carmel, bent down to the ground and put his face between his knees.",
    ESV: "42 So Ahab went up to eat and to drink. And Elijah went up to the top of Mount Carmel. And he bowed himself down on the earth and put his face between his knees.",
    AMP: "42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he crouched down on the earth and put his face between his knees,",
    NLT: "42 So Ahab went to eat and drink. But Elijah climbed to the top of Mount Carmel and bowed low to the ground and prayed with his face between his knees."
  },
  "1 Kings 18:41-42": {
    KJV: "41 And Elijah said unto Ahab, Get thee up, eat and drink; for there is a sound of abundance of rain. 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he cast himself down upon the earth, and put his face between his knees,",
    NKJV: "41 Then Elijah said to Ahab, “Go up, eat and drink; for there is the sound of abundance of rain.” 42 So Ahab went up to eat and drink. And Elijah went up to the top of Carmel; then he bowed down on the ground, and put his face between his knees,",
    NIV: "41 And Elijah said to Ahab, “Go, eat and drink, for there is the sound of a heavy rain.” 42 So Ahab went off to eat and drink, but Elijah climbed to the top of Carmel, bent down to the ground and put his face between his knees.",
    ESV: "41 And Elijah said to Ahab, “Go up, eat and drink, for there is a sound of the rushing of rain.” 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Mount Carmel. And he bowed himself down on the earth and put his face between his knees.",
    AMP: "41 Elijah said to Ahab, “Go up, eat and drink, for there is the sound of the roar of an abundance of rain.” 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he crouched down on the earth and put his face between his knees,",
    NLT: "41 Then Elijah said to Ahab, “Go on up and have a food and drink, for I hear a mighty rainstorm coming!” 42 So Ahab went to eat and drink. But Elijah climbed to the top of Mount Carmel and bowed low to the ground and prayed with his face between his knees."
  },
  "1 Kings 18:41-46": {
    KJV: "41 And Elijah said unto Ahab, Get thee up, eat and drink; for there is a sound of abundance of rain. 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he cast himself down upon the earth, and put his face between his knees, 43 And said to his servant, Go up now, look toward the sea. And he went up, and looked, and said, There is nothing. And he said, Go again seven times. 44 And it came to pass at the seventh time, that he said, Behold, there ariseth a little cloud out of the sea, like a man's hand. And he said, Go up, say unto Ahab, Prepare thy chariot, and get thee down, that the rain stop thee not. 45 And it came to pass in the mean while, that the heaven was black with clouds and wind, and there was a great rain. And Ahab rode, and went to Jezreel. 46 And the hand of the Lord was on Elijah; and he girded up his loins, and ran before Ahab to the entrance of Jezreel.",
    NKJV: "41 Then Elijah said to Ahab, “Go up, eat and drink; for there is the sound of abundance of rain.” 42 So Ahab went up to eat and drink. And Elijah went up to the top of Carmel; then he bowed down on the ground, and put his face between his knees, 43 and said to his servant, “Go up now, look toward the sea.” So he went up and looked, and said, “There is nothing.” And seven times he said, “Go again.” 44 Then it came to pass the seventh time, that he said, “There is a cloud, as small as a man’s hand, rising out of the sea!” So he said, “Go up, say to Ahab, ‘Prepare your chariot, and go down before the rain stops you.’” 45 Now it happened in the meantime that the sky became black with clouds and wind, and there was a heavy rain. So Ahab rode away and went to Jezreel. 46 Then the hand of the Lord came upon Elijah; and he girded up his loins and ran ahead of Ahab to the entrance of Jezreel.",
    NIV: "41 And Elijah said to Ahab, “Go, eat and drink, for there is the sound of a heavy rain.” 42 So Ahab went off to eat and drink, but Elijah climbed to the top of Carmel, bent down to the ground and put his face between his knees. 43 “Go and look toward the sea,” he told his servant. And he went up and looked. “There is nothing there,” he said. Seven times Elijah said, “Go back.” 44 The seventh time the servant reported, “A cloud as small as a man’s hand is rising from the sea.” So Elijah said, “Go and tell Ahab, ‘Hitch up your chariot and go down before the rain stops you.’” 45 Meanwhile, the sky grew black with clouds, the wind rose, a heavy rain started falling and Ahab rode off to Jezreel. 46 The power of the Lord came on Elijah and, tucking his cloak into his belt, he ran ahead of Ahab all the way to Jezreel.",
    ESV: "41 And Elijah said to Ahab, “Go up, eat and drink, for there is a sound of the rushing of rain.” 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Mount Carmel. And he bowed himself down on the earth and put his face between his knees. 43 And he said to his servant, “Go up now, look toward the sea.” And he went up and looked and said, “There is nothing.” And he said, “Go again,” seven times. 44 And at the seventh time he said, “Behold, a little cloud like a man's hand is rising from the sea.” And he said, “Go up, say to Ahab, ‘Prepare your chariot and go down, lest the rain stop you.’” 45 And in a little while the heavens grew black with clouds and wind, and there was a great rain. And Ahab rode and went to Jezreel. 46 And the hand of the Lord was on Elijah, and he gathered up his garment and ran before Ahab to the entrance of Jezreel.",
    AMP: "41 Elijah said to Ahab, “Go up, eat and drink, for there is the sound of the roar of an abundance of rain.” 42 So Ahab went up to eat and to drink. And Elijah went up to the top of Carmel; and he crouched down on the earth and put his face between his knees, 43 and said to his servant, “Go up now, look toward the sea.” So he went up and looked and said, “There is nothing.” Elijah said, “Go again” seven times. 44 And at the seventh time the servant said, “A cloud as small as a man’s hand is rising from the sea.” And Elijah said, “Go up, say to Ahab, ‘Prepare your chariot and go down, so that the rain does not stop you.’” 45 In a little while the sky grew black with clouds and wind, and there was a heavy rain. And Ahab rode and went to Jezreel. 46 Then the hand of the Lord was on Elijah [giving him supernatural strength]; he girded up his loins and outran Ahab to the entrance of Jezreel [nearly twenty miles].",
    NLT: "41 Then Elijah said to Ahab, “Go on up and have a food and drink, for I hear a mighty rainstorm coming!” 42 So Ahab went to eat and drink. But Elijah climbed to the top of Mount Carmel and bowed low to the ground and prayed with his face between his knees. 43 Then he said to his servant, “Go and look out toward the sea.” The servant went and looked, then returned to Elijah and said, “I didn’t see anything.” Seven times Elijah told him to go and look. 44 Finally the seventh time, his servant told him, “I saw a little cloud about the size of a man’s hand rising from the sea.” Then Elijah shouted, “Hurry to Ahab and tell him, ‘Climb into your chariot and go back home. If you don’t hurry, the rain will stop you!’” 45 And soon the sky was black with clouds. A heavy wind brought a terrific rainstorm, and Ahab left quickly for Jezreel. 46 Then the Lord gave special strength to Elijah. He tucked his cloak into his belt and ran ahead of Ahab’s chariot all the way to the entrance of Jezreel."
  },
  "1 John 5:14": {
    KJV: "14 And this is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us:",
    NKJV: "14 Now this is the confidence that we have in Him, that if we ask anything according to His will, He hears us.",
    NIV: "14 This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.",
    ESV: "14 And this is the confidence that we have toward him, that if we ask anything according to his will he hears us.",
    AMP: "14 This is the [remarkable degree of] confidence which we have in Him, that if we ask anything according to His will, [that is, consistent with His plan and purpose] He hears us.",
    NLT: "14 And we are confident that he hears us whenever we ask for anything that pleases him."
  },
  "Isaiah 2:2-3": {
    KJV: "2 And it shall come to pass in the last days, that the mountain of the Lord's house shall be established in the top of the mountains, and shall be exalted above the hills; and all nations shall flow unto it. 3 And many people shall go and say, Come ye, and let us go up to the mountain of the Lord, to the house of the God of Jacob; and he will teach us of his ways, and we will walk in his paths: for out of Zion shall go forth the law, and the word of the Lord from Jerusalem.",
    NKJV: "2 Now it shall come to pass in the latter days That the mountain of the Lord’s house Shall be established on the top of the mountains, And shall be exalted above the hills; And all nations shall flow to it. 3 Many people shall come and say, “Come, and let us go up to the mountain of the Lord, To the house of the God of Jacob; He will teach us His ways, And we will walk in His paths.” For out of Zion shall go forth the law, And the word of the Lord from Jerusalem.",
    NIV: "2 In the last days the mountain of the Lord’s temple will be established as the highest of the mountains; it will be shifted above the hills, and all nations will stream to it. 3 Many peoples will come and say, “Come, let us go up to the mountain of the Lord, to the temple of the God of Jacob. He will teach us his ways, so that we may walk in his paths.” The law will go out from Zion, the word of the Lord from Jerusalem.",
    ESV: "2 It shall come to pass in the latter days that the mountain of the house of the Lord shall be established as the highest of the mountains, and shall be lifted up above the hills; and all the nations shall flow to it, 3 and many peoples shall come, and say: “Come, let us go up to the mountain of the Lord, to the house of the God of Jacob, that he may teach us his ways and that we may walk in his paths.” For out of Zion shall go forth the law, and the word of the Lord from Jerusalem.",
    AMP: "2 Now it will come to pass in the last days that the mountain of the house of the Lord will be established as the highest of the mountains and will be raised above the hills; and all the nations will stream to it. 3 And many peoples will come and say, “Come, let us go up to the mountain of the Lord, to the house of the God of Jacob; that He may teach us His ways and that we may walk in His paths.” For the law will go out from Zion and the word of the Lord from Jerusalem.",
    NLT: "2 In the last days, the mountain of the Lord’s house will be the highest of all—the most important place on earth. It will be raised above the other hills, and people from all over the world will stream there to worship. 3 People from many nations will come and say, “Come, let us go up to the mountain of the Lord, to the house of Jacob’s God. There he will teach us his ways, and we will walk in his paths.” For the Lord’s teaching will go out from Zion; his word will go out from Jerusalem."
  },
  "Micah 4:1-2": {
    KJV: "1 But in the last days it shall come to pass, that the mountain of the house of the Lord shall be established in the top of the mountains, and it shall be exalted above the hills; and people shall flow unto it. 2 And many nations shall come, and say, Come, and let us go up to the mountain of the Lord, and to the house of the God of Jacob; and he will teach us of his ways, and we will walk in his paths: for the law shall go forth of Zion, and the word of the Lord from Jerusalem.",
    NKJV: "1 Now it shall come to pass in the latter days That the mountain of the Lord’s house Shall be established on the top of the mountains, And shall be exalted above the hills; And peoples shall flow to it. 2 Many nations shall come and say, “Come, and let us go up to the mountain of the Lord, To the house of the God of Jacob; He will teach us His ways, And we will walk in His paths.” For out of Zion the law shall go forth, And the word of the Lord from Jerusalem.",
    NIV: "1 In the last days the mountain of the Lord’s temple will be established as the highest of the mountains; it will be exalted above the hills, and peoples will stream to it. 2 Many nations will come and say, “Come, let us go up to the mountain of the Lord, to the temple of the God of Jacob. He will teach us his ways, so that we may walk in his paths.” The law will go out from Zion, the word of the Lord from Jerusalem.",
    ESV: "1 It shall come to pass in the latter days that the mountain of the house of the Lord shall be established as the highest of the mountains, and it shall be lifted up above the hills; and peoples shall flow to it, 2 and many nations shall come, and say: “Come, let us go up to the mountain of the Lord, to the house of the God of Jacob, that he may teach us his ways and that we may walk in his paths.” For out of Zion shall go forth the law, and the word of the Lord from Jerusalem.",
    AMP: "1 But it shall come to pass in the last days that the mountain of the house of the Lord shall be established as the highest of the mountains; and it shall be exalted above the hills, and peoples shall stream to it. 2 And many nations shall come and say, “Come, let us go up to the mountain of the Lord and to the house of the God of Jacob, that He may teach us His ways and that we may walk in His paths.” For the law shall go forth from Zion and the word of the Lord from Jerusalem.",
    NLT: "1 In the last days, the mountain of the Lord’s house will be the highest of all—the most important place on earth. It will be raised above the other hills, and people from all over the world will stream there to worship. 2 People from many nations will come and say, “Come, let us go up to the mountain of the Lord, to the house of Jacob’s God. There he will teach us his ways, and we will walk in his paths.” For the Lord’s teaching will go out from Zion; his word will go out from Jerusalem."
  }
};

const quizQuestions = [
    {
        q: "According to the introduction, what has caused some believers to consider leaving God?",
        a: [
            "Lack of church attendance",
            "Discouragement from unanswered prayers",
            "Persecution from the government",
            "Loss of material possessions"
        ],
        correct: 1
    },
    {
        q: "What spiritual principle is taught by Elijah praying after declaring the coming rain?",
        a: [
            "Faith replaces prayer",
            "Miracles happen automatically",
            "Declarations must be backed by persistent prayer",
            "Prophets never need to pray"
        ],
        correct: 2
    },
    {
        q: "Why was Ahab unable to eat before Elijah’s good news?",
        a: [
            "He was observing a religious fast",
            "He was troubled by the suffering caused by the drought",
            "He had no food in the palace",
            "He was sick"
        ],
        correct: 1
    },
    {
        q: "What does the lesson suggest is necessary for some prayers to be answered?",
        a: [
            "Waiting for a prophet to pray for you",
            "Offering large sacrifices",
            "Coming to the spiritual equivalent of Mt. Carmel",
            "Changing your location physically"
        ],
        correct: 2
    },
    {
        q: "What is the deeper meaning of Elijah being ‘buried in prayer’?",
        a: [
            "Repeating the same words",
            "Avoiding public worship",
            "Praying only in secret places",
            "Complete humility and total concentration before God"
        ],
        correct: 3
    },
    {
        q: "What condition in Israel led to the three and a half years of closed heavens?",
        a: [
            "Natural climate change",
            "Their transgressions",
            "Enemy attacks",
            "Poor leadership alone"
        ],
        correct: 1
    },
    {
        q: "According to the lesson, what must accompany revelations from God?",
        a: [
            "Immediate celebration",
            "Prayer that removes obstacles",
            "Public announcements",
            "Fasting only"
        ],
        correct: 1
    },
    {
        q: "What key spiritual danger is highlighted in the introduction?",
        a: [
            "Praying too often",
            "Overconfidence in prayer",
            "Turning away from God due to discouragement",
            "Trusting prophets too much"
        ],
        correct: 2
    },
    {
        q: "What does Elijah’s example teach about delayed answers to prayer?",
        a: [
            "Delays mean God has rejected the prayer",
            "Prayer is unnecessary after prophecy",
            "Only sinners experience delays",
            "Even great prophets must pray persistently"
        ],
        correct: 3
    },
    {
        q: "What condition must a believer meet for God to work through them according to the conclusion?",
        a: [
            "They must perform miracles",
            "They must not faint or give up",
            "They must be prophets",
            "They must live on a mountain"
        ],
        correct: 1
    }
];



const SundaySchoolApp = () => {
    const [showPaymentGate, setShowPaymentGate] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [activeTab, setActiveTab] = useState("intro");
    const [darkMode, setDarkMode] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [loading, setLoading] = useState(false);
    const [appLoading, setAppLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [scriptureDB, setScriptureDB] =
        useState<ScriptureDB>(initialScriptureDB);
    const [selectedVerse, setSelectedVerse] = useState<string | null>(null);
    const [bibleVersion, setBibleVersion] =
        useState<keyof BibleVersions>("KJV");
    const [showVerseModal, setShowVerseModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [newVerse, setNewVerse] = useState<{
        reference: string;
        versions: BibleVersions;
    }>({
        reference: "",
        versions: { KJV: "", NKJV: "", NIV: "", ESV: "", AMP: "", NLT: "" },
    });
    const [verseLoading, setVerseLoading] = useState(false);
    const [quizActive, setQuizActive] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(50);
    const [showResults, setShowResults] = useState(false);
    const [faithRating, setFaithRating] = useState(5);
    const [commitments, setCommitments] = useState<
        Array<{ text: string; date: string }>
    >([]);
    const [commitmentInput, setCommitmentInput] = useState("");
    const [editingContent, setEditingContent] = useState<string | null>(null);

    type SubPoint = { title: string; content: string; scripture?: string };
    type LessonPoint = {
        title: string;
        content: string;
        scriptures: string[];
        subPoints: SubPoint[];
    };
    type ContentData = {
        lessonDate: string;
        lessonTitle: string;
        memoryVerse: string;
        memoryVerseRef: string;
        introduction: string;
        introScriptures: string[];
        lessonIntroScriptures: string[];
        aims: string;
        objectives: string;
        lessonIntro: string;
        lessonPoints: LessonPoint[];
        conclusion: string;
        conclusionScriptures: string[];
        prayerPoints: string[];
    };
    

    const [contentData, setContentData] = useState<ContentData>({
        lessonDate: "February 15, 2026",
        lessonTitle: "Praying Until Something Happens (Part 1)",

        memoryVerse:
            "For everyone that asketh receiveth; and he that seeketh findeth; and to him that knocketh it shall be opened. - Matt. 7:8",
        memoryVerseRef: "Matthew 7:8",

        introScriptures: ["1 John 5:14", "Matthew 7:7"],
        lessonIntroScriptures: ["1 Kings 18:41-46"],

        introduction:
            "Even though we were not supposed to hinge our worship to God for His provisions, many children of God have often reached the limit of their endurance due to unanswered prayers. Some people have turned away from God while others are still brooding over the idea of leaving God with excuses of unanswered prayers. If only we could go a little more distance in prayer, our answers will come because prayers done according to His will always enjoy answers – 1 John 5:14; Matt. 7:7.",

        aims:
            "To encourage Christ believers to pray continuously until the results are received.",

        objectives:
            "That Christians be delivered from discouragement and backsliding.",

        lessonIntro:
            "Ahab and Israel had experienced three and half years of closed heavens and economic constraint because of their transgressions but received the best news of that time from Prophet Elijah that it was going to rain. Elijah prayed fervently after declaration until it rained even when it appeared futile enough to be discouraging. Consider the kind of fiery Prophet he was to have delayed answer. (1 Kings 18:41–46)",

        lessonPoints: [
            {
                title: "APPETITE DENIED BY WORRIES:",
                content:
                    "Verse 41 - King Ahab was worried about the agonizing experience of Israel from the closed heaven and hardship. The good news is that right relationship with God and prayers can change conditions.",
                scriptures: ["1 Kings 18:41"],
                subPoints: [],
            },
            {
                title: "REVELATION REQUIRED PRAYER BACK-UP:",
                content:
                    "Verse 41-42 – Elijah heard the sound of rain but didn’t wait for it to fall. He prayed it down. Your revelations require prayers to facilitate or to clear the obstacles.",
                scriptures: ["1 Kings 18:41-42"],
                subPoints: [],
            },
            {
                title: "GOOD NEWS REVIVES:",
                content:
                    "Verse 42 – King Ahab was encouraged by the good news to eat after starving for a long while because of the ugly events in the kingdom. We are under obligation to tell other people about the gospel of hope.",
                scriptures: ["1 Kings 18:42"],
                subPoints: [],
            },
            {
                title: "THE TOP OF THE MT. CARMEL:",
                content:
                    "Verse 42 – Some prayers cannot be answered until you come to the top of Mt. Carmel (the House of the Lord). Isa. 2:2–3; Micah 4:1–2. This is the place where the altar was repaired, where blood was shed, and where the fire fell. If Elijah could recognize that, we need to.",
                scriptures: ["1 Kings 18:42", "Isaiah 2:2-3", "Micah 4:1-2"],
                subPoints: [],
            },
            {
                title: "BURIED IN PRAYER:",
                content:
                    "Verse 42 – Elijah humbled himself before the Lord and was completely buried in prayer. He gave total concentration. He was cut off from the surrounding and the world. He was in turn with divinity. He emptied himself and put on immortality. No wonder his prayers were answered. If we adopt his model, we will surely receive answers to prayers in due time.",
                scriptures: ["1 Kings 18:42"],
                subPoints: [],
            },
        ],

        conclusion:
            "The God of Elijah who sent down fire is also your God, and He is delighted to work through you if you faint not like Elijah didn’t.",

        conclusionScriptures: [],

        prayerPoints: [
            "Father, give me the grace to pray continuously until my answers come.",
            "Lord, deliver me from discouragement and strengthen my faith while I wait for Your answers.",
            "Father, help me to humble myself in prayer and remain persistent like Elijah until something happens.",
        ],
    });






    const formatScriptureText = (text: string) => {
        const parts = text.split(/(\d+)/);
        return parts.map((part, index) => {
            if (/^\d+$/.test(part)) {
                return (
                    <strong key={index} className="font-bold">
                        {part}
                    </strong>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setAppLoading(false), 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => setDarkMode(!darkMode);
    const adjustFontSize = (delta: number) =>
        setFontSize((prev) => Math.min(Math.max(prev + delta, 12), 24));
    const handleTabChange = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            setActiveTab(tab);
            setLoading(false);
        }, 500);
    };

    const showBibleVersions = (reference: string) => {
        setSelectedVerse(reference);
        setShowVerseModal(true);
        setVerseLoading(true);
        setTimeout(() => setVerseLoading(false), 800);
    };

    const changeBibleVersion = (version: keyof BibleVersions) => {
        setVerseLoading(true);
        setTimeout(() => {
            setBibleVersion(version);
            setVerseLoading(false);
        }, 600);
    };

    const addNewScripture = () => {
        if (
            newVerse.reference &&
            Object.values(newVerse.versions).some((v) => v !== "")
        ) {
            setScriptureDB((prev) => ({
                ...prev,
                [newVerse.reference]: newVerse.versions,
            }));
            setNewVerse({
                reference: "",
                versions: {
                    KJV: "",
                    NKJV: "",
                    NIV: "",
                    ESV: "",
                    AMP: "",
                    NLT: "",
                },
            });
            setEditMode(false);
        }
    };

    const updateVerseVersion = (version: keyof BibleVersions, text: string) => {
        setNewVerse((prev) => ({
            ...prev,
            versions: { ...prev.versions, [version]: text },
        }));
    };

    useEffect(() => {
        let timer: ReturnType<typeof setInterval> | undefined;
        if (quizActive && timeLeft > 0 && !showResults) {
            timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endQuiz();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [quizActive, timeLeft, showResults]);

    const startQuiz = () => {
        setQuizActive(true);
        setCurrentQuestion(0);
        setScore(0);
        setTimeLeft(50);
        setShowResults(false);
    };

    const checkAnswer = (choice: number) => {
        if (!quizActive || showResults) return;
        const correct = quizQuestions[currentQuestion].correct === choice;
        const timeBonus = Math.floor(timeLeft / 10);
        const points = correct ? 10 + timeBonus : 0;
        if (correct) setScore((prev) => prev + points);
        if (currentQuestion < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuestion((prev) => prev + 1), 1000);
        } else {
            setTimeout(() => endQuiz(), 1000);
        }
    };

    const endQuiz = () => {
        setQuizActive(false);
        setShowResults(true);
    };

    const addCommitment = () => {
        if (commitmentInput.trim()) {
            setCommitments((prev) => [
                ...prev,
                {
                    text: commitmentInput,
                    date: new Date().toLocaleDateString(),
                },
            ]);
            setCommitmentInput("");
        }
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === "M") {
                e.preventDefault();
                handleTabChange("manage");
            }
            if (e.ctrlKey && e.shiftKey && e.key === "E") {
                e.preventDefault();
                setEditingContent(editingContent ? null : activeTab);
            }
        };
        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [editingContent, activeTab]);

    const updateContent = (field: string, value: string) =>
        setContentData((prev) => ({ ...prev, [field]: value }));
    const updateLessonPoint = (index: number, field: string, value: string) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === index ? { ...point, [field]: value } : point
            ),
        }));
    };
    const updatePrayerPoint = (index: number, value: string) => {
        setContentData((prev) => ({
            ...prev,
            prayerPoints: prev.prayerPoints.map((prayer, i) =>
                i === index ? value : prayer
            ),
        }));
    };
    const updateLessonSubPoint = (
        pointIndex: number,
        subIndex: number,
        field: string,
        value: string
    ) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.map((sub, j) =>
                              j === subIndex ? { ...sub, [field]: value } : sub
                          ),
                      }
                    : point
            ),
        }));
    };
    const addLessonSubPoint = (pointIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: [
                              ...point.subPoints,
                              {
                                  title: "New Point",
                                  content: "",
                                  scripture: "",
                              },
                          ],
                      }
                    : point
            ),
        }));
    };
    const deleteLessonSubPoint = (pointIndex: number, subIndex: number) => {
        setContentData((prev) => ({
            ...prev,
            lessonPoints: prev.lessonPoints.map((point, i) =>
                i === pointIndex
                    ? {
                          ...point,
                          subPoints: point.subPoints.filter(
                              (_, j) => j !== subIndex
                          ),
                      }
                    : point
            ),
        }));
    };
    const addPrayerPoint = () =>
        setContentData((prev) => ({
            ...prev,
            prayerPoints: [...prev.prayerPoints, "New prayer point..."],
        }));

    const PAYSTACK_PUBLIC_KEY =
        "pk_test_bed97038ebcf74b30219ed0500cfffc6e80948f1";
    const PAYMENT_AMOUNT = 500000;

    const handlePaystackSuccess = (reference: unknown) => {
        console.log("Payment successful:", reference);
        setIsPaid(true);
        setShowPaymentGate(false);
    };

    const handlePaystackClose = () => console.log("Payment closed");

    const initializePaystack = () => {
        if (!window.PaystackPop) {
            alert("Paystack script not loaded!");
            return;
        }
        const paystack = window.PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: "user@example.com",
            amount: PAYMENT_AMOUNT,
            currency: "NGN",
            reference: "SSA_" + Math.floor(Math.random() * 1000000000 + 1),
            onClose: () => handlePaystackClose(),
            callback: (transaction: PaystackResponse) =>
                handlePaystackSuccess(transaction),
        });
        paystack.openIframe();
    };

    const handleFreePlan = () => {
        setShowPaymentGate(false);
        setIsPaid(false);
    };

    const themeClasses = darkMode
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-green-900 text-white"
        : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-100 text-gray-900";


        if (appLoading) {
    const animatedText = "Dancing in Fame and Glory".split("");

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center z-50">
            <div className="text-center">
                <div className="relative mb-8">
                    <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="w-40 h-40 rounded-full border-4 border-white/20 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                        ></div>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Life Gate Ministries Worldwide
                </h1>
                <p className="text-xl text-white/90 mb-8">
                    Sunday School Lessons
                </p>

                {/* Single-color glowing neon text */}
                <div className="flex justify-center mb-6 text-3xl md:text-4xl font-extrabold">
                    {animatedText.map((char, idx) => (
                        <span
                            key={idx}
                            className="inline-block text-blue-400 drop-shadow-[0_0_10px_#00ffff] animate-[wave_1.5s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${idx * 0.1}s`,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>

                <div className="text-white/80 mb-6 text-lg animate-pulse">
                    Loading Sunday School Lesson...
                </div>
                <div className="w-64 mx-auto bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300 ease-out shadow-lg"
                        style={{ width: `${loadingProgress}%` }}
                    ></div>
                </div>
                <p className="text-white/70 mt-3 text-sm">
                    {loadingProgress}%
                </p>
            </div>

            {/* Keyframes for smooth wave bounce */}
            <style>
                {`
                    @keyframes wave {
                        0%, 100% { transform: translateY(0); }
                        25% { transform: translateY(-12px); }
                        50% { transform: translateY(8px); }
                        75% { transform: translateY(-6px); }
                    }
                `}
            </style>
        </div>
    );
}




    if (showPaymentGate) {
        return (
            <div
                className={`min-h-screen ${themeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
                    <div
                        className="absolute w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                    <div
                        className="absolute w-64 h-64 bg-pink-500/20 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse"
                        style={{ animationDelay: "2s" }}
                    ></div>
                </div>
                <div className="max-w-4xl w-full relative z-10">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center shadow-2xl border border-white/20">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Sunday School Lesson
                        </h1>
                        <p className="text-xl opacity-80">
                            Praying Until Something Happens (Part 1)
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Free Access
                                    </h3>
                                    <Unlock
                                        className="text-green-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦0
                                    </p>
                                    <p className="opacity-70">View Only Mode</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Read all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-green-400"
                                        />
                                        <span>Take interactive quizzes</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No content editing
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <X size={20} className="text-red-400" />
                                        <span className="opacity-50">
                                            No scripture management
                                        </span>
                                    </li>
                                </ul>
                                <button
                                    onClick={handleFreePlan}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Continue Free
                                </button>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition duration-300 shadow-2xl">
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-2xl font-bold">
                                        Premium Access
                                    </h3>
                                    <Lock
                                        className="text-purple-400"
                                        size={32}
                                    />
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-bold mb-2">
                                        ₦5,000
                                    </p>
                                    <p className="opacity-70">Full Access</p>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Everything in Free</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Edit all lesson content</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Manage Bible scriptures</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Save your commitments</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle
                                            size={20}
                                            className="text-purple-400"
                                        />
                                        <span>Priority support</span>
                                    </li>
                                </ul>
                                <button
                                    onClick={initializePaystack}
                                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl font-semibold text-white shadow-lg transform hover:scale-105 transition duration-300"
                                >
                                    Unlock Premium
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className="text-center mt-8 opacity-70 text-sm">
                        Secure payment powered by Paystack • All transactions
                        are encrypted
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${themeClasses} transition-all duration-500 relative`}
            style={{ fontSize: `${fontSize}px` }}
        >
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-0 left-1/4 animate-pulse"></div>
                <div
                    className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl bottom-0 right-1/4 animate-pulse"
                    style={{ animationDelay: "1s" }}
                ></div>
            </div>
            <Header
                logo={logo}
                contentData={contentData}
                fontSize={fontSize}
                adjustFontSize={adjustFontSize}
                darkMode={darkMode}
                toggleTheme={toggleTheme}
            />
            <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {contentData.lessonTitle}
                </h2>
                <div className="flex gap-2 mb-6 overflow-x-auto flex-nowrap md:flex-wrap justify-start md:justify-center scrollbar-hide backdrop-blur-sm bg-white/5 p-2 rounded-2xl border border-white/10">
                    {[
                        "intro",
                        "lesson",
                        "conclusion",
                        "application",
                        "quiz",
                        "prayer",
                    ].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${
                                activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : darkMode
                                    ? "bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10"
                                    : "bg-black/10 backdrop-blur-md hover:bg-black/20 border border-black/10"
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                    {isPaid && (
                        <button
                            onClick={() => handleTabChange("manage")}
                            className={`px-2 py-3 rounded-xl font-semibold transition-all flex-shrink-0 opacity-0 hover:opacity-10 ${
                                activeTab === "manage"
                                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105"
                                    : "bg-white/10 backdrop-blur-md"
                            }`}
                            title="Admin"
                            style={{ width: "40px" }}
                        >
                            <Edit2 size={16} className="mx-auto" />
                        </button>
                    )}
                </div>
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    </div>
                )}
                {!loading && (
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 md:p-8">
                        {activeTab === "intro" && (
                            <div className="space-y-6">
                                {editingContent === "intro" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-blue-900/30"
                                            : "bg-blue-50"
                                    } p-6 rounded-lg border-l-4 border-blue-600`}
                                >
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="text-blue-600" />{" "}
                                        Memory Verse
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.memoryVerse}
                                            onChange={(e) =>
                                                updateContent(
                                                    "memoryVerse",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border text-xl italic mb-4 ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={2}
                                        />
                                    ) : (
                                        <blockquote className="text-xl italic mb-4">
                                            "{contentData.memoryVerse}"
                                        </blockquote>
                                    )}
                                    <button
                                        onClick={() =>
                                            showBibleVersions(
                                                contentData.memoryVerseRef
                                            )
                                        }
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <BookOpen size={16} />
                                        Read {contentData.memoryVerseRef}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Text: 1 Kings 18:41-46
                                    </h3>
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "1 Kings 18:41-46"
                                                )
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                        >
                                        <BookOpen size={16} />
                                            Read 1 Kings 18:41-46
                                        </button>

                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-3">
                                        Introduction
                                    </h3>
                                    {editingContent === "intro" ? (
                                        <textarea
                                            value={contentData.introduction}
                                            onChange={(e) =>
                                                updateContent(
                                                    "introduction",
                                                    e.target.value
                                                )
                                            }
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                            rows={6}
                                        />
                                    ) : (
                                        <p className="leading-relaxed">
                                            {contentData.introduction}
                                            <div className="flex gap-4">
                                                <button
                                                onClick={() =>
                                                    showBibleVersions(
                                                        "1 John 5:14"
                                                    )
                                                }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                            >
                                            <BookOpen size={16} />
                                                1 John 5:14
                                            </button>

                                            <button
                                            onClick={() =>
                                                showBibleVersions(
                                                    "Matthew 7:7"
                                                )
                                            }
                                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mt-2 rounded-lg transition flex items-center gap-2 text-sm"
                                        >
                                            <BookOpen size={16} />
                                                Matthew 7:7
                                            </button>
                                            </div>
                                            
                                        </p>
                                        
                                    )}
                                   
                                </div>
                                <div
                                    className={`${
                                        darkMode
                                            ? "bg-green-900/30"
                                            : "bg-green-50"
                                    } p-6 rounded-lg`}
                                >
                                    <h3 className="text-xl font-bold mb-3">
                                        Aims and Objectives
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                AIMS:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={contentData.aims}
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "aims",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={3}
                                                />
                                            ) : (
                                                <p>{contentData.aims}</p>
                                            )}
                                        </div>
                                        <div>
                                            <strong className="text-green-700 dark:text-green-400">
                                                OBJECTIVES:
                                            </strong>
                                            {editingContent === "intro" ? (
                                                <textarea
                                                    value={
                                                        contentData.objectives
                                                    }
                                                    onChange={(e) =>
                                                        updateContent(
                                                            "objectives",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`w-full px-3 py-2 rounded-lg border mt-2 ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                    rows={2}
                                                />
                                            ) : (
                                                <p>{contentData.objectives}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "lesson" && (
                            <div className="space-y-6">
                                {editingContent === "lesson" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Lesson Content
                                </h3>
                                {editingContent === "lesson" ? (
                                    <textarea
                                        value={contentData.lessonIntro}
                                        onChange={(e) =>
                                            updateContent(
                                                "lessonIntro",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border mb-4 ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={3}
                                    />
                                ) : (
                                    <p className="leading-relaxed mb-4">
                                        {contentData.lessonIntro}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.lessonIntroScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                    
                                        </div>
                                        
                                    </p>
                                    
                                )}
                                <div className="space-y-6">
                                    {contentData.lessonPoints.map(
                                        (section, idx) => (
                                            <div
                                                key={idx}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-gray-50"
                                                } p-5 rounded-lg`}
                                            >
                                                {editingContent === "lesson" ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={
                                                                section.title
                                                            }
                                                            onChange={(e) =>
                                                                updateLessonPoint(
                                                                    idx,
                                                                    "title",
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className={`w-full px-3 py-2 rounded-lg border mb-3 text-xl font-semibold ${
                                                                darkMode
                                                                    ? "bg-gray-800 border-gray-600"
                                                                    : "bg-white border-gray-300"
                                                            }`}
                                                        />
                                                        {section.content && (
                                                            <textarea
                                                                value={
                                                                    section.content
                                                                }
                                                                onChange={(e) =>
                                                                    updateLessonPoint(
                                                                        idx,
                                                                        "content",
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`w-full px-3 py-2 rounded-lg border mb-3 ${
                                                                    darkMode
                                                                        ? "bg-gray-800 border-gray-600"
                                                                        : "bg-white border-gray-300"
                                                                }`}
                                                                rows={3}
                                                            />
                                                        )}
                                                        <div className="ml-6 space-y-3 mt-3">
                                                            {section.subPoints.map(
                                                                (
                                                                    subPoint,
                                                                    subIdx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            subIdx
                                                                        }
                                                                        className={`${
                                                                            darkMode
                                                                                ? "bg-gray-800"
                                                                                : "bg-white"
                                                                        } p-3 rounded-lg`}
                                                                    >
                                                                        <div className="flex justify-between items-start mb-2">
                                                                            <span className="text-sm font-bold text-yellow-600">
                                                                                {String.fromCharCode(
                                                                                    97 +
                                                                                        subIdx
                                                                                )}

                                                                                .
                                                                            </span>
                                                                            <button
                                                                                onClick={() =>
                                                                                    deleteLessonSubPoint(
                                                                                        idx,
                                                                                        subIdx
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:text-red-800"
                                                                            >
                                                                                <X
                                                                                    size={
                                                                                        16
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.title
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "title",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point title"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm font-semibold ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                        <textarea
                                                                            value={
                                                                                subPoint.content
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "content",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Sub-point content"
                                                                            className={`w-full px-3 py-1 rounded border mb-2 text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                            rows={
                                                                                2
                                                                            }
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={
                                                                                subPoint.scripture ||
                                                                                ""
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                updateLessonSubPoint(
                                                                                    idx,
                                                                                    subIdx,
                                                                                    "scripture",
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                            placeholder="Scripture reference (optional)"
                                                                            className={`w-full px-3 py-1 rounded border text-sm ${
                                                                                darkMode
                                                                                    ? "bg-gray-700 border-gray-600"
                                                                                    : "bg-gray-50 border-gray-300"
                                                                            }`}
                                                                        />
                                                                    </div>
                                                                )
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    addLessonSubPoint(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                                                            >
                                                                <Plus
                                                                    size={14}
                                                                />{" "}
                                                                Add Sub-point
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <h4 className="text-xl font-semibold mb-2">
                                                            {idx + 1}.{" "}
                                                            {section.title}
                                                        </h4>
                                                        {section.content && (
                                                            <p className="leading-relaxed mb-3">
                                                                {
                                                                    section.content
                                                                }
                                                            </p>
                                                        )}
                                                        {section.scriptures &&
                                                            section.scriptures
                                                                .length > 0 && (
                                                                <div className="mt-3 flex flex-wrap gap-2">
                                                                    {section.scriptures.map(
                                                                        (
                                                                            scripture
                                                                        ) => (
                                                                            <button
                                                                                key={
                                                                                    scripture
                                                                                }
                                                                                onClick={() =>
                                                                                    showBibleVersions(
                                                                                        scripture
                                                                                    )
                                                                                }
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition flex items-center gap-2 text-sm"
                                                                            >
                                                                                <BookOpen
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                />
                                                                                {
                                                                                    scripture
                                                                                }
                                                                            </button>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        {section.subPoints &&
                                                            section.subPoints
                                                                .length > 0 && (
                                                                <ol className="list-[lower-alpha] ml-6 space-y-3 mt-3">
                                                                    {section.subPoints.map(
                                                                        (
                                                                            subPoint,
                                                                            subIdx
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    subIdx
                                                                                }
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        subPoint.title
                                                                                    }

                                                                                    :
                                                                                </strong>{" "}
                                                                                {
                                                                                    subPoint.content
                                                                                }
                                                                                {subPoint.scripture && (
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            if (
                                                                                                subPoint.scripture
                                                                                            )
                                                                                                showBibleVersions(
                                                                                                    subPoint.scripture
                                                                                                );
                                                                                        }}
                                                                                        className="ml-2 text-blue-600 hover:text-blue-800 text-sm"
                                                                                    >
                                                                                        📖
                                                                                        Read{" "}
                                                                                        {
                                                                                            subPoint.scripture
                                                                                        }
                                                                                    </button>
                                                                                )}
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ol>
                                                            )}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "conclusion" && (
                            <div className="space-y-4">
                                {editingContent === "conclusion" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-4">
                                    Conclusion
                                </h3>
                                {editingContent === "conclusion" ? (
                                    <textarea
                                        value={contentData.conclusion}
                                        onChange={(e) =>
                                            updateContent(
                                                "conclusion",
                                                e.target.value
                                            )
                                        }
                                        className={`w-full px-4 py-2 rounded-lg border text-lg ${
                                            darkMode
                                                ? "bg-gray-800 border-gray-600"
                                                : "bg-white border-gray-300"
                                        }`}
                                        rows={4}
                                    />
                                ) : (
                                    <p className="text-lg leading-relaxed">
                                        {contentData.conclusion}
                                    </p>
                                )}
                                {contentData.conclusionScriptures &&
                                    contentData.conclusionScriptures.length >
                                        0 && (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {contentData.conclusionScriptures.map(
                                                (scripture) => (
                                                    <button
                                                        key={scripture}
                                                        onClick={() =>
                                                            showBibleVersions(
                                                                scripture
                                                            )
                                                        }
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm"
                                                    >
                                                        <BookOpen size={14} />
                                                        {scripture}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>
                        )}
            

                        {activeTab === "application" && (
                            <div className="space-y-6">
                            <h3 className="text-2xl font-bold mb-4">Personal Application</h3>

                            {/* Self-Assessment */}
                            <div
                            className={`${
                                darkMode ? "bg-gray-700" : "bg-gradient-to-r from-blue-50 to-indigo-50"
                            } p-6 rounded-lg`}
                            >
                            <h4 className="text-xl font-semibold mb-4">
                                Self-Assessment: Persistence in Prayer
                            </h4>

                            <p className="mb-4">
                                On a scale of 1 to 10, how consistent are you in praying until you receive an
                                answer—without discouragement or giving up—according to God’s will (Matt. 7:7–8; 1
                                John 5:14)?
                            </p>

                            <div className="flex items-center gap-4">
                                <input
                                type="range"
                                min="1"
                                max="10"
                                value={faithRating}
                                onChange={(e) => setFaithRating(Number(e.target.value))}
                                className="flex-1"
                                />
                                <span className="text-2xl font-bold text-blue-600">{faithRating}/10</span>
                            </div>

                            <p className="mt-3 text-sm italic">
                                {faithRating >= 8
                                ? "Excellent! Stay consistent—keep praying and trusting God until the answer comes."
                                : faithRating >= 5
                                ? "Good progress. Identify what usually discourages you and make a plan to stay persistent."
                                : "This is a call to strengthen your prayer life. Ask God for grace to endure and not faint."}
                            </p>
                            </div>

                            {/* Personal Decisions */}
                            <div
                            className={`${
                                darkMode ? "bg-gray-700" : "bg-white border border-gray-200"
                            } p-6 rounded-lg`}
                            >
                            <h4 className="text-xl font-semibold mb-4">
                                Personal Decisions: Pray Until Something Happens
                            </h4>

                            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                                <input
                                type="text"
                                value={commitmentInput}
                                onChange={(e) => setCommitmentInput(e.target.value)}
                                placeholder="Write a personal decision (e.g., pray daily, avoid discouragement, wait on God, pray through obstacles, seek God’s will)..."
                                className={`flex-1 px-4 py-2 rounded-lg border ${
                                    darkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
                                }`}
                                onKeyPress={(e) => e.key === "Enter" && addCommitment()}
                                />
                                <button
                                onClick={addCommitment}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                <Save size={16} /> Save
                                </button>
                            </div>

                            <div className="space-y-2">
                                {commitments.map((commitment, idx) => (
                                <div
                                    key={idx}
                                    className={`${darkMode ? "bg-gray-800" : "bg-gray-50"} p-3 rounded-lg flex items-start gap-3`}
                                >
                                    <CheckCircle className="text-green-600 mt-1" size={20} />
                                    <div className="flex-1">
                                    <p>{commitment.text}</p>
                                    <p className="text-xs opacity-70 mt-1">{commitment.date}</p>
                                    </div>
                                </div>
                                ))}
                            </div>

                            <p className="mt-4 text-sm italic text-gray-500">
                                Elijah did not stop at the revelation—he prayed until the rain came (1 Kings
                                18:41–46). Use this section to write clear and practical decisions that help you
                                keep praying, overcome discouragement, and persist until your answer comes (Matt.
                                7:7–8; 1 John 5:14).
                            </p>
                            </div>
                            </div>
                        )}











                        {activeTab === "quiz" && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Speed Quiz Challenge
                                    </h3>
                                    {quizActive && (
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-2">
                                                <Clock className="text-blue-600" />
                                                <span className="text-xl font-bold">
                                                    {timeLeft}s
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="text-yellow-600" />
                                                <span className="text-xl font-bold">
                                                    {score}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {!quizActive && !showResults && (
                                    <div className="text-center py-12">
                                        <Award
                                            size={64}
                                            className="mx-auto mb-4 text-yellow-600"
                                        />
                                        <h4 className="text-2xl font-bold mb-4">
                                            Ready to Test Your Knowledge?
                                        </h4>
                                        <p className="mb-6 text-lg">
                                            Answer quickly for bonus points!
                                        </p>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-xl font-semibold transition transform hover:scale-105"
                                        >
                                            Start Quiz
                                        </button>
                                    </div>
                                )}
                                {quizActive && !showResults && (
                                    <div>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-blue-50"
                                            } p-6 rounded-lg mb-6`}
                                        >
                                            <h4 className="text-xl font-semibold mb-4">
                                                Question {currentQuestion + 1}{" "}
                                                of {quizQuestions.length}
                                            </h4>
                                            <p className="text-lg mb-6">
                                                {
                                                    quizQuestions[
                                                        currentQuestion
                                                    ].q
                                                }
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {quizQuestions[
                                                    currentQuestion
                                                ].a.map((answer, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() =>
                                                            checkAnswer(idx)
                                                        }
                                                        className={`${
                                                            darkMode
                                                                ? "bg-gray-800 hover:bg-gray-900"
                                                                : "bg-white hover:bg-gray-50"
                                                        } p-4 rounded-lg border-2 border-blue-600 transition transform hover:scale-105 text-left`}
                                                    >
                                                        <span className="font-bold text-blue-600 mr-2">
                                                            {String.fromCharCode(
                                                                65 + idx
                                                            )}
                                                            .
                                                        </span>
                                                        {answer}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {showResults && (
                                    <div className="text-center space-y-6">
                                        <Award
                                            size={80}
                                            className="mx-auto text-yellow-600"
                                        />
                                        <h4 className="text-3xl font-bold">
                                            Quiz Complete!
                                        </h4>
                                        <div
                                            className={`${
                                                darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gradient-to-r from-blue-50 to-indigo-50"
                                            } p-8 rounded-lg`}
                                        >
                                            <p className="text-5xl font-bold text-blue-600 mb-2">
                                                {score}
                                            </p>
                                            <p className="text-xl">
                                                Final Score
                                            </p>
                                            <p className="mt-4 text-lg">
                                                {score >= 100
                                                    ? "Outstanding! Excellent knowledge!"
                                                    : score >= 60
                                                    ? "Great work! Keep studying!"
                                                    : "Good effort! Review the lesson."}
                                            </p>
                                        </div>
                                        <button
                                            onClick={startQuiz}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === "prayer" && (
                            <div className="space-y-4">
                                {editingContent === "prayer" && (
                                    <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 rounded-lg p-3 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Edit2
                                                size={16}
                                                className="text-yellow-700"
                                            />
                                            <span className="text-yellow-700 dark:text-yellow-400 font-semibold">
                                                Edit Mode Active
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                setEditingContent(null)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Done Editing
                                        </button>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-6">
                                    Prayer Points
                                </h3>
                                {contentData.prayerPoints.map((prayer, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-gradient-to-r from-purple-50 to-pink-50"
                                        } p-6 rounded-lg border-l-4 border-purple-600`}
                                    >
                                        {editingContent === "prayer" ? (
                                            <textarea
                                                value={prayer}
                                                onChange={(e) =>
                                                    updatePrayerPoint(
                                                        idx,
                                                        e.target.value
                                                    )
                                                }
                                                className={`w-full px-3 py-2 rounded-lg border ${
                                                    darkMode
                                                        ? "bg-gray-800 border-gray-600"
                                                        : "bg-white border-gray-300"
                                                }`}
                                                rows={3}
                                            />
                                        ) : (
                                            <p className="text-lg leading-relaxed">
                                                {prayer}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                {editingContent === "prayer" && (
                                    <button
                                        onClick={addPrayerPoint}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
                                    >
                                        <Plus size={16} /> Add Prayer Point
                                    </button>
                                )}
                            </div>
                        )}
                        {activeTab === "manage" && isPaid && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold">
                                        Manage Scriptures
                                    </h3>
                                    <button
                                        onClick={() => setEditMode(!editMode)}
                                        className={`${
                                            editMode
                                                ? "bg-red-600 hover:bg-red-700"
                                                : "bg-green-600 hover:bg-green-700"
                                        } text-white px-4 py-2 rounded-lg transition flex items-center gap-2`}
                                    >
                                        {editMode ? (
                                            <>
                                                <X size={16} /> Cancel
                                            </>
                                        ) : (
                                            <>
                                                <Edit2 size={16} /> Add New
                                            </>
                                        )}
                                    </button>
                                </div>
                                {editMode && (
                                    <div
                                        className={`${
                                            darkMode
                                                ? "bg-gray-700"
                                                : "bg-blue-50"
                                        } p-6 rounded-lg space-y-4`}
                                    >
                                        <input
                                            type="text"
                                            value={newVerse.reference}
                                            onChange={(e) =>
                                                setNewVerse({
                                                    ...newVerse,
                                                    reference: e.target.value,
                                                })
                                            }
                                            placeholder="Scripture Reference (e.g., John 3:16)"
                                            className={`w-full px-4 py-2 rounded-lg border ${
                                                darkMode
                                                    ? "bg-gray-800 border-gray-600"
                                                    : "bg-white border-gray-300"
                                            }`}
                                        />
                                        {(
                                            [
                                                "KJV",
                                                "NKJV",
                                                "NIV",
                                                "ESV",
                                                "AMP",
                                                "NLT",
                                            ] as const
                                        ).map((version) => (
                                            <div key={version}>
                                                <label className="block font-semibold mb-2">
                                                    {version}
                                                </label>
                                                <textarea
                                                    value={
                                                        newVerse.versions[
                                                            version
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        updateVerseVersion(
                                                            version,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder={`Enter ${version} text...`}
                                                    rows={3}
                                                    className={`w-full px-4 py-2 rounded-lg border ${
                                                        darkMode
                                                            ? "bg-gray-800 border-gray-600"
                                                            : "bg-white border-gray-300"
                                                    }`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            onClick={addNewScripture}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center gap-2"
                                        >
                                            <Save size={16} /> Save Scripture
                                        </button>
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {Object.keys(scriptureDB).map(
                                        (reference) => (
                                            <div
                                                key={reference}
                                                className={`${
                                                    darkMode
                                                        ? "bg-gray-700"
                                                        : "bg-white border border-gray-200"
                                                } p-4 rounded-lg`}
                                            >
                                                <h4 className="font-bold text-lg mb-2">
                                                    {reference}
                                                </h4>
                                                <button
                                                    onClick={() =>
                                                        showBibleVersions(
                                                            reference
                                                        )
                                                    }
                                                    className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                    View All Versions →
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        {activeTab === "manage" && !isPaid && (
                            <div className="text-center py-12">
                                <Lock
                                    size={64}
                                    className="mx-auto mb-4 text-purple-400"
                                />
                                <h3 className="text-2xl font-bold mb-4">
                                    Premium Feature
                                </h3>
                                <p className="mb-6">
                                    Upgrade to Premium to access scripture
                                    management
                                </p>
                                <button
                                    onClick={() => setShowPaymentGate(true)}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold"
                                >
                                    Unlock Now
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {showVerseModal && selectedVerse && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowVerseModal(false)}
                >
                    <div
                        className={`${
                            darkMode ? "bg-gray-800" : "bg-white"
                        } rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    {selectedVerse}
                                </h3>
                                <button
                                    onClick={() => setShowVerseModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="flex gap-2 p-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                            {(
                                [
                                    "KJV",
                                    "NKJV",
                                    "NIV",
                                    "ESV",
                                    "AMP",
                                    "NLT",
                                ] as const
                            ).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => changeBibleVersion(version)}
                                    disabled={verseLoading}
                                    className={`px-4 py-2 rounded-lg font-semibold transition whitespace-nowrap ${
                                        bibleVersion === version
                                            ? "bg-blue-600 text-white"
                                            : darkMode
                                            ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                    } ${
                                        verseLoading
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                        <div
                            className="p-6 overflow-y-auto"
                            style={{ maxHeight: "calc(85vh - 180px)" }}
                        >
                            {verseLoading ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="relative w-16 h-16 mb-4">
                                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="text-gray-500 animate-pulse">
                                        Loading scripture...
                                    </p>
                                </div>
                            ) : selectedVerse &&
                              scriptureDB[selectedVerse] &&
                              scriptureDB[selectedVerse][bibleVersion] ? (
                                <div className="text-lg leading-relaxed animate-fadeIn">
                                    {formatScriptureText(
                                        scriptureDB[selectedVerse][bibleVersion]
                                    )}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">
                                    Translation not available
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SundaySchoolApp;
