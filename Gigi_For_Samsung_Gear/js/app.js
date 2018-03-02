
var coins = 0;
var health = 0;
var energy = 0;
var emotions = 0;
var day = 0;

var startDate = 0;
var lastDateCo = 0;
var lastDateEm = 0;
var lastDateEn = 0;
var lastDateHe = 0;
var currDate = 0;

var started = false;

var timerId;

var pedometer;
var currPedoInfo;

var logger = "";

function newGame()
{
	started = true;
	window.localStorage.setItem("started", "true");
	
	coins = 50;
	health = 10;
	energy = 10;
	emotions = 10;
	
	startDate = (new Date()).getTime();	
	lastDateCo = (new Date()).getTime();	
	lastDateEm = (new Date()).getTime();
	lastDateEn = (new Date()).getTime();
	lastDateHe = (new Date()).getTime();	

	writeStorage();
}

function writeStorage()
{
	window.localStorage.setItem("coins", "" + coins);
	window.localStorage.setItem("health", "" + health);
	window.localStorage.setItem("energy", "" + energy);
	window.localStorage.setItem("emotions", "" + emotions);
	window.localStorage.setItem("startDate", "" + startDate);
	window.localStorage.setItem("lastDateCo", "" + lastDateCo);
	window.localStorage.setItem("lastDateEm", "" + lastDateEm);
	window.localStorage.setItem("lastDateEn", "" + lastDateEn);
	window.localStorage.setItem("lastDateHe", "" + lastDateHe);
	log("Write storage - Co: " + coins + " CoD: " + lastDateCo + " Em: " + emotions + " EmD: " + lastDateEm +
			" En: " + energy + " EnD: " + lastDateEn + " He: " + health + " HeD: " + lastDateHe + " Started: " + started);
}

function readStorage()
{
	coins = parseInt(window.localStorage.getItem("coins"));
	health = parseInt(window.localStorage.getItem("health"));
	energy = parseInt(window.localStorage.getItem("energy"));
	emotions = parseInt(window.localStorage.getItem("emotions"));
	startDate = parseInt(window.localStorage["startDate"]);
	lastDateCo = parseInt(window.localStorage["lastDateCo"]);
	lastDateEm = parseInt(window.localStorage["lastDateEm"]);
	lastDateEn = parseInt(window.localStorage["lastDateEn"]);
	lastDateHe = parseInt(window.localStorage["lastDateHe"]);
	log("Read storage - Co: " + coins + " CoD: " + lastDateCo + " Em: " + emotions + " EmD: " + lastDateEm +
			" En: " + energy + " EnD: " + lastDateEn + " He: " + health + " HeD: " + lastDateHe + " Started: " + started);
}

function init()
{
	if (window.webapis && window.webapis.motion !== undefined) 
	{
		pedometer = window.webapis.motion;
	}
	
	if (window.localStorage["started"] == undefined)
	{
		started = false;
		window.localStorage["started"] = "false";
		log("Started is set to false");
	}
	else
	{
		started = window.localStorage["started"] == "true" ? true: false;
		log("Started is " + started);
	}

	if (!started)
	{	
		newGame();
	}
	else
	{
		readStorage();
	}
	
	displayData();
	
	timerId = setInterval("checkState()", 60000);
}

function handlePedoInfo(pedoInfo)
{
	currPedoInfo = pedoInfo;
	var steps = pedoInfo.cumulativeWalkStepCount + pedoInfo.cumulativeRunStepCount;
	var emoCount = parseInt((pedoInfo.cumulativeWalkStepCount + 2 * pedoInfo.cumulativeRunStepCount) / 200.0);
	var eneCount = parseInt((pedoInfo.cumulativeWalkStepCount + 2 * pedoInfo.cumulativeRunStepCount) / 400.0);
	var heaCount = parseInt((pedoInfo.cumulativeWalkStepCount + 2 * pedoInfo.cumulativeRunStepCount) / 600.0);
	document.getElementById("addemotions").innerHTML = "<b>+" + emoCount + "</b>";
	document.getElementById("addenergy").innerHTML = "<b>+" + eneCount + "</b>";
	document.getElementById("addhealth").innerHTML = "<b>+" + heaCount + "</b>";
	document.getElementById("steps").innerHTML = "" + steps;
}

