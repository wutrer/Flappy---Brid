//用对象收编变量


var brid = {


    skyPosition:0,
    skyStep:2,
    bridTop:235,
    startColor:'blue',
    startFlag:false,
    bridStepY:0,
    minTop:0,
    maxTop:570,
    piepLength:7,
    pieArr:[],
    pieLastIndex:6,
    score:0,
    scoreArr:[],

    init:function(){

        this.initData();
        this.animate();
        this.handleStart();
        this.handleClick();
        this.handleReStart();

        if(sessionStorage.getItem('play')){

            this.start();
        }
    },

    initData:function(){

        
        this.el = document.getElementById('game');
        this.oBrid = this.el.getElementsByClassName("brid")[0];
        this.oStart = this.el.getElementsByClassName('start')[0];
        this.oScore = this.el.getElementsByClassName('score')[0];
        this.oMask =  this.el.getElementsByClassName("mask")[0];
        this.oEnd = this.el.getElementsByClassName('end')[0];
        this.oFinalScore = this.el.getElementsByClassName('final-score')[0];
        this.oRankList= this.el.getElementsByClassName('rank-list')[0];
        this.oRestart = this.el.getElementsByClassName('restart')[0];
        this.scoreArr = this.getScore();
    
        

    },//初始化数据
    getScore:function(){

        var scoreArr = getLocal('score');
        return scoreArr ? scoreArr :[];
        
        

        

    },
    animate:function(){

        //管理所有运动
        var count = 0;
        var self = this;
        this.timer = setInterval(function(){

            self.skyMove();

            if(self.startFlag){

                self.bridDrop();
                self.pipeMove();
            }

            if(++ count% 10 === 0){

                if(!self.startFlag){

                    self.startBound();
                    self.bridJump();

                }
                self.bridFly(count);
                
                
            }
            
         },30);
        
    },
    skyMove:function(){

         

         //1.找元素拿x 2.给x减去一个数 3.将减去的数赋值给x
         this.skyPosition -= this.skyStep;
         this.el.style.backgroundPositionX = this.skyPosition +"px";
            
     },//天空移动
     bridJump:function(){

         this.bridTop =  this.bridTop === 220 ? 260 : 220;


         this.oBrid.style.top = this.bridTop +"px";

         
        
     },
     bridFly:function(count){

        //0-30-60
        // alert(this.oBrid.style.backgroundPositionX);
        this.oBrid.style.backgroundPositionX = count%3 * -30 +"px";
        
        
        
     },
     bridDrop:function(){

        this.bridTop += ++ this.bridStepY;
        this.oBrid.style.top = this.bridTop + 'px';

        this.judgeKnock();

        this.addScore();
     },
     addScore:function(){

         var index = this.score % this.piepLength;
         var pipeX = this.pieArr[index].up.offsetLeft;

         if(pipeX<13){

            this.oScore.innerText = ++this.score;
            
            
            
         }
     },
     judgeKnock:function(){

        this.judgeBoundary();
        this.judgePipe();

     },
     judgeBoundary:function(){

        if(this.bridTop <= this.minTop || this.bridTop >= this.maxTop){

            this.failGame();
        };
        
     },
     judgePipe:function(){


        var index = this.score % this.piepLength;
        var pipeX = this.pieArr[index].up.offsetLeft;
        var pipeY = this.pieArr[index].y;
        var bridY = this.bridTop;

        if((pipeX <= 95 &&  pipeX >=13) && (bridY <= pipeY[0] || bridY >=pipeY[1])){

            
            
            this.failGame();
        }



     },
     createPipe:function(x){

        //柱子的创建
       
        
        var upHeight =  50 + Math.floor(Math.random() * 175);
        var downHeight = 450 - upHeight;

        var oUpPipe = createEle('div',['pipe','pipe-up'],{

            height: upHeight + "px",
            left : x+ 'px',
        });

        var oDownPipe = createEle('div',['pipe','pipe-down'],{

            height: downHeight +'px',
            left : x+ 'px',
        });

        this.el.appendChild(oUpPipe);
        this.el.appendChild(oDownPipe);

        this.pieArr.push({

            up:oUpPipe,
            down:oDownPipe,
            y:[upHeight,upHeight  + 150 -30],
        })
        
     },
     pipeMove:function(){

         for(var i=0;i<this.piepLength;i++){

            
            var oUpPipe = this.pieArr[i].up;
            var DownPipe = this.pieArr[i].down;
             
            var x = oUpPipe.offsetLeft - this.skyStep;
            
            if( x< -52 ) {

              //  pieLastIndex
              var lastPieLeft = this.pieArr[this.pieLastIndex].up.offsetLeft;

              oUpPipe.style.left = lastPieLeft + 300 +'px';

              DownPipe.style.left = lastPieLeft + 300 +'px';
            
              this.pieLastIndex = i;
              
              

              continue;
              
            
            }

            oUpPipe.style .left = x+'px';
            DownPipe.style.left = x+'px';
            
            
            
            
         }
     },
     startBound: function(){

        var prevColor = this.startColor;
        this.startColor =  this.startColor === 'blue' ? 'white' :'blue';
        
        this.oStart.classList.remove('start-' + prevColor);
        this.oStart.classList.add('start-' + this.startColor);
        


        

     },
     handleStart:function(){

        var self =  this;
        this.oStart.onclick = this.start.bind(this);

        
     },
     start:function(){

        var self = this;
        self.startFlag = true;

        self.oStart.style.display = 'none';
        self.oScore.style.display = 'block';
        self.oBrid.style.left = '80px';
        self.oBrid.style.transition = 'none';
        self.skyStep = 5;
        
        for(var i=0;i<self.piepLength;i++){

            self.createPipe(300 *(i+1));

        }

     },
     handleClick:function(){

          var self  = this;
          this.el.onclick = function(e){

            var dom = e.target;
            var isStart = dom.classList.contains('start');

            if(!isStart){

                self.bridStepY = -10;
                
            }
            
            
                
        };
     },
     handleReStart:function(){

        this.oRestart.onclick =  function(){

            sessionStorage.setItem('play',true);
            window.location.reload();
            
        };
     },
     failGame:function(){

        clearInterval(this.timer);
        this.setScore();


        this.oMask.style.display = 'block';
        this.oEnd.style.display = 'block';
        
        this.oBrid.style.display = 'none';
        this.oScore.style.display = 'none';
        this.oFinalScore.innerText = this.score;

        this.renderRankList();
        
        //排行榜列表渲染，h5本地存储

     },
     setScore:function(){

        this.scoreArr.push({


            score:this.score,
            time:this.getDate()

            
            
        })

        this.scoreArr.sort(function(a,b){

            return b.score - a.score;
        })

        var scoreLength = this.scoreArr.length;
        // console.log(scoreLength);

        this.scoreArr.length = scoreLength > 8 ? 8 : scoreLength;
        
        
        setLocal('score',this.scoreArr);
        
        
     },
     getDate:function(){

          var d = new Date();
          var year = d.getFullYear();
          var month = d.getMonth()+1;
          var day = d.getDate();
          var hour = d.getHours();
          var minute = d.getMinutes();
          var second = d.getSeconds();

          return  `${year}.${month}.${day}.${hour}:${minute}:${second}`;
     },
     renderRankList:function(){

        var template = '';
        for(var i=0;i<this.scoreArr.length;i++){

            var scoreObj = this.scoreArr[i];
            var degreeClass = '';
            switch(i){

                
                case 0:
                    degreeClass = 'first';
                    break;
                case 1:
                    degreeClass = 'second';
                    break;
                case 2:
                    degreeClass = 'third';
                    break;
            }



            template +=  `<li class="rank-item">
            <span class="rank-degree ${degreeClass}">i</span>
            <span class="rank-score">${scoreObj.score}</span>
            <span class="rank-title">${scoreObj.time}</span>
            </li>
            `;

            
            
        }
        
        this.oRankList.innerHTML = template;
        
        

     },
};



brid.init();


