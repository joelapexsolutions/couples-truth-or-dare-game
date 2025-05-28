/**
 * Couples Intimacy Assessment Questions
 * 
 * This file contains the questions used for the couples assessment
 * separated into erotic and romantic categories.
 */

// Erotic Assessment Questions
const eroticQuestions = {
    soft: [
        "We have held hands in public",
        "We have often cuddled in bed or while watching a movie",
        "We have given each other massages (non-sexual)",
        "We have kissed passionately at least twice a month",
        "We have showered or bathed together",
        "We have slept in the same bed naked at least once a month",
        "We have undressed each other",
        "We have sent flirty text messages to each other",
        "We have kissed in public several times",
        "We kiss each other often when greeting",
        "We have teased each other with gentle touching",
        "We have shared sexual fantasies or desires",
        "We give each other hugs often",
        "We have danced closely together"
    ],
    sensual: [
        "We have given each other erotic massages",
        "We speak about sex to each other freely",
        "We have gone skinny dipping together",
        "We have sent each other explicit photos",
        "We have engaged in quickies (intentionally fast sex)",
        "We have included foreplay often during sex",
        "We have had oral sex at least once a month",
        "We have incorporated ice or temperature play during sex",
        "We have engaged in light spanking or other impact play",
        "We have had sex while friends or family were visiting",
        "We have teased each other to the edge of climax before stopping",
        "We have engaged in sensual food play (whipped cream, chocolate, etc.)",
        "We have surprised each other with sexual initiation",
        "We have engaged in role play during sex"
    ],
    hot: [
        "We have masturbated in front of each other",
        "We have had sex in a public place (risk of being caught)",
        "We have had sex while visiting friends or family",
        "We have filmed ourselves having sex and watched it later",
        "We have incorporated restraints or blindfolds in our play",
        "We have had phone or video sex while apart",
        "We have used dirty talk extensively during sex",
        "We have had sex five days in a week",
        "We have used sex toys together",
        "We have watched erotic movies more than once together",
        "We have engaged in dominant/submissive dynamics",
        "We have had sex in a car",
        "We have tried anal play or sex",
        "We have had oral sex in a public place"
    ],
    extreme: [
        "We have posted our own sex videos on the internet (porn websites, Onlyfans etc.)",
        "We have a collection of our own sex tapes and watched them occasionally",
        "We have engaged in threesomes or group sex",
        "We have tried swinging or partner swapping",
        "We have attended sex parties or clubs together",
        "We have engaged in intense BDSM play",
        "We have explored exhibitionism or voyeurism",
        "We have tried double penetration (with toys or others)",
        "We have experimented with sensory deprivation during sex",
        "We have engaged in role play with elaborate costumes/scenarios",
        "We have had sex while others watched",
        "We have engaged in extended sex sessions (2+ hours)",
        "We have participated in an orgy"
    ]
};

// Romantic Assessment Questions - Last 6 Months Focus
const romanticQuestions = {
    casual: [
        "We hold hands when walking together",
        "We've had date nights focused just on each other",
        "We compliment each other's appearance regularly",
        "We share goodnight kisses or cuddles",
        "We've made each other laugh until we cried",
        "We sit close together when watching TV",
        "We've taken selfies together",
        "We text each other affectionate messages",
        "We say 'I love you' regularly",
        "We hug each other often"
    ],
    affectionate: [
        "We've recreated our first date",
        "We've bought each other special gifts to show our love, like flowers or chocolates",
        "We've created romantic moments with music or candles",
        "We've gone on romantic picnics",
        "We give each other back rubs or massages",
        "We've taken showers together often",
        "We prepare special meals or treats for each other regularly",
        "We've slow danced together even briefly",
        "We've celebrated relationship milestones with special activities",
        "We dress up for each other occasionally",
    ],
    devoted: [
        "We regularly discuss and plan future adventures together",
        "We've surprised each other with special experiences",
        "We've created private romantic traditions",
        "We've made time for romance despite busy schedules",
        "We've created special memories in new locations",
        "We've gone on elaborate or creative dates",
        "We've recreated meaningful moments from our past",
        "We've made homemade romantic gifts for each other",
        "We've done romantic things for each other on valentines day",
        "We've prepared breakfast in bed for each other"
    ],
    passionate: [
        "We've written love letters expressing deep feelings",
        "We've created romantic settings with candles, music, and ambiance",
        "We've created personalized meaningful gifts",
        "We've gone on getaways with romantic elements",
        "We've publicly shared our affection in meaningful ways",
        "We've shared a romantic bubble bath together",
        "We've had professional romantic photos taken",
        "We've gone on overnight trips just to rekindle romance",
        "We've taken turns planning special intimate evenings for each other",
        "We've created a romantic bedroom environment with sensual elements",
    ]
};

