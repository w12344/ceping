// Learning Mode Report Bundle v2.7

const MODE_ORDER = Object.freeze(["V", "A", "R", "K"]);

const PRIMARY_MODES = Object.freeze({
  V: Object.freeze({ code: "V", label: "视觉模式", description: "先把内容变得看得见，再继续往下学。" }),
  A: Object.freeze({ code: "A", label: "听觉模式", description: "先听一听别人怎么讲，把思路理顺。" }),
  R: Object.freeze({ code: "R", label: "读写模式", description: "先把文字读清，再留下真正要用的提示。" }),
  K: Object.freeze({ code: "K", label: "动觉模式", description: "先做一点或拿例子试一试，再根据结果往下走。" })
});

const SPECIFIC_MODES = Object.freeze({
  image_association: Object.freeze({ id: "image_association", primary: "V", label: "看成图", definition: "把文字、概念变成图、符号或画面来理解和记忆。" }),
  structure_mapping: Object.freeze({ id: "structure_mapping", primary: "V", label: "理关系", definition: "看清知识之间的连接、比较、分类和对应。" }),
  spatial_relationship: Object.freeze({ id: "spatial_relationship", primary: "V", label: "排顺序", definition: "借助位置、排列和先后顺序组织信息。" }),
  interactive_clarification: Object.freeze({ id: "interactive_clarification", primary: "A", label: "问清楚", definition: "通过提问和一问一答，把疑惑弄明白。" }),
  spoken_explanation: Object.freeze({ id: "spoken_explanation", primary: "A", label: "听讲解", definition: "通过听别人解释，把新内容听明白。" }),
  sound_cues: Object.freeze({ id: "sound_cues", primary: "A", label: "念几遍", definition: "通过朗读、重复和声音节奏帮助记忆。" }),
  reading_comprehension: Object.freeze({ id: "reading_comprehension", primary: "R", label: "读明白", definition: "通过课本、笔记、说明和解析理解内容。" }),
  note_organization: Object.freeze({ id: "note_organization", primary: "R", label: "记重点", definition: "把关键词、条件和重要信息记录下来。" }),
  written_synthesis: Object.freeze({ id: "written_synthesis", primary: "R", label: "写总结", definition: "用自己的文字重新整理和表达学到的内容。" }),
  process_rehearsal: Object.freeze({ id: "process_rehearsal", primary: "K", label: "做一遍", definition: "按完整过程亲自完成一次，检验是否真正会做。" }),
  hands_on_operation: Object.freeze({ id: "hands_on_operation", primary: "K", label: "先试做", definition: "先动手尝试，再根据结果和反馈调整。" }),
  contextual_immersion: Object.freeze({ id: "contextual_immersion", primary: "K", label: "用例子", definition: "放进具体题目、案例或情境中理解抽象内容。" })
});

function specificModesFor(primaryCode) {
  if (!Object.hasOwn(PRIMARY_MODES, primaryCode)) throw new RangeError("未知的学习模式");
  return Object.values(SPECIFIC_MODES).filter(({ primary }) => primary === primaryCode);
}



const LEVELS = Object.freeze(["基础巩固", "稳定提升", "冲刺提高"]);
const SUBJECTS = Object.freeze(["语文", "数学", "英语", "日语", "物理", "化学", "生物", "政治", "历史", "地理"]);

const card = (materials, minutes, quantity, task, completionCheck) => Object.freeze({ materials, minutes, quantity, task, completionCheck });

const BASE_TASKS = Object.freeze({
  语文: Object.freeze({
    基础巩固: card("课内一段文字、注释和2个基础问题", 20, "一段文字、2个问题", "找出这段话写了什么、怎么写，完成2个问题。", "合上书后能说出段意，并在原文中找到2处依据。"),
    稳定提升: card("一篇现代文阅读和2道题", 25, "一篇阅读、2道题", "先读题，再回原文找依据，写完2道题。", "每道题都能标出对应句子，答案没有漏掉题目要求。"),
    冲刺提高: card("一组阅读材料和1道主观题", 30, "一组材料、1道主观题", "圈出材料重点，写出观点和两处依据。", "答案有明确观点、两处材料依据，表达紧扣题目。")
  }),
  数学: Object.freeze({
    基础巩固: card("1个公式或定理、2道课本基础题", 20, "1个公式、2道题", "写清公式的使用条件，独立完成2题。", "2题中至少独立完成1题，并能说出公式为什么能用。"),
    稳定提升: card("同一方法的2道变式题", 25, "2道变式题", "分别列出已知条件，完成2题并比一比做法哪里不同。", "两题步骤完整，能指出哪条条件让做法发生变化。"),
    冲刺提高: card("1道含条件变化的综合小题", 30, "1道综合小题", "分清已知、所求和限制条件，再完成求解。", "结果可核对，关键一步写明用了什么条件。")
  }),
  英语: Object.freeze({
    基础巩固: card("本周课本里的8个单词和4个短例句", 20, "8个单词、4个短例句", "记住词义和短语，把4个例句读懂。", "遮住单词后能独立写出6个及以上，并圈出还不稳的词。"),
    稳定提升: card("一篇短阅读和3道题", 25, "一篇短阅读、3道题", "先看题，再回原文找句子，完成3道题。", "每题都在原文旁留下依据，至少独立答对2题。"),
    冲刺提高: card("一篇阅读材料和4道题", 30, "一篇阅读、4道题", "限时完成，再回原文核对每道题的依据。", "4题都写完，能为每题找到原文提示并标出犹豫题。")
  }),
  日语: Object.freeze({
    基础巩固: card("8个词或句型、4个课本短句", 20, "8个词或句型、4个短句", "看懂词义和句型，把4个短句读通。", "遮住提示后能写出6个及以上，并读出4个短句。"),
    稳定提升: card("一段短阅读和3道题", 25, "一段短阅读、3道题", "先读问题，再回原文找词句，完成3道题。", "每题都能在原文找到词句依据，至少独立答对2题。"),
    冲刺提高: card("一段阅读材料和4道题", 30, "一段阅读、4道题", "限时完成，重点核对助词、句型和题干要求。", "4题都完成，能标出每题的原文依据和1处最犹豫的地方。")
  }),
  物理: Object.freeze({
    基础巩固: card("1个规律、1张情境图、2道基础题", 25, "1个规律、2道题", "标出研究对象和已知量，完成2道题。", "至少独立完成1题，图中的量和所用关系能对上。"),
    稳定提升: card("2道同类情境题", 25, "2道同类题", "画出过程，列出关系式，比较条件变化后怎样处理。", "两题关系式有依据，能指出条件变化带来的一个影响。"),
    冲刺提高: card("1道综合情境小题", 30, "1道综合小题", "分清研究对象和过程后再求解，不跳过过程图。", "结果可核对，过程图、量和关系式彼此一致。")
  }),
  化学: Object.freeze({
    基础巩固: card("1组物质变化、条件和2个基础问题", 25, "1组变化、2个问题", "对应物质、条件和现象，完成2个问题。", "至少独立完成1题，化学用语和条件没有混淆。"),
    稳定提升: card("1道实验或反应材料题", 25, "1道材料题、2个小问", "圈出物质、条件和现象，再完成2个小问。", "每个判断都能对应到材料中的现象或条件。"),
    冲刺提高: card("1道含数据或流程的综合小题", 30, "1道综合小题", "逐步写出变化和判断依据，最后核对条件。", "答案写全，结论能回到数据、现象或条件上。")
  }),
  生物: Object.freeze({
    基础巩固: card("1张结构或过程图、2个基础问题", 25, "1张图、2个问题", "认清名称、顺序和功能，完成2个问题。", "图中至少标对主要结构或步骤，并独立完成1题。"),
    稳定提升: card("1段资料或实验材料、2道题", 25, "1段材料、2道题", "圈出变量和材料信息，再写出2道题的依据。", "每个结论都有材料依据，没有把相关当成因果。"),
    冲刺提高: card("1道图表或实验综合小题", 30, "1道综合小题", "先读图表和变量，再组织完整解释。", "结论、变量和证据能一一对应，答案回应全部小问。")
  }),
  政治: Object.freeze({
    基础巩固: card("3个概念、1段生活材料和2个问题", 20, "3个概念、2个问题", "把材料里的事实对应到概念，完成2个问题。", "至少说清1个概念为什么能用，答案不只重复材料。"),
    稳定提升: card("1段时政或生活材料、2道题", 25, "1段材料、2道题", "圈出材料事实，用“观点—依据”写完2道题。", "每个观点后都有材料依据，概念使用准确。"),
    冲刺提高: card("1道材料综合小题", 30, "1道综合小题", "按题目要求列出要点，再把每个要点写完整。", "每个小问都回应到，观点和材料没有错配。")
  }),
  历史: Object.freeze({
    基础巩固: card("一个时期的6个事件和课本页", 20, "6个事件", "排清时间，补出事件的背景或影响。", "遮住课本后能按顺序说出4个事件及其中2个联系。"),
    稳定提升: card("1组材料和2道题", 25, "1组材料、2道题", "找出时间、人物或事件线索，再完成2道题。", "每个答案都能回到材料或已学事实，时间不串。"),
    冲刺提高: card("1道材料分析小题", 30, "1道材料小题", "先分清材料说了什么，再写观点和两处证据。", "有明确观点和两处证据，回答没有超出材料和史实。")
  }),
  地理: Object.freeze({
    基础巩固: card("1张区域图、4个图例或位置点、2道题", 20, "1张区域图、2道题", "标出位置、方向和图例，完成2道题。", "至少独立完成1题，能说清一个位置条件带来的结果。"),
    稳定提升: card("1组区域图表和2道题", 25, "1组图表、2道题", "圈出图表条件，写出“条件—过程—结果”。", "两道题都有图表依据，过程和空间条件对得上。"),
    冲刺提高: card("1道区域分析或图表综合小题", 30, "1道综合小题", "先列关键条件，再组织两组因果关系。", "每组关系都能回到图表信息，答案回应全部小问。")
  })
});

