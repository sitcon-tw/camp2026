export const cards = [
	{
		title: "活動日期",
		main: "07/21 ~\n07/25",
		note: "共五天四夜",
		icon: "calendar" as const
	},
	{
		title: "晚鳥票報名日期",
		main: "06/01 ~\n06/30",
		note: "逾期不候",
		icon: "ticket" as const,
		iconClass: "rotate-[-12deg]"
	},
	{
		title: "活動地點",
		main: "台灣大學",
		note: "詳細地點待公告",
		icon: "school" as const
	}
];

export const pricingRows = [
	{ label: "早鳥優惠", color: "text-orange", price: "1000元/人", tl: true, br: false },
	{ label: "一人報名", color: "text-primary-blue", price: "1500元/人", tl: false, br: false },
	{ label: "兩人報名", color: "text-soft-blue", price: "1200元/人", tl: false, br: false },
	{ label: "三人報名", color: "text-sky-blue", price: "1000元/人", tl: false, br: false },
	{ label: "早鳥優惠", color: "text-dark-green", price: "800元/人", tl: false, br: true }
];

type NoticePart = { text: string; href?: string };

export const noticeItems: NoticePart[][] = [
	[{ text: "第 5 人（含）起將以原價計費。" }],
	[{ text: "提前一晚入住營隊 700 NTD/人" }],
	[{ text: "若在 5/11（日）23:59 前報名即享有早鳥價，享有早鳥價者仍可享有團報優惠。" }],
	[
		{ text: "團體報名不保證全數錄取，團體報名凡錄取者（無論是否全數錄取）皆享有團報優惠價格，詳見" },
		{ text: "《報名簡章》", href: "https://drive.google.com/file/d/1nxt-lYWAMnsK-QbwbbeIV7lTi9hcimTw/view" },
		{ text: "。" }
	],
	[{ text: "本次夏令營預計招收學員 54 名，我們會針對報名資料做簡易審查，非先報先錄取。" }],
	[{ text: "正取學員名單最晚將於 6/8（日）前公佈，屆時請關注 SITCON 相關社群媒體及 Email 信箱。" }],
	[
		{ text: "正取學員需完成報名費繳交，始完成報名程序；另設有補助名額，請詳閱" },
		{ text: "《報名費用補助辦法》", href: "https://drive.google.com/file/d/1g6OSBT0yZIpOjKk5tkzgFOv-mcpBrPLd/view" },
		{ text: "。" }
	],
	[{ text: "關於退費事宜，請見" }, { text: "《退費說明文件》", href: "https://drive.google.com/file/d/1A193ekw7DtCgfMmxsICeT4gO2pWYGd4q/view" }, { text: "。" }]
];
