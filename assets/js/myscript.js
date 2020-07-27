document.addEventListener('DOMContentLoaded', function(event) {
    // showLoading()
    //fetch data dari API
    fetch("https://covid19.mathdro.id/api")
    .then(response => response.json())
    .then(response => {
        drawHeader(response)
        getIndonesiaData("https://indonesia-covid-19.mathdro.id/api/")
        // getDailyData(response.dailySummary)
    })
})

function getDailyData(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => {
        drawDailyData(response)
    })
    .then( hideLoading() )
}

function drawDailyData(adata) {
    const reorderArray = adata.reverse()
    const dailyData = document.querySelector(".daily-summary-container")

    let aHtml = `<div class="row daily-judul">
                        <div class="col-12">
                            <div class="dp-flex-center">
                                <div class="line"></div>
                            </div>
                            <div class="dp-flex-center">
                                <span class="txt-daily">Daily Updates</span>
                            </div>
                        </div>
                    </div>`;

    reorderArray.forEach((item, idx) => {
        aHtml += `<div class="row bd-b-separator">
                        <div class="col-12 daily-det-container">
                            <div class="date-detail">
                                <span>${convertDate(item.reportDate)}</span>
                            </div>
                            <div class="dp-flex-start">
                                <div class="val-confirmed dp-flex-start-top">
                                    ${ cekPrevData(reorderArray[idx].confirmed.total, idx+1 > reorderArray.length-1 ? 0 : reorderArray[idx+1].confirmed.total) }
                                    
                                    <span class="daily-conf">Confirmed : ${item.confirmed.total === null ? '-' : cekDiffData(item.confirmed.total, idx+1 > reorderArray.length-1 ? 0 : reorderArray[idx+1].confirmed.total, idx)}</span>
                                </div>
                                <div class="val-deaths dp-flex-start-top">
                                    ${ cekPrevData(reorderArray[idx].deaths.total, idx+1 > reorderArray.length-1 ? 0 : reorderArray[idx+1].deaths.total) }

                                    <span class="daily-deaths">Deaths : ${item.deaths.total === null ? '-' : cekDiffData(item.deaths.total, idx+1 > reorderArray.length-1 ? 0 : reorderArray[idx+1].deaths.total, idx)}</span>
                                </div>                   
                            </div>
                            <div class="dp-flex-start">
                                <span class="fz-13 color-primary">
                                    <svg class="bi bi-info-circle-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" d="M8 16A8 8 0 108 0a8 8 0 000 16zm.93-9.412l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM8 5.5a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"/>
                                    </svg>
                                </span>
                                <div class="pd-l-nolkoma5rem">
                                    <span class="txt-info"><span class="color-confirmed">${item.confirmed.china}</span> on China and <span class="color-confirmed">${item.confirmed.outsideChina}</span> on the other countries</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
    });

    dailyData.innerHTML = aHtml
}

function drawHeader(adata) {
    drawChart(adata)
    drawDetailHeader(adata)
}

function getIndonesiaData(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => {
        drawIndonesiaData(response)
        getProvincesData(response.perProvinsi.json)
    })
}

function getProvincesData(url) {
    fetch(url)
    .then(response => response.json())
    .then(response => {
        drawProvincesData(response)
    })
    .then( hideLoading() )
}

function drawProvincesData(adata) {
    const dailyData = document.querySelector(".provinces-summ-container")

    let aHtml = `<div class="row daily-judul">
                    <div class="col-12">
                        <div class="dp-flex-center">
                            <div class="line"></div>
                        </div>
                        <div class="dp-flex-center">
                            <span class="txt-daily">Provinces</span>
                        </div>
                    </div>
                </div>`;

    adata.data.forEach((item, idx) => {

        if (idx !== adata.data.length - 1) {
            aHtml += `<div class="row">
                        <div class="col-12">
                            <div class="card-provinces">
                                <div class="row">
                                    <div class="col-3" style="display: flex; align-items: center; justify-content: center;">
                                        <div class="txt-urutan">
                                            <span style="font-weight: bold; font-size: 1.25rem;">${idx+1}</span>
                                        </div>
                                    </div>
                                    <div class="col-9 pl-0">
                                        <span class="d-block font-weight-bolder" style="font-size: 1rem; color: #464E5F;">${item.provinsi}</span>
                                        <div class="row">
                                            <div class="col-12">
                                                <div class="d-flex justify-content-start">
                                                    <div class="id-confirmed px-0 mr-5">
                                                        <span class="dp-block val" style="font-size: .85rem">${item.kasusPosi}</span>
                                                        <span class="dp-block desc">Confirmed</span>
                                                    </div>
                                                    <div class="id-recovered px-0 mr-5">
                                                        <span class="dp-block val" style="font-size: .85rem">${item.kasusSemb}</span>
                                                        <span class="dp-block desc">Recovered</span>
                                                    </div> 
                                                    <div class="id-deaths px-0 mr-5">
                                                        <span class="dp-block val" style="font-size: .85rem">${item.kasusMeni}</span>
                                                        <span class="dp-block desc">Deaths</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }
    });

    dailyData.innerHTML = aHtml
}

