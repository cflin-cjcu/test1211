$(function () {
    GetAuthorizationHeader();
    
    GetApiResponse();    
});

function GetAuthorizationHeader() {    
    const parameter = {
        grant_type:"client_credentials",
        client_id: "cflin-65af5b27-cc5f-4acb",
        client_secret: "4bc42ba8-bcd6-4053-a0c0-0301edd4f1ca"
    };
    
    let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";
        
    $.ajax({
        type: "POST",
        url: auth_url,
        headers: {
                "Accept-Encoding": "br,gzip",
              },  
        crossDomain:true,
        dataType:'JSON',                
        data: parameter,
        async: false,       
        success: function(data){            
            $("#accesstoken").text(JSON.stringify(data));                            
        },
        error: function (xhr, textStatus, thrownError) {
            
        }
    });          
}

function GetApiResponse(){    
    let accesstokenStr = $("#accesstoken").text();    

    let accesstoken = JSON.parse(accesstokenStr);    

    if(accesstoken !=undefined){
        $.ajax({
            type: 'GET',
            url: 'https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/LiveTrainDelay?$top=30&$format=JSON',             
            headers: {
                "authorization": "Bearer " + accesstoken.access_token,
                 "Accept-Encoding": "br,gzip",
              },            
            async: false,
            success: function (Data) {
                $('#apireponse').text(JSON.stringify(Data));                
                console.log('Data', Data);
            },
            error: function (xhr, textStatus, thrownError) {
                console.log('errorStatus:',textStatus);
                console.log('Error:',thrownError);
            }
        });
    }
}