function startPedo()
{
	pedometer.start("PEDOMETER", handlePedoInfo);
	document.getElementById("addemotions").innerHTML = "<b>+0</b>";
	document.getElementById("addenergy").innerHTML = "<b>+0</b>";
	document.getElementById("addhealth").innerHTML = "<b>+0</b>";
	document.getElementById("steps").innerHTML = "0";
}

function stopPedo()
{
	pedometer.stop("PEDOMETER");
	if (currPedoInfo)
	{
		var emoCount = parseInt((currPedoInfo.cumulativeWalkStepCount + 2 * currPedoInfo.cumulativeRunStepCount) / 200.0);
		var eneCount = parseInt((currPedoInfo.cumulativeWalkStepCount + 2 * currPedoInfo.cumulativeRunStepCount) / 400.0);
		var heaCount = parseInt((currPedoInfo.cumulativeWalkStepCount + 2 * currPedoInfo.cumulativeRunStepCount) / 600.0);
		health = health + heaCount >= 10 ? 10 : health + heaCount;
		energy = energy + eneCount >= 10 ? 10 : energy + eneCount;
		emotions = emotions + emoCount >= 10 ? 10 : emotions + emoCount; 	
		writeStorage();
	}
	displayData();
	tau.back();
}

function checkState()
{
	if (started)
	{
		displayData();
	}
}

function displayData()
{
	var type = -1;
	currDate = (new Date()).getTime();	
	log("Curr: " + currDate + " ST: " + startDate + " CoD: " + lastDateCo + " EmD: " + lastDateEm +
			" EnD: " + lastDateEn + " HeD: " + lastDateHe + " Started: " + started);
	
	var delta = (currDate - startDate) / 86400000.0;
	if (Math.abs(delta) < 0.1)
	{
		delta = 0.0;
	}
	day = 1 + parseInt(delta);
	document.getElementById("day").innerHTML = "<b>Day " + day + "</b>";	
	log("Day: " + day);
	
	var deltaCoTemp = (currDate - lastDateCo) / 3600000.0;
	if (Math.abs(deltaCoTemp) < 0.1)
	{
		deltaCoTemp = 0.0;
	}
	var deltaCo = parseInt(deltaCoTemp);
	log("Delta coins: " + deltaCo);
	if (deltaCo > 0)
	{
		coins += deltaCo * 2;
		if (coins > 100)
		{
			coins = 100;
		}
		lastDateCo = currDate;
		type = 1;
	}
	
	var deltaEmTemp = (currDate - lastDateEm) / 10800000.0;
	if (Math.abs(deltaEmTemp) < 0.1)
	{
		deltaEmTemp = 0.0;
	}
	var deltaEm = parseInt(deltaEmTemp);
	log("Delta emotions: " + deltaEm);
	if (deltaEm > 0)
	{
		emotions -= deltaEm;
		lastDateEm = currDate;
		type = 2;
	}
	if (emotions < 0)
	{
		emotions = 0;
	}
	
	var deltaHeTemp = (currDate - lastDateHe) / 21600000.0;
	if (Math.abs(deltaHeTemp) < 0.1)
	{
		deltaHeTemp = 0.0;
	}
	var deltaHe = parseInt(deltaHeTemp);
	log("Delta health: " + deltaHe);
	if (deltaHe > 0)
	{
		health -= deltaHe;
		lastDateHe = currDate;
		type = 2;
	}
	if (health < 0)
	{
		health = 0;
	}
	
	var deltaEnTemp = (currDate - lastDateEn) / 14400000.0;
	if (Math.abs(deltaEnTemp) < 0.1)
	{
		deltaEnTemp = 0.0;
	}
	var deltaEn = parseInt(deltaEnTemp);
	log("Delta energy: " + deltaEn);
	if (deltaEn > 0)
	{
		energy -= deltaEn;
		lastDateEn = currDate;
		type = 2;
	}
	if (energy < 0)
	{
		energy = 0;
	}	
	
	writeStorage();
	
	if (type > -1)
	{
		doSound(type);
	}
	
	drawState();
	
}

