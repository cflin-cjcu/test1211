document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('authButton').addEventListener('click', GetAuthorizationHeader);
    document.getElementById('apiButton').addEventListener('click', GetApiResponse);
});

async function GetAuthorizationHeader() {
    const parameter = new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "xxxxxxxx",
        client_secret: "xxxxxxx"
    });

    let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    try {
        const response = await fetch(auth_url, {
            method: "POST",
            headers: {
                "Accept-Encoding": "br,gzip",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: parameter,
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log('Data', data);
        localStorage.setItem('accesstoken', JSON.stringify(data));
    } catch (error) {
        console.error('Error:', error);
    }
}

async function GetApiResponse() {
    let accesstokenStr = localStorage.getItem('accesstoken');
    let accesstoken = JSON.parse(accesstokenStr);

    if (accesstoken !== undefined) {
        try {
            const response = await fetch('https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/LiveTrainDelay?$format=JSON', {
                method: 'GET',
                headers: {
                    "authorization": "Bearer " + accesstoken.access_token,
                    "Accept-Encoding": "br,gzip"
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            document.getElementById('apireponse').textContent = JSON.stringify(data);
            console.log('Data', data);
            displayDataInTable(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function displayDataInTable(data) {
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse'; // 合併邊框
    table.style.width = '100%'; // 設置表格寬度
    const headerRow = document.createElement('tr');

    // 假設 data 是一個包含多個對象的數組，並且每個對象有相同的鍵
    const headers = Object.keys(data[0]).filter(header => header !== 'UpdateTime'); // 排除 UpdateTime 欄位
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid black'; // 設置邊框
        th.style.padding = '8px'; // 設置內邊距
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            if (header === 'StationName' && item[header] && item[header].Zh_tw) {
                td.textContent = item[header].Zh_tw;
            } else {
                td.textContent = item[header];
            }
            td.style.border = '1px solid black'; // 設置邊框
            td.style.padding = '8px'; // 設置內邊距
            row.appendChild(td);
        });
        table.appendChild(row);
    });

;

    const apiResponseDiv = document.getElementById('apireponse');
    apiResponseDiv.innerHTML = ''; // 清空之前的內容
    apiResponseDiv.appendChild(table);
}