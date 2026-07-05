export type ScheduleDayType = "opening" | "software" | "artificial-intelligence" | "security" | "closing";

export const scheduleSlots = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"] as const;

export type ScheduleSlot = (typeof scheduleSlots)[number];

export type ScheduleEventCategory = "啟程" | "主線課程" | "活動" | "生活" | "其他" | "總結";

export interface ScheduleMeta {
	title: string;
	description: string;
	note?: string;
}

export interface ScheduleBlock {
	startSlot: ScheduleSlot;
	span?: number;
	eventId: string;
}

export interface ScheduleSpeaker {
	id: string;
	name?: string;
	description?: string;
	avatar?: {
		key?: string;
		alt?: string;
	};
}

export interface ScheduleDay {
	id: string;
	title: string[];
	date: string;
	subtitle: string;
	type: ScheduleDayType;
	blocks: ScheduleBlock[];
}

export interface ScheduleEvent {
	id: string;
	name: string;
	lectureTitle?: string;
	summary: string;
	category: ScheduleEventCategory;
	isInteractive?: boolean;
	description?: string[];
	image?: {
		key: string;
		alt: string;
	};
	speakers?: ScheduleSpeaker["id"][];
}

export const scheduleMeta: ScheduleMeta = {
	title: "活動日程",
	description: "SITCON Camp 2026 將圍繞軟體工程、人工智慧與資訊安全三大主線展開，並穿插交流、實作與活動。"
};

export const scheduleSpeakers: ScheduleSpeaker[] = [
	{
		id: "william-mou",
		name: "William Mou",
		description:
			"嗨，我是展佑！我的開發日常是跟電腦底層對話。曾在 Linux Foundation 的 WasmEdge 專案刻過 C/C++ API、在實驗室及 Homelab 建置虛擬機及 Overlay Network，近期在 SiFive 參與 RISC-V CPU 及 AI 加速器的晶片設計及性能最佳化。大學時最瘋狂的經歷是在清大超算隊伍設計 3KW 功耗限制的叢集，贏得兩座世界超級電腦冠軍（SCC22 & ASC20-21）回台灣。\n身為 2019 Camp 的學員，這次回來想和大家聊聊「被 AI 取代」的焦慮，分享資工系那些 Hardcore 的底層知識，如何成為你走過每次技術革命的心法。"
	},
	{
		id: "jayin",
		name: "李杰穎",
		description:
			"嗨嗨大家我是杰穎，我目前同時在軟體公司擔任軟體工程師，一邊在陽明交大就讀博士班。我從高中時期就對於電腦視覺、影像生成、3D 渲染相關的研究和技術相當感興趣，並在高中的時候獲得旺宏科學獎的旺宏獎，上大學後也持續投稿論文至國際頂尖會議如 SIGGRAPH, ECCV, CVPR, CoRL 等。身為 2019 SITCON Camp 的學員，這次回來想要跟大家分享的是我從高中到現在大學畢業觀察到 AI 技術在這幾年的發展，為什麼影像生成模型可以在兩三年內突飛猛進、the bitter lesson 如何影響電腦視覺和電腦圖學的研究、coding agent 又怎麼改變了大家開發或是做研究的方式、在這個時代什麼問題是真正重要，可以改變世界的、在資訊領域下一個十年的研究主題會是什麼？",
		avatar: {
			key: "jayin",
			alt: "李杰穎"
		}
	},
	{
		id: "tedlu",
		name: "呂顥天",
		description:
			"陽明交大生科準大一，曾做過嵌入式系統 AI、神經科學等，在業界做了幾年的 genAI 與 AIoT 產品設計與開發後，決定回到熟悉的 AI 領域研究。活躍於各數位治理、開源社群。",
		avatar: {
			key: "tedlu",
			alt: "呂顥天"
		}
	}
];