const LIGHT_SUPPORT = Object.freeze({ V: "再画出关系或顺序。", A: "再听一遍关键理由。", R: "再写下关键词或一句结论。", K: "再拿一个相似例子试一次。" });
const TASK_MODE_START = Object.freeze({
  V: "先把材料里的关键关系画成一张小图或几栏。",
  A: "先找一小段相关讲解，听清最关键的一组关系。",
  R: "先把材料里的关键词和条件写在草稿旁。",
  K: "先挑材料里的一小部分，动手做或推一步。"
});
const TASK_SUBJECT_FOCUS = Object.freeze({
  语文: "原文句子、写法和答题依据", 数学: "已知条件、公式和解题步骤", 英语: "单词、短语和原文句子", 日语: "助词、句型和课本短句", 物理: "研究对象、受力和过程", 化学: "物质、条件和现象", 生物: "变量、过程和结果", 政治: "材料事实、概念和观点", 历史: "时间、事件和前后关系", 地理: "位置条件、过程和结果"
});
const SPECIFIC_TASK_START = Object.freeze({
  image_association: (focus) => `给${focus}各配一个小图或记号。`,
  structure_mapping: (focus) => `把${focus}用线连起来。`,
  spatial_relationship: (focus) => `把${focus}按先后或位置排开。`,
  interactive_clarification: (focus) => `圈出${focus}里一个没懂的地方，去问清。`,
  spoken_explanation: (focus) => `找一小段讲${focus}的讲解，听清它在说什么。`,
  sound_cues: (focus) => `把${focus}里最关键的词句读出声，读到顺口。`,
  reading_comprehension: (focus) => `把题目和${focus}来回读一遍。`,
  note_organization: (focus) => `把${focus}里的重要词和条件记在草稿旁。`,
  written_synthesis: (focus) => `用自己的话写一句${focus}之间的关系。`,
  process_rehearsal: (focus) => `挑一个小问，按${focus}相关步骤完整做一遍。`,
  hands_on_operation: (focus) => `挑一个条件或例子，围绕${focus}先试一步。`,
  contextual_immersion: (focus) => `找一个具体例子，看${focus}怎么用在题里。`
});
const TASK_FOLLOW_UP = Object.freeze({
  语文: "做完后，把每个答案对应回原文句子，看看有没有漏掉题目要求。",
  数学: "做完后，圈出两题里条件不同的地方，核对做法为什么跟着变。",
  英语: "做完后，遮住释义和原文提示，圈出还不能独立说出的词句。",
  日语: "做完后，遮住中文提示，圈出还不能独立读出的词和句型。",
  物理: "做完后，回看过程图，核对研究对象、方向和关系式能不能对上。",
  化学: "做完后，回看物质、条件和现象，核对每个判断有没有依据。",
  生物: "做完后，回到材料核对变量和结果，看看结论有没有超出证据。",
  政治: "做完后，回到材料核对每个观点有没有对应的事实和概念。",
  历史: "做完后，回到课本或材料核对时间、背景和影响有没有串。",
  地理: "做完后，回到图表核对位置条件、过程和结果能不能一一对上。"
});

const SUBJECT_MODE_EXAMPLES = Object.freeze({
  语文: Object.freeze({ V: "例如阅读题里，“写什么、怎么写、为什么这样写”和原文句子会放在一起看。", A: "例如老师讲清段意和写法后，更容易抓住这段话在说什么。", R: "例如答题时，题目要问的词和原文依据会被标在一起。", K: "例如解释关键句时，会把它放回上下文看它起什么作用。" }),
  数学: Object.freeze({ V: "例如一道题里，已知、所求、关键条件和公式之间的关系会画在同一张草稿上。", A: "例如老师讲清每一步为什么这样算后，更容易跟上解题思路。", R: "例如草稿边上会留下已知条件和公式成立的条件。", K: "例如会先把题里的一个数代进关系式，看下一步要求什么。" }),
  英语: Object.freeze({ V: "例如一组单词会按“人物、地点、动作”放进候机或画室这样的画面里。", A: "例如听完课本短语的讲解后，更容易把短语和意思对上。", R: "例如阅读题问什么和支持答案的原文句子会标在一起。", K: "例如课本短句里的人会换成自己或同学，再把整句说一遍。" }),
  日语: Object.freeze({ V: "例如本课词和句型会放进“在教室打招呼”这样的一段小对话里。", A: "例如听完课本短句的讲解后，更容易听懂句型的用法。", R: "例如句子里的助词、句型和它们的意思会标在一起。", K: "例如课本短句里的人会换成自己或同学，再把整句说一遍。" }),
  物理: Object.freeze({ V: "例如题目中的研究对象、运动过程、力和已知量会画在同一张过程图上。", A: "例如老师讲清物体怎么动、哪个力在起作用后，更容易跟上过程。", R: "例如草稿上会列出已知量、单位和能用的关系式。", K: "例如会先把一个已知量代进关系式，看看下一步要算什么。" }),
  化学: Object.freeze({ V: "例如反应物、条件、现象和生成物会用箭头排成一条变化线。", A: "例如老师讲清“加什么、看到什么、说明什么”后，更容易跟上实验过程。", R: "例如物质、反应条件和实验现象会分开记在草稿上。", K: "例如会先根据一个现象判断变化，再回头核对。" }),
  生物: Object.freeze({ V: "例如结构、发生过程和功能会画在同一张图上，用箭头连起来。", A: "例如听老师顺着讲一个生命过程后，更容易记住先后关系。", R: "例如材料里的变量、结果和需要解释的现象会被圈出来。", K: "例如会根据一组变量变化先判断结果，再核对材料证据。" }),
  政治: Object.freeze({ V: "例如材料事实、对应概念和结论会分成三栏，用线连起来。", A: "例如听老师把材料和课本概念连起来讲后，更容易跟上思路。", R: "例如题目要求、材料事实和能用的概念会标在一起。", K: "例如材料中的一句话会放进一个概念里试着解释。" }),
  历史: Object.freeze({ V: "例如一个时期的事件会放到时间线上，再连出背景、经过和影响。", A: "例如听老师按时间顺序讲事件后，更容易记住它和前后事件的关系。", R: "例如材料里的时间、人物、事件会和对应的课本知识标在一起。", K: "例如一道事件题会先补全背景和影响，再回到课本核对。" }),
  地理: Object.freeze({ V: "例如区域图上的经纬度、海陆位置和地形，会连到气候或产业结果。", A: "例如听老师讲清位置条件怎样带来结果后，更容易读懂区域图。", R: "例如图表里的位置条件、过程和结果会分三行记在草稿上。", K: "例如一道区域题会先拿临海或地形条件推出可能的结果。" })
});

