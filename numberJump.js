// == 跳動數字 Start ==
const LotteryNumber = function(El, def) {
    if (!El) throw new Error('尚未綁定元素')
    this.El = document.querySelectorAll(El)
    this.El = this.El.length < 2 ? this.El[0] : this.El
    this.def = {
        startNumber: 10000,            // 第一次執行的最低基礎數字
        currentStart: null,            // 開始基礎數字
        addNumber: 10,                 // 每秒累加
        updateTime: 3000,              // 動畫每3000毫秒更新一次
        runNumber: 0,                  // 動畫數字
        currentNumber: 0,              // 紀錄當前動畫字
        decimal: 0,                    // 小數點
        duration: 1000,                // 動畫區間
        endTime: false,                // 結束時間
        nowTime: new Date().getTime(), // 當下時間
        isStop: false,                 // 是否停止
        timer: null,                   // 存放 setInterval
        isActive: false                // 跳動中是否添加active class
    };

    // 如果有自訂參數,則調用替換方法
    if (def) {
        this.changeDef(def)
    }
    this.start() // start
}

// == 預設參數替代成自訂參數方法
LotteryNumber.prototype.changeDef = function(value){
    for (let key in this.def) {  //先跑　預設參數迴圈
        for (let key2 in value){ //在跑　自訂參數迴圈
            if (key2 === key) {  //檢查是否相符,符合則將預設參數改成自訂參數
                this.def[key] = value[key]
            }
        }
    }
    // 如果有自訂結束時間,則將時間單位轉換
    if (this.def.endTime != false) {
        this.def.endTime = this.getTime(this.def.endTime)
        this.def.isStop = this.isStop()
    }
}

// == start
LotteryNumber.prototype.start = function(){
    if (this.def.isStop) {
        this.def.runNumber = this.def.currentNumber

    } else {
        this.calculateNumber()

        if (this.def.timer === null) { 
            this.def.timer = setInterval(()=>{
                this.calculateNumber()
            }, this.def.updateTime)
        }
    }
}

// == 數字重新開始
LotteryNumber.prototype.restart = function(){
    if (!this.def.isStop) {
        this.def.currentNumber = 0
        this.def.runNumber = 0
        this.def.currentStart = this.def.startNumber
        this.start()
    }
}

// == 停止跳動
LotteryNumber.prototype.stop = function(){
    clearInterval(this.def.timer)
    this.def.timer = null
}

// == 計算下一次需要更新的數字
LotteryNumber.prototype.calculateNumber = function(){
    if (this.def.isStop) {
        this.def.runNumber = this.def.currentNumber
    } else {
        // 換算邏輯 起始金額 + 每10秒增加95~100金額
        // 開始金額 + (每秒增加金額 * 每幾秒執行一次) * ((100 + 亂數-5~5之間) / 100)
        // 10000 + ((1 *10) * 1.05)
        this.def.currentStart = (this.def.currentStart === null) ? this.def.startNumber : this.def.currentStart
        this.def.runNumber = Math.floor(this.def.currentStart + ((this.def.addNumber * (this.def.updateTime / 1000)) * (100 + (Math.random()*10 - 5)) / 100))
        this.countRun(this.def.runNumber, this.def.currentNumber)   // 執行數字跳動動畫
        this.def.currentNumber = this.def.runNumber                 // 將目前號碼儲存
        this.def.currentStart = this.def.currentNumber              // 預設下一次的號碼
    }
}

// == 轉換時間
LotteryNumber.prototype.getTime = function(time){
    return time ? new Date(time).getTime() : null
}

// == 判斷是否停止
LotteryNumber.prototype.isStop = function(){
    return this.def.endTime === false ?  false : this.def.nowTime > this.def.endTime
}

// == 數字跳動
LotteryNumber.prototype.countRun = function(startNumber, currentNumber){
    this.active(this.def.isActive)
    let startTime = 0;
    let dec = Math.pow(10, this.def.decimal) //小數點
    let progress,value;
    const startCount = (timestamp) => {

        if (!startTime) startTime = timestamp;
        progress = timestamp - startTime;
        value = currentNumber + (startNumber - currentNumber) * (progress / this.def.duration);

        //判斷該遞增還是遞減
        if (currentNumber > startNumber){
            value = (value < startNumber) ? startNumber : value;
        } else { 
            value = (value > startNumber) ? startNumber : value;
        }

        value = Math.floor(value*dec) / dec;

        if (this.El.length > 1) {
            for (let i=0; i<this.El.length; i++) {
                this.El[i].innerText = value.toFixed(this.def.decimal);
            }
        } else {
            this.El.innerText = value.toFixed(this.def.decimal);
        }

        if( progress < this.def.duration ) {
            requestAnimationFrame(startCount);
        } else {
            this.active(this.def.isActive)
        }

    }
    requestAnimationFrame(startCount)
}

// == 添加active class
LotteryNumber.prototype.active = function(isActive) {
    if (isActive) {
        if (this.El.length > 1) {
            for (let i=0; i<this.El.length; i++) {
                this.El[i].classList.contains('active') ? this.El[i].classList.remove('active') : this.El[i].classList.add('active')
            }
        } else {
            this.El.classList.contains('active') ? this.El.classList.remove('active') : this.El.classList.add('active')
        }
    }
}

// == 調用跳動數字方法
// base
const number1 = new LotteryNumber('.n1', {isActive: true})

// == 自訂參數
const number2 = new LotteryNumber('.n2', {
    startNumber: 10000,　　　  // 起始數字
    addNumber: 1350,　　　　 　  // 每秒增長
    updateTime: 2000,　　　　  // 幾毫秒跳動一次
    duration: 2000,　　　　　　 // 動畫跳動時間
    decimal: 2,               // 小數點位數
    endTime: false,　　 // 結束跳動時間　
    isActive: false           // 是否添加active class
})

// == 跳動數字 new prototype版  End ==