export const scheduleEvents: ScheduleEvent[] = [
	{
		id: "opening",
		name: "開幕",
		summary: "認識營隊節奏與接下來五天的學習安排。",
		description: ["從開幕開始進入 SITCON Camp 的五天四夜。", "學員會理解營隊主軸、活動規則與接下來的課程安排，準備好和小隊夥伴一起展開學習與實作。"],
		category: "啟程",
		isInteractive: true,
		image: {
			key: "start-and-opening",
			alt: "SITCON Camp 開幕現場"
		}
	},
	{
		id: "broad-course",
		name: "廣度課程",
		summary: "從應用層往下看底層系統與高效能運算，理解 AI 時代仍然重要的資工基礎。",
		description: [
			"當 LLM 幾秒鐘就能生成精美的 Web UI、AI 寫 Code 的速度遠超人類，你是否曾看著資工系厚重的「作業系統」、「計算機組織與結構」課本，懷疑起學這些底層理論的意義？這場廣度課程希望帶領已經具備基礎程式能力的你，把目光從喧囂的「應用層」往下切，直達整座資訊世界的地基——底層系統與高效能運算（HPC）。身為曾經坐在台下的 2019 Camp 學員，我想結合近年的實戰經驗，跟大家聊聊：",
			"- 打破黑盒： 在超級電腦上跑動大型 AI 模型的背後，撐起算力奇蹟的從來不是魔法，而是作業系統與硬體架構的極致調度。那些讓你熬夜趕工的資工必修課，究竟在當代最前沿的技術裡扮演什麼角色？",
			"- 造浪者的心法： 當寫出會動的 Code 門檻被無限拉低，我們該如何省思資工系帶給我們的思維方式，從單純的技術消費者，蛻變成參與下一次革命的貢獻者？"
		],
		category: "其他",
		isInteractive: true,
		image: {
			key: "broad-course",
			alt: "廣度課程活動現場"
		},
		speakers: ["william-mou", "jayin"]
	},
	{
		id: "quest",
		name: "闖關活動",
		summary: "結合觀察與分析，與隊友一同攻克隱藏在資訊背後的關卡",
		description: [
			"當 AI 已經成為世界的一部分，那麼身處其中的我們，又該如何理解與運用科技？",
			"圍繞軟體工程、機器學習與資訊安全三大方向設計的挑戰內容，將結合觀察、分析與團隊合作等元素，讓大家在互動與探索的過程中，逐漸認識資訊科技背後的思考方式與應用場景。",
			"或許答案不只存在於程式之中，也藏在團隊合作與每一次推理的過程裡。",
			"準備好一起踏入這場科技探索了嗎？"
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "quest",
			alt: "學員參與闖關活動"
		}
	},
	{
		id: "web-system-intro",
		name: "Web 系統入門",
		summary: "認識瀏覽器、伺服器與資料庫如何串起一個網站。",
		description: [
			"從打開網頁、登入帳號到送出表單，帶學員拆解瀏覽器、伺服器與資料庫之間的互動流程。課程會說明前端如何呈現畫面並送出請求、後端如何接收與處理資料，以及 HTTP、API、Cookie、Session 等概念如何串起常見的網站功能。"
		],
		category: "啟程",
		isInteractive: true,
		image: {
			key: "agent-battle",
			alt: "學員操作著電腦"
		}
	},
	{
		id: "lab-setup",
		name: "先導課程",
		summary: "完成接下來課程需要的環境與工具準備。",
		description: [
			"在正式進入主線課程前，帶領學員完成電腦教室環境、常用工具與開發平台設定，確保後續實作能順利進行。同時，課程也將引導學員理解開發環境的基本概念，讓學員即使離開 Camp 後，也能在自己的電腦上重現設定流程，持續進行自主學習與專案開發。 "
		],
		category: "啟程",
		isInteractive: true,
		image: {
			key: "lab-setup",
			alt: "課程環境設定"
		}
	},
	{
		id: "software-main",
		name: "軟工主線課程",
		summary: "用軟體工程師的方法思考、協作與維護專案。",
		description: ["軟體工程主題日的核心，是讓學員了解一個專案不只是把程式寫出來，而是要能被理解、被協作、被維護，並在需求變動時繼續前進。"],
		category: "主線課程",
		isInteractive: true,
		image: {
			key: "software-main",
			alt: "軟體工程主題日課程現場"
		}
	},
	{
		id: "ml-main",
		name: "人工智慧主線課程",
		summary: "理解模型、資料與判斷之間的關係。",
		description: ["人工智慧與機器學習主題課程會帶學員理解模型不是魔法，而是和資料品質、問題定義與驗證方法緊密相關的工具。"],
		category: "主線課程",
		isInteractive: true,
		image: {
			key: "ai-main",
			alt: "人工智慧主題日課程現場"
		}
	},
	{
		id: "ml-broad",
		name: "人工智慧廣度課程",
		lectureTitle: "從可解釋性到 AI 時代的主體性",
		summary: "從 AI safety 與 mech interp 的前沿出發，思考在被人工智慧環繞的未來如何重建人類的主體性。",
		description: [
			"本課程將帶領學員跳脫「如何使用 AI」的框架，進入 AI safety 與 mech interp 的前沿領域。我們將探討為什麼科學家需要像神經科學家一樣，去解剖 AI 的運作機制？當 AI 表現得越來越完美，人類是否正陷入逐漸去賦權（gradual disempowerment）的風險中？",
			"講師將分享自己如何在這個領域探索，並引導學員思考：在被人工智慧環繞的未來，我們如何透過培養「品味」與思維架構，重新建構屬於人類的主體性（human agency）。"
		],
		category: "其他",
		isInteractive: true,
		speakers: ["tedlu"]
	},
	{
		id: "security-main",
		name: "資安主線課程",
		summary: "從攻防視角理解系統安全與資安思維。",
		description: ["資訊安全主題日將帶學員靠近資安領域的思考方式。", "", "資安不只是找到漏洞或解出題目，更是在理解系統如何運作，以及攻擊者與防禦者會如何看待同一個問題。"],
		category: "主線課程",
		isInteractive: true,
		image: {
			key: "security-main",
			alt: "資訊安全主題日課程現場"
		}
	},
	{
		id: "agentic-coding",
		name: "AI 寫程式經驗交流",
		summary: "課程結束後，和同學一起聊聊實際使用 AI 寫程式工具的經驗：哪裡真的省時間？哪裡又容易踩坑？",
		description: [
			"現在越來越多人會用 AI 協助寫程式，從產生雛形、理解錯誤訊息，到修改程式、補上測試，都可能交給 AI 幫忙。但工具越方便，也越容易遇到新的問題：它寫出來的程式真的對嗎？修改後會不會破壞原本功能？我們該怎麼判斷什麼時候可以相信它？",
			"",
			"在這個課後交流環節中，學員可以和同學分享自己使用 AI 寫程式工具的經驗，聊聊用過哪些方法、遇過哪些問題、哪些做法真的有幫助。經過一整天的軟體工程課程後，我們也會一起回頭思考：當 AI 可以幫我們寫更多程式碼時，需求釐清、架構設計、測試與維護為什麼變得更加重要。"
		],
		category: "主線課程",
		isInteractive: true,
		image: {
			key: "software-main",
			alt: "AI 寫程式經驗交流"
		}
	},
	{
		id: "heisenbug",
		name: "破解位元城的都市傳說",
		summary:
			"位元城自古流傳著一則都市傳說：「當交易的巔峰過後，喧嘩終歸於海，財富與浮名皆隨浪隱入塵煙。」而如今，政府觀察到這則都市傳說似乎應證的情形，身為收到政府指派的守衛隊，你們該如何解救這場危機？",
		description: [
			"在 AI 發達的時代，人與人的溝通變的稀薄，除了和 AI 聊聊天，也有人會請 AI 幫忙分析怎麼回復他人的訊息，但即使人工智慧在發達，交流仍是必不可少的，",
			"",
			"在課程之後的休閒，讓我們一起活絡筋骨、和營隊的新朋友們一起了解著名的「海森堡 Bug」的故事吧！"
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "heisenbug",
			alt: "學員參與海森堡 Bug 活動"
		}
	},
	{
		id: "reality-puzzle",
		name: "實境解謎",
		summary: "在場地各處尋找線索，和隊友一起解開藏在營隊中的謎題。",
		description: [
			"實境解謎會把線索藏進營隊場地的各個角落，學員需要走出教室、觀察環境，尋找散落在四周的提示與關鍵資訊。每一道謎題都不只是單純的問答，而是需要結合觀察、推理、討論與團隊分工，才能一步步靠近答案。",
			"",
			"在這個活動中，學員會和小隊夥伴一起探索場地、交換想法、驗證猜測，也可能在卡關時從別人的觀點中找到新的切入點。透過解謎的過程，讓大家在課程之外用另一種方式熟悉營隊空間，也在合作與推理中累積共同完成任務的經驗。"
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "reality-puzzle",
			alt: "學員參與實境解謎"
		}
	},
	{
		id: "open-source-sharing",
		name: "開源理念分享",
		summary: "認識開源精神與學生社群的參與方式。",
		description: [
			"「為什麼我們要辦 SITCON？大概是為了吃宵夜時有人能揪一塊去」（Rifur，2013）",
			"",
			"對許多新接觸的參與者而言，資訊社群是個不可思議的地方：大家好像都有話直說、勇於表達、互相提攜，也很少有輩分或是上下關係的顧慮。在這場短講裡，我會盡量用簡單的方式帶過資訊社群文化發展的歷史、介紹社群成員彼此協作的方式，以及讓大家了解有哪些地方能找到學習資源、甚至進一步對你喜歡的專案做出有意義的貢獻。"
		],
		category: "其他",
		isInteractive: true,
		image: {
			key: "learning-wrap",
			alt: "開源理念分享"
		}
	},
	{
		id: "community-fair",
		name: "社群博覽會",
		summary: "群覽資訊社群，踏出啟程之路",
		description: [
			"資訊世界廣袤無垠，「獨學而無友，則孤陋寡聞」既然如此來探索不同社群看看吧！",
			"除 SITCON 學生計算機年會外，其實還有許多不同資訊社群，這些社群有著不同的取向，但都有相同對資訊的熱愛，我們精選了數個社群，從開放文化到 Python 再到資訊安全，在這裡，你可以認識一群「友」，使得資訊探索之路更加精彩。"
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "community-fair",
			alt: "社群博覽會攤位交流現場"
		}
	},
	{
		id: "vision-cafe",
		name: "視界咖啡館",
		summary: "透過輕鬆對談的形式，在與前輩近距離交流中獲得啟發。",
		description: [
			"視界咖啡館參考自世界咖啡館（The World Café），在本次夏令營中，我們邀請到各領域及社群知名前輩，將傳統座談會形式改以聊天的樣貌呈現。",
			"",
			"學員可以與資訊界的名人們近距離互動，期望透過縮短講者與學員之間的距離，講者可以更針對學員給出建議，也鼓勵學員踴躍提問、參與，進而產生良好的雙向交流。"
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "vision-cafe",
			alt: "視界咖啡館交流現場"
		}
	},
	{
		id: "sigs-ak",
		name: "爐邊夜談",
		summary: "燈火微暗、宵夜飄香，屬於資訊人的深夜交流正式開張。在這裡沒有講師與學生，只有隨意走動、自由入座，圍繞著技術本質與一線秘辛的深夜閒聊。",
		description: [
			"白天的課聽不夠？拉張椅子，配著宵夜，我們繼續聊。",
			"",
			"承襲以往大受好評的「視界咖啡館」精神，今年的爐邊夜談將帶來更深度的交流。當熱騰騰的宵夜香氣瀰漫，各領域的工作人員將化身各桌的「攤主」。想知道大型語言模型背後的對齊技術怎麼做？好奇業界一線的開發會面對什麼坑？又或者是想聽資安大神分享攻防秘辛？我們帶著你揭開資訊領域的面紗。",
			"",
			"在這裡，沒有台上的講師與台下的學生，只有一群對資訊充滿熱情的夥伴。隨意走動，自由入座，最真實的技術知識與靈感，將在深夜的閒聊與宵夜中誕生。 "
		],
		category: "活動",
		isInteractive: true,
		image: {
			key: "roundtable-discussion",
			alt: "學員在專題圓桌討論會中交流討論"
		}
	},
	{
		id: "closing",
		name: "閉幕",
		summary: "收起五天的故事，走向更大的資訊社群。",
		description: ["閉幕會把五天的故事收在一起，把視線帶向營隊之後，也把這段經驗連結到更大的資訊社群。"],
		category: "總結",
		isInteractive: true,
		image: {
			key: "closing",
			alt: "閉幕活動與學員合影現場"
		}
	},
	{
		id: "return-home",
		name: "賦歸",
		summary: "整理行李，帶著五天的收穫回到日常。",
		category: "總結"
	},
	{
		id: "free-chat",
		name: "回宿 / 自由交流",
		summary: "和夥伴自由交流，延續課程與活動後的討論。",
		category: "其他"
	},
	{
		id: "lunch",
		name: "午餐",
		summary: "補充能量，準備下午的課程與活動。",
		category: "生活"
	},
	{
		id: "dinner",
		name: "晚餐",
		summary: "晚餐與休息時間。",
		category: "生活"
	}
];