// Define the profile categories and descriptions
const profileCategories = {
    erotic: {
        novice: {
            title: "Sensual Novices",
            description: "You're at the beginning of your intimate journey together. A world of shared pleasure awaits as you slowly explore each other's desires. Your current comfort zone is the perfect starting point for the adventures that lie ahead.",
            suggestion: "Choose one new intimate activity each month that pushes your boundaries just slightly. Consider reading an erotic story together and discussing which parts intrigue you both."
        },
        curious: {
            title: "Erotic Explorers",
            description: "You've begun to venture beyond the basics of physical intimacy. Your curiosity is propelling you toward new experiences, and you're discovering how thrilling it can be to break from routine. The sexual tension between you grows with each new adventure.",
            suggestion: "Try creating a shared 'desire map' where you each anonymously write fantasies you'd like to explore, then compare notes and plan your next adventure together."
        },
        adventurous: {
            title: "Pleasure Adventurers",
            description: "Your intimate life pulses with life and possibility! You've found the confidence to share desires and explore new forms of pleasure together. When you're in each other's arms, hesitations fade as your natural chemistry creates moments of breathtaking connection.",
            suggestion: "Consider introducing simple role play scenarios or power exchange dynamics. Take turns being in complete control for an evening's intimate activities."
        },
        daring: {
            title: "Passionate Connoisseurs",
            description: "Your physical connection crackles with electricity. You've created an intimate world where fantasies come to life naturally. The deep trust you share opens doors to adventures many couples only dream about, creating moments of intense pleasure that strengthen your bond.",
            suggestion: "Explore more public settings (while remaining legal and considerate). The thrill of potentially being caught can amplify arousal to extraordinary levels."
        },
        Fiery: {
            title: "Erotic Virtuosos",
            description: "You've created something rare - an intimate connection that transcends conventional boundaries through exceptional trust and open communication. Your physical relationship is a masterpiece of passion and exploration that few couples ever achieve.",
            suggestion: "Consider documenting your journey (privately) through a shared journal or tasteful photography. Your connection is rare and worth celebrating in ways meaningful to you both."
        }
    },
    romantic: {
        casual: {
            title: "Budding Romantics",
            description: "You're laying the foundation of your love story through shared moments and growing closeness. Those delightful butterflies still flutter as you discover the simple joy of having each other in your daily lives.",
            suggestion: "Create a 'first times' journal documenting your initial experiences together: first date, first trip, first time meeting important people in each other's lives."
        },
        affectionate: {
            title: "Tender Companions",
            description: "Your relationship has flowered into a warm garden of affection and understanding. You've created special rituals of care that belong only to the two of you, building a shared world that feels like coming home.",
            suggestion: "Establish a monthly 'no phones' date where you focus entirely on connecting without distractions. Take turns planning these special occasions."
        },
        devoted: {
            title: "Steadfast Partners",
            description: "Your bond runs deep like roots of an ancient tree, having weathered storms and basked in sunshine together. Your devotion shows in countless actions that speak louder than words ever could.",
            suggestion: "Create a vision board together that represents your shared future goals and dreams. Revisit and update it annually to stay aligned on your journey together."
        },
        soulmates: {
            title: "Passionate Soulmates",
            description: "What you share transcends ordinary connection - it's a soul-deep recognition that feels both mysterious and perfectly natural. Your lives dance together in beautiful harmony while you still nurture each other's individual flames.",
            suggestion: "Consider a commitment ceremony or renewal of vows (formal or private) where you create personalized promises that reflect your unique journey and vision for the future."
        }
    }
};