function log(info)
{
	logger = (new Date()).toString() + " - " + info + "<br/><br>" + logger;
}

function showLog()
{
	document.getElementById("logDiv").innerHTML = logger;
}

function drawState()
{
	document.getElementById("coins").innerHTML = "<b>" + coins + "</b>";
	document.getElementById("health").innerHTML = "<b>" + health + "</b>";
	document.getElementById("energy").innerHTML = "<b>" + energy + "</b>";
	document.getElementById("emotions").innerHTML = "<b>" + emotions + "</b>";
	
	if (energy + health + emotions > 26)
	{
		document.getElementById("flower").setAttribute("src", "images/happy.gif");
	}
	else if (energy + health + emotions > 18)
	{
		document.getElementById("flower").setAttribute("src", "images/flower_high.gif");
	}
	else if (energy + health + emotions > 13)
	{
		document.getElementById("flower").setAttribute("src", "images/flower_med_high.gif");
	}
	else if (energy + health + emotions > 8)
	{
		document.getElementById("flower").setAttribute("src", "images/flower_med_low.gif");
	}
	else
	{
		document.getElementById("flower").setAttribute("src", "images/flower_low.gif");
	}
	
	if (energy + health + emotions <= 0)
	{
		document.getElementById("flower").setAttribute("src", "images/gameover.gif");
		started = false;
		window.localStorage["started"] = "false";
		log("Game over - started: " + started);
	}
}

function doNewGame()
{
	var r = confirm("Do you want to end this game and start a new one?");
	if (r == true) 
	{
		newGame();
		displayData();
	}
	tau.back();
}

function showAbout()
{
	alert("Gigi, your flower buddy\n\n© 2014, Pronic, Meselina Ponikvar Verhovsek s.p.\n\nhttp://pronic.si\n\n");
	tau.back();
}

function doSound(type)
{
	if (type === 0)
	{
		var pos = parseInt(Math.random() * 5);
		if (pos === 0)
		{
			document.getElementById("buy1Sound").play();
		}
		else if (pos === 1)
		{
			document.getElementById("buy2Sound").play();
		}
		else if (pos === 2)
		{
			document.getElementById("buy3Sound").play();
		}
		else if (pos === 3)
		{
			document.getElementById("buy4Sound").play();
		}
		else if (pos === 4)
		{
			document.getElementById("buy5Sound").play();
		}
	}
	else if (type === 1)
	{
		var pos = parseInt(Math.random() * 5);
		if (pos === 0)
		{
			document.getElementById("pos1Sound").play();
		}
		else if (pos === 1)
		{
			document.getElementById("pos2Sound").play();
		}
		else if (pos === 2)
		{
			document.getElementById("pos3Sound").play();
		}
		else if (pos === 3)
		{
			document.getElementById("pos4Sound").play();
		}
		else if (pos === 4)
		{
			document.getElementById("pos5Sound").play();
		}
	}
	else if (type === 2)
	{
		var pos = parseInt(Math.random() * 7);
		if (pos === 0)
		{
			document.getElementById("neg1Sound").play();
		}
		else if (pos === 1)
		{
			document.getElementById("neg2Sound").play();
		}
		else if (pos === 2)
		{
			document.getElementById("neg3Sound").play();
		}
		else if (pos === 3)
		{
			document.getElementById("neg4Sound").play();
		}
		else if (pos === 4)
		{
			document.getElementById("neg5Sound").play();
		}
		else if (pos === 5)
		{
			document.getElementById("neg6Sound").play();
		}
		else if (pos === 6)
		{
			document.getElementById("neg7Sound").play();
		}
	}
	else if (type === 3)
	{
		var pos = parseInt(Math.random() * 4);
		if (pos === 0)
		{
			document.getElementById("song1Sound").play();
		}
		else if (pos === 1)
		{
			document.getElementById("song2Sound").play();
		}
		else if (pos === 2)
		{
			document.getElementById("song3Sound").play();
		}
		else if (pos === 3)
		{
			document.getElementById("song4Sound").play();
		}
	}
}

