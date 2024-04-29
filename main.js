// 設定月份變數
const monthList = "2024-04";

// 設定序號變數，計劃名稱右邊的數字
const thisSeqID = "67028";

// 設定日期列表
const dates = ["05"];

// 設定開始和結束時間變數
const startTime = 09;
const endTime = 17;

//********以下都不用改********//

// 工作備註
const workMemo = "%E6%8E%A5%E8%81%BD%E9%9B%BB%E8%A9%B1%E3%80%81%E7%99%BB%E6%89%93%E5%85%AC%E6%96%87%E3%80%81%E6%89%93%E6%8E%83%E8%BE%A6%E5%85%AC%E5%AE%A4";

// 從網頁中擷取 __VIEWSTATE 和 __VIEWSTATEGENERATOR 的值
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

  dates.forEach(date => {
    // 產生隨機分鐘數 (0-10)
    const randomMinute = Math.floor(Math.random() * 11).toString().padStart(2, '0');

    // 組合工作開始和結束時間
    const workStart = `${startTime}:${randomMinute}`;
    const workEnd = `${endTime}:${randomMinute}`;

    // 計算總時數
    const totalHour = endTime - startTime;

    // 組合請求 Body
    const body = `__VIEWSTATE=${encodeURIComponent(viewState)}&__VIEWSTATEGENERATOR=${encodeURIComponent(viewStateGenerator)}&UserID=&work_no=745287&ModifyType=add&monthList=${monthList}&thisSeqID=${thisSeqID}&work_date=${monthList}-${date}&work_start=${workStart}&work_end=${workEnd}&work_memo=${workMemo}&total_hour=${totalHour}`;

    // 發送請求
    fetch("https://assistant.ntpu.edu.tw/STD/STDAdminPost.aspx", {
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
  });
}

processDateRange();