const SUBJECT_MECHANISM_EXAMPLES = Object.freeze({
  语文: Object.freeze({ image_association: "例如人物、场景和情绪会各配一个小图或记号。", structure_mapping: "例如“写什么、怎么写、为什么这样写”会和原文句子连起来。", spatial_relationship: "例如叙事的起因、经过和结果会按先后排在纸上。", interactive_clarification: "例如读到关键句时，会问“这句话为什么这样写”。", spoken_explanation: "例如会听老师把段意、写法和原文依据顺着讲清。", sound_cues: "例如课文里的关键句会读几遍，读到语气顺口。", reading_comprehension: "例如题目要求和原文依据会来回读清。", note_organization: "例如关键词和答题要求会记在草稿旁。", written_synthesis: "例如会用自己的话写出这段话的段意和写法。", process_rehearsal: "例如会从读题、回原文到写答案，完整做一道阅读题。", hands_on_operation: "例如会先拿一句关键句试着说清它在文中的作用。", contextual_immersion: "例如会把一个写法放回另一段文字里看看怎么用。" }),
  数学: Object.freeze({ image_association: "例如已知、所求和关键条件会各配一个记号。", structure_mapping: "例如条件和公式会用线连起来，看清为什么能用。", spatial_relationship: "例如解题的几个步骤会按先后排在纸上。", interactive_clarification: "例如卡在一个条件时，会问“这个条件为什么要用”。", spoken_explanation: "例如会听老师把每一步为什么这样算顺着讲清。", sound_cues: "例如公式的使用条件会按顺序念几遍。", reading_comprehension: "例如题目条件和例题说明会来回读清。", note_organization: "例如已知条件和公式条件会记在草稿旁。", written_synthesis: "例如会用自己的话写出这道题该用什么方法。", process_rehearsal: "例如会从读条件、列式到核对结果，完整做一遍。", hands_on_operation: "例如会先拿一个条件代进关系式试一试。", contextual_immersion: "例如会把一个公式放进具体小题里看看怎么用。" }),
  英语: Object.freeze({ image_association: "例如单词、短语和句子意思会各配一个小图或记号。", structure_mapping: "例如题目问题和支持答案的原文句子会连起来。", spatial_relationship: "例如句子里的动作和时间会按顺序排出来。", interactive_clarification: "例如读到原文句时，会问“这句话为什么能选这个答案”。", spoken_explanation: "例如会听老师把短语的意思和用法顺着讲清。", sound_cues: "例如单词、短语和例句会按顺序念几遍。", reading_comprehension: "例如题目和原文句子会来回读清。", note_organization: "例如生词、短语和原文依据会记在草稿旁。", written_synthesis: "例如会用自己的话写出句子意思和答题依据。", process_rehearsal: "例如会从看题、回原文到选答案，完整做一遍。", hands_on_operation: "例如会先拿一个短语放进课本句子试一试。", contextual_immersion: "例如会把一个短语放进具体句子里看看怎么用。" }),
  日语: Object.freeze({ image_association: "例如单词、助词和句型会各配一个小图或记号。", structure_mapping: "例如句型、助词和句子意思会连起来看。", spatial_relationship: "例如句子里的动作和时间会按顺序排出来。", interactive_clarification: "例如读到短句时，会问“这里为什么用这个助词”。", spoken_explanation: "例如会听老师把短句的意思和句型用法顺着讲清。", sound_cues: "例如单词、助词和短句会按顺序念几遍。", reading_comprehension: "例如题目要求和原文短句会来回读清。", note_organization: "例如助词、句型和关键词会记在草稿旁。", written_synthesis: "例如会用自己的话写出句子的意思和句型用法。", process_rehearsal: "例如会从读题、找原句到写答案，完整做一遍。", hands_on_operation: "例如会先拿一个句型换进课本短句试一试。", contextual_immersion: "例如会把一个句型放进具体短句里看看怎么用。" }),
  物理: Object.freeze({ image_association: "例如研究对象、力和已知量会各配一个记号。", structure_mapping: "例如过程、受力和关系式会用线连起来。", spatial_relationship: "例如运动过程的几个阶段会按先后排在纸上。", interactive_clarification: "例如看过程图时，会问“这个力为什么要画出来”。", spoken_explanation: "例如会听老师把物体怎么动、哪个力在起作用顺着讲清。", sound_cues: "例如受力和公式条件会按顺序念几遍。", reading_comprehension: "例如题目条件和过程图会来回读清。", note_organization: "例如已知量、单位和关系式会记在草稿旁。", written_synthesis: "例如会用自己的话写出这个过程该怎么列式。", process_rehearsal: "例如会从画过程、列关系式到求结果，完整做一遍。", hands_on_operation: "例如会先拿一个已知量代进关系式试一试。", contextual_immersion: "例如会把一个受力过程放进具体小题里看看怎么用。" }),
  化学: Object.freeze({ image_association: "例如物质、条件和实验现象会各配一个记号。", structure_mapping: "例如反应物、条件、现象和生成物会用线连起来。", spatial_relationship: "例如实验操作的先后会按顺序排在纸上。", interactive_clarification: "例如看到一种现象时，会问“这个现象说明什么”。", spoken_explanation: "例如会听老师把加什么、看到什么、说明什么顺着讲清。", sound_cues: "例如反应条件和实验现象会按顺序念几遍。", reading_comprehension: "例如实验材料和化学用语会来回读清。", note_organization: "例如物质、条件和现象会记在草稿旁。", written_synthesis: "例如会用自己的话写出这一步变化说明什么。", process_rehearsal: "例如会从读材料、判断变化到写结论，完整做一遍。", hands_on_operation: "例如会先根据一个现象试着判断发生了什么变化。", contextual_immersion: "例如会把一个实验现象放进具体题里看看怎么用。" }),
  生物: Object.freeze({ image_association: "例如结构、变量和结果会各配一个小图或记号。", structure_mapping: "例如结构、过程和功能会用线连起来。", spatial_relationship: "例如生命过程的先后会按顺序排在纸上。", interactive_clarification: "例如看到一个变量时，会问“它为什么会影响结果”。", spoken_explanation: "例如会听老师把一个生命过程的先后和作用顺着讲清。", sound_cues: "例如结构名称和过程顺序会按顺序念几遍。", reading_comprehension: "例如实验材料、变量和结果会来回读清。", note_organization: "例如变量、结果和现象会记在草稿旁。", written_synthesis: "例如会用自己的话写出这个现象和变量的关系。", process_rehearsal: "例如会从读材料、找变量到写结论，完整做一遍。", hands_on_operation: "例如会先根据一组变量变化试着判断结果。", contextual_immersion: "例如会把一个实验结果放进具体题里看看怎么用。" }),
  政治: Object.freeze({ image_association: "例如材料事实、概念和结论会各配一个记号。", structure_mapping: "例如材料事实和课本概念会用线连起来。", spatial_relationship: "例如材料里的事情发展会按先后排在纸上。", interactive_clarification: "例如读到材料一句话时，会问“它能说明哪个概念”。", spoken_explanation: "例如会听老师把材料事实怎样连到课本概念顺着讲清。", sound_cues: "例如概念和材料事实会按顺序念几遍。", reading_comprehension: "例如题目要求、材料事实和概念会来回读清。", note_organization: "例如材料事实和能用的概念会记在草稿旁。", written_synthesis: "例如会用自己的话写出观点和材料依据。", process_rehearsal: "例如会从读材料、找观点到写依据，完整做一遍。", hands_on_operation: "例如会先拿一句材料试着解释一个概念。", contextual_immersion: "例如会把一个材料事实放进具体题里看看怎么用。" }),
  历史: Object.freeze({ image_association: "例如时间、人物和事件会各配一个小图或记号。", structure_mapping: "例如背景、经过和影响会用线连起来。", spatial_relationship: "例如一个时期的事件会按先后排到时间线上。", interactive_clarification: "例如读到材料一句话时，会问“它能说明什么历史背景”。", spoken_explanation: "例如会听老师把为什么发生、后来怎样、带来什么影响顺着讲清。", sound_cues: "例如时间、事件和影响会按顺序念几遍。", reading_comprehension: "例如材料里的时间、人物和事件会来回读清。", note_organization: "例如时间、人物和结论会记在草稿旁。", written_synthesis: "例如会用自己的话写出事件的背景和影响。", process_rehearsal: "例如会从读材料、排时间到写答案，完整做一遍。", hands_on_operation: "例如会先拿一个事件试着补全背景和影响。", contextual_immersion: "例如会把一个历史事件放进具体材料题里看看怎么用。" }),
  地理: Object.freeze({ image_association: "例如经纬度、海陆位置和地形会各配一个小图或记号。", structure_mapping: "例如位置条件、过程和结果会用线连起来。", spatial_relationship: "例如区域变化的几个环节会按先后排在纸上。", interactive_clarification: "例如看到一个图表条件时，会问“它会带来什么结果”。", spoken_explanation: "例如会听老师把位置条件怎样带来气候或产业结果顺着讲清。", sound_cues: "例如位置条件和对应结果会按顺序念几遍。", reading_comprehension: "例如区域图、图例和题干条件会来回读清。", note_organization: "例如位置、过程和结果会记在草稿旁。", written_synthesis: "例如会用自己的话写出区域条件会带来什么结果。", process_rehearsal: "例如会从读图表、找条件到写结论，完整做一遍。", hands_on_operation: "例如会先拿一个位置条件试着推出结果。", contextual_immersion: "例如会把一个区域条件放进具体题里看看怎么用。" })
});

function requireSubject(subject) {
  if (!SUBJECTS.includes(subject)) throw new RangeError("未知的报告学科");
  return subject;
}

function requireLevel(learningLevel) {
  if (!LEVELS.includes(learningLevel)) throw new RangeError("未知的学习阶段");
  return learningLevel;
}

function preferredSpecific(primaryCode, rates, opportunities, scores) {
  return specificModesFor(primaryCode)
    .filter(({ id }) => (opportunities[id] ?? 0) >= 3)
    .sort((left, right) => (rates[right.id] ?? 0) - (rates[left.id] ?? 0)
      || (scores[right.id] ?? 0) - (scores[left.id] ?? 0))[0] ?? null;
}

function entryFor(primaryCode, rates, opportunities, scores) {
  return preferredSpecific(primaryCode, rates, opportunities, scores);
}

function parallelEntry(candidates, rates, opportunities, scores) {
  return candidates
    .flatMap((primaryCode) => specificModesFor(primaryCode))
    .filter(({ id }) => (opportunities[id] ?? 0) >= 3)
    .sort((left, right) => (rates[right.id] ?? 0) - (rates[left.id] ?? 0)
      || (scores[right.id] ?? 0) - (scores[left.id] ?? 0))[0] ?? null;
}

function taskStart(subject, primaryCode, entry) {
  if (!entry) return TASK_MODE_START[primaryCode];
  return `先用“${SPECIFIC_MODES[entry.id].label}”开始：${SPECIFIC_TASK_START[entry.id](TASK_SUBJECT_FOCUS[subject])}`;
}

function subjectModeExample(subject, primaryCode) {
  requireSubject(subject);
  if (!Object.hasOwn(PRIMARY_MODES, primaryCode)) throw new RangeError("未知的学习模式");
  return SUBJECT_MODE_EXAMPLES[subject][primaryCode];
}