// Define the profile categories for established relationships (2+ years)
const establishedProfileCategories = {
    erotic: {
        novice: {
            title: "Sensual Traditionalists",
            description: "Over time, your physical intimacy has found a comfortable rhythm. This familiar approach has served your relationship, while a world of additional pleasure still awaits your discovery. Many long-term couples find renewed passion by gently expanding their intimate horizons.",
            suggestion: "Try a 30-day intimacy challenge where you take turns introducing a new element to your physical connection each week."
        },
        curious: {
            title: "Rediscovering Explorers",
            description: "You've maintained a healthy curiosity in your physical relationship over the years. This openness to occasional new experiences keeps your connection fresh and exciting. Your established trust creates the perfect foundation for deeper exploration whenever you're ready.",
            suggestion: "Consider a weekend getaway specifically focused on reconnecting physically, away from routine distractions and responsibilities."
        },
        adventurous: {
            title: "Balanced Adventurers",
            description: "You've cultivated an adventurous intimate life throughout your relationship. This willingness to evolve together has kept your physical connection vibrant despite the passing years. Your deep trust allows for meaningful exploration that continues to strengthen your bond.",
            suggestion: "Create a shared bucket list of new experiences you'd both like to try, rating them from 'slightly adventurous' to 'wildly exciting' so you can progress at a comfortable pace."
        },
        daring: {
            title: "Passionate Innovators",
            description: "You've maintained a daring physical connection that continues to spark and surprise. This commitment to exploration has kept your intimate life thrilling through the years. Your established history enhances every adventure, as they build on your foundation of deep understanding.",
            suggestion: "Consider exploring power exchange dynamics or role reversal to add new dimensions to your already vibrant physical connection."
        },
        Fiery: {
            title: "Liberated Intimates",
            description: "You've cultivated extraordinary freedom in your physical relationship over the years. This uninhibited approach reflects the deep trust you've established and your commitment to continual evolution. Few long-term couples achieve this level of openness and exploration.",
            suggestion: "Consider documenting your journey through a private journal that celebrates how your physical connection has evolved and deepened over time."
        }
    },
    romantic: {
        casual: {
            title: "Independent Partners",
            description: "Your relationship balances togetherness with plenty of individual space. This approach has allowed you both to grow while maintaining a comfortable connection. Though your emotional expression may be more reserved, your consistent presence in each other's lives shows genuine commitment.",
            suggestion: "Consider implementing a monthly 'state of the relationship' dinner where you intentionally share appreciations and future hopes."
        },
        affectionate: {
            title: "Warm Companions",
            description: "You've cultivated a relationship filled with genuine warmth and affection over the years. Your comfortable emotional intimacy provides a nurturing environment where you both feel appreciated and valued. This foundation of kindness sustains you through life's challenges.",
            suggestion: "Create new shared rituals that celebrate your history together while creating fresh memories that keep your connection vibrant."
        },
        devoted: {
            title: "Steadfast Allies",
            description: "Your years together have produced a relationship defined by unwavering commitment. You've faced life's challenges as a united team, developing profound trust and understanding. Your dedication to supporting each other's growth while maintaining your bond is truly remarkable.",
            suggestion: "Consider renewing your commitment through a private ceremony or letter exchange that acknowledges your journey and visions for the future."
        },
        soulmates: {
            title: "Spiritual Partners",
            description: "Your relationship has transcended ordinary connection, evolving into a profound spiritual bond. Your years together have created an extraordinary understanding where you recognize and nurture each other's deepest essence. This rare connection continues to deepen with time.",
            suggestion: "Create a relationship legacy project together - something that represents your unique bond and values that can be shared with others or future generations."
        }
    }
};