export const scheduleDays: ScheduleDay[] = [
	{
		id: "day-one",
		// Each title item is a wrap unit: keep words together, and only wrap between items when needed.
		title: ["主線課程", "先導日"],
		date: "7/8",
		subtitle: "Day 1",
		type: "opening",
		blocks: [
			{ startSlot: "9:00", eventId: "opening" },
			{ startSlot: "10:00", span: 2, eventId: "lab-setup" },
			{ startSlot: "12:00", eventId: "lunch" },
			{ startSlot: "13:00", span: 2, eventId: "broad-course" },
			{ startSlot: "15:00", span: 3, eventId: "quest" },
			{ startSlot: "18:00", eventId: "dinner" },
			{ startSlot: "19:00", span: 2, eventId: "web-system-intro" },
			{ startSlot: "21:00", eventId: "sigs-ak" }
		]
	},
	{
		id: "day-two",
		title: ["軟體工程", "主題日"],
		date: "7/9",
		subtitle: "Day 2",
		type: "software",
		blocks: [
			{ startSlot: "9:00", span: 3, eventId: "software-main" },
			{ startSlot: "12:00", eventId: "lunch" },
			{ startSlot: "13:00", span: 6, eventId: "software-main" },
			{ startSlot: "19:00", eventId: "dinner" },
			{ startSlot: "20:00", eventId: "agentic-coding" },
			{ startSlot: "21:00", eventId: "sigs-ak" }
		]
	},
	{
		id: "day-three",
		title: ["人工智慧", "主題日"],
		subtitle: "Day 3",
		date: "7/10",
		type: "artificial-intelligence",
		blocks: [
			{ startSlot: "9:00", span: 3, eventId: "ml-main" },
			{ startSlot: "12:00", eventId: "lunch" },
			{ startSlot: "13:00", span: 3, eventId: "ml-main" },
			{ startSlot: "16:00", eventId: "ml-broad" },
			{ startSlot: "17:00", eventId: "dinner" },
			{ startSlot: "18:00", span: 3, eventId: "ml-main" },
			{ startSlot: "21:00", eventId: "sigs-ak" }
		]
	},
	{
		id: "day-four",
		title: ["資訊安全", "主題日"],
		date: "7/11",
		subtitle: "Day 4",
		type: "security",
		blocks: [
			{ startSlot: "9:00", span: 3, eventId: "security-main" },
			{ startSlot: "12:00", eventId: "lunch" },
			{ startSlot: "13:00", span: 3, eventId: "security-main" },
			{ startSlot: "16:00", span: 3, eventId: "reality-puzzle" },
			{ startSlot: "19:00", eventId: "dinner" },
			{ startSlot: "20:00", eventId: "security-main" },
			{ startSlot: "21:00", eventId: "sigs-ak" }
		]
	},
	{
		id: "day-five",
		title: ["資訊交流", "探索日"],
		date: "7/12",
		subtitle: "Day 5",
		type: "closing",
		blocks: [
			{ startSlot: "10:00", eventId: "open-source-sharing" },
			{ startSlot: "11:00", span: 2, eventId: "community-fair" },
			{ startSlot: "13:00", span: 2, eventId: "vision-cafe" },
			{ startSlot: "15:00", span: 2, eventId: "closing" },
			{ startSlot: "17:00", span: 6, eventId: "return-home" }
		]
	}
];