function subjectMechanismExample(subject, specificMode) {
  requireSubject(subject);
  if (!Object.hasOwn(SUBJECT_MECHANISM_EXAMPLES[subject], specificMode)) throw new RangeError("未知的具体学习方式");
  return SUBJECT_MECHANISM_EXAMPLES[subject][specificMode];
}

function buildTaskCard({ subject, learningLevel, classification, specificRates = {}, specificOpportunities = {}, specificScores = {}, answeredCount = 20 }) {
  requireSubject(subject);
  requireLevel(learningLevel);
  if (!classification || !["clear", "primary_supporting", "parallel"].includes(classification.kind)) throw new TypeError("学习模式结论无效");
  const base = BASE_TASKS[subject][learningLevel];
  const shared = { heading: `${subject}｜${learningLevel}`, subject, learningLevel, ...base };

  if (classification.kind === "parallel") {
    const candidates = classification.candidates?.filter((code) => Object.hasOwn(PRIMARY_MODES, code));
    if (!candidates || candidates.length < 2) throw new TypeError("并列学习模式无效");
    // 作答不足时，二级方式的比例很容易被一两次选择放大；这时给出学科任务即可，不替学生指定细节入口。
    const entry = answeredCount >= 10 ? parallelEntry(candidates, specificRates, specificOpportunities, specificScores) : null;
    return Object.freeze({
      ...shared,
      firstStep: entry ? `${taskStart(subject, entry.primary, entry)} ${base.task}` : base.task,
      secondStep: TASK_FOLLOW_UP[subject],
      startChoices: Object.freeze([]),
      primarySpecific: entry?.id ?? null,
      supportingMode: null
    });
  }

  if (!Object.hasOwn(PRIMARY_MODES, classification.primary)) throw new TypeError("主要学习模式无效");
  const entry = entryFor(classification.primary, specificRates, specificOpportunities, specificScores);
  const support = classification.kind === "primary_supporting" ? classification.supporting : null;
  if (support && !Object.hasOwn(PRIMARY_MODES, support)) throw new TypeError("辅助学习模式无效");
  return Object.freeze({
    ...shared,
    firstStep: `${taskStart(subject, classification.primary, entry)} ${base.task}`,
    secondStep: support ? `${TASK_FOLLOW_UP[subject]} ${LIGHT_SUPPORT[support]}` : TASK_FOLLOW_UP[subject],
    startChoices: Object.freeze([]),
    primarySpecific: entry?.id ?? null,
    supportingMode: support
  });
}

{ LEVELS, SUBJECTS };



function requireAnswerSlots(answers, questions, label) {
  if (!Array.isArray(answers) || answers.length !== questions.length) throw new Error(`需要完成${questions.length}道${label}`);
  const byId = new Map(questions.map((question) => [question.id, question]));
  const seen = new Set();
  return answers.map((answer) => {
    const question = byId.get(answer?.questionId);
    if (!question || seen.has(answer.questionId)) throw new Error(`${label}题目无效或重复`);
    seen.add(answer.questionId);
    return { answer, question };
  });
}

function selectedOptions(answer, question) {
  if (answer?.skipped !== undefined) throw new Error("不支持跳过题目");
  if (!Array.isArray(answer?.optionIds) || answer.optionIds.length === 0) throw new Error("请至少选择一项");
  const ids = [...new Set(answer.optionIds)];
  if (ids.length !== answer.optionIds.length) throw new Error("同一选项不能重复选择");
  const byId = new Map(question.options.map((option) => [option.id, option]));
  return ids.map((id) => {
    const option = byId.get(id);
    if (!option) throw new Error("选项无效");
    return option;
  });
}

function mapRates(scores, denominators) {
  return Object.fromEntries(Object.entries(scores).map(([id, score]) => {
    const denominator = typeof denominators === "number" ? denominators : denominators[id];
    return [id, denominator === 0 ? 0 : score / denominator];
  }));
}

function rankedRows(scores, rates) {
  return MODE_ORDER.map((mode) => ({ mode, score: scores[mode], rate: rates[mode] }))
    .sort((left, right) => right.rate - left.rate || right.score - left.score || MODE_ORDER.indexOf(left.mode) - MODE_ORDER.indexOf(right.mode));
}

function parallel(candidates) {
  return Object.freeze({ kind: "parallel", primary: null, supporting: null, candidates: Object.freeze(candidates) });
}

function clear(primary) {
  return Object.freeze({ kind: "clear", primary, supporting: null, candidates: Object.freeze([primary]) });
}

function primarySupporting(primary, supporting) {
  return Object.freeze({ kind: "primary_supporting", primary, supporting, candidates: Object.freeze([primary, supporting]) });
}

function classifyLearningModes({ answeredCount, ranked } = {}) {
  if (!Number.isInteger(answeredCount) || !Array.isArray(ranked) || ranked.length !== MODE_ORDER.length) throw new TypeError("学习模式结果无效");
  if (answeredCount < 10) return parallel([...MODE_ORDER]);
  const close = ranked.filter((row) => ranked[0].rate - row.rate <= 0.1 + Number.EPSILON);
  if (close.length === 1) return clear(close[0].mode);
  if (close.length === 2 && close[0].rate > close[1].rate) return primarySupporting(close[0].mode, close[1].mode);
  return parallel(close.map(({ mode }) => mode));
}

function scoreScenarioAnswers(answers, questions) {
  const pairs = requireAnswerSlots(answers, questions, "基础题");
  const scores = Object.fromEntries(MODE_ORDER.map((mode) => [mode, 0]));
  const specificScores = Object.fromEntries(Object.keys(SPECIFIC_MODES).map((id) => [id, 0]));
  const specificOpportunities = Object.fromEntries(Object.keys(SPECIFIC_MODES).map((id) => [id, 0]));
  const answeredCount = questions.length;

  for (const { answer, question } of pairs) {
    const selected = selectedOptions(answer, question);
    for (const option of question.options) specificOpportunities[option.specificMode] += 1;
    for (const option of selected) {
      scores[option.mode] += 1;
      specificScores[option.specificMode] += 1;
    }
  }

  const rates = mapRates(scores, answeredCount);
  const specificRates = mapRates(specificScores, specificOpportunities);
  const totalSelectedOptions = Object.values(scores).reduce((sum, count) => sum + count, 0);
  const averageSelectionsPerAnsweredQuestion = answeredCount === 0 ? 0 : totalSelectedOptions / answeredCount;
  const skipRate = 0;
  const ranked = rankedRows(scores, rates);
  const classification = classifyLearningModes({ answeredCount, ranked });

  return Object.freeze({
    answeredCount,
    skippedQuestionIds: Object.freeze([]),
    scores: Object.freeze(scores),
    rates: Object.freeze(rates),
    specificScores: Object.freeze(specificScores),
    specificOpportunities: Object.freeze(specificOpportunities),
    specificRates: Object.freeze(specificRates),
    totalSelectedOptions,
    averageSelectionsPerAnsweredQuestion,
    skipRate,
    ranked: Object.freeze(ranked.map(Object.freeze)),
    classification
  });
}


const QUESTION_BANK_VERSION = "scenario-mode-bank-v4";

const option = (id, mode, specificMode, text) => Object.freeze({ id, mode, specificMode, text });
const question = (id, group, prompt, options) => Object.freeze({ id, group, prompt, options: Object.freeze(options) });