function cekDiffData(newVal, oldVal, index) {
    let aNew = newVal === null ? 0 : newVal 
    let anOld = oldVal === null ? 0 : oldVal 

    if(index === 0) {
        if(anOld > aNew) {
            return aNew
        } else {
            return anOld + " + " + (aNew - anOld) + " new cases"
        }
    } else {
        return aNew
    }
}

function cekPrevData(newData, oldData) {
    let aNew = newData === null ? 0 : newData 
    let anOld = oldData === null ? 0 : oldData 
    const aIconUp = `<span class="icon color-primary">
                        <svg class="bi bi-graph-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"/>
                            <path fill-rule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clip-rule="evenodd"/>
                        </svg>
                    </span>`;

    const aIconDown = `<span class="icon color-primary">
                        <svg class="bi bi-graph-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"/>
                            <path fill-rule="evenodd" d="M14.39 9.041l-4.349-5.436L7 6.646 3.354 3l-.708.707L7 8.061l2.959-2.959 3.65 4.564.781-.625z" clip-rule="evenodd"/>
                            <path fill-rule="evenodd" d="M10 9.854a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v3.5h-3.5a.5.5 0 00-.5.5z" clip-rule="evenodd"/>
                        </svg>
                    </span>`;

    if( aNew !== anOld ) {
        if( aNew < anOld ) {
            return aIconDown
        } else {
            return aIconUp
        }
    } else {
        return "-"
    }
}

function drawIndonesiaData(adata) {
    // <div class="dp-flex-center">
    //     <span class="last-update">Last Update ${convertDateTime(adata.lastUpdate)}</span>
    // </div>
    const IndonesiaData = document.querySelector(".idn-data-container")
    IndonesiaData.innerHTML = `<div class="col-12">
                                    <div class="dp-flex-center">
                                        <span class="id-country">Indonesia</span>
                                    </div>
                                    <div class="dp-flex-center">
                                        <div class="dp-block id-confirmed">
                                            <span class="dp-block val">${adata.jumlahKasus}</span>
                                            <span class="dp-block desc">Confirmed</span>
                                        </div>
                                        <div class="dp-block id-recovered">
                                            <span class="dp-block val">${adata.sembuh}</span>
                                            <span class="dp-block desc">Recovered</span>
                                        </div>
                                        <div class="dp-block id-deaths">
                                            <span class="dp-block val">${adata.meninggal}</span>
                                            <span class="dp-block desc">Deaths</span>
                                        </div>
                                    </div>
                                </div>
                                <span class="dp-block sc-data">Data Source: https://indonesia-covid-19.mathdro.id/api/</span>`
    
}

function drawDetailHeader(data){
    const totalCases = document.querySelector("#total-cases")
    totalCases.textContent = data.confirmed.value + data.recovered.value + data.deaths.value

    const detailCases = document.querySelector("#detail-cases")
    detailCases.innerHTML = `<div class="wrapper">
                                <div class="dp-block confirmed">
                                    <span class="dp-block val">${data.confirmed.value}</span>
                                    <span class="dp-block desc">Confirmed</span>
                                </div>
                                <div class="dp-block recovered">
                                    <span class="dp-block val">${data.recovered.value}</span>
                                    <span class="dp-block desc">Recovered</span>
                                </div>
                                <div class="dp-block deaths">
                                    <span class="dp-block val">${data.deaths.value}</span>
                                    <span class="dp-block desc">Deaths</span>
                                </div>
                            </div>`
}

function drawChart(data) {
    CanvasJS.addColorSet("customColor", [
        "#F8AD1E",
        "#2ABA6B",
        "#B11E31"                
    ]);

    const chart = new CanvasJS.Chart("chartContainer", {
        // width: 200,
        // height: 200,
        backgroundColor: "transparent",
        animationEnabled: true,
        interactivityEnabled: false,
        colorSet:  "customColor",
        title:{
            horizontalAlign: "left"
        },
        data: [{
            type: "doughnut",
            startAngle: 60,
            indexLabelFontSize: 10,
            indexLabel: "{null}",
            dataPoints: [
                { y: data.confirmed.value, label: "Confirmed" },
                { y: data.recovered.value, label: "Recovered" },
                { y: data.deaths.value, label: "Deaths" }
            ]
        }]
    });
    chart.render();
}

function convertDateTime(adate) {
    const newDate = new Date(adate);
    let month_names = ["January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    let month_index = newDate.getMonth();
    let date = newDate.getDate() + ' ' + (month_names[month_index]) + ' ' +newDate.getFullYear();
    let time = newDate.getHours() + ":" + newDate.getMinutes();
    let dateTime = date + ' ' + time;

    return dateTime
}

function convertDate(adate) {
    const newDate = new Date(adate);
    let month_names = ["January", "February", "March",
        "April", "May", "June",
        "July", "August", "September",
        "October", "November", "December"
    ];
    let month_index = newDate.getMonth();
    let date = newDate.getDate() + ' ' + (month_names[month_index]) + ' ' +newDate.getFullYear();

    return date
}

// function showLoading() {
//     console.log(3)
// }

function hideLoading() {
    document.querySelector(".loading").style.display = "none"
    const allContainer = document.querySelectorAll(".container")
    const arrContainer = Array.from(allContainer);
    arrContainer.forEach(element => {
        element.style.visibility = "visible"
    })
}