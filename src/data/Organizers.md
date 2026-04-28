# Organizers.json 配置說明

本檔案記錄活動主辦、協辦、贊助單位資料，供前端渲染。

## 結構

```json
{
  "主辦": [ { ...單位物件... } ],
  "協辦": [ { ...單位物件... } ],
  "贊助": [ { ...單位物件... } ]
}
```

### 單位物件格式

| 欄位        | 型別   | 必填 | 說明         |
| ----------- | ------ | ---- | ------------ |
| name        | string | 是   | 單位名稱     |
| role        | string | 是   | 單位角色     |
| description | string | 是   | 單位簡介     |
| iconPath    | string | 是   | 單位圖示 URL |
| url         | string | 是   | 單位官方網站 |

## 填寫規則

- 所有欄位必填
- iconPath 請填有效 URL
- 分組名稱（主辦/協辦/贊助）可擴充，需同步前端

## 範例

```json
{
	"主辦": [
		{
			"name": "六角學院",
			"role": "主辦單位",
			"description": "專注於網頁開發教育的線上學校，提供從入門到進階的實戰課程，學員超過萬人。",
			"iconPath": "https://api.dicebear.com/9.x/icons/svg?seed=hexschool&icon=code",
			"url": "https://hexschool.tw"
		}
	]
}
```