// Compatibility matrix for summary generation
const compatibilityMatrix = [
    // Format: [erotic level, romantic level, summary]
    ["novice", "casual", "You're in the sweet beginning stages of discovery, both emotionally and physically. This fresh connection holds beautiful potential as you learn about each other. The foundation you're building now—of communication, trust, and gentle exploration—creates the perfect starting point for your journey together."],
    
    ["novice", "affectionate", "Your emotional connection is flourishing beautifully while your physical intimacy still has room to grow. This natural pattern creates safety first, allowing physical exploration to unfold gradually. Your warm emotional foundation provides the perfect environment for physical intimacy to develop when you're both ready."],
    
    ["novice", "devoted", "You've built remarkable emotional depth while taking a more measured approach to physical intimacy. The trust and commitment you've established creates perfect emotional safety for exploring new dimensions of pleasure together. This strong foundation ensures that any physical exploration will only strengthen your already deep bond."],
    
    ["novice", "soulmates", "You've achieved an extraordinary emotional connection while maintaining a more traditional approach to physical exploration. This rare combination speaks to your deeply value-driven relationship. When you choose to expand your physical intimacy, your soul-level connection will transform it into something truly transcendent."],
    
    ["curious", "casual", "Your relationship balances casual romantic connection with budding physical exploration. This playful, low-pressure dynamic gives you both space to discover what truly resonates. Your growing curiosity about physical pleasure creates exciting possibilities while maintaining comfortable emotional boundaries."],
    
    ["curious", "affectionate", "You've achieved a beautiful harmony between emotional tenderness and physical exploration. This balanced approach nurtures both aspects of intimacy at a comfortable pace, creating a relationship that feels both exciting and secure. You're building intimacy in multiple dimensions simultaneously - a recipe for lasting connection."],
    
    ["curious", "devoted", "Your deep emotional commitment provides a secure foundation for your growing physical exploration. This powerful combination creates an environment where trust flourishes naturally, allowing you to gradually push boundaries while feeling completely safe with one another. Your devotion transforms physical discovery into profound connection."],
    
    ["curious", "soulmates", "Your soulmate-level emotional connection elevates your physical exploration to something truly sacred. Each new intimate experience is enhanced by the profound depth of your emotional bond, creating moments of transcendent connection. This rare balance promises extraordinary growth as your physical connection catches up to your emotional depth."],
    
    ["adventurous", "casual", "Your physical connection is developing more rapidly than your emotional intimacy. This creates exciting chemistry while maintaining comfortable emotional space. To create more sustainability, consider investing equal energy into building emotional depth. Many passionate relationships discover that deeper feelings actually enhance physical pleasure."],
    
    ["adventurous", "affectionate", "You've cultivated a warm, affectionate emotional connection that beautifully complements your adventurous physical relationship. This balanced approach allows both dimensions to enhance each other, creating a fulfilling and dynamic partnership where security and excitement coexist perfectly."],
    
    ["adventurous", "devoted", "Your devoted emotional commitment and adventurous physical connection create a relationship of remarkable depth and excitement. You've achieved what many couples strive for—security and passion in equal measure. This powerful combination creates both the safety to be vulnerable and the freedom to explore new horizons together."],
    
    ["adventurous", "soulmates", "The profound spiritual connection between you elevates your physical adventures to transcendent experiences. You've achieved a rare harmony where emotional depth and physical exploration enhance each other perfectly. Your soul-level understanding creates extraordinary freedom and trust in your physical connection."],
    
    ["daring", "casual", "Your physical connection sparks with electric intensity while emotional intimacy develops at a more relaxed pace. This pattern creates exhilarating encounters while maintaining comfortable emotional boundaries. For greater relationship sustainability, consider being as adventurous in opening your hearts as you are with your bodies."],
    
    ["daring", "affectionate", "Your passionate physical relationship is beautifully balanced by genuine emotional warmth. This exciting combination provides both the thrill of adventure and the comfort of affectionate connection. Your growing emotional bond creates a safe harbor from which you can launch increasingly exciting physical explorations."],
    
    ["daring", "devoted", "You've achieved a powerful combination of devoted emotional commitment and passionate physical connection. This balance creates a relationship that's both exciting and secure—a rare achievement that positions you for exceptional long-term satisfaction. Your deep trust allows you to push boundaries while feeling completely safe together."],
    
    ["daring", "soulmates", "Your relationship exists in rarefied air—combining soulmate-level emotional connection with passionate physical exploration. You've achieved what most couples only dream of: profound spiritual bonding that elevates physical intimacy to transcendent experiences. Your connection traverses both the heights of passion and the depths of soulful understanding."],
    
    ["Fiery", "casual", "Your sexual connection burns with extraordinary intensity while your emotional relationship maintains more comfortable boundaries. This creates passionate encounters with personal independence. While this pattern can create exciting chemistry, developing deeper emotional vulnerability would create more resilience and meaning over time."],
    
    ["Fiery", "affectionate", "Your exceptional physical connection is beautifully balanced by growing emotional intimacy. This dynamic combination creates a relationship with both excitement and security. Your warm affection provides the perfect foundation for uninhibited physical expression, creating a safe playground for your most authentic desires."],
    
    ["Fiery", "devoted", "You've achieved a remarkable balance of uninhibited physical expression and deep emotional commitment. This powerful combination creates a relationship of exceptional depth, where complete vulnerability exists in both physical and emotional dimensions. Your connection is truly special - the embodiment of passion anchored in unwavering devotion."],
    
    ["Fiery", "soulmates", "You've achieved relationship nirvana—a spiritual soulmate connection expressed through completely uninhibited physical intimacy. This transcendent bond represents the fullest expression of human connection, where emotional and physical dimensions enhance each other perfectly. Your relationship demonstrates how the deepest trust creates the greatest freedom."]
]; 


