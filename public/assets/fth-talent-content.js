// Auto-generated from public/fthtalent/wechat-talent-assessment.html — content only, do not edit layout here
window.FTH_ASSESSMENT_CONTENT = {
  templateCode: "FTH_TALENT",
  templateName: "FTH \u804c\u4e1a\u7279\u8d28\u6d4b\u8bc4(\u5fae\u4fe1\u7248)",
  scoringMode: "legacy42",
  questionCount: 42,
  likertOptions: [{"val": 1, "text": "完全不像"}, {"val": 2, "text": "不太像"}, {"val": 3, "text": "有点像"}, {"val": 4, "text": "比较像"}, {"val": 5, "text": "就是这样"}],
  attributes: {
      fighter: { cn: "进取者", en: "Fighter", color: "#f97316", initial: "F", copy: "你的优势更偏向目标、行动和突破，适合在真实场景中推进事情、拿下结果。" },
      thinker: { cn: "思辨者", en: "Thinker", color: "#60a5fa", initial: "T", copy: "你的优势更偏向分析、结构和创造，适合把复杂问题想清楚、搭出方法和系统。" },
      helper: { cn: "赋能者", en: "Helper", color: "#22c55e", initial: "H", copy: "你的优势更偏向连接、支持和稳定，适合帮助人和系统更好地协作、成长和长期运转。" }
    },
  partnerGuides: {
      fighter: [
        "优先搭配 Thinker 型伙伴：帮你把机会、打法和关键决策拆清楚，避免只靠冲劲推进。",
        "再搭配 Helper 型伙伴：帮你稳住核心团队、客户关系和长期协作，避免组织被高压节奏拉扯。",
        "最适合的组合方式：你负责定目标和破局，对方负责结构化判断、组织稳定和复盘沉淀。"
      ],
      thinker: [
        "优先搭配 Fighter 型伙伴：帮你把判断变成动作，把方案推到市场、客户和真实结果里。",
        "再搭配 Helper 型伙伴：帮你处理人、关系和团队共识，避免好系统没人真正用起来。",
        "最适合的组合方式：你负责战略、产品或机制设计，对方负责节奏推进、资源协调和团队动员。"
      ],
      helper: [
        "优先搭配 Fighter 型伙伴：帮你在关键窗口更果断地进攻、拍板和拿结果。",
        "再搭配 Thinker 型伙伴：帮你把人和关系中的经验沉淀成方法、流程和长期系统。",
        "最适合的组合方式：你负责凝聚人心和稳定组织，对方负责外部突破、关键判断和系统搭建。"
      ]
    },
  types: {
      runner: {
        attr: "fighter", cn: "冲刺型", en: "Runner", color: "#f97316",
        one: "你更像快速启动、快速反馈、快速拿结果的人。",
        strengths: ["行动速度快，能把机会窗口转成动作", "适合目标明确、节奏紧、反馈快的任务", "能带动团队从讨论进入执行"],
        risks: ["容易重速度、轻沉淀", "对慢节奏协同耐心不足", "目标模糊或频繁变化时容易消耗"],
        fit: "顾问邀约、市场活动、短期招生目标推进、体验课转化、活动执行、线索跟进。"
      },
      climber: {
        attr: "fighter", cn: "攻坚型", en: "Climber", color: "#ef4444",
        one: "你更像面对困难持续攀登、能扛硬仗的人。",
        strengths: ["抗压和韧性强，困难越大越容易投入", "适合关键客户、复杂谈判和瓶颈突破", "能在局面卡住时顶上去"],
        risks: ["可能过度硬扛，忽略资源协同", "长期高压容易透支", "对低挑战、重复任务兴趣不足"],
        fit: "重点客户转化、难点续费、投诉与危机处理、关键项目推进、校区攻坚任务。"
      },
      analyzer: {
        attr: "thinker", cn: "分析型", en: "Analyzer", color: "#60a5fa",
        one: "你更像从复杂信息中找到规律、根因和判断的人。",
        strengths: ["能把混乱问题结构化", "重视证据、数据和逻辑", "能识别关键变量和优先级"],
        risks: ["可能想得深但行动慢", "过度追求确定性", "表达过于理性时不易被听见"],
        fit: "运营分析、用户分层、课程数据复盘、转化链路诊断、需求分析、经营分析。"
      },
      builder: {
        attr: "thinker", cn: "创构型", en: "Builder", color: "#8b5cf6",
        one: "你更像把想法搭成产品、系统、机制或方法论的人。",
        strengths: ["从零到一搭建新东西", "把经验沉淀为可复用系统", "关注扩展性和长期效率"],
        risks: ["可能过度理想化", "容易低估落地成本", "对重复执行兴趣不足"],
        fit: "课程产品设计、训练营体系搭建、教研工具、SOP 模板、知识库、培训体系设计。"
      },
      socializer: {
        attr: "helper", cn: "人际型", en: "Socializer", color: "#22c55e",
        one: "你更像理解人、连接人、激发人一起完成事情的人。",
        strengths: ["共情和沟通敏感度高", "擅长协调冲突、恢复连接", "能营造安全感和投入感"],
        risks: ["可能过度照顾他人感受", "强冲突场景不够果断", "容易承担过多情绪劳动"],
        fit: "用户运营顾问、老师、教练、HRBP、客户成功、家校沟通、跨部门协调。"
      },
      keeper: {
        attr: "helper", cn: "流程型", en: "Keeper", color: "#14b8a6",
        one: "你更像维护秩序、流程和细节，让组织稳定运转的人。",
        strengths: ["认真细致，可靠稳定", "擅长发现流程漏洞并补上", "能保障交付质量和节奏"],
        risks: ["可能灵活性不足", "面对模糊变化会不适应", "流程若脱离目标会变成负担"],
        fit: "教务、班级运营、排课与交付管理、流程运营、人事运营、质量检查、后台支持。"
      }
    },
  questions: [{"facet": "runner", "prompt": "方向大致清楚时，我更习惯先推进一版，再根据反馈调整。", "id": "R01"}, {"facet": "runner", "prompt": "相比长周期沉淀，我更偏好短周期目标和快速反馈。", "id": "R02"}, {"facet": "runner", "prompt": "团队讨论较久时，我会自然关注下一步可以先做什么。", "id": "R03"}, {"facet": "runner", "prompt": "我更习惯用实际结果来校准判断，而不是只在方案里推演。", "id": "R04"}, {"facet": "runner", "prompt": "面对新机会，我更倾向先观察一段时间，再决定是否尝试。", "reverse": true, "id": "R05"}, {"facet": "runner", "prompt": "任务启动前，我更偏好先把资源、边界和流程梳理完整。", "reverse": true, "id": "R06"}, {"facet": "runner", "prompt": "相比快速启动，我更喜欢先把计划反复打磨到比较稳妥。", "reverse": true, "id": "R07"}, {"facet": "climber", "prompt": "面对复杂任务时，我更关注如何逐步拆开阻力。", "id": "C01"}, {"facet": "climber", "prompt": "遇到卡点时，我通常会继续寻找新的推进入口。", "id": "C02"}, {"facet": "climber", "prompt": "任务压力较大时，我不太会因为压力本身而降低投入。", "id": "C03"}, {"facet": "climber", "prompt": "相比常规任务，我对有明显难度的任务更容易产生投入感。", "id": "C04"}, {"facet": "climber", "prompt": "当一件事推进不顺时，我通常会先判断是否值得继续投入，而不是马上拆解推进。", "reverse": true, "id": "C05"}, {"facet": "climber", "prompt": "如果短期看不到成果，我通常会倾向于减少投入，转向更清晰的任务。", "reverse": true, "id": "C06"}, {"facet": "climber", "prompt": "任务连续受阻时，我更倾向先转向确定性更高的事项。", "reverse": true, "id": "C07"}, {"facet": "analyzer", "prompt": "面对复杂问题时，我会先区分变量、条件和关键判断。", "id": "A01"}, {"facet": "analyzer", "prompt": "做判断时，我更依赖事实、数据或逻辑链，而不是直觉感受。", "id": "A02"}, {"facet": "analyzer", "prompt": "我经常会关注问题背后的原因，而不只看表面现象。", "id": "A03"}, {"facet": "analyzer", "prompt": "进入行动前，我习惯先评估收益、风险和优先级。", "id": "A04"}, {"facet": "analyzer", "prompt": "观点不一致时，我更倾向先推动形成结论，而不是继续拆分背后的假设。", "reverse": true, "id": "A05"}, {"facet": "analyzer", "prompt": "如果一个判断听起来方向大致合理，我通常不会继续深挖证据和前提。", "reverse": true, "id": "A06"}, {"facet": "analyzer", "prompt": "团队已经形成方向时，我通常不再继续深挖依据和风险。", "reverse": true, "id": "A07"}, {"facet": "builder", "prompt": "我喜欢把零散经验整理成方法、模板、工具或机制。", "id": "B01"}, {"facet": "builder", "prompt": "相比重复执行既定动作，我更容易被新东西的搭建过程吸引。", "id": "B02"}, {"facet": "builder", "prompt": "我会关注方案未来是否能复用、扩展和持续运转。", "id": "B03"}, {"facet": "builder", "prompt": "遇到反复出现的问题时，我通常更关注这次先处理完，不会优先考虑沉淀模板。", "reverse": true, "id": "B04"}, {"facet": "builder", "prompt": "想法还比较模糊时，我通常会先搁置，等它自然清晰后再继续处理。", "reverse": true, "id": "B05"}, {"facet": "builder", "prompt": "解决一个问题后，我会关注能否沉淀为之后可用的东西。", "id": "B06"}, {"facet": "builder", "prompt": "如果问题已经临时解决，我通常不会再额外做系统化沉淀。", "reverse": true, "id": "B07"}, {"facet": "socializer", "prompt": "工作中，我会比较自然地留意他人的状态和团队氛围。", "id": "S01"}, {"facet": "socializer", "prompt": "和别人协作时，我会比较在意彼此是否信任、信息是否沟通顺畅。", "id": "S02"}, {"facet": "socializer", "prompt": "团队出现摩擦时，我会关注彼此是否理解了对方的真实意思。", "id": "S03"}, {"facet": "socializer", "prompt": "看到别人获得支持、反馈或成长，会让我感到有意义。", "id": "S04"}, {"facet": "socializer", "prompt": "别人没有直接表达出来的顾虑或期待，通常不会成为我工作中的关注重点。", "reverse": true, "id": "S05"}, {"facet": "socializer", "prompt": "跨部门合作时，我更关注各自任务能否完成，不太会额外花时间同步背景。", "reverse": true, "id": "S06"}, {"facet": "socializer", "prompt": "工作中，我更关注任务本身，较少主动留意关系和氛围变化。", "reverse": true, "id": "S07"}, {"facet": "keeper", "prompt": "我会自然关注规则、流程、细节和交付标准是否清楚。", "id": "K01"}, {"facet": "keeper", "prompt": "如果发现流程中有容易遗漏或反复出错的环节，我会想把它调整得更清楚。", "id": "K02"}, {"facet": "keeper", "prompt": "相比临场发挥，我更偏好清晰标准、固定节奏和检查机制。", "id": "K03"}, {"facet": "keeper", "prompt": "团队协作中，我会关注是否有稳定、可依赖的工作秩序。", "id": "K04"}, {"facet": "keeper", "prompt": "只要大方向清楚，责任边界、时间节点和交付口径可以边做边补。", "reverse": true, "id": "K05"}, {"facet": "keeper", "prompt": "如果临时补救能解决问题，我通常不会特别推动流程规范化。", "reverse": true, "id": "K06"}, {"facet": "keeper", "prompt": "相比固定流程，我更偏好根据现场情况灵活处理。", "reverse": true, "id": "K07"}]
};