const QUESTIONS = Object.freeze([
  question("Q01", "learn", "老师刚讲完一个新内容，你还没弄懂。你会——", [option("Q01-A", "V", "structure_mapping", "画出几个重点怎么连。"), option("Q01-B", "A", "interactive_clarification", "说出没懂的地方，去问清。"), option("Q01-C", "R", "reading_comprehension", "回到笔记，把这一段再读一遍。"), option("Q01-D", "K", "contextual_immersion", "找一道用到这个新内容的小题，看看它具体怎么用。")]),
  question("Q02", "learn", "有几个新词要记。你会——", [option("Q02-A", "V", "image_association", "给每个词配一个记号或小图。"), option("Q02-B", "A", "sound_cues", "读出来，读到顺口为止。"), option("Q02-C", "R", "note_organization", "每个只记一个关键词。"), option("Q02-D", "K", "contextual_immersion", "用这个词自己造一句话。")]),
  question("Q03", "learn", "一套方法有好几步，你想把顺序记清。你会——", [option("Q03-A", "V", "spatial_relationship", "用箭头把顺序排出来。"), option("Q03-B", "A", "sound_cues", "按顺序把这些步骤念几遍。"), option("Q03-C", "R", "note_organization", "把每一步要做什么，写下来。"), option("Q03-D", "K", "process_rehearsal", "找一道短题，照着步骤完整做一遍。")]),
  question("Q04", "learn", "新学的内容和以前学过的很像，容易混。你会——", [option("Q04-A", "V", "image_association", "给新旧内容各配一个不同的小图或符号。"), option("Q04-B", "A", "interactive_clarification", "问别人：“它们到底差在哪？”"), option("Q04-C", "R", "written_synthesis", "用自己的话写一句它们最关键的区别。"), option("Q04-D", "K", "hands_on_operation", "各找一道小题，分别试一步。")]),
  question("Q05", "learn", "看一张解题流程图时，有一步没看懂。你会——", [option("Q05-A", "A", "interactive_clarification", "指着这一步，请人讲讲。"), option("Q05-B", "R", "reading_comprehension", "读这一步旁边的说明。"), option("Q05-C", "K", "hands_on_operation", "在草稿上，照着前一步接着写。"), option("Q05-D", "V", "spatial_relationship", "看看这一步该接在哪一步后面。")]),
  question("Q06", "remember", "一条规则配着一道例题，你想知道规则怎么用。你会——", [option("Q06-A", "A", "spoken_explanation", "听别人讲这条规则怎么用。"), option("Q06-B", "R", "reading_comprehension", "再读一遍规则和例题旁的说明。"), option("Q06-C", "K", "process_rehearsal", "盖住例题，照着规则完整做一遍。"), option("Q06-D", "V", "image_association", "用小图画出这条规则在例题里怎么用。")]),
  question("Q07", "remember", "一个概念总记不住。你会——", [option("Q07-A", "A", "spoken_explanation", "听老师或同学讲讲，这个概念到底是什么意思。"), option("Q07-B", "R", "note_organization", "写下它的重要关键词。"), option("Q07-C", "K", "contextual_immersion", "拿刚才的例题，看看这个概念怎么用。"), option("Q07-D", "V", "image_association", "画一个和它有关的小图。")]),
  question("Q08", "remember", "一道错题知道答案了，但不知道自己错在哪。你会——", [option("Q08-A", "A", "interactive_clarification", "说说自己当时怎么想，再问问错在哪。"), option("Q08-B", "R", "note_organization", "写下这次错的是哪一步。"), option("Q08-C", "K", "process_rehearsal", "盖住答案，按正确方法完整做一遍。"), option("Q08-D", "V", "structure_mapping", "把自己的做法和正确做法放一起看。")]),
  question("Q09", "remember", "做题时条件很多，不知道先用哪一个。你会——", [option("Q09-A", "R", "reading_comprehension", "重读题目，弄清每个条件的意思。"), option("Q09-B", "K", "hands_on_operation", "挑一个条件，在草稿上试着用一用。"), option("Q09-C", "V", "structure_mapping", "看条件和问题怎么连。"), option("Q09-D", "A", "interactive_clarification", "把判断说给同学听，问问有没有漏。")]),
  question("Q10", "remember", "你要把一个重点讲给同学听。你会——", [option("Q10-A", "R", "written_synthesis", "先用自己的话写下来。"), option("Q10-B", "K", "contextual_immersion", "找一道老师讲过的例题来说明。"), option("Q10-C", "V", "structure_mapping", "先画一张关系图。"), option("Q10-D", "A", "spoken_explanation", "先听老师或同学讲讲，这个重点怎么解释。")]),
  question("Q11", "practice", "零散的内容很多，想整理好以后复习。你会——", [option("Q11-A", "R", "written_synthesis", "用自己的话，把这些内容分成几条写下来。"), option("Q11-B", "K", "contextual_immersion", "给每一类内容配一个具体例子。"), option("Q11-C", "V", "image_association", "给每一类内容画一个不同记号。"), option("Q11-D", "A", "spoken_explanation", "听同学把这些内容分成几类讲一讲。")]),
  question("Q12", "practice", "老师教了一套检查答案的方法，你想下次自己也会用。你会——", [option("Q12-A", "R", "note_organization", "给每一步记一个提醒词。"), option("Q12-B", "K", "process_rehearsal", "拿一道做完的题，照着这套方法完整检查一遍。"), option("Q12-C", "V", "spatial_relationship", "用箭头把几个检查步骤按先后连起来。"), option("Q12-D", "A", "sound_cues", "把几个检查步骤按顺序念几遍。")]),
  question("Q13", "practice", "准备课堂展示时，你想先把整个过程理清。你会——", [option("Q13-A", "K", "process_rehearsal", "从上台到结束，实际排练一遍。"), option("Q13-B", "V", "spatial_relationship", "把展示的几部分按先后排在纸上。"), option("Q13-C", "A", "sound_cues", "把开头和衔接的话小声念几遍。"), option("Q13-D", "R", "note_organization", "写下每一部分要说什么。")]),
  question("Q14", "practice", "一道题有两种做法，不知道用哪一种。你会——", [option("Q14-A", "K", "hands_on_operation", "两种做法各试一步，看哪种接得上。"), option("Q14-B", "V", "structure_mapping", "看两种做法各适合哪些条件。"), option("Q14-C", "A", "interactive_clarification", "问问两种做法各适合什么题。"), option("Q14-D", "R", "reading_comprehension", "看笔记，找出两种做法各适合什么情况。")]),
  question("Q15", "practice", "课本上有一段话比较抽象，你想把意思弄明白。你会——", [option("Q15-A", "K", "contextual_immersion", "找一个符合这段话的具体例子。"), option("Q15-B", "V", "image_association", "把这段话画成一个简单的小图。"), option("Q15-C", "A", "spoken_explanation", "听老师或同学讲讲，这段话在说什么。"), option("Q15-D", "R", "written_synthesis", "用自己的话，把这段话改写成一句好懂的话。")]),
  question("Q16", "repair", "刚订正完一道题，你想记住这次错在哪里。你会——", [option("Q16-A", "K", "process_rehearsal", "不看答案，把这道题完整重做一遍。"), option("Q16-B", "V", "structure_mapping", "把“易错点”和“正确做法”连起来。"), option("Q16-C", "A", "sound_cues", "把正确做法顺着念几遍。"), option("Q16-D", "R", "reading_comprehension", "重读订正，找出自己这次漏了什么。")]),
  question("Q17", "repair", "第一次去新考场或新教室，怕走错。你会——", [option("Q17-A", "V", "spatial_relationship", "看平面图，把沿路几个明显的位置按先后记住。"), option("Q17-B", "A", "interactive_clarification", "问人怎么走，再听一遍。"), option("Q17-C", "R", "note_organization", "写下楼层、方向和教室号。"), option("Q17-D", "K", "process_rehearsal", "提前走一遍，从门口找到教室。")]),
  question("Q18", "repair", "老师示范了一道题的答案，你想下次自己也能写完整。你会——", [option("Q18-A", "A", "sound_cues", "把答案里的几个要点读出声。"), option("Q18-B", "R", "note_organization", "写下答案里必须写到的要点。"), option("Q18-C", "K", "hands_on_operation", "照着这个答案，在草稿上写一遍。"), option("Q18-D", "V", "spatial_relationship", "把答案的要点按顺序排在纸上。")]),
  question("Q19", "repair", "几个知识点学完后，你想弄清它们怎么连。你会——", [option("Q19-A", "R", "written_synthesis", "写下每个知识点，再写它们怎么连。"), option("Q19-B", "K", "contextual_immersion", "给每个知识点配个例子，再看它们怎么连。"), option("Q19-C", "V", "structure_mapping", "用线把几个知识点连成一张图。"), option("Q19-D", "A", "spoken_explanation", "听别人讲讲，几个知识点是怎么连起来的。")]),
  question("Q20", "repair", "复习完一页内容，你想看看自己是不是真的懂了。你会——", [option("Q20-A", "K", "hands_on_operation", "找一道相关小题，先试着做。"), option("Q20-B", "V", "structure_mapping", "画出这页几个重点怎么连。"), option("Q20-C", "A", "spoken_explanation", "找一段讲这页内容的讲解，听一遍。"), option("Q20-D", "R", "written_synthesis", "合上书，用自己的话写下这页内容。")])
]);

function getScenarioQuestions() { return QUESTIONS; }



const REPORT_FORMAT_VERSION = "scenario-report-v3";

function requireText(value, label, fallback = "--") {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str.length === 0 ? fallback : str;
}

function requireModeResult(modeResult) {
  if (!modeResult || typeof modeResult !== "object") throw new TypeError("学习模式结果不能为空");
  if (!Number.isInteger(modeResult.answeredCount) || modeResult.answeredCount < 0) throw new TypeError("有效作答数无效");
  if (!modeResult.scores || MODE_ORDER.some((code) => !Number.isInteger(modeResult.scores[code]) || modeResult.scores[code] < 0)) throw new TypeError("学习模式分数不完整");
  if (!modeResult.rates || MODE_ORDER.some((code) => !Number.isFinite(modeResult.rates[code]) || modeResult.rates[code] < 0 || modeResult.rates[code] > 1)) throw new TypeError("学习模式比例不完整");
  if (!modeResult.specificScores || Object.keys(SPECIFIC_MODES).some((id) => !Number.isInteger(modeResult.specificScores[id]) || modeResult.specificScores[id] < 0)) throw new TypeError("具体方式分数不完整");
  if (!modeResult.specificOpportunities || Object.keys(SPECIFIC_MODES).some((id) => !Number.isInteger(modeResult.specificOpportunities[id]) || modeResult.specificOpportunities[id] < 0)) throw new TypeError("具体方式机会数不完整");
  if (!modeResult.specificRates || Object.keys(SPECIFIC_MODES).some((id) => !Number.isFinite(modeResult.specificRates[id]) || modeResult.specificRates[id] < 0 || modeResult.specificRates[id] > 1)) throw new TypeError("具体方式比例不完整");
  const classification = modeResult.classification;
  if (!classification || !["clear", "primary_supporting", "parallel"].includes(classification.kind)) throw new TypeError("学习模式结论无效");
  if (classification.kind === "parallel") {
    if (classification.primary !== null || classification.supporting !== null || !Array.isArray(classification.candidates) || classification.candidates.length < 2) throw new TypeError("并列学习模式无效");
  } else {
    if (!Object.hasOwn(PRIMARY_MODES, classification.primary)) throw new TypeError("主要学习模式无效");
    if (classification.kind === "primary_supporting" && (!Object.hasOwn(PRIMARY_MODES, classification.supporting) || classification.primary === classification.supporting)) throw new TypeError("辅助学习模式无效");
  }
  return modeResult;
}

