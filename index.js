var gameList = [];
var modList = [];
var chosedGame;
var chosedModIndex = [];
var chosedList = [];
var outputList = [];
var needNum = 9;

// 初始化
function init () {
	// 初始化video
	document.getElementById("video").innerHTML = "";
	for (let i in bv) {
		document.getElementById("video").innerHTML += `<div class='video-in' title='点击跳转B站播放' onclick='bilibiliPlay(${i})'>&nbsp;</div>`;
		document.getElementsByClassName("video-in")[i].style.backgroundImage = `url(img/video/v${+i + 1	}.jpg)`;
	}
	
	// 初始化变量
	for (let obj of totalList) {
		if (obj.type === "mc") {
			gameList.push(obj);
		}
	}
	gameList.sort(compareVer);
	
	// 初始化HTML
	document.getElementById("mc-list").innerHTML = "";
	for (let i in gameList) {
		const mcHTML = `<div class="mc-list mc-list-def" onclick="mcSelect(${i})">mc-${gameList[i].ver}</div>`
		document.getElementById("mc-list").innerHTML += mcHTML;
	}
}
// 比较版本号
function compareVer (a, b) {
	let verA = a.ver.split(".").map(Number);
	let verB = b.ver.split(".").map(Number);
	
	for (let i = 0; i < Math.max(verA.length, verB.length); i ++) {
		if (!verA[i] && verB[i]) {
			return 1;
		}
		if (verA[i] && !verB[i]) {
			return -1;
		}
		if (verA[i] < verB[i]) {
			return 1;
		}
		if (verA[i] > verB[i]) {
			return -1;
		}
	}
	return 0;
}

// 游戏版本选择
function mcSelect (index) {
	// 应用于HTML
	for (let i in gameList) {
		document.getElementsByClassName("mc-list")[i].className = "mc-list mc-list-def";
	}
	document.getElementsByClassName("mc-list")[index].className = "mc-list mc-list-aft";
	
	// 初始化变量modList
	for (let obj of totalList) {
		if (obj.type === "mod") {
			modList.push(obj);
		}
	}
	// 初始化变量chosedModIndex
	for (let i in modList) {
		chosedModIndex[i] = false;
	}
	// 初始化变量chosedGame
	chosedGame = gameList[index];
	
	// 筛选变量
	modList = modList.filter(mod => mod.ver === gameList[index].ver);
	
	// 应用于HTML
	document.getElementById("mod-list").innerHTML = "";
	for (let i in modList) {
		const modHTML = `<div class="mod-list mod-list-def" onclick="modSelect(${i})">${modList[i].name}</div>`;
		document.getElementById("mod-list").innerHTML += modHTML;
	}
}

// mod选择
function modSelect (index) {
	chosedModIndex[index] = !chosedModIndex[index];
	
	// 应用于HTML
	for (let i in chosedModIndex) {
		if (chosedModIndex[i]) {
			document.getElementsByClassName("mod-list")[i].className = "mod-list mod-list-aft";
		} else {
			document.getElementsByClassName("mod-list")[i].className = "mod-list mod-list-def";
		}
	}
}

// 开始随机
function doRandom () {
	// 初始化chosedList
	chosedList = {
		"bio": [],
		"death": []
	};
	for (let i in modList) {
		if (chosedModIndex[i]) {
			chosedList.bio.push(...modList[i].bioList);
			chosedList.death.push(...modList[i].deathList);
		}
	}
	chosedList.bio.push(...chosedGame.bioList);
	chosedList.death.push(...chosedGame.deathList);
	
	// 洗牌算法排序chosedList.bio
	for (let i = chosedList.bio.length - 1; i > 0; i --) {
		let j = Math.trunc( (i + 1) * Math.random());
		
		let temp = chosedList.bio[i];
		chosedList.bio[i] = chosedList.bio[j];
		chosedList.bio[j] = temp;
	}
	
	// 生成outputList
	for (let i = 0; i < 10; i ++) {
		outputList[i] = {};
		outputList[i].bio = chosedList.bio[i];
		outputList[i].death = chosedList.death[deathRandom(i)];
	}
	
	// 应用到HTML
	document.getElementById("main").innerHTML = "";
	for (let i = 0; i < 10; i ++) {
		const rowHTML = `
			<div class="main-row">
				<div class="main-index">${i + 1}</div>
				<div class="main-name">${outputList[i].bio}</div>
				<div class="main-reRandom"><div onclick="reRandom(${i})"}>更换生物</div></div>
				<div class="main-death">${outputList[i].death}</div>
				<div class="main-reDeath"><div onclick="reDeath(${i})"}>更换死法</div></div>
			</div>
		`
		
		const fragment = document.createDocumentFragment();
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = rowHTML;
		while (tempDiv.firstChild) {
			fragment.appendChild(tempDiv.firstChild);
		}
		
		document.getElementById("main").appendChild(fragment);
	}
}
// 返回死法
function deathRandom (index) {
	let i = 0
	do {
		i = Math.trunc(chosedList.death.length * Math.random());
	} while (i === index);
	return i;
}

// 更换生物
function reRandom (index) {
	needNum ++;
	outputList[index].bio = chosedList.bio[needNum];
	document.getElementsByClassName("main-name")[index].innerHTML =outputList[index].bio;
}
// 更换死法
function reDeath (index) {
	for (let i in chosedList.death) {
		if (chosedList.death[i] === outputList[index].death) {
			outputList[index].death = chosedList.death[deathRandom(i)];
			document.getElementsByClassName("main-death")[index].innerHTML = outputList[index].death;
			return 0;
		}
	}
}

// 视频播放
function bilibiliPlay (index) {
	window.open("https://www.bilibili.com/video/" + bv[index]);
}

// 我爱锦鲤
function iLoveFish () {
	window.open("https://space.bilibili.com/531231667");
}