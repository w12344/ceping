(function (global) {
  "use strict";

  const basicAnswers = {};
  const answers = {};
  const situationAnswers = {};

  function applyState(state) {
    Object.keys(basicAnswers).forEach((key) => delete basicAnswers[key]);
    Object.keys(answers).forEach((key) => delete answers[key]);
    Object.keys(situationAnswers).forEach((key) => delete situationAnswers[key]);
    Object.assign(basicAnswers, state.basicAnswers || {});
    Object.assign(answers, state.answers || {});
    Object.assign(situationAnswers, state.situationAnswers || {});
  }

const likert = ["完全不像","不太像","有点像","比较像","就是这样"];
const dims = {meaning:{label:"目标意义感",desc:"看你是否知道为什么要学文化课，以及文化课和大学、专业、城市、未来选择之间有没有连接。"},autonomy:{label:"自主感",desc:"看学习对你来说是自己参与选择的事，还是完全被催着、推着走。"},efficacy:{label:"自我效能感",desc:"看你是否相信自己能学会、能进步，遇到困难后还能重新调整。"},method:{label:"方法掌控感",desc:"看你是否知道怎么学、怎么复盘、怎么处理错题、怎么把听懂变成会做。"},support:{label:"关系支持感",desc:"看你在学习中是否感到被理解、被支持，遇到问题时是否敢求助、能得到具体反馈。"},execution:{label:"执行启动感",desc:"看你能不能从想学进入行动，并把任务持续做到一个明确结果。"},emotion:{label:"情绪压力感",desc:"看考试、比较、失败预期和外界期待是否正在消耗你的学习状态。"}};
const mechanisms = {meaning:{future:"未来价值感",personal:"个人意义感",concrete:"目标具体性",path:"路径连接感"},autonomy:{internal:"内化认同",choice:"选择参与感",control:"控制压力感",responsibility:"自我负责感"},efficacy:{competence:"胜任预期",evidence:"成功证据感",effort:"努力有效感",recovery:"挫折恢复感"},method:{strategy:"策略选择感",diagnosis:"错因诊断感",review:"复盘调整感",transfer:"迁移应用感"},support:{understood:"被理解感",help:"求助安全感",feedback:"具体反馈感",stable:"支持稳定感"},execution:{start:"启动能力",clarity:"任务清晰感",persist:"持续坚持感",restart:"中断恢复感"},emotion:{result:"结果焦虑",failure:"失败预期",social:"社会评价压力",recovery:"情绪恢复力"}};
const dimensionDeep={meaning:{type:"目标意义类型",meaning:"它看的是：你是否能把文化课学习与大学、专业发展、城市资源、自我成长、未来选择权连接起来，并形成属于自己的学习理由。它不是简单问“你有没有目标”，而是看 4 件事：你是否能理解大学对自己的意义；你是否能把文化课和未来选择连接起来；你是否能想象一个具体、可感知的未来画面；你是否有一个属于自己的“为什么”。",mech:"未来价值感看你是否理解分数背后的平台、城市和选择权；个人意义感看学习是否和“我想成为什么样的人”有关；目标具体性看目标是否从口号变成学校、城市或阶段任务；路径连接感看你是否知道今天的努力和未来目标之间怎么接上。",bands:["你不是看不到未来，只是那个未来还没有足够具体、足够和你有关。文化课对你来说可能还更像任务、分数和压力，所以它很难自然变成动力。你真正需要的不是被要求“树立远大目标”，而是先找到一个和自己有关的理由：我想去哪、想成为谁、想把哪些选择权拿回来。","你已经知道文化课重要，但这个重要性还没有完全变成稳定的内在理由。你可能有目标，也可能知道要努力，但有时仍会觉得它离自己有点远。下一步要把“重要”变成“和我有关”：具体到城市、学校、专业平台、生活画面和本周要完成的小突破。","你对文化课的理解已经不只是多考几分。你能看见，分数背后连接的是学校、城市、专业平台和未来选择。这个阶段最重要的是把目标拆成路线图，让意义不只停留在想象里，而能落到每天的学习节奏里。","你的目标意义感比较成熟。你不只是知道要考大学，也比较清楚文化课、专业发展、城市资源和未来主动权之间的关系。对你来说，真正要做的不是再被提醒“文化课很重要”，而是把清晰目标转化成高质量行动。"]},autonomy:{type:"自主质量类型",meaning:"它看的是：学习这件事在你心里是“我参与选择、我愿意承担”，还是“我被安排、被催促、被推着走”。自主感不是想干什么就干什么，而是在必要任务里保留参与感、选择感和自我负责感。",mech:"内化认同看你是否认可任务背后的意义；选择参与感看你能否参与目标、节奏和方法安排；控制压力感看外界要求是否让你感到被压迫；自我负责感看你是否愿意把学习结果重新拿回自己手里。",bands:["你现在可能更容易感到学习是外界压下来的任务。别人越催，你越容易被动、抗拒或麻木。真正要提升的不是“听话程度”，而是把一部分选择权还给你：先从一个科目、一个时段、一个任务顺序开始，让你重新感到“这是我参与决定的”。","你有一定自主意识，但还不够稳定。你可能愿意学，也知道要负责，但在压力大、任务多或被催促时，容易重新回到被动状态。下一步需要在老师给出的边界内，保留可选择的空间，比如先做哪类题、用什么节奏复盘、今天完成到什么标准。","你的自主感处在比较健康的区间。你既能接受必要任务，也能在其中保留自己的选择和判断。接下来要做的是把自主感和方法系统连接起来：不是只靠意愿坚持，而是参与制定更适合自己的学习路径。","你的自主感很强，说明你已经把学习较多地看成自己的事。你不是单纯被推着走，而是愿意参与选择并承担结果。这个优势很宝贵，但也要避免变成“什么都自己扛”，必要时仍要借助老师的结构和反馈。"]},efficacy:{type:"信心系统类型",meaning:"它看的是：你是否相信自己能学会、能进步、能通过努力改变结果。自我效能感不是盲目自信，而是来自一次次“小成功证据”：我做到了、我变好了、我知道下次怎么改。",mech:"胜任预期看你面对当前任务时是否相信自己能完成；成功证据感看最近是否有可感知的进步；努力有效感看你是否相信努力和方法会带来改变；挫折恢复感看考试波动后能否重新站回学习里。",bands:["你现在最需要的不是更大的目标，而是重新积累“我能做到”的证据。过去的挫败可能让你把文化课和无力感绑在一起，于是还没开始就先泄气。第一步要把任务降到能成功的大小，用连续的小成功把信心唤回来。","你的信心不是没有，而是容易波动。状态好、有人反馈、题目做出来时，你会觉得自己可以；一旦考试不理想或遇到难题，就容易怀疑自己。接下来要建立稳定的成功证据库，让信心不再只被单次成绩牵着走。","你对自己有基本信心，也能看见努力带来的变化。这个分数说明你有继续提升的底座。下一步要把信心从“我愿意努力”升级为“我知道怎样努力更有效”，让自我效能和方法掌控相互支撑。","你的自我效能感很强，说明你相信自己能学会、能进步，也比较能从挫折中恢复。这样的学生适合更高质量的挑战，但要注意别把高标准变成持续自我否定，信心越强，越要配合科学节奏和及时复盘。"]},method:{type:"策略系统类型",meaning:"它看的是：你是否知道怎么学、怎么判断自己卡在哪里、怎么把错题和测验变成下一步行动。方法掌控感不是“刷得多”，而是能分清问题属于知识、审题、方法、迁移、时间还是状态。",mech:"策略选择感看你是否知道不同科目该用不同方法；错因诊断感看你能否找到比“粗心、不会”更具体的原因；复盘调整感看你是否会根据结果改变下一步；迁移应用感看你能否把听懂的东西转化成会做、会考。",bands:["你现在可能不是完全不想学，而是经常不知道下一步怎么学。越没方法，越容易靠硬撑、加量或逃避来应对。接下来最重要的是先建立一张简单方法单：错因分类、例题模仿、限时训练、当天反馈，而不是直接要求自己更努力。","你已经有一些方法意识，但还不够稳定。你可能知道要复盘、要整理错题，但执行时容易停在表面。下一步要把方法变成固定流程：先判错因，再选练法，最后用小测验证是否真的会了。","你的方法掌控感比较稳定，说明你已经不只是盲目刷题，而是能对学习过程做一些判断。接下来要提升的是方法精度：哪些题型最值得先突破，哪些错因最影响提分，哪些训练能最快转化到考试。","你的策略系统比较成熟，适合进入提效阶段。你不仅愿意学，也比较知道怎么学。下一步不要只追求做更多，而要追求更准：用数据看高频错因，用复盘调整训练结构，把时间投到最能涨分的位置。"]},support:{type:"支持系统类型",meaning:"它看的是：你在学习中是否感到被理解、被支持，遇到问题时是否敢求助，并且能不能得到具体、有用的反馈。关系支持感不是被哄着学，而是身边有人能帮你把压力、问题和下一步看清楚。",mech:"被理解感看你真实状态有没有被看见；求助安全感看你遇到不会时敢不敢开口；具体反馈感看得到的是可操作建议还是空泛鼓励；支持稳定感看支持是否持续存在，而不是只在考差时出现。",bands:["你现在可能比较容易一个人扛。不是你不需要帮助，而是过去的求助体验可能不够安全、不够具体，甚至让你更有压力。接下来要先建立低压力求助入口：每天只问一个具体问题，让支持重新变得可用。","你能感到一些支持，但还不够稳定或不够具体。有人关心你，但未必真的知道你卡在哪里；有人鼓励你，但未必给得出下一步。接下来要把求助方式变具体：不要只说“我学不会”，而是带着题目、错因和希望得到的帮助去问。","你的关系支持感较好，说明你身边有一定可用资源，也比较能接受帮助。这个优势可以直接转化为提分资源：让老师帮你校准重点，让同伴陪你启动，让家长减少无效催促、增加具体反馈。","你的支持系统很强，这是一种很重要的学习资源。你不是孤立作战，遇到问题时更容易得到理解和反馈。下一步要把支持升级为协作：老师负责诊断和反馈，你负责执行和复盘，家长负责稳定情绪和环境。"]},execution:{type:"行动系统类型",meaning:"它看的是：你能不能从“想学”进入“开始学”，并把任务持续做到一个明确结果。执行启动感不是意志力强弱，而是任务是否清楚、起步是否容易、过程是否能持续、中断后是否能回来。",mech:"启动能力看你能否较快进入学习；任务清晰感看你是否知道今天具体做什么、做到什么标准；持续坚持感看你能否保持一段时间专注；中断恢复感看计划被打断后能否重新开始。",bands:["你现在最需要解决的是“启动门槛”。可能不是你完全没有动力，而是任务太大、太模糊或太容易被情绪和环境打断。接下来要把学习任务切小到能立刻开始：10 分钟、5 道题、1 个知识点、1 张错因表。","你有启动意愿，但执行系统还不够稳定。你可能能开始一阵子，但容易拖延、中断或做着做着偏掉。下一步要用明确标准保护执行：今天做什么、做到多少、什么时候停、留下什么结果。","你的执行启动感比较稳定，说明你能把想法变成行动，也能完成一定任务。接下来要提高执行质量：减少低效耗时，把每次学习都变成有产出的闭环，而不是坐得久但结果不清楚。","你的行动系统很强，说明你能开始、能坚持、能完成，这是提分中非常关键的能力。下一步要防止“只靠执行硬推”，把执行和方法复盘结合起来，让每次努力都更精准。"]},emotion:{type:"压力风险类型",meaning:"它看的是：考试、排名、失败预期、他人评价和外部期待是否正在消耗你的学习状态。情绪压力感是风险值，分数越高代表压力消耗越明显；它不是说你不努力，而是提醒你：如果压力持续过高，动力会被焦虑、羞耻和疲惫吃掉。",mech:"结果焦虑看考试和排名是否让你紧张；失败预期看你是否容易提前觉得自己不行；社会评价压力看别人怎么看你是否强烈影响状态；情绪恢复力看压力上来后你是否知道怎么恢复。",bands:["你的压力风险较低，说明情绪目前没有明显吞掉学习动力。这个状态适合把精力放在目标、方法和效率优化上，同时保留稳定作息，避免后期冲刺时压力突然累积。","你的压力处在可管理区间。它可能会让你紧张，但还没有严重影响行动。接下来要做的是建立固定恢复方式：小任务重启、错因复盘、短时放松和具体求助，防止压力继续升高。","你的压力已经在明显消耗学习状态。你可能一边想进步，一边被焦虑、比较、怕失败或怕辜负拉住。现在不适合单纯加压，必须把任务变小、反馈变具体、节奏变可控，否则越努力越容易累。","你的情绪压力风险很高，需要优先处理。你不是不想好，而是压力系统可能已经过载：越在意越紧绷，越紧绷越低效。接下来最重要的不是继续硬扛，而是降低威胁感，建立恢复节奏，并让老师或家长用更具体、更支持的方式介入。"]}};
const basicQuestions = [{id:"origin",title:"你来自哪里？",type:"text",placeholder:"例如：杭州 / 金华 / 某县城"},{id:"major",title:"你的专业方向更接近？",type:"single",options:["美术/设计","音乐","舞蹈","播音/表演","书法","体育","其他"]},{id:"foundation",title:"你觉得自己的文化课基础？",type:"single",options:["很弱，需要重新补基础","有一些基础，但不稳定","中等，能跟上但不突出","还不错，希望进一步提升","一直比较好，希望冲更高分"]},{id:"history",title:"过去学文化课的经历，更像哪一种？",type:"single",options:["一直比较稳定","曾经不错，后来掉下来","努力过，但效果不明显","基础薄弱，学起来吃力","状态起伏比较大","主要看老师和环境","以前不重视，现在想认真学","一直比较好，现在想冲更高分"]},{id:"seen",title:"小时候或过去，别人更常看见/认可你的哪一面？",type:"multi",max:3,options:["活跃爱玩","懂事配合","喜欢和人在一起","习惯自己消化","想象力丰富","愿意尝试新东西","做事比较谨慎","有自己的想法","反应快","肯努力","善良体贴","有表达力","有才艺","有审美","自律有规划","很少被明确认可"]},{id:"remind",title:"过去别人比较容易提醒你的地方是？",type:"multi",max:2,options:["粗心","爱玩","不太服管","容易受影响","不太主动表达","有时比较敏感","做事拖延","文化课不稳定","很少被明显提醒"]},{id:"pressureReaction",title:"压力很大时，你通常会？",type:"single",options:["自己扛","找人说说","玩手机放空","睡觉逃避","假装没事","继续硬撑","运动或散步","做点小事让自己恢复"]},{id:"hurt",title:"哪件事最容易让你难受？",type:"single",options:["被否定","被误解","被忽视","失败","让别人失望","被比较","努力不被看见","失去掌控感"]},{id:"freeTime",title:"如果没有考试压力，你最愿意把时间花在哪？",type:"multi",max:2,options:["游戏","音乐","运动","绘画设计","阅读","写作/创作","拍摄/剪辑","旅行","赚钱/做项目","和朋友在一起","安静休息","研究感兴趣的东西"]},{id:"flow",title:"什么事情最容易让你进入很投入、忘记时间的状态？",type:"single",options:["解题","阅读","游戏","运动","聊天社交","绘画设计","音乐","写作创作","研究自己感兴趣的东西","动手制作","表演展示","整理规划","暂时没有特别明显的事情"]},{id:"admire",title:"别人最可能因为什么佩服你？",type:"single",options:["学习能力","毅力","性格","责任感","创造力","社交能力","表达能力","审美能力","稳定发挥","暂时想不到"]},{id:"achievement",title:"什么事情最能让你有成就感？",type:"single",options:["考出好成绩","完成困难目标","超过原来的自己","被认可","帮助别人","学会新东西","把作品或成果做出来","稳定保持好状态"]},{id:"futureSelf",title:"未来你最希望成为哪种大人？",type:"single",options:["有钱","自由","专业高手","有影响力","幸福快乐","做自己喜欢的事","有安全感","能照顾好自己和重要的人"]},{id:"teacherHelp",title:"你现在最希望被老师怎样帮助？",type:"single",options:["帮我把目标和方向变清楚","帮我重新建立信心","帮我找到更有效的方法","帮我提高执行力","帮我稳住情绪压力","帮我冲刺更高分","先理解我，再给建议","给我更明确的反馈和要求","给我更多独立空间，必要时再提供支持","少一点催促和干预，让我按自己的节奏推进"]},{id:"oneSentence",title:"如果只能选一句最像你的话：",type:"single",options:["我总觉得自己还能做得更好","我特别怕辜负别人的期待","我很希望被认可，但不太会说","我比别人想象中更努力","我其实比表现出来的更敏感","我一直在寻找真正喜欢的事情","我希望自己能更稳定","我想证明自己可以"]}];
function q(id,dim,mech,text,reverse=false){return {id,dim,mech,text,reverse,type:"likert"};}
const coreItems = [q(1,"meaning","future","我很清楚学文化课和我未来的大学、专业、职业选择之间的关系。"),q(2,"meaning","future","我觉得文化课学得好不好，和我将来能过上什么样的生活关系不大。",true),q(3,"meaning","personal","我觉得学习文化课这件事，和我“想成为什么样的人”是有关的。"),q(4,"meaning","personal","我很少去想“我为什么要学”，感觉学了就行。",true),q(5,"meaning","concrete","我心里有一个比较清晰的大学目标（具体到学校或城市）。"),q(6,"meaning","concrete","我对未来没有特别具体的想法，走一步看一步。",true),q(7,"meaning","path","我知道从现在到高考，每个阶段大概要做到什么程度。"),q(8,"meaning","path","我不太清楚现在学的东西和我未来的目标之间具体怎么连接。",true),q(9,"autonomy","internal","虽然学习任务有时很累，但我在心里是认可这些任务的意义的。"),q(10,"autonomy","internal","我学习主要是因为不想被批评或不想让身边人失望。",true),q(11,"autonomy","choice","在学习目标、节奏和任务安排上，我有一定的参与权和选择空间。"),q(12,"autonomy","choice","我的学习安排基本都是被定好的，我没什么发言权。",true),q(13,"autonomy","control","我经常感觉被催、被管、被推着走。",true),q(14,"autonomy","control","虽然任务多，但我觉得自己还能掌控学习节奏，不至于完全被动。"),q(15,"autonomy","responsibility","我愿意为自己的学习结果负责，不管好还是不好。"),q(16,"autonomy","responsibility","如果我学得不好，我不太觉得是自己的问题。",true),q(17,"efficacy","competence","我相信自己有能力完成当前阶段的学习任务。"),q(18,"efficacy","competence","面对比较难的章节，我通常会觉得自己可能学不会。",true),q(19,"efficacy","evidence","最近我在学习中获得了一些进步或成就感，哪怕不大。"),q(20,"efficacy","evidence","我想不起来最近有什么让我觉得“我做到了”的时刻。",true),q(21,"efficacy","effort","我觉得就算我认真学了，成绩也不一定能提高。",true),q(22,"efficacy","effort","我曾经通过自己的努力和方法，把一门课从弱变强过。"),q(23,"efficacy","recovery","一次考试没考好之后，我需要很长时间才能缓过来。",true),q(24,"efficacy","recovery","成绩波动时，我心里会想“这次只是意外，我还能稳住”。"),q(25,"method","strategy","我知道不同科目适合用什么方法去复习和做题。"),q(26,"method","strategy","我经常觉得“不知道怎么学”是让我卡住的主要原因。",true),q(27,"method","diagnosis","拿到一张做过的卷子，我能分清错因是知识不会、审题错误、方法不对还是时间不够。"),q(28,"method","diagnosis","我很少仔细分析自己到底为什么错，只知道“这道题我不会”。",true),q(29,"method","review","每次测验或考试后，我会花时间复盘并调整后续学习。"),q(30,"method","review","我很少总结学习中的规律，做完就过去了。",true),q(31,"method","transfer","上课听懂了但自己做题或考试时就不会了，这种情况经常发生。",true),q(32,"method","transfer","我比较擅长把学过的知识串起来，应对综合题。"),q(33,"support","understood","我觉得我的老师或家长能理解我现在的真实状态和压力。"),q(34,"support","understood","身边人更多关注我的分数，而不是我学得累不累、卡在哪。",true),q(35,"support","help","遇到不会的问题时，我敢主动问老师或同学。"),q(36,"support","help","我会担心“这么简单都不会，会不会被笑话”，所以不太敢问。",true),q(37,"support","feedback","当我向老师或家长求助时，能得到具体、有用、可操作的回应。"),q(38,"support","feedback","我得到的反馈通常比较模糊，比如“加油”“再用点心”，但不知道具体怎么做。",true),q(39,"support","stable","我能感受到身边有人持续关心我的学习状态，不只是考差时才出现。"),q(40,"support","stable","考得不好时，我得到的更多是批评和质问，而不是帮助。",true),q(41,"execution","start","每天开始学习时，我通常能较快进入状态，不会拖很久。"),q(42,"execution","start","我总是拖到最后一刻才开始写作业或复习。",true),q(43,"execution","clarity","每天开始学习之前，我清楚自己今天具体要完成哪些任务、完成到什么标准。"),q(44,"execution","clarity","我经常坐下来却不知道先做什么，花很多时间在“想”上而不是“做”上。",true),q(45,"execution","persist","学习时我容易分心、走神，很难持续完成一件事。",true),q(46,"execution","persist","一旦开始学习，我能保持一段时间的专注。"),q(47,"execution","restart","计划被打断后，我通常能较快调整并重新投入。"),q(48,"execution","restart","遇到卡住的题或任务时，我容易停在那里，不知道怎么拆出一个能继续做的小步骤。",true),q(49,"emotion","result","一想到考试和排名，我就会感到紧张或不安。"),q(50,"emotion","result","如果某次考试没考好，我会反复想这件事，很难放下。"),q(51,"emotion","failure","每次考试前，我总觉得自己会考不好。"),q(52,"emotion","failure","在做比较难的题目时，我脑子里常出现“我做不出来”的声音。"),q(53,"emotion","social","我很在意别人怎么评价我的成绩。"),q(54,"emotion","social","我有时会觉得自己是在为别人的期待而学，这种感觉让我很累。"),q(55,"emotion","recovery","压力大的时候，我知道怎么让自己放松或平静下来。",true),q(56,"emotion","recovery","当压力影响学习时，我能先把情绪和任务分开，做一件小事让自己稳下来。",true)];
const situationItems = [{id:"s1",dim:"meaning",type:"single",text:"当你想到“为什么要学文化课”时，哪句话最接近你？",options:["我有比较清楚的目标，文化课是在帮我争取更好的选择","它能让我多一些学校、城市和专业选择","它和我未来想成为的人有关","我知道它重要，但还没真正想清楚为什么","更多是为了满足父母或老师的期待，是必须完成的一件事","我暂时还不知道为什么要学文化课"]},{id:"s2",dim:"autonomy",type:"single",text:"当老师给你安排学习任务时，你更希望：",options:["老师给目标和标准，我自己安排节奏并对结果负责","老师告诉我目标，再让我选择先做哪一部分","先听听我的想法，再一起定计划","直接告诉我做什么，我按要求完成","不要管太多，我自己安排","我不太想参与，反正最后也是别人说了算"]},{id:"s3",dim:"efficacy",type:"single",text:"当你连续努力几天，但成绩没有明显变化时，你通常会：",options:["保持稳定，觉得短期没变化不代表方向错了","先看看是不是方法、题型或复盘出了问题","找老师确认自己到底卡在哪里","换一个更小的目标重新开始","继续学，但心里会越来越没底","觉得自己可能真的不适合学文化课"]},{id:"s4",dim:"method",type:"single",text:"当一科成绩迟迟没有变化时，你更可能：",options:["先看最近错得最多的是哪类","找老师确认是不是学习顺序或重点不对","调整练法，比如限时、变式或讲题","增加练习量，看看是不是熟练度不够","先换一科，过一会儿再回来","卡住，不太知道下一步怎么做"]},{id:"s5",dim:"support",type:"single",text:"当你学习状态不好时，哪种帮助最容易让你重新进入状态？",options:["给我更高质量的反馈，帮我继续提高","先有人听我说清楚问题","直接帮我指出下一步该做什么","陪我开始一小段任务","告诉我哪里已经比之前好了","先给我一点空间，我自己缓一缓"]},{id:"s6",dim:"execution",type:"single",text:"当你面对一项重要学习任务时，最像你的状态是：",options:["我能较快开始，并按标准完成","我能开始，但需要任务目标和完成标准更清楚","我想做，但任务太大时会拖延","我开始还可以，但中途容易断掉","我容易被手机或别的事情带走","我常常不知道先做什么，所以迟迟开始不了"]},{id:"s7",dim:"emotion",type:"single",text:"当压力很大时，你更容易：",options:["先稳住节奏，用小任务让自己恢复","越想越焦虑，效率变低","怕失败，所以干脆拖一拖","想到别人怎么看我，就更难受","找人说一说，或者调整一下状态","表面继续学，但心里很紧绷"]}];

function asText(value){return Array.isArray(value)?value.join("、"):(value||"");}
function scoreBandIndex(key,score){if(key==='emotion'){if(score<=16)return 0;if(score<=24)return 1;if(score<=32)return 2;return 3;}if(score<=16)return 0;if(score<=24)return 1;if(score<=32)return 2;return 3;}
function mechanismDeepText(key){return dimensionDeep[key].mech;}
function scoreDeepText(key,score){return dimensionDeep[key].bands[scoreBandIndex(key,score)];}
function resourceLevel(scores){const values=['meaning','autonomy','efficacy','method','support','execution'].map(k=>scores[k]);const avg=values.reduce((sum,value)=>sum+value,0)/6;const low16=values.filter(value=>value<=16).length,low20=values.filter(value=>value<=20).length;if(avg<19.2||low16>=3)return'低资源';if(avg<25.6||low20>=2)return'中低资源';if(avg>=30.4&&!values.some(value=>value<24))return'高资源';return'中高资源';}
function riskLevel(score){if(score>=33)return'严重风险';if(score>=25)return'高风险';if(score>=17)return'中风险';return'低风险';}
function stateName(scores){const res=resourceLevel(scores),risk=riskLevel(scores.emotion);if(['高资源','中高资源'].includes(res)&&['低风险','中风险'].includes(risk))return'稳定成长态';if(['高资源','中高资源'].includes(res))return'高压消耗态';if(['低风险','中风险'].includes(risk))return'动力未激活态';return'受困失衡态';}
function resourceStructure(scores){const values=['meaning','autonomy','efficacy','method','support','execution'].map(k=>scores[k]);const gap=Math.max(...values)-Math.min(...values);return{label:gap<13?'资源均衡':'资源不均衡',gap,obvious:values.filter(value=>value<=16).length};}
function situationSignal(key){const selected=(situationAnswers['s'+({meaning:1,autonomy:2,efficacy:3,method:4,support:5,execution:6,emotion:7}[key])]||[])[0];if(selected===undefined)return 0;const concern={meaning:[3,4,5],autonomy:[3,5],efficacy:[4,5],method:[5],support:[],execution:[2,3,4,5],emotion:[1,2,3,5]};return(concern[key]||[]).includes(selected)?1:0;}
function developmentPoint(scores,state){const order={稳定成长态:['method','execution','meaning','efficacy','autonomy','support'],高压消耗态:['efficacy','method','execution','support','autonomy','meaning'],动力未激活态:['meaning','efficacy','execution','support','autonomy','method'],受困失衡态:['support','efficacy','execution','meaning','method','autonomy']}[state];const structure=resourceStructure(scores),positive=order.map(k=>scores[k]);if(state==='稳定成长态'&&Math.min(...positive)>=26&&structure.label==='资源均衡')return order[0];const adjusted=order.map((key,index)=>({key,index,value:scores[key]-(situationSignal(key)?3:0)}));const floor=Math.min(...adjusted.map(item=>item.value));return adjusted.filter(item=>item.value<=floor+3).sort((a,b)=>a.index-b.index||a.value-b.value)[0].key;}
function primaryType(scores,mechScores){const top=['meaning','autonomy','efficacy','method','support','execution'].sort((a,b)=>scores[b]-scores[a])[0];return{key:top,label:dims[top].label};}
function pointTitle(state,scores){const structure=resourceStructure(scores),positive=['meaning','autonomy','efficacy','method','support','execution'].map(k=>scores[k]);return state==='稳定成长态'&&Math.min(...positive)>=26&&structure.label==='资源均衡'?'优先升级方向':'优先发展点';}
function tone(score,key){if(key==='emotion')return score>=25?'var(--coral)':score>=17?'var(--gold)':'var(--green)';return score>=26?'var(--teal)':score>=18?'var(--gold)':'var(--coral)';}
function radar(scores,profiles){const keys=['meaning','autonomy','efficacy','method','support','execution'];const size=310,c=size/2,r=98;const pt=(i,rr)=>{const angle=-Math.PI/2+i*Math.PI*2/keys.length;return[c+Math.cos(angle)*rr,c+Math.sin(angle)*rr]};const poly=rr=>keys.map((_,i)=>pt(i,rr).join(',')).join(' ');const pts=profile=>keys.map((k,i)=>pt(i,r*(profile[k]||0)/40).join(',')).join(' ');const risk=riskLevel(scores.emotion);return `<svg width="100%" height="310" viewBox="0 0 ${size} ${size}">${[1,.75,.5,.25].map(x=>`<polygon points="${poly(r*x)}" fill="none" stroke="#ddd4c4"/>`).join('')}${keys.map((k,i)=>{const[x,y]=pt(i,r);return`<line x1="${c}" y1="${c}" x2="${x}" y2="${y}" stroke="#ddd4c4"/>`}).join('')}<polygon points="${pts(profiles.extension||scores)}" fill="rgba(233,180,76,.14)" stroke="#e9b44c" stroke-width="2.5"/><polygon points="${pts(profiles.core||scores)}" fill="rgba(111,155,81,.24)" stroke="#6f9b51" stroke-width="3.5"/>${keys.map((k,i)=>{const[x,y]=pt(i,r+30);return`<text x="${x}" y="${y}" text-anchor="middle" font-size="12" font-weight="800">${dims[k].label}</text>`}).join('')}</svg><div class="emotion-pill">情绪风险值 <b style="color:${tone(scores.emotion,'emotion')}">${scores.emotion}/40 · ${risk}</b></div><div class="radar-legend"><span><i style="background:#6f9b51"></i>内核：4-5 分，稳定显现</span><span><i style="background:#e9b44c"></i>外延：2-5 分，潜在范围</span></div><div class="radar-note">内核越饱满，说明这个维度越稳定地成为你的习惯；外延大于内核的部分，代表在合适情境下可以被调用和发展的空间。</div>`;}
function scenarioChoice(key){const map={meaning:1,autonomy:2,efficacy:3,method:4,support:5,execution:6,emotion:7};const selected=(situationAnswers['s'+map[key]]||[])[0];return selected===undefined?null:selected;}
function tieEntry(key,profile){const choice=scenarioChoice(key);const map={meaning:['future','future','personal','concrete','personal','concrete'],autonomy:['choice','choice','choice','control','responsibility','control'],efficacy:['recovery','effort','evidence','evidence','competence','competence'],method:['diagnosis','strategy','review','strategy','review','strategy'],support:['feedback','understood','feedback','stable','feedback','understood'],execution:['start','clarity','start','persist','persist','clarity'],emotion:['recovery','result','failure','social','recovery','result']};const candidate=map[key]&&choice!==null?map[key][choice]:null;return profile.entries.find(item=>item.m===candidate)||profile.low||profile.highestSource||profile.entries[0];}
function specificHelp(key,mechanism){const help={meaning:{future:'把“分数提高后会多出什么选择”写成学校、城市、专业平台各一条；从中选一条，请老师对应到当前最值得突破的题型。',personal:'在完成任务后补一句“这件事正在帮我成为怎样的人”，把文化课从外部要求重新接回自己的成长感。',concrete:'先选一个可查、可想象的目标画面：学校、城市或大学生活；不急着决定终身，只让未来不再只有一句口号。',path:'把目标写成三栏：当前位置、下一阶段要做到的题型或分数、今天的一步动作。'},autonomy:{internal:'先和老师确认一项任务的价值：它解决什么问题、完成后会带来什么变化；理解意义后，再决定自己的执行顺序。',choice:'在目标和标准不变的前提下，自己决定一次任务顺序、练习方式或反馈时间；完成后按标准自评。',control:'把“被催”改成一次明确协商：老师给边界和截止点，你决定先做什么、怎样做；家长只检查约定结果。',responsibility:'每天复盘一句“今天我为自己的结果做了什么决定”，用可见选择重建责任感，不把一次没完成等同于失败。'},efficacy:{competence:'从一类刚好够得着的任务开始，如 5 道基础题或一个知识点；连续完成后再升级难度，让“我能学会”有真实证据。',evidence:'建立一页“成功证据”：每天只记录一个做对的动作、题型或进步，避免用“我挺努力”这种模糊评价。',effort:'把练习固定成“方法—练习—反馈—再练”四步，让努力有路径，逐步恢复“方法会带来变化”的感受。',recovery:'提前约定失利后的恢复流程：当天只复盘一类错因，次日完成一个低门槛任务，避免一次波动变成长期否定。'},method:{strategy:'每科先保留一种当前主练法，并写明适用场景；先减少“什么都试一点”的混乱，再比较效果。',diagnosis:'把最近 5 道错题按知识、审题、方法、记忆、时间或状态分类；只选最多的一类设计下一次练习。',review:'每次小测后留 10 分钟写“错在哪里、下次改什么、何时验证”，把一次错误变成下一轮可检查调整。',transfer:'把一道例题换成同类新题或限时题再做一次；检查的重点不是“听懂了没有”，而是“换一题还能不能用”。'},support:{understood:'先约定一次不谈分数的 10 分钟沟通，只说最近卡点和最累的地方；被理解是让帮助对准问题的起点。',help:'使用固定求助句式：“我卡在___，试过___，想请你帮我判断___。”每次只带一个问题，降低暴露不会的压力。',feedback:'把“加油、认真点”换成三句具体反馈：哪一步做对了、哪一步错了、下一步先改什么。',stable:'建立固定支持节奏，如每周一次 10 分钟学习回顾；平时谈过程，考差时也只讨论下一步。'},execution:{start:'固定一个 10 分钟启动动作：坐下后直接完成可检查的小任务。目标不是一次学很久，而是让“坐下就能开始”变成习惯。',clarity:'每次开始前写下三件事：先做什么、做到什么算完成、完成后如何反馈。',persist:'先使用 25 分钟专注加 5 分钟休息的节奏，只要求完成一轮；中断时记录原因，不把走神直接解释成不自律。',restart:'准备一个状态掉线后的“重启任务”，如先改 1 道错题或背 5 个词，确保被打断后有明确回来的路。'},emotion:{result:'把注意力从排名转到可控清单：今天复盘什么、练了哪类题、明天验证什么，用过程指标降低结果焦虑。',failure:'考试前先做一组熟悉的基础题；考后只复盘可改部分，不反复预演最坏结果。',social:'把最难受的评价场景说清楚，并请老师和家长把评价改成具体问题与下一步，减少比较和贴标签。',recovery:'列出两个 10 分钟内可完成的恢复动作，如散步、呼吸、倾诉、整理桌面或做基础题；压力出现时先执行一个。'}};return help[key][mechanism]||'';}
function hasBasic(id, keyword){return asText(basicAnswers[id]).includes(keyword);}
function portraitTextParts(state, point, scores){const seen=asText(basicAnswers.seen)||"还没有被充分描述";const remind=asText(basicAnswers.remind)||"没有明显被提醒的部分";const pressure=basicAnswers.pressureReaction||"还没有说明";const hurt=basicAnswers.hurt||"还没有说明";const free=asText(basicAnswers.freeTime)||"还没有说明";const flow=basicAnswers.flow||"还没有说明";const achievement=basicAnswers.achievement||"还没有说明";const future=basicAnswers.futureSelf||"还没有说明";const help=basicAnswers.teacherHelp||"给到更合适的帮助";let base="你的成长底色里有“"+seen+"”这一面，也有“"+remind+"”这些曾经被提醒或被要求调整的部分。这说明你不是一个单一的“成绩好/不好”的学生，而是带着自己的表达方式、保护方式和成长经验来到学习里。";if(hasBasic('seen','想象')||hasBasic('seen','有自己的想法')||hasBasic('seen','有审美')||hasBasic('seen','有才艺'))base="你的成长底色里有很明显的审美、想象、表达或自我感。你不太适合只被标准答案和重复要求推动；当学习能连接到作品、专业、城市和未来空间时，你会更容易被真正点亮。";else if(hasBasic('seen','自律')||hasBasic('seen','肯努力')||hasBasic('seen','懂事'))base="你的成长底色里有责任感和想把事情做好的部分。你不是没有力量，而是这份力量需要一个更清楚的方向和更有效的方法，否则容易变成硬撑。";else if(hasBasic('seen','习惯自己消化')||hasBasic('seen','很少被明确认可'))base="你的成长底色里有一部分习惯把感受放在心里。你可能不是没有想法，也不是没有压力，只是过去被准确看见和回应的时刻不够多。";let outer="你的外在驱动力更多来自被认可、被看见、完成期待和证明自己。你会在意别人怎么看，也会希望自己的努力不是白费。这个部分有力量，但如果只靠外部评价推动，就容易一边想变好，一边被压力消耗。";if(hasBasic('hurt','让别人失望')||hasBasic('oneSentence','辜负'))outer="你的外在驱动力里有很强的责任感：你在意重要的人，不希望让他们失望。这会推着你往前走，但也可能让学习变沉重。下一步要把“不能辜负别人”慢慢转成“我要为自己争取”。";else if(hasBasic('hurt','被否定')||hasBasic('hurt','被比较'))outer="你的外在驱动力里有一部分来自不想被否定、不想被比较、不想被过去的评价定义。这股不甘心很真实，也很有冲劲，但它需要被转化成成长动力，而不是长期停留在证明自己。";let inner="你的内在驱动力藏在“"+free+"”和“"+flow+"”里。你真正投入时，往往不是因为别人催你，而是因为这件事和兴趣、创造、理解、关系或自我成长发生了连接。";if(hasBasic('freeTime','绘画')||hasBasic('freeTime','音乐')||hasBasic('freeTime','写作')||hasBasic('flow','创作'))inner="你的内在驱动力更接近创造和表达。对你来说，文化课不能只被解释成分数，它还需要连接到更好的专业平台、更大的表达空间和更自由的未来选择。";else if(hasBasic('flow','研究')||hasBasic('flow','解题')||hasBasic('freeTime','阅读'))inner="你的内在驱动力里有理解、研究和把事情弄明白的部分。文化课如果被拆成可以攻克的小问题，你会比单纯刷题更容易进入状态。";else if(hasBasic('freeTime','和朋友')||hasBasic('flow','聊天'))inner="你的内在驱动力和关系氛围有关。有人懂你、陪你、给你具体反馈时，你会更容易恢复；孤立地硬撑，反而容易把动力耗掉。";let fragile="你的脆弱点更容易出现在“"+hurt+"”以及压力大时“"+pressure+"”的反应里。这说明影响你的不只是题目难度，还有评价、关系、掌控感和情绪恢复。";if(hasBasic('hurt','失去掌控')||hasBasic('pressureReaction','继续硬撑'))fragile="你的脆弱点和失去掌控有关。你可能表面还在继续，但里面已经很紧。对你来说，真正有效的帮助不是继续加压，而是把任务、节奏和反馈重新变得可控。";else if(hasBasic('hurt','被否定')||hasBasic('hurt','被比较')||hasBasic('hurt','被误解'))fragile="你的脆弱点和被否定、被比较、被误解有关。你需要的不是被贴标签，而是被具体理解：你到底卡在哪里，哪些努力有效，下一步怎么走。";let need="你的深层需要是：既被看见，也被具体带着往前走。你希望老师“"+help+"”，也希望未来自己接近“"+future+"”。所以接下来的干预，不该只是让你更用力，而是帮你把“"+dims[point].label+"”变成一个能开始、能反馈、能看到变化的入口。";if(scores.emotion>=16)need+=" 同时，你的压力风险偏高，任何行动建议都要先降低威胁感，再谈效率和突破。";return{base,outer,inner,fragile,need};}

function buildPersonPortrait(state, point, scores){const p=portraitTextParts(state,point,scores);return `<h3>很高兴认识你</h3><div class="portrait-grid"><div class="portrait-item"><b>成长底色</b><p>${p.base}</p></div><div class="portrait-item"><b>外在驱动力</b><p>${p.outer}</p></div><div class="portrait-item"><b>内在驱动力</b><p>${p.inner}</p></div><div class="portrait-item"><b>脆弱点</b><p>${p.fragile}</p></div><div class="portrait-item" style="grid-column:1/-1"><b>深层需要</b><p>${p.need}</p></div></div>`;}
function buildStrengths(scores){const top=['meaning','autonomy','efficacy','method','support','execution'].sort((a,b)=>scores[b]-scores[a]).slice(0,2);const texts={meaning:'你能把文化课和未来选择连接起来。把这份清楚感继续落到目标、差距和每日任务上，它会成为稳定推进的燃料。',autonomy:'你愿意参与学习选择，也愿意对结果负责。把这种主动性放进计划、节奏和复盘里，能减少被动消耗。',efficacy:'你对“自己能够学会、能够进步”保有一定信心。它可以支持你承受短期波动，并把努力转成持续行动。',method:'你不只是靠刷题硬推，也具备判断方法和调整策略的基础。把这份能力用在高频错因上，能更快形成提分闭环。',support:'你身边存在可用的理解、反馈或求助资源。把支持变成具体协作，能让困难不必全靠一个人硬扛。',execution:'你有把想法变成行动、把任务完成到有结果的能力。配合复盘后，这会是最直接的提分资源。'};return '<div class="strength-grid">'+top.map(key=>'<div class="strength-card"><h3>'+dims[key].label+' · '+scores[key]+'/40</h3><p>'+texts[key]+'</p></div>').join('')+'</div>';}
function buildDimensionDetailCard(k,scores,mechScores){const profile=mechanismProfile(k,mechScores),dominant=k==='emotion'?(profile.mode==='recovery-gap'?profile.recovery:profile.mode==='manageable'?tieEntry(k,profile):profile.highestSource):(profile.mode==='contrast'?profile.high:tieEntry(k,profile));const mechanismsHtml=profile.entries.map(({m,score,label})=>`<div class="mechanism"><span>${label}</span><div class="mini-track"><div class="mini-fill" style="width:${score*10}%;background:${mechanismTone(k,m,score)}"></div></div><b>${score}/10</b></div>`).join('');return `<div class="dimension-card dim-${k}"><h3>${dims[k].label}</h3><div class="detail-section"><span class="detail-label">维度得分 + 类型名</span><div class="score-type"><em>${scores[k]}/40</em><span>主要二级机制：${dominant.label}</span></div></div><div class="detail-section"><span class="detail-label">主维度释义</span><p>${dimensionDeep[k].meaning}</p></div><div class="detail-section"><span class="detail-label">主维度得分及说明</span><p>${scoreDeepText(k,scores[k])}</p></div><div class="detail-section"><span class="detail-label">二级机制释义</span><p>${mechanismDeepText(k)}</p></div><div class="detail-section"><span class="detail-label">二级机制强弱说明</span>${mechanismsHtml}<p class="report-result-note">${mechanismNarrative(k,mechScores)}</p></div><div class="detail-section"><span class="detail-label">对应建议</span>${detailedAdvice(k,scores,mechScores)}</div></div>`;}
function buildJudgement(state,res,risk,structure,point,scores){const mainKey=['meaning','autonomy','efficacy','method','support','execution'].sort((a,b)=>scores[b]-scores[a])[0];const pressure=risk==='低风险'?'情绪目前没有明显吞掉学习资源':risk==='中风险'?'需要留意压力对节奏和效率的影响':'压力已经在消耗学习状态，不能只靠继续加压';return `<div class="summary-box ${scores.emotion>=25?'warn':''}"><p><b>你目前更接近${state}。</b>动机资源处于${res}，${structure.label}，${pressure}。你最可调用的资源是${dims[mainKey].label}；接下来先从<b>${dims[point].label}</b>开始，会比单纯要求自己“更努力”更容易看到变化。</p><p class="report-result-note">这是一份当前学习状态的描述，不是固定标签。它会随着目标、方法、支持和节奏的改变而变化。</p></div>`;}
function buildBottleneck(state,point,scores,mechScores){const profile=mechanismProfile(point,mechScores),entry=profile.mode==='contrast'?profile.low:tieEntry(point,profile);const signal=situationSignal(point)?'情境题里也出现了相近信号，说明这个发展入口在不同作答方式下较一致。':'情境题没有出现明显冲突信号，后续可以结合学习记录继续观察。';const issue=profile.mode==='systemic-low'?`${dims[point].label}的四项二级机制目前一起偏低，更像需要系统性支持，而不是只修一个最弱点。`:profile.mode==='balanced'?`${dims[point].label}内部较平均，目前没有单一机制需要被硬性放大；后续从${entry.label}进入，更容易形成一次完整的改善循环。`:profile.mode==='stable'?`${dims[point].label}并非明显短板。它被选为升级方向，是为了把已有资源用得更精准。`:`${entry.label}（${entry.score}/10）是${dims[point].label}中当前最值得先处理的环节，可以借${profile.high.label}的基础带动它。`;return `<div class="summary-box ${scores.emotion>=25?'warn':''}"><h3>${dims[point].label}</h3><p>${issue}</p><p class="report-result-note">完整的具体行动会放在下一部分展开，避免把同一条建议在报告里重复出现。</p><p class="report-result-note">${signal}</p></div>`;}
function buildActionPlan(state,point,scores,mechScores){const profile=mechanismProfile(point,mechScores),entry=profile.mode==='contrast'?profile.low:tieEntry(point,profile);const major=basicAnswers.major||'当前专业方向';const shared={meaning:{task:`完成一张“未来连接卡”：写下一个想靠近的城市或大学生活、一种和${major}有关的平台、一项希望获得的选择权，并对应一个当前文化课小任务。`,follow:'每次完成文化课任务后，在卡片上补一条“我今天为哪一种选择多走了一步”，连续留下 5 条记录。',support:'老师把未来连接卡翻译成一个可提分题型或知识点；家长少讲大道理，多问“你今天为哪个选择多走了一步”。'},autonomy:{task:'选一个科目或题型，自己决定任务顺序、完成标准和反馈方式，并把决定写下来。',follow:'连续 5 次在学习前写下自己的选择，结束后只按事先定好的标准自评，观察被催后重新进入的速度是否变快。',support:'老师给目标和边界，但允许选择顺序或练法；家长关注是否完成约定，不接管每一个细节。'},efficacy:{task:'选择一类低难度、可提分的固定任务；每次完成一小组，并记录一条“我做到了什么”。',follow:'连续完成 5 次后，把记录按“做对了什么、弄懂了什么、比上次快了什么”分开看，积累真实的成功证据。',support:'老师指出具体进步，不只报结果；家长用“你今天做成了哪一步”代替“怎么还没提高”。'},method:{task:'拿一张最近错题或测验，只分析 5 道，并写出每道题的错因和下一步练法。',follow:'两天后用同类题验证一次：原来的错因有没有减少。只保留有效练法，避免把复盘变成新的负担。',support:'老师校准错因与练法；家长只检查“有没有错因和下一步”，不要求盲目增加题量。'},support:{task:'准备一个固定求助句式：我卡在___，试过___，希望你帮我判断___；每次只带一个问题去求助。',follow:'连续 5 次把得到的反馈写成下一步动作，并在 24 小时内完成其中一项，让支持真正进入学习过程。',support:'老师或家长先听学生把卡点讲清楚，再给一条具体、可执行的建议。'},execution:{task:'把第一个任务缩成 10 分钟能完成的动作，并固定每天的启动时间和完成标准。',follow:'连续 5 次记录实际开始时间、完成结果和被打断后的重启时间；只比较是否更容易开始，不用追求一次做很久。',support:'老师把任务写成可检查产出；家长只协助守住启动时间，不在过程中反复催促。'},emotion:{task:'准备一张“压力重启卡”：写下一个低威胁任务和两个 10 分钟恢复动作，压力来时先按卡执行。',follow:'每次压力出现时只记录触发场景、用了哪个恢复动作、多久重新开始；连续 5 次后找出最有效的一种恢复方式。',support:'老师和家长减少临时加压，用具体边界和具体反馈帮助恢复节奏。'}}[point];const why=profile.mode==='systemic-low'?`这里没有一个单独的“最差机制”，所以不靠找错来推进；先用${entry.label}做可执行入口，带动整组能力慢慢建立。`:profile.mode==='balanced'?`二级机制表现接近，先按情境题提示从${entry.label}进入，避免对着一个并不真实的“最低分”反复用力。`:profile.mode==='stable'?`${dims[point].label}已经有基础，接下来把${entry.label}用得更具体，让它服务于更高阶的学习提升。`:`${entry.label}是当前最能撬动变化的环节，先从这里做，会比全面加量更有效。`;return `<div class="summary-box"><h3>围绕${dims[point].label}的行动方案</h3><p><b>为什么先做这个：</b>${why}</p><p><b>第一个动作：</b>${shared.task}</p><p><b>接下来怎么做：</b>${shared.follow}</p><p><b>老师和家长可以这样帮你：</b>${shared.support}</p><p><b>做到什么程度算有效：</b>留下 5 次以上可检查的过程记录，并能说清楚：我做了什么、遇到什么、下一次准备怎么调整。</p></div>`;}

function buildReportArtifacts(){
  const calculated=calc();
  const scores=calculated.scores||{};
  const rawScores=calculated.rawScores||{};
  const mechScores=calculated.mechScores||{};
  const radarProfiles=calculated.radarProfiles||{};
  const state=stateName(scores);
  const res=resourceLevel(scores);
  const risk=riskLevel(scores.emotion);
  const structure=resourceStructure(scores);
  const point=developmentPoint(scores,state);
  const main=primaryType(scores,mechScores);
  const priorityTitle=pointTitle(state,scores);
  const mainProfile=mechanismProfile(main.key,mechScores);
  const mainMechanism=mainProfile.mode==='contrast'?mainProfile.high:tieEntry(main.key,mainProfile);
  const priorityProfile=mechanismProfile(point,mechScores);
  const priorityMechanism=priorityProfile.mode==='contrast'?priorityProfile.low:tieEntry(point,priorityProfile);
  const priorityDisplay=`${dims[point].label} · ${priorityMechanism.label}`;
  const support100=Math.round(positiveScoreKeys().reduce((sum,key)=>sum+(Number(rawScores[key])||0),0)/240*100);
  const sorted=['meaning','autonomy','efficacy','method','support','execution'].sort((a,b)=>scores[b]-scores[a]);
  const judgementHTML=buildJudgement(state,res,risk,structure,point,scores);
  const summaryHTML=buildPersonPortrait(state,point,{...scores,emotion:Math.round(scores.emotion/40*25)});
  const dimensionDetailsHTML=['meaning','autonomy','efficacy','method','support','execution','emotion'].map(k=>buildDimensionDetailCard(k,scores,mechScores)).join('');
  const strengthsHTML=buildStrengths(scores);
  const bottleneckHTML=buildBottleneck(state,point,scores,mechScores);
  const actionPlanHTML=buildActionPlan(state,point,scores,mechScores);
  const barsHTML=sorted.map(k=>`<div class="bar-row"><b>${dims[k].label}</b><div class="bar-track"><div class="bar-fill" style="width:${scores[k]/40*100}%;background:${tone(scores[k],k)}"></div></div><b>${scores[k]}/40</b></div>`).join('');
  const tagsHTML=`<span class="tag">${res}</span><span class="tag">${risk}</span><span class="tag">${structure.label}</span><span class="tag">主导资源：${dims[main.key].label}</span><span class="tag">${priorityTitle}：${priorityDisplay}</span>`;
  return {scores,rawScores,mechScores,radarProfiles,state,res,risk,structure,point,main,priorityTitle,priorityDisplay,mainMechanism,support100,sorted,judgementHTML,summaryHTML,dimensionDetailsHTML,strengthsHTML,bottleneckHTML,actionPlanHTML,barsHTML,tagsHTML,radarHTML:radar(scores,radarProfiles)};
}

function calc(){
  const raw={},mech={};
  Object.keys(dims).forEach(k=>{raw[k]=[];mech[k]={};Object.keys(mechanisms[k]||{}).forEach(m=>mech[k][m]=[]);});
  coreItems.forEach(item=>{
    const response=answers[item.id];
    const directionScore=item.reverse?6-response:response;
    if(item.dim==='emotion'){
      raw.emotion.push(directionScore); // Q55-Q56 are reverse-scored here only for total risk.
      mech.emotion[item.mech].push(item.mech==='recovery'?response:directionScore);
      return;
    }
    raw[item.dim].push(directionScore);
    mech[item.dim][item.mech].push(directionScore);
  });
  const scores={},rawScores={},mechScores={},radarProfiles={core:{},extension:{}};
  Object.keys(raw).forEach(k=>{
    rawScores[k]=raw[k].reduce((sum,value)=>sum+value,0);
    scores[k]=rawScores[k];
    mechScores[k]={};
    Object.keys(mech[k]).forEach(m=>mechScores[k][m]=mech[k][m].reduce((sum,value)=>sum+value,0));
    if(k!=='emotion'){
      radarProfiles.core[k]=raw[k].filter(value=>value>=4).reduce((sum,value)=>sum+value,0);
      radarProfiles.extension[k]=raw[k].filter(value=>value>=2).reduce((sum,value)=>sum+value,0);
    }
  });
  return{scores,rawScores,mechScores,radarProfiles};
}
function mechanismTone(key,name,score){
  if(key==='emotion'){
    if(name==='recovery')return score>=8?'var(--green)':score>=5?'var(--gold)':'var(--coral)';
    return score>=8?'var(--coral)':score>=5?'var(--gold)':'var(--green)';
  }
  return score>=8?'var(--teal)':score>=5?'var(--gold)':'var(--coral)';
}
function keyMechanism(key,mechScores){
  const entries=Object.entries(mechScores[key]).map(([m,score])=>({m,score,label:mechanisms[key][m]}));
  return key==='emotion'?entries:entries.sort((a,b)=>a.score-b.score);
}
function mechanismProfile(key,mechScores){
  const entries=keyMechanism(key,mechScores);
  if(key==='emotion'){
    const sources=entries.filter(item=>item.m!=='recovery');
    const highestSource=[...sources].sort((a,b)=>b.score-a.score)[0];
    const recovery=entries.find(item=>item.m==='recovery');
    const mode=highestSource.score>=7&&recovery.score<=4?'risk-recovery-gap':highestSource.score>=7?'risk-source':recovery.score<=4?'recovery-gap':'manageable';
    return{entries,highestSource,recovery,mode};
  }
  const sorted=[...entries].sort((a,b)=>a.score-b.score),avg=sorted.reduce((sum,item)=>sum+item.score,0)/sorted.length,gap=sorted[sorted.length-1].score-sorted[0].score;
  return{entries:sorted,avg,gap,low:sorted[0],high:sorted[sorted.length-1],mode:gap<=1?(avg<=4?'systemic-low':avg>=7?'stable':'balanced'):'contrast'};
}
function mechanismNarrative(key,mechScores){
  const profile=mechanismProfile(key,mechScores);
  if(key==='emotion'){
    const source=profile.highestSource,recovery=profile.recovery;
    if(profile.mode==='risk-recovery-gap')return `${source.label}（${source.score}/10）是当前最强的压力触发点，而${recovery.label}（${recovery.score}/10）偏弱，说明状态被影响后不容易自然恢复。先减少触发，再建立固定恢复动作。`;
    if(profile.mode==='risk-source')return `${source.label}（${source.score}/10）较突出，说明压力主要会在这一类场景被点燃；${recovery.label}（${recovery.score}/10）仍是可用资源，可以把恢复动作提前放进学习节奏。`;
    if(profile.mode==='recovery-gap')return `压力来源暂未出现特别突出的单点，但${recovery.label}（${recovery.score}/10）偏弱，说明状态被影响后不容易自然恢复。先建立固定的“暂停—整理—重启”流程，比继续硬撑更有效。`;
    return `三类压力来源和${recovery.label}目前总体可管理。继续保留已有恢复方式，并留意考试或比较情境下的变化，能帮助学习节奏更稳定。`;
  }
  if(profile.mode==='systemic-low')return `四项二级机制都处在较低位置，说明${dims[key].label}当前不是单一小环节的问题，而是整个支持系统还没有建立起来。报告不会把其中任一项误判成“唯一短板”，更适合从一个低门槛入口开始，逐步带动其余机制。`;
  if(profile.mode==='balanced')return `四项二级机制的表现比较接近，当前没有证据表明某一项是唯一短板。这个维度需要的不是反复补一个点，而是用一次完整的小循环，把相关能力一起稳定下来。`;
  if(profile.mode==='stable')return `四项二级机制都较稳定，说明${dims[key].label}已经是可以持续调用的资源。下一步更值得做的是把它用来支持当前相对薄弱的维度，而不是重复补已经具备的能力。`;
  return `${profile.high.label}（${profile.high.score}/10）相对更有基础，说明学生在“${profile.high.label}”上已有可借用资源；${profile.low.label}（${profile.low.score}/10）相对需要关注。更合适的做法是借已有基础，带动这一个较弱环节，而不是把四项同时加量。`;
}
function detailedAdvice(key,scores,mechScores){
  const profile=mechanismProfile(key,mechScores);
  const entry=key==='emotion'?(profile.mode==='recovery-gap'?profile.recovery:profile.mode==='manageable'?tieEntry(key,profile):profile.highestSource):(profile.mode==='contrast'?profile.low:tieEntry(key,profile));
  if(key==='emotion'){
    const opening=profile.mode==='manageable'?'当前没有一个需要被单独放大的压力触发点，重点是保留已有恢复节奏。':`优先从${entry.label}这个情境入口处理，它比笼统要求“别焦虑”更容易落地。`;
    return `<div class="advice-path"><p>${opening} ${specificHelp(key,entry.m)}</p></div>`;
  }
  const mechanismRead=profile.mode==='systemic-low'?`四项机制一起偏低，先选${entry.label}作为实际入口；它不是“唯一短板”，而是此刻最容易开始的一步。`:profile.mode==='balanced'?`四项机制较平均，情境题更提示先从${entry.label}进入；完成一个完整小循环，比反复强调某个分数更有意义。`:profile.mode==='stable'?`四项机制都较稳，${entry.label}可以成为支持其他维度的抓手。`:`先借${profile.high.label}的基础，带动${entry.label}。`;
  return `<div class="advice-path"><p>${mechanismRead} ${specificHelp(key,entry.m)} 老师和家长此阶段优先支持这个动作，而不是只增加任务量。</p></div>`;
}
function positiveScoreKeys(){return ['meaning','autonomy','efficacy','method','support','execution'];}
function normalizedScoreMap(scores){
  const result={};
  positiveScoreKeys().concat(['emotion']).forEach(key=>{result[key]=Math.round((Number(scores[key])||0)/40*25);});
  return result;
}
function currentReportPayload(){
  const artifacts=buildReportArtifacts();
  const {scores,rawScores,mechScores,state,res,risk,structure,point,main,priorityDisplay,support100}=artifacts;
  const supportIndex=positiveScoreKeys().reduce((sum,key)=>sum+(Number(rawScores[key])||0),0);
  return {
    name:basicAnswers.name||'',
    contact:basicAnswers.phone||'',
    basic:cloneState(basicAnswers),
    answerState:{basic:cloneState(basicAnswers),answers:cloneState(answers),situation:cloneState(situationAnswers)},
    answers:{core:cloneState(answers),situation:cloneState(situationAnswers)},
    scores:normalizedScoreMap(scores),
    rawScores:cloneState(rawScores),
    mechScores:cloneState(mechScores),
    supportIndex:Math.round(supportIndex/240*150),
    supportIndex100:support100,
    risk,
    profileName:state,
    profileCode:structure.label,
    representativeName:dims[main.key]?dims[main.key].label:main.label,
    representativeDimension:`${dims[main.key].label} · ${artifacts.mainMechanism.label}`,
    priorityPoint:priorityDisplay,
    diagnosticSentence:artifacts.judgementHTML,
    summaryHTML:artifacts.summaryHTML,
    dimensionDetailsHTML:artifacts.dimensionDetailsHTML,
    strengthsHTML:artifacts.strengthsHTML,
    bottleneckHTML:artifacts.bottleneckHTML,
    actionPlanHTML:artifacts.actionPlanHTML,
    radarHTML:artifacts.radarHTML,
    barsHTML:artifacts.barsHTML,
    tagsHTML:artifacts.tagsHTML,
    judgementHTML:artifacts.judgementHTML,
    adviceHTML:[artifacts.dimensionDetailsHTML,artifacts.strengthsHTML,artifacts.bottleneckHTML,artifacts.actionPlanHTML].join(''),
    reportVersion:'feishu-2026-07'
  };
}
function cloneState(obj){return JSON.parse(JSON.stringify(obj||{}));}

  function createEmptyState() {
    return { basicAnswers: {}, answers: {}, situationAnswers: {} };
  }

  function parseSubmitAnswers(rawAnswers) {
    const state = createEmptyState();
    const list = Array.isArray(rawAnswers) ? rawAnswers : [];
    list.forEach((item) => {
      const qid = String(item.questionId || item.id || "");
      const value = item.value;
      if (!qid) return;
      if (qid.startsWith("basic_")) {
        state.basicAnswers[qid.slice(6)] = value;
        return;
      }
      if (/^s\d+$/.test(qid)) {
        state.situationAnswers[qid] = Array.isArray(value) ? value : [Number(value)];
        return;
      }
      const numId = Number(qid);
      if (!Number.isNaN(numId)) state.answers[numId] = Number(value);
    });
    return state;
  }

  function parseRecordState(parsed) {
    const state = createEmptyState();
    const assessment = parsed.assessmentInfo || {};
    const resultData = assessment.resultData || parsed.resultData || parsed.result || {};
    if (resultData.basic) Object.assign(state.basicAnswers, resultData.basic);
    if (resultData.answerState) {
      Object.assign(state.basicAnswers, resultData.answerState.basic || {});
      Object.assign(state.answers, resultData.answerState.answers || {});
      Object.assign(state.situationAnswers, resultData.answerState.situation || {});
    }
    if (resultData.answers && resultData.answers.core) {
      Object.assign(state.answers, resultData.answers.core);
      Object.assign(state.situationAnswers, resultData.answers.situation || {});
    }
    const fromList = parseSubmitAnswers(assessment.answers || parsed.answers || []);
    Object.assign(state.basicAnswers, fromList.basicAnswers);
    Object.assign(state.answers, fromList.answers);
    Object.assign(state.situationAnswers, fromList.situationAnswers);

    const student = parsed.studentInfo || {};
    if (!state.basicAnswers.name) state.basicAnswers.name = student.name || resultData.name || "";
    if (!state.basicAnswers.phone) state.basicAnswers.phone = student.mobile || resultData.contact || "";
    return state;
  }

  function hasReportContent(reportData) {
    if (!reportData || typeof reportData !== "object") return false;
    return reportData.supportIndex100 != null
      || !!reportData.radarHTML
      || !!reportData.diagnosticSentence
      || !!reportData.dimensionDetailsHTML
      || (reportData.rawScores && Object.keys(reportData.rawScores).length > 0);
  }

  function buildReportArtifactsForState(state) {
    applyState(state || createEmptyState());
    if (!Object.keys(answers).length) return null;
    try {
      return buildReportArtifacts();
    } catch (e) {
      return null;
    }
  }

  function buildReportPayloadForState(state) {
    applyState(state || createEmptyState());
    if (!Object.keys(answers).length) return null;
    try {
      return currentReportPayload();
    } catch (e) {
      return null;
    }
  }

  function buildReportPayloadFromParsed(parsed) {
    return buildReportPayloadForState(parseRecordState(parsed || {}));
  }

  function extractReportData(parsed, record) {
    const assessment = parsed.assessmentInfo || {};
    const resObj = parsed.resultData || parsed.result || {};
    let reportData = assessment.resultData || parsed.resultData || parsed.result || null;
    if (!hasReportContent(reportData) && hasReportContent(resObj)) reportData = resObj;
    if (!hasReportContent(reportData) && hasReportContent(assessment)) reportData = assessment;
    if (!hasReportContent(reportData) && hasReportContent(parsed)) reportData = parsed;
    if (!hasReportContent(reportData) && record && hasReportContent(record)) reportData = record;
    return reportData || {};
  }

  function templateCodeOf(record, parsed) {
    const assessment = (parsed && parsed.assessmentInfo) || {};
    return String(
      (record && record.templateCode)
      || (parsed && parsed.templateCode)
      || assessment.templateCode
      || ""
    ).trim();
  }

  function isLearningStyleTemplate(code, parsed) {
    if (/学习风格|学习模式定位|LEARNING[\s_-]*STYLE|VARK|LSA/i.test(code)) return true;
    const answers = (parsed && parsed.answers)
      || (parsed && parsed.assessmentInfo && parsed.assessmentInfo.answers)
      || [];
    return Array.isArray(answers) && answers.some((item) => /^[VARK]\d+/i.test(String(item && item.questionId || "")));
  }

  function isMotivationTemplate(code, parsed) {
    if (/学习动机|动力系统探索|MOTIVATION/i.test(code)) return true;
    const answers = (parsed && parsed.answers)
      || (parsed && parsed.assessmentInfo && parsed.assessmentInfo.answers)
      || [];
    return Array.isArray(answers) && answers.some((item) => {
      const qid = String(item && item.questionId || "");
      return /^\d+$/.test(qid) || /^s\d+$/i.test(qid) || /^basic_/i.test(qid);
    });
  }

  function parseRecord(record) {
    if (!record) return {};
    if (record.resultJson) {
      try {
        return typeof record.resultJson === "string" ? JSON.parse(record.resultJson) : record.resultJson;
      } catch (e) {
        return {};
      }
    }
    return record;
  }

  function resolveMotivationReport(record) {
    const parsed = parseRecord(record);
    const templateCode = templateCodeOf(record, parsed);
    if (isLearningStyleTemplate(templateCode, parsed) && !isMotivationTemplate(templateCode, parsed)) {
      return {
        error: "wrong_template",
        templateCode,
        redirectId: record && record.id,
        parsed,
        record
      };
    }

    let reportData = extractReportData(parsed, record);
    let rebuilt = null;
    if (!hasReportContent(reportData)) {
      try {
        rebuilt = buildReportPayloadFromParsed(parsed);
      } catch (e) {
        rebuilt = null;
      }
      if (rebuilt && hasReportContent(rebuilt)) reportData = rebuilt;
    }

    if (!hasReportContent(reportData)) {
      return {
        error: "no_content",
        templateCode,
        parsed,
        record
      };
    }

    return {
      parsed,
      record,
      reportData,
      templateCode,
      rebuilt: !!rebuilt
    };
  }

  global.MotivationReportEngine = {
    createEmptyState,
    parseSubmitAnswers,
    parseRecordState,
    hasReportContent,
    buildReportArtifactsForState,
    buildReportPayloadForState,
    buildReportPayloadFromParsed,
    extractReportData,
    templateCodeOf,
    isLearningStyleTemplate,
    isMotivationTemplate,
    parseRecord,
    resolveMotivationReport,
    tone
  };
})(typeof window !== "undefined" ? window : globalThis);