function mechanismStatus({ selected, opportunities, rate, highestReliableRate }) {
  if (selected === 0) return "这次暂未选到";
  if (opportunities >= 3 && rate === highestReliableRate) return "这次选得更多";
  return "这次也选到过";
}

function cardRole(code, classification, score) {
  const selectedRole = score > 0 ? "本次也选到过" : "本次未选到";
  if (classification.kind === "clear") return code === classification.primary ? "本次主要入口" : selectedRole;
  if (classification.kind === "primary_supporting") {
    if (code === classification.primary) return "本次主要入口";
    if (code === classification.supporting) return "本次辅助入口";
    return selectedRole;
  }
  if (score === 0) return "本次未选到";
  return classification.candidates.includes(code) ? "本次并列入口" : "本次也选到过";
}

const MODE_CARD_COPY = Object.freeze({
  V: "遇到一堆内容时，你会想先把它看清、画出来，眼睛一有画面，心里就不那么乱。",
  A: "你会先听一听、问一问。有人把理由讲清楚，思路就容易接上。",
  R: "你会先读清楚，再记下真正要用的部分。写在纸上，回头也找得到。",
  K: "你会想先试一下。做出第一步以后，才知道后面该怎么走。"
});

const MECHANISM_COACH_COPY = Object.freeze({
  image_association: "字太多时，你会想先画出来、标出来，一眼就能抓住意思。",
  structure_mapping: "你会想弄清：这些内容和谁有关，哪里不同，能不能放在一起看。",
  spatial_relationship: "步骤一多时，你会先把前后排好，免得做到一半乱掉。",
  interactive_clarification: "有一句没懂，你会把它问出来，不想含糊地往下走。",
  spoken_explanation: "有人把它从头讲一遍，你会更容易听懂它到底在说什么。",
  sound_cues: "读出声、多念几遍，词句会慢慢顺起来。",
  reading_comprehension: "你会把题目、课本或解析再读一遍，先弄明白它在说什么。",
  note_organization: "你会把以后要用的词、条件和提示记下来。",
  written_synthesis: "你会用自己的话写一写，看看自己到底懂没懂。",
  process_rehearsal: "光看还不够，你会从头走一遍，心里才有数。",
  hands_on_operation: "你会先试一步，看看能不能走通，再决定后面怎么做。",
  contextual_immersion: "把它放进一道题或具体例子里，才容易明白它怎么用。"
});

function modeCards(subject, modeResult) {
  const modeOrder = [...MODE_ORDER].sort((left, right) => {
    const rateDifference = modeResult.rates[right] - modeResult.rates[left];
    if (rateDifference !== 0) return rateDifference;
    const scoreDifference = modeResult.scores[right] - modeResult.scores[left];
    if (scoreDifference !== 0) return scoreDifference;
    return MODE_ORDER.indexOf(left) - MODE_ORDER.indexOf(right);
  });
  return Object.freeze(modeOrder.map((code) => {
    const mode = PRIMARY_MODES[code];
    const children = specificModesFor(code);
    const reliableRates = children
      .filter(({ id }) => modeResult.specificOpportunities[id] >= 3)
      .map(({ id }) => modeResult.specificRates[id]);
    const highestReliableRate = reliableRates.length > 0 ? Math.max(...reliableRates) : null;
    return Object.freeze({
      code,
      label: mode.label,
      score: modeResult.scores[code] || 0,
      rate: modeResult.rates[code] || 0,
      role: cardRole(code, modeResult.classification, modeResult.scores[code]),
      description: MODE_CARD_COPY[code],
      mechanisms: Object.freeze([...children].sort((left, right) => {
        const rateDifference = modeResult.specificRates[right.id] - modeResult.specificRates[left.id];
        if (rateDifference !== 0) return rateDifference;
        const scoreDifference = modeResult.specificScores[right.id] - modeResult.specificScores[left.id];
        if (scoreDifference !== 0) return scoreDifference;
        return children.indexOf(left) - children.indexOf(right);
      }).map((specific) => {
        const selected = modeResult.specificScores[specific.id];
        const opportunities = modeResult.specificOpportunities[specific.id];
        const rate = modeResult.specificRates[specific.id];
        return Object.freeze({
          id: specific.id,
          label: specific.label,
          definition: MECHANISM_COACH_COPY[specific.id],
          subjectExample: subjectMechanismExample(subject, specific.id),
          selected,
          opportunities,
          rate,
          status: mechanismStatus({ selected, opportunities, rate, highestReliableRate })
        });
      }))
    });
  }));
}

const MODE_COACHING = Object.freeze({
  V: "这次作答里，你常会先把内容看清。重点、关系和顺序一明白，就知道从哪儿下手了。",
  A: "这次作答里，你常会先听一听。有人把理由讲清楚，思路就不容易乱。",
  R: "这次作答里，你常会先读清、写下。把要点变成自己的话，做题时心里会更踏实。",
  K: "这次作答里，你常会先动手。先试一小步，看看哪里能走通，心里就有数。"
});

const SUPPORT_COACHING = Object.freeze({
  V: "需要时再画一画、排一排，思路会更清楚。",
  A: "卡住时再听一遍关键理由，常常就通了。",
  R: "把关键内容记在纸上，回头更容易找到。",
  K: "再动手试一小步，能很快知道自己卡在哪。"
});

const SUBJECT_PATH_FOCUS = Object.freeze({
  语文: "原文句子、写法和答题依据",
  数学: "已知条件、公式和解题步骤",
  英语: "单词、短语和原文句子",
  日语: "助词、句型和课本短句",
  物理: "研究对象、受力和过程",
  化学: "物质、条件和现象",
  生物: "变量、过程和结果",
  政治: "材料事实、概念和观点",
  历史: "时间、事件和前后关系",
  地理: "位置条件、过程和结果"
});

const PRIMARY_PATH_ACTIONS = Object.freeze({
  V: (focus) => `把${focus}画清、排清`,
  A: (focus) => `听一小段讲${focus}的解释，把没懂的地方问出来`,
  R: (focus) => `把题目和${focus}读清，再圈出真正要用的信息`,
  K: (focus) => `围绕${focus}先做一个小问，看看自己卡在哪`
});

function conclusion(modeResult) {
  const { answeredCount, classification, rates, scores } = modeResult;
  const counts = Object.freeze(MODE_ORDER.map((code) => Object.freeze({
    code,
    label: PRIMARY_MODES[code].label,
    count: scores[code],
    answeredCount,
    rate: rates[code]
  })));
  if (classification.kind === "clear") {
    const mode = PRIMARY_MODES[classification.primary];
    return Object.freeze({
      kind: "clear",
      title: `本次你的主要学习入口：${mode.label}`,
      summary: MODE_COACHING[mode.code],
      primaryMode: Object.freeze({ code: mode.code, label: mode.label }),
      supportingMode: null,
      candidates: Object.freeze([mode.code]),
      counts
    });
  }
  if (classification.kind === "primary_supporting") {
    const primary = PRIMARY_MODES[classification.primary];
    const supporting = PRIMARY_MODES[classification.supporting];
    return Object.freeze({
      kind: "primary_supporting",
      title: `本次你的学习入口：${primary.label}为主，${supporting.label}为辅`,
      summary: `${MODE_COACHING[primary.code]} ${SUPPORT_COACHING[supporting.code]}`,
      primaryMode: Object.freeze({ code: primary.code, label: primary.label }),
      supportingMode: Object.freeze({ code: supporting.code, label: supporting.label }),
      candidates: Object.freeze([primary.code, supporting.code]),
      counts
    });
  }
  const summary = answeredCount < 10
    ? "这次留下的线索还不够，我们先不急着替你定一种模式。眼前这门课怎么学最顺，就先怎么开始；多做几次，你会慢慢看清自己的习惯。"
    : "这次没有哪一种入口一直领先。碰到不同任务，你会换不同的办法：有时先看清关系，有时听一段讲解，有时直接试一试。这很正常。";
  return Object.freeze({
    kind: "parallel",
    title: "多通道学习入口",
    summary,
    primaryMode: null,
    supportingMode: null,
    candidates: Object.freeze(classification.candidates),
    counts
  });
}

function primaryPathAction(subject, primaryCode) {
  const focus = SUBJECT_PATH_FOCUS[subject];
  if (!focus || !Object.hasOwn(PRIMARY_PATH_ACTIONS, primaryCode)) return "从最顺手的一步开始";
  return PRIMARY_PATH_ACTIONS[primaryCode](focus);
}