// Compatibility matrix for established relationships (2+ years)
const establishedCompatibilityMatrix = [
    // Format: [erotic level, romantic level, summary]
    ["novice", "casual", "After being together for some time, your relationship maintains a comfortable balance with room for growth in both dimensions. Many couples find this pattern works well for their lifestyle, providing connection without overwhelming intensity. If you desire more depth, consider setting aside dedicated time to reconnect in both physical and emotional ways."],
    
    ["novice", "affectionate", "Over the years, you've developed a warm emotional foundation while physical intimacy remains an area with potential for growth. This pattern reflects your priority on emotional connection - a beautiful foundation that can support more physical exploration when you're both ready. Many couples find that scheduled intimate time helps rekindle physical connection."],
    
    ["novice", "devoted", "Your years together have created a deep emotional commitment, while physical intimacy has taken a more traditional path. The extraordinary trust you've built provides the perfect foundation for exploring new dimensions of physical connection if you both desire. Many devoted couples find renewed passion through intentional exploration in a safe, judgment-free space."],
    
    ["novice", "soulmates", "You've cultivated an extraordinary spiritual bond throughout your relationship, with physical intimacy remaining more measured. This balance reflects your profound values and priorities. Your soul-level connection creates perfect safety for gradually expanding physical expression if you both desire - many couples in your position find physical intimacy becomes more meaningful with such deep emotional groundwork."],
    
    ["curious", "casual", "Your established relationship shows a relaxed approach to both emotional and physical connection. This comfortable space allows independence while maintaining consistent connection. To deepen your bond, consider intentionally investing in both emotional vulnerability and physical discovery through dedicated quality time together."],
    
    ["curious", "affectionate", "You've built a warm emotional haven while maintaining healthy curiosity about physical connection. This balanced approach has served your relationship well over time. Your affectionate foundation provides the perfect launching pad for deeper physical exploration whenever you're both inspired to expand those horizons."],
    
    ["curious", "devoted", "Your years together have created a deeply committed emotional bond alongside an openness to physical discovery. This beautiful combination of security and curiosity keeps your relationship fresh despite the passage of time. Your established trust creates the perfect environment for continuing to explore new dimensions of intimacy together."],
    
    ["curious", "soulmates", "You've developed a profound soul connection while maintaining a gentle curiosity about physical intimacy. This pattern shows your priority on spiritual bonding throughout your relationship. Your extraordinary emotional safety creates the perfect environment for physical exploration to unfold naturally, without pressure or expectation."],
    
    ["adventurous", "casual", "Your established relationship features an adventurous physical connection paired with more casual emotional boundaries. This combination offers excitement while maintaining personal independence. After being together for some time, you might find that deepening your emotional intimacy actually enhances your already vibrant physical connection."],
    
    ["adventurous", "affectionate", "You've developed a relationship that beautifully balances emotional warmth with physical adventure - a rewarding combination many couples strive for. Your established connection gives you the safety to explore together while maintaining the comfort of emotional closeness. This balance creates sustainable passion that can last a lifetime."],
    
    ["adventurous", "devoted", "Your years together have fostered both devoted commitment and adventurous physical connection. This powerful combination creates both security and excitement - qualities that many long-term relationships struggle to maintain. You've discovered how to keep both dimensions vibrant despite the inevitable challenges of life."],
    
    ["adventurous", "soulmates", "Your long-term relationship has evolved into something truly special - a spiritual connection paired with physical adventure. You've mastered the balance many couples seek, where deep emotional bonding enhances physical exploration rather than limiting it. Your exceptional trust transforms ordinary moments into sacred connection."],
    
    ["daring", "casual", "Your relationship prioritizes bold physical expression while keeping emotional connection more relaxed. This pattern creates excitement and independence, though it may create imbalance over time. After being together for several years, exploring deeper emotional vulnerability could add new dimensions to your already exciting physical connection."],
    
    ["daring", "affectionate", "You've cultivated a passionate physical relationship balanced with genuine emotional warmth. This dynamic combination has sustained your connection beautifully over time. Your affectionate foundation provides the perfect safety net for daring physical adventures, creating both excitement and security in your established relationship."],
    
    ["daring", "devoted", "Your years together have produced a remarkable balance of devoted commitment and passionate physical connection. This powerful combination creates both security and excitement - qualities that many long-term relationships struggle to maintain. You've found ways to keep both dimensions vibrant despite the inevitable challenges of life."],
    
    ["daring", "soulmates", "You've achieved a rare harmony in your established relationship - profound emotional bonding that elevates passionate physical connection. This balance represents years of intentional cultivation of both dimensions. Your deep history together transforms physical experiences from merely exciting to deeply meaningful, creating memories that continue to bond you."],
    
    ["Fiery", "casual", "Your relationship features exceptional physical freedom paired with more casual emotional connection. This combination reflects your priority on passionate exploration throughout your time together. Many established couples with this profile find that gradually deepening emotional intimacy can add new, unexpected dimensions to their already extraordinary physical connection."],
    
    ["Fiery", "affectionate", "You've developed a relationship that combines complete physical expression with genuine emotional warmth. This beautiful balance shows how you've nurtured both dimensions throughout your time together. Your affectionate connection provides perfect safety for uninhibited physical exploration, creating a relationship that satisfies completely."],
    
    ["Fiery", "devoted", "Your years together have fostered both deep commitment and complete freedom of physical expression. This exceptional balance creates a relationship of remarkable depth and passion. You've discovered the secret many couples miss - that emotional security enhances physical adventure rather than limiting it."],
    
    ["Fiery", "soulmates", "You've achieved relationship mastery - a spiritual, soulmate connection expressed through completely uninhibited physical intimacy. This transcendent bond represents years of intentional cultivation of both dimensions. Your extraordinary relationship demonstrates the ultimate truth: the deepest emotional connection creates the greatest freedom in physical expression."]
];