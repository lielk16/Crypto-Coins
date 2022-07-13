/// <reference path="jquery-3.6.0.js" />

$(function () {

    //first ajax call for displaying coins 
    $("#showCrypto").append(function () {
        apiFirstCall();
    });
//ajax call function
    function apiFirstCall() {
        $.ajax({
            // beforeSend: displaySpinner(),
            url: "https://api.coingecko.com/api/v3/coins",
            success: lists => insertObjToArr(lists),
            error: err => alert("Error: " + err.status)
        })
    }

    //insert objects in array 
    let coinsArr = [];
    function insertObjToArr(lists) {
        for (let i = 0; i < lists.length; i++) {
            const coinsVal = {
                id: lists[i].id,
                symbol: lists[i].symbol,
                name: lists[i].name,
                img: lists[i].image.small
            }
            coinsArr.push(coinsVal);
            displayCoins(coinsVal);
        }
    }

    //display coins on page
    function displayCoins(lists) {
        let coinsCards = coinsToHtml(lists);
        $("#showCrypto").append(coinsCards);
        $("#homeLink").addClass('active');
        $("#liveReportSection").hide();
        $("#aboutSection").hide();

    }

    //display coins html
    function coinsToHtml(lists) {
        const coinsCards =
            `<div class="card-body" id="${lists.symbol}">   
                 <input type="checkbox" id="-${lists.id}">
                      <img src="${lists.img}" 
                    <br>
                     <h5 class="card-title">${lists.symbol}</h5>
                    <p class="card-text" >${lists.name}</p>
                     <button data-toggle="collapse" data-target="#${lists.name}" class="btnMoreInfo" 
                     id="${lists.id}">More Info</button>
                     <p id="${lists.name}"></p>
                </div>`
        return coinsCards;
    }

    //checks how many checkbox were checked
    let selectedCoins = [];
    $("#showCrypto").on("click", '.card-body > input[type="checkbox"]', function () {
        if (selectedCoins.length < 5) {
            if ($(this).prop("checked") == true) {
                selectedCoins.push(this.id);
            }
            else if ($(this).prop("checked") == false) {
                selectedCoins.splice(selectedCoins.indexOf(`${this.id}`), 1);
                console.log(selectedCoins)
            }
        } else {
            displayCoinsReport(selectedCoins, this.id);
        }
    });

    //display modal on page
    function displayCoinsReport(selectedCoins, coinAdded) {
        let modalDiv = " ";
        for (let i = 0; i < selectedCoins.length; i++) {
            modalDiv += `${selectedCoins[i]} <input type="checkbox" id="${selectedCoins[i]}"> <br>`
        }
        $("#displayReportModal").html(modalDiv)
        $('#exampleModal').modal('show');
        selectedCoins.push(coinAdded)
    }

    //removing selected coin 
    $("#selectedCoinsReport").on("click", '#displayReportModal > input[type="checkbox"]', function () {
        selectedCoins.splice(selectedCoins.indexOf(`${this.id}`), 1);
        $("#" + this.id).prop("checked", false)
    });

 
    //second ajax call for displaying coin data
    $("#showCrypto").on("click", ".card-body > button", function () {
        if (localStorage != null) {
            $.ajax({
                // beforeSend: function () {
                //     const spinner = displaySpinner();
                //     $(".card-body").html(spinner);
                // },
                url: "https://api.coingecko.com/api/v3/coins/" + this.id,
                success: coin => {
                    saveLocalStorage(coin);
                    displayInfo(coin);
                },
                error: err => alert("Error: " + err.status)
            });
        } else {
            readLocalStorage();
        }
    });
    //display coin data
    function displayInfo(coin) {
        const coinInfo = `
        <div id="${coin.name}" >
            ${coin.market_data.current_price.eur + "€"} |
            ${coin.market_data.current_price.usd + "$"} |
            ${coin.market_data.current_price.ils + "₪"}
            </div>`
        $("#" + coin.name).html(coinInfo);
    }
    //check if input exist and display it
    $("#searchBtn").click(function () {
        try {
            let input = $("#searchTxt").val();
            let InputObj = coinsArr.find(o => o.symbol === input);
            $("#showCrypto").html(coinsToHtml(InputObj));
        } catch {
            alert("could not find the coin, please try again")
        }
    })
    //cleaning search text and return back to "show crypto" div
    $("#searchTxt").click(function () {
        $("#searchTxt").val('');
    })
    //spinner function
    function displaySpinner() {
        const spinnerDiv = `
        <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>`
        return spinnerDiv;
    }
    //local storage functions
    function saveLocalStorage(coin) {
        localStorage.setItem(`${coin.id}`, JSON.stringify(coin))
        clearLocalStorage(`${coin.id}`);
    }
    function readLocalStorage() {
        const coins = JSON.parse(localStorage.getItem("coin"));
        displayCoins(coins);
    }
    function clearLocalStorage(coin) {
        setTimeout(() => {
            localStorage.removeItem(coin);
        }, 1000 * 60 * 2);
    }
    //display different html
    $("#homeLink").click(function () {
        $("#showCrypto").html(" ");
        apiFirstCall();
        $("#homeSection").show();
        $("#liveReportSection").hide();
        $("#aboutSection").hide();

    })
    $("#liveReportsLink").click(function () {
        //display different html
        $("#homeSection").hide();
        $("#liveReportSection").show();
        $("#aboutSection").hide();

    })
    $("#aboutLink").click(function () {
        //display different html
        $("#homeSection").hide();
        $("#liveReportSection").hide();
        $("#aboutSection").show();
    })
    //display bg color to clicked button on topnav
    $(".topnav a").click(function () {
        $(".topnav").children().removeClass('active');
        $(this).addClass('active');
    });
});