function learningPath(classification, taskCard) {
  const { subject } = taskCard;
  if (classification.kind === "clear") {
    const mode = PRIMARY_MODES[classification.primary];
    return Object.freeze({
      title: `学${subject}，先从${mode.label}进入`,
      copy: `不必一上来就把所有内容记住。先${primaryPathAction(subject, mode.code)}。这条路走顺了，再往下做题。`
    });
  }
  if (classification.kind === "primary_supporting") {
    const primary = PRIMARY_MODES[classification.primary];
    const supporting = PRIMARY_MODES[classification.supporting];
    return Object.freeze({
      title: `学${subject}，先用${primary.label}打头`,
      copy: `先${primaryPathAction(subject, primary.code)}。还觉得不顺时，再${primaryPathAction(subject, supporting.code)}。不用每次都两样全做，眼前哪一步最能帮上忙，就先做哪一步。`
    });
  }
  const candidates = classification.candidates.filter((code) => Object.hasOwn(PRIMARY_MODES, code));
  const first = taskCard.primarySpecific ? SPECIFIC_MODES[taskCard.primarySpecific].primary : candidates[0];
  const second = candidates.find((code) => code !== first) ?? candidates[1];
  return Object.freeze({
    title: `学${subject}，按任务换入口`,
    copy: `这次不用急着给自己定一种办法。遇到${subject}内容，可以先${primaryPathAction(subject, first)}。这条路不顺，再${primaryPathAction(subject, second)}。先挑一条做起来就好。`
  });
}

function buildReport(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new TypeError("报告数据不能为空");
  const targetSubject = requireText(input.targetSubject, "目标学科");
  const learningLevel = requireText(input.learningLevel, "学习阶段");
  if (!SUBJECTS.includes(targetSubject)) throw new RangeError(`未知的学科：${targetSubject}`);
  if (!LEVELS.includes(learningLevel)) throw new RangeError(`未知的学习阶段：${learningLevel}`);
  const modeResult = requireModeResult(input.modeResult);
  const taskCard = buildTaskCard({
    subject: targetSubject,
    learningLevel,
    classification: modeResult.classification,
    answeredCount: modeResult.answeredCount,
    specificScores: modeResult.specificScores,
    specificRates: modeResult.specificRates,
    specificOpportunities: modeResult.specificOpportunities
  });
  const cards = modeCards(targetSubject, modeResult);
  const radar = Object.freeze({
    axes: Object.freeze(MODE_ORDER.map((code) => Object.freeze({
      key: code,
      label: PRIMARY_MODES[code].label,
      score: modeResult.scores[code] || 0,
      ratio: modeResult.rates[code] || 0
    })))
  });

  const modeCounts = Object.freeze({
    V: modeResult.scores.V || 0,
    A: modeResult.scores.A || 0,
    R: modeResult.scores.R || 0,
    K: modeResult.scores.K || 0
  });

  return Object.freeze({
    formatVersion: REPORT_FORMAT_VERSION,
    overview: Object.freeze({
      title: "学习模式定位报告",
      anonymousCode: requireText(input.anonymousCode, "匿名编号"),
      studentName: requireText(input.studentName, "姓名"),
      contact: requireText(input.contact, "联系方式"),
      grade: requireText(input.grade, "年级"),
      targetSubject,
      learningLevel
    }),
    conclusion: conclusion(modeResult),
    radar,
    modeCounts,
    modeCards: cards,
    learningPath: learningPath(modeResult.classification, taskCard),
    taskCard
  });
}


function byId(id) { return document.getElementById(id); }
function parseUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash || "";
  const hashParams = new URLSearchParams(hash.includes("?") ? hash.split("?")[1] : "");
  return {
    id: params.get("id") || hashParams.get("id") || "",
    session: params.get("session") || hashParams.get("session") || "",
    mobile: params.get("mobile") || hashParams.get("mobile") || params.get("customerMobile") || localStorage.getItem("lsa_last_mobile") || ""
  };
}

async function fetchReportData(id, session, mobile) {
  const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "[::1]");
  const backendBase = window.ASSESSMENT_API_BASE || (isLocal ? "https://ffcrm-daily.1605ai.com" : "https://ffcrm-api.1605ai.com");

  // 1. 如果有 ID，按公开免登录接口 /api/assessment/result/{id} 与 /api/assessment/detail?id={id} 查询（最多重试 3 次处理主从延迟）
  if (id) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        let res = await fetch(`${backendBase}/api/assessment/result/${encodeURIComponent(id)}`);
        let json = await res.json().catch(() => ({}));
        if ((json.code === 200 || json.code === 0) && json.data) {
          return json.data;
        }

        res = await fetch(`${backendBase}/api/assessment/detail?id=${encodeURIComponent(id)}`);
        json = await res.json().catch(() => ({}));
        if ((json.code === 200 || json.code === 0) && json.data) {
          return json.data;
        }
      } catch (e) {
        console.warn(`API 重试 (${attempt}/3) 失败:`, e);
      }
      if (attempt < 3) await new Promise((r) => setTimeout(r, 600 * attempt));
    }
  }

  // 2. 如果有手机号，按手机号查最新一条
  if (mobile) {
    try {
      const res = await fetch(`${backendBase}/api/assessment/result/page?customerMobile=${encodeURIComponent(mobile)}&pageSize=100`);
      const json = await res.json().catch(() => ({}));
      const list = json.data?.list || (Array.isArray(json.data) ? json.data : []);
      if (list && list.length > 0) {
        return list[0];
      }
    } catch (e) {
      console.warn("按手机号查询记录异常:", e);
    }
  }

  // 3. 从本地 Storage 读取快照兜底
  if (session) {
    const raw = localStorage.getItem("lsa_session_" + session);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
  }
  if (id) {
    const rawId = localStorage.getItem("lsa_record_" + id);
    if (rawId) {
      try { return JSON.parse(rawId); } catch (e) {}
    }
  }
  const last = localStorage.getItem("lsa_last_record");
  if (last) {
    try {
      const p = JSON.parse(last);
      if (p) return p;
    } catch (e) {}
  }
  return null;
}
function normalizeReportModel(data) {
  if (!data) return null;
  if (data.reportModel && data.reportModel.radar) return data.reportModel;
  if (data.radar && data.conclusion) return data;

  let inner = data;
  if (data.resultJson) {
    try {
      const parsed = typeof data.resultJson === "string" ? JSON.parse(data.resultJson) : data.resultJson;
      if (parsed && typeof parsed === "object") {
        inner = { ...data, ...parsed };
      }
    } catch (e) {
      console.warn("解析 resultJson 异常:", e);
    }
  }

  const rawAnswers = Array.isArray(inner.answers)
    ? inner.answers
    : (inner.assessmentInfo && Array.isArray(inner.assessmentInfo.answers) ? inner.assessmentInfo.answers : []);

  const ansMap = new Map(rawAnswers.map(a => [a.questionId || a.id, a]));
  const safeAnswers = QUESTIONS.map((q, idx) => {
    const a = ansMap.get(q.id);
    if (a && Array.isArray(a.optionIds) && a.optionIds.length > 0) {
      return { questionId: q.id, optionIds: [...a.optionIds], responseTimeMs: a.responseTimeMs || 1000 };
    }
    return { questionId: q.id, optionIds: [q.options[idx % q.options.length].id], responseTimeMs: 1000 };
  });

  const studentInfo = inner.studentInfo || inner.userInfo || {};
  const studentName = String(inner.customerName || studentInfo.name || studentInfo.studentName || inner.studentName || inner.name || "学员").trim() || "学员";
  const contact = String(inner.customerMobile || studentInfo.mobile || studentInfo.phoneNumber || studentInfo.contact || inner.contact || "--").trim() || "--";
  const grade = String(studentInfo.grade || inner.grade || "高三").trim() || "高三";
  
  let targetSubject = String(studentInfo.targetSubject || inner.targetSubject || "语文").trim();
  if (!SUBJECTS.includes(targetSubject)) targetSubject = "语文";

  let learningLevel = String(studentInfo.learningLevel || inner.learningLevel || "稳定提升").trim();
  if (!LEVELS.includes(learningLevel)) learningLevel = "稳定提升";

  const anonymousCode = String(inner.id || inner.recordId || inner.session || ("LSA-" + Date.now().toString(36).toUpperCase()));

  const scored = scoreScenarioAnswers(safeAnswers, QUESTIONS);
  const report = buildReport({
    studentName,
    contact,
    grade,
    targetSubject,
    learningLevel,
    anonymousCode,
    modeResult: scored
  });

  return {
    ...report,
    studentInfo: {
      name: studentName,
      contact: contact,
      grade: grade,
      targetSubject,
      learningLevel,
      anonymousCode
    }
  };
}


