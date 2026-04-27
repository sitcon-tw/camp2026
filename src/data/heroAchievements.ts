import heroPlaceholderImage from "@/assets/hero/1.jpeg";

export type HeroAchievementPinColor = "green" | "blue" | "orange" | "soft-blue";

export type HeroAchievement = {
  id: string;
  title: string;
  description: string;
  image: typeof heroPlaceholderImage;
  x: number;
  y: number;
  width: number;
  rotation: number;
  pinColor: HeroAchievementPinColor;
  mobile?: boolean;
};

export type HeroAchievementLink = {
  from: string;
  to: string;
  color: HeroAchievementPinColor;
};

export const heroAchievements: HeroAchievement[] = [
  {
    id: "first-night",
    title: "第一晚就開始組隊",
    description: "陌生人變成隊友，從破冰到專案點子一起成形。",
    image: heroPlaceholderImage,
    x: 6,
    y: 12,
    width: 18,
    rotation: -5,
    pinColor: "green",
    mobile: true,
  },
  {
    id: "security-lab",
    title: "資安實作挑戰",
    description: "把攻防概念拆成任務，在實作裡理解風險與防護。",
    image: heroPlaceholderImage,
    x: 30,
    y: 8,
    width: 16,
    rotation: 4,
    pinColor: "blue",
    mobile: true,
  },
  {
    id: "ai-workshop",
    title: "AI 工作坊",
    description: "從模型應用到作品雛形，讓想法快速被看見。",
    image: heroPlaceholderImage,
    x: 62,
    y: 10,
    width: 18,
    rotation: -3,
    pinColor: "orange",
    mobile: true,
  },
  {
    id: "night-hack",
    title: "深夜開發時段",
    description: "有人修 bug，有人畫介面，也有人把點子講到天亮。",
    image: heroPlaceholderImage,
    x: 78,
    y: 36,
    width: 16,
    rotation: 6,
    pinColor: "green",
  },
  {
    id: "field-game",
    title: "大地遊戲",
    description: "技術之外，也用任務和合作把整個營隊串起來。",
    image: heroPlaceholderImage,
    x: 12,
    y: 46,
    width: 17,
    rotation: 5,
    pinColor: "soft-blue",
  },
  {
    id: "demo-stage",
    title: "成果發表",
    description: "把幾天累積的想法、程式和故事一次講給大家聽。",
    image: heroPlaceholderImage,
    x: 48,
    y: 36,
    width: 19,
    rotation: -6,
    pinColor: "blue",
    mobile: true,
  },
  {
    id: "mentor-time",
    title: "和講師近距離討論",
    description: "問題不只停在課堂，午餐和走廊也能繼續聊。",
    image: heroPlaceholderImage,
    x: 32,
    y: 62,
    width: 16,
    rotation: 3,
    pinColor: "orange",
  },
];

export const heroAchievementLinks: HeroAchievementLink[] = [
  { from: "first-night", to: "security-lab", color: "green" },
  { from: "security-lab", to: "ai-workshop", color: "blue" },
  { from: "ai-workshop", to: "night-hack", color: "orange" },
  { from: "first-night", to: "field-game", color: "soft-blue" },
  { from: "field-game", to: "mentor-time", color: "green" },
  { from: "mentor-time", to: "demo-stage", color: "orange" },
  { from: "demo-stage", to: "night-hack", color: "blue" },
  { from: "security-lab", to: "demo-stage", color: "soft-blue" },
];
