// 序號，計劃名稱右邊的數字
const thisSeqID = "67028";
// 年月份變數
const monthList = "2024-04";
// 日期列表
const dates = ["06", "03", "09", "10", "16", "17", "18", "24", "25", "30"];
// 設定每天開始和結束小時變數，24小時制
const startTime = 09;
const endTime = 16;
// 設定隨機分鐘數範圍 (例如，產生 0 到 20 之間的隨機分鐘數)
const minMinute = 0;
const maxMinute = 15;


//**********下面不用改**********//


// 工作備註
const workMemo = "%E6%8E%A5%E8%81%BD%E9%9B%BB%E8%A9%B1%E3%80%81%E7%99%BB%E6%89%93%E5%85%AC%E6%96%87%E3%80%81%E6%89%93%E6%8E%83%E8%BE%A6%E5%85%AC%E5%AE%A4";

// 從網頁中擷取 __VIEWSTATE 和 __VIEWSTATEGENERATOR 的值
var userIDNoElement = document.getElementById('UserIDNo');

async function getViewStateValues() {
  const response = await fetch("https://assistant.ntpu.edu.tw/STD/STDAdminPost.aspx");
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const viewState = doc.querySelector("#__VIEWSTATE").value;
  const viewStateGenerator = doc.querySelector("#__VIEWSTATEGENERATOR").value;
  return { viewState, viewStateGenerator };
}

// 迴圈處理每個日期
async function processDateRange() {
  const { viewState, viewStateGenerator } = await getViewStateValues();

  for (const date of dates) {
    // 產生指定範圍內的隨機分鐘數
    const randomMinute = (Math.floor(Math.random() * (maxMinute - minMinute + 1)) + minMinute).toString().padStart(2, '0');

    // 組合工作開始和結束時間
    const workStart = `${startTime}:${randomMinute}`;
    const workEnd = `${endTime}:${randomMinute}`;

    // 計算總時數
    const totalHour = endTime - startTime;

    // 組合請求 Body
    const body = `__VIEWSTATE=${encodeURIComponent(viewState)}&__VIEWSTATEGENERATOR=${encodeURIComponent(viewStateGenerator)}&UserID=${userIDNoElement.value}&ModifyType=add&monthList=${monthList}&thisSeqID=${thisSeqID}&work_date=${monthList}-${date}&work_start=${workStart}&work_end=${workEnd}&work_memo=${workMemo}&total_hour=${totalHour}`;

    try {
      // 發送請求
      const response = await fetch("https://assistant.ntpu.edu.tw/STD/STDAdminPost.aspx", {
        "headers": {
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7,ja;q=0.6",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          "sec-ch-ua": "\"Google Chrome\";v=\"125\", \"Chromium\";v=\"125\", \"Not.A/Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"macOS\"",
          "sec-fetch-dest": "iframe",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1"
        },
        "referrer": "https://assistant.ntpu.edu.tw/STD/STDAdminPost.aspx",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": body,
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });

      const httpCode = response.status;
      const success = response.ok;
      console.log(`${monthList}-${date} ${workStart} - ${workEnd}：${success ? '成功✅' : '失敗❌'} (${httpCode})`);
    } catch (error) {
      console.log(`${monthList}-${date} ${workStart} - ${workEnd}：失敗❌ (${error.message})`);
    }
  }
}

processDateRange();