function renderRadar(measurements) {
  const chart = byId("modeRadar");
  if (!chart) return;
  const RADAR_CENTER = 120;
  const RADAR_RADIUS = 75;
  const pointFor = (position, fraction = 1) => {
    const angle = -Math.PI / 2 + position * Math.PI / 2;
    const radius = RADAR_RADIUS * fraction;
    return { x: RADAR_CENTER + Math.cos(angle) * radius, y: RADAR_CENTER + Math.sin(angle) * radius };
  };
  const pointList = (fraction) => Array.from({ length: 4 }, (_, pos) => pointFor(pos, fraction)).map(({ x, y }) => x.toFixed(1) + "," + y.toFixed(1)).join(" ");

  const grid = [0.25, 0.5, 0.75, 1].map(fraction => 
    "<polygon class=\"radar-grid\" points=\"" + pointList(fraction) + "\" fill=\"none\" stroke=\"rgba(209, 213, 219, 0.8)\" stroke-width=\"1\" stroke-dasharray=\"3,3\" />"
  ).join("");

  const axes = measurements.map((_, position) => {
    const { x, y } = pointFor(position);
    return "<line class=\"radar-axis\" x1=\"" + RADAR_CENTER + "\" y1=\"" + RADAR_CENTER + "\" x2=\"" + x.toFixed(1) + "\" y2=\"" + y.toFixed(1) + "\" stroke=\"rgba(209, 213, 219, 0.8)\" stroke-width=\"1\" />";
  }).join("");

  const points = measurements.map(({ fraction }, position) => {
    const { x, y } = pointFor(position, Math.max(0.12, fraction));
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");

  const shape = "<polygon class=\"radar-shape\" points=\"" + points + "\" fill=\"rgba(245, 158, 11, 0.28)\" stroke=\"#D97706\" stroke-width=\"2.5\" stroke-linejoin=\"round\" />";

  const dots = measurements.map(({ fraction }, position) => {
    const { x, y } = pointFor(position, Math.max(0.12, fraction));
    return "<circle class=\"radar-dot\" cx=\"" + x.toFixed(1) + "\" cy=\"" + y.toFixed(1) + "\" r=\"4.5\" fill=\"#FFFFFF\" stroke=\"#D97706\" stroke-width=\"2.5\" />";
  }).join("");

  const labels = measurements.map(({ label, value }, position) => {
    const { x, y } = pointFor(position, 1.32);
    return "<text class=\"radar-label\" x=\"" + x.toFixed(1) + "\" y=\"" + y.toFixed(1) + "\" fill=\"#374151\" font-size=\"12\" font-weight=\"750\" text-anchor=\"middle\" dominant-baseline=\"central\">" + label.replace("模式", "") + " " + value + "%</text>";
  }).join("");

  chart.innerHTML = grid + axes + shape + dots + labels;
}

function renderCounts(measurements) {
  const container = byId("modeCounts");
  if (!container) return;
  const colors = {
    V: { fill: "linear-gradient(90deg, #3B82F6, #60A5FA)", text: "#1D4ED8", bg: "#EFF6FF" },
    A: { fill: "linear-gradient(90deg, #EC4899, #F472B6)", text: "#BE185D", bg: "#FDF2F8" },
    R: { fill: "linear-gradient(90deg, #10B981, #34D399)", text: "#047857", bg: "#ECFDF5" },
    K: { fill: "linear-gradient(90deg, #F59E0B, #FBBF24)", text: "#B45309", bg: "#FFFBEB" }
  };

  container.innerHTML = measurements.map(m => {
    const c = colors[m.code] || colors.V;
    return `
      <div class="mode-progress">
        <div class="mode-progress-heading">
          <span class="mode-progress-label" style="background:${c.bg};color:${c.text};">${m.label}</span>
          <strong class="mode-progress-val">${m.value}%</strong>
        </div>
        <div class="mode-progress-track">
          <div class="mode-progress-fill" style="width:${Math.max(m.value, m.value > 0 ? 5 : 0)}%;background:${c.fill};"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderModeCards(modeCardsList) {
  const container = byId("modeCards");
  if (!container || !modeCardsList) return;

  const list = Array.isArray(modeCardsList) ? modeCardsList : Object.values(modeCardsList);
  container.innerHTML = list.map(card => {
    const code = card.code || "V";
    const subList = (card.mechanisms || []).map(mech => {
      const isSelected = mech.status === "这次选得更多" || mech.status === "这次也选到过";
      const statusClass = mech.status === "这次选得更多" ? "is-top" : (mech.status === "这次也选到过" ? "is-selected" : "is-zero");
      return `
        <li class="mechanism-item ${isSelected ? "is-selected-mech" : ""}">
          <div class="mechanism-head">
            <strong class="mechanism-name">${mech.label}</strong>
            <span class="mechanism-status ${statusClass}">${mech.status}</span>
          </div>
          <p class="mechanism-definition">${mech.definition || ""}</p>
          <p class="mechanism-example">${mech.subjectExample || mech.example || ""}</p>
        </li>
      `;
    }).join("");

    return `
      <article class="mode-card mode-card-${code.toLowerCase()}">
        <div class="mode-card-topbar">
          <span class="mode-role-pill">${card.role || "本次学习方式"}</span>
        </div>
        <h3 class="mode-card-title">${card.label}</h3>
        <p class="mode-card-desc">${card.description || ""}</p>
        <ul class="mechanism-list">${subList}</ul>
      </article>
    `;
  }).join("");
}

function renderReport(report) {
  if (!report) return;
  const info = report.studentInfo || report.overview || {};
  if (byId("studentName")) byId("studentName").textContent = info.studentName || info.name || "学员";
  if (byId("contact")) byId("contact").textContent = info.contact ? info.contact.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "--";
  if (byId("grade")) byId("grade").textContent = info.grade || "--";
  if (byId("targetSubject")) byId("targetSubject").textContent = info.targetSubject || "--";
  if (byId("learningLevel")) byId("learningLevel").textContent = info.learningLevel || "--";
  if (byId("anonymousCode")) byId("anonymousCode").textContent = info.anonymousCode || "--";

  if (report.conclusion) {
    if (byId("conclusionTitle")) byId("conclusionTitle").textContent = report.conclusion.title || "--";
    if (byId("conclusionSummary")) byId("conclusionSummary").textContent = report.conclusion.summary || "--";
    if (byId("conclusionTag")) {
      const tagText = report.conclusion.kind === "clear" ? "主要学习入口" : (report.conclusion.kind === "primary_supporting" ? "主辅结合入口" : "多通道学习入口");
      byId("conclusionTag").textContent = tagText;
    }
  }

  // 计算图表与进度条度量数据
  const counts = Array.isArray(report.conclusion?.counts) ? report.conclusion.counts : [];
  const totalAnswers = counts.reduce((sum, item) => sum + (item.count || 0), 0) || 1;
  const measurements = counts.map(item => {
    const rateVal = item.rate !== undefined ? Number(item.rate) : (item.count / totalAnswers);
    const value = Math.round(rateVal * 100);
    return {
      code: item.code,
      label: item.label,
      value,
      fraction: rateVal,
      count: item.count || 0
    };
  });

  renderRadar(measurements);
  renderCounts(measurements);

  if (report.modeCards) renderModeCards(report.modeCards);

  if (report.learningPath) {
    if (byId("learningPathTitle")) byId("learningPathTitle").textContent = report.learningPath.title || "从顺手的入口切入";
    if (byId("learningPathCopy")) byId("learningPathCopy").textContent = report.learningPath.copy || "--";
  }

  if (report.taskCard) {
    const card = report.taskCard;
    if (byId("taskLevelPill")) byId("taskLevelPill").textContent = info.learningLevel || "阶段目标";
    if (byId("taskHeading")) byId("taskHeading").textContent = card.heading || card.title || card.task || "--";
    if (byId("taskMaterials")) byId("taskMaterials").textContent = card.materials || "--";
    if (byId("taskMinutes")) byId("taskMinutes").textContent = card.minutes ? (card.minutes + "分钟") : "--";
    if (byId("taskQuantity")) byId("taskQuantity").textContent = card.quantity || "--";
    if (byId("taskFirstStep")) byId("taskFirstStep").textContent = card.firstStep || "--";
    if (byId("taskSecondStep")) byId("taskSecondStep").textContent = card.secondStep || "--";
    if (byId("taskCheck")) byId("taskCheck").textContent = card.completionCheck || card.check || "--";
    const choicesRow = byId("taskChoicesRow");
    if (choicesRow) {
      if (card.startChoices && card.startChoices.length > 0) {
        choicesRow.style.display = "flex";
        choicesRow.hidden = false;
        choicesRow.classList.remove("is-hidden");
        if (byId("taskChoices")) byId("taskChoices").textContent = card.startChoices.map(c => c.label + "：" + c.copy).join("； ");
      } else {
        choicesRow.style.display = "none";
        choicesRow.hidden = true;
        choicesRow.classList.add("is-hidden");
      }
    }
  }

  if (byId("reportLoading")) byId("reportLoading").hidden = true;
  if (byId("reportError")) byId("reportError").hidden = true;
  if (byId("reportDocument")) byId("reportDocument").hidden = false;
}
async function boot() {
  const { id, session, mobile } = parseUrlParams();
  try {
    const rawData = await fetchReportData(id, session, mobile);
    if (!rawData) {
      if (byId("reportLoading")) byId("reportLoading").hidden = true;
      if (byId("reportError")) byId("reportError").hidden = false;
      return;
    }
    const reportModel = normalizeReportModel(rawData);
    if (!reportModel) {
      if (byId("reportLoading")) byId("reportLoading").hidden = true;
      if (byId("reportError")) byId("reportError").hidden = false;
      return;
    }
    renderReport(reportModel);
  } catch (err) {
    console.error("渲染报告异常:", err);
    if (byId("reportLoading")) byId("reportLoading").hidden = true;
    if (byId("reportError")) byId("reportError").hidden = false;
  }
  byId("retryReport")?.addEventListener("click", () => { window.location.reload(); });
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
}
if (typeof globalThis !== "undefined") {
  globalThis.QUESTIONS = QUESTIONS;
  globalThis.scoreScenarioAnswers = scoreScenarioAnswers;
  globalThis.buildReport = buildReport;
  globalThis.buildTaskCard = buildTaskCard;
  globalThis.MODE_ORDER = MODE_ORDER;
  globalThis.SPECIFIC_MODES = SPECIFIC_MODES;
  globalThis.SUBJECTS = SUBJECTS;
  globalThis.LEVELS = LEVELS;
}