function doBuy(group, id)
{
	if (started)
	{
		if (group === 0) // amusement
		{
			if (id === 0) // cards
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id === 1) // amusement
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 2) // games
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 3) // movies
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 4) // music
			{
				if (coins >= 3)
				{
					coins -= 3;
					emotions += 2;
					doSound(3);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 5) // snook
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 6) // shop
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 7) // sing
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(3);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 8) // play
			{
				if (coins >= 2)
				{
					coins -= 2;
					emotions += 1;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
			else if (id == 9) // travel
			{
				if (coins >= 3)
				{
					coins -= 3;
					emotions += 2;
					doSound(0);
					if (emotions >= 10)
					{
						emotions = 10;
					}
				}
			}
		}
		else if (group == 1) // energy
		{
			if (id == 0) // fitness
			{
				if (coins >= 4)
				{
					coins -= 4;
					energy += 2;
					doSound(0);
					if (energy >= 10)
					{
						energy = 10;
					}
				}
			}
			else if (id == 1) // yoga
			{
				if (coins >= 3)
				{
					coins -= 3;
					energy += 1;
					doSound(0);
					if (energy >= 10)
					{
						energy = 10;
					}
				}
			}
			else if (id == 2) // sleep
			{
				if (coins >= 3)
				{
					coins -= 3;
					energy += 1;
					document.getElementById("sleepSound").play();
					if (energy >= 10)
					{
						energy = 10;
					}
				}
			}
			else if (id == 3) // sun
			{
				if (coins >= 3)
				{
					coins -= 3;
					energy += 1;
					doSound(0);
					if (energy >= 10)
					{
						energy = 10;
					}
				}
			}
			else if (id == 4) // water
			{
					if (coins >= 4)
					{
						coins -= 4;
						energy += 2;
						document.getElementById("drinkSound").play();
						if (energy >= 10)
						{
							energy = 10;
						}
					}
			}
			else if (id == 5) // care
			{
				if (coins >= 3)
				{
					coins -= 3;
					energy += 1;
					document.getElementById("eatSound").play();
					if (energy >= 10)
					{
						energy = 10;
					}
				}
			}
		}
		else if (group == 2) // love
		{
			if (id == 0) // gift
			{
				if (coins >= 8)
				{
					coins -= 8;
					health += 2;
					doSound(0);
					if (health >= 10)
					{
						health = 10;
					}
				}
			}
			else if (id == 1) // kiss
			{
				if (coins >= 5)
				{
					coins -= 5;
					health += 1;
					document.getElementById("buy2Sound").play();
					if (health >= 10)
					{
						health = 10;
					}
				}
			}
			else if (id == 2) // hug
			{
				if (coins >= 5)
				{
					coins -= 5;
					health += 1;
					doSound(0);
					if (health >= 10)
					{
						health = 10;
					}
				}
			}
			else if (id == 3) // spa
			{
				if (coins >= 8)
				{
					coins -= 8;
					health += 2;
					doSound(0);
					if (health >= 10)
					{
						coins += 12;
						health = 10;
					}
				}
			}
			else if (id == 4) // read
			{
				if (coins >= 5)
				{
					coins -= 5;
					health += 1;
					doSound(0);
					if (health >= 10)
					{
						health = 10;
					}
				}
			}
			else if (id == 5) // talk
			{
				if (coins >= 5)
				{
					coins -= 5;
					health += 1;
					doSound(0);
					if (health >= 10)
					{
						health = 10;
					}
				}
			}
		}
	}
	
	writeStorage();
	displayData();
	tau.back();
}

( 
	function () 
	{
		window.addEventListener( 'tizenhwkey', function( ev ) 
			{
				if (ev.keyName == "back") 
				{
					var page = document.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id : "";
					if (pageid === "main") 
					{
						tizen.application.getCurrentApplication().exit();
					} 
					else 
					{
						window.history.back();
					}
				}
			});
			


	} () 
);
