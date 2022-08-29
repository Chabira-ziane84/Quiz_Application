//select Element
let countQuestion=document.querySelector(".count span");
let spans=document.querySelector(".bullet .spans");
let questions=document.querySelector(".answer_area");
let title=document.querySelector(".quiz_area");
let button=document.querySelector(".submit_button");
let results=document.querySelector(".results");
let bullets=document.querySelector(".bullet");
let countDown=document.querySelector(".count-down")
let currentIndex=0;
let rightAnswers=0;
let count;
let countinterval;
function getQuestions() {
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=function() {
        if(this.readyState===4 && this.status===200) {
            let myquestion=JSON.parse(this.responseText);
            //create bullets + set question count
             count=myquestion.length;
            createBullets(count);
            // add questions data
            addQuestions(myquestion[currentIndex],count);
            //add countdown
            countDownF(60);
            // add onlick
            button.onclick=function() {
                let rAnswer=myquestion[currentIndex].right_answer;
                checkanswer(rAnswer,count);
                currentIndex++;
                //add countdown
                clearInterval(countinterval);
                countDownF(60);
                // remove question
                title.innerHTML="";
                questions.innerHTML="";
                // add next question
                addQuestions(myquestion[currentIndex],count);
                // update bullets span
                handlebullest() ;
                // shwo results
                sResults();
            }
        }
    }
    myRequest.open("Get","./question.json",true);
    myRequest.send();
}
getQuestions()
function createBullets(num) {
    countQuestion.innerHTML=num;
    for(let i=0;i<num;i++) {
        let span=document.createElement("span");
        if (i===0) {
            span.className="on";
        }
        spans.appendChild(span);
    }
} 
// add questions data from dbb
function addQuestions(obj,qcount){
if(currentIndex<qcount) {
    let h2=document.createElement("h2");
h2.textContent=obj.title;
title.appendChild(h2)
for(let i=0;i<4;i++) {
    let div=document.createElement("div");
    div.className="answer";
    let inp=document.createElement("input");
    inp.id=`answer_${i+1}`;
    inp.type="radio";
    inp.name="questions";
    inp.dataset.answer=obj[`answer_${i+1}`];
    let lab=document.createElement("label");
    lab.htmlFor=inp.id;
    lab.textContent=obj[`answer_${i+1}`];
    if (i===0) {
        inp.checked=true;
    }
    div.appendChild(inp);
    div.appendChild(lab);
    questions.appendChild(div);
}
}
}
function checkanswer(rAnswer,count) {
let answers=document.getElementsByName("questions");
let chosed;
for(let i=0;i<4;i++) {
   if (answers[i].checked) {
   chosed= answers[i].dataset.answer;
}
}
if(rAnswer===chosed) {
    rightAnswers++;
}
}
function handlebullest() {
    let span=document.querySelectorAll(".bullet .spans span");
    let arrspan=Array.from(span);
    arrspan.forEach((span,indx)=>{
        if(currentIndex===indx){
            span.className="on";
        }

    })
}
function sResults() {
if(currentIndex===count) {
    questions.remove();
    title.remove();
    bullets.remove();
    button.remove();
    if(rightAnswers>(count/2) && rightAnswers<count) {
        results.innerHTML=`<span class="good">good</span> you answered ${rightAnswers} from ${count} `;
    } else if (rightAnswers===count) {
        results.innerHTML=`<span class="perfect">Perfect</span> you answered ${rightAnswers} from ${count}`;
    } else {
        results.innerHTML=`<span class="bad">bad</span> you answered ${rightAnswers} from ${count} `;
    }
    results.style.cssText="background-color: #fff; padding: 15px;font-weight: bold;text-align: center;font-size:18px; color: #777;margin:100px 50px ;"
}
}
function countDownF(duration) {
    if(currentIndex<count) {
        let minutes,secondes;
       
    countinterval=setInterval((function(){
     
        minutes=parseInt(duration/60);
        secondes=parseInt(duration%60);
       minutes=minutes>=10 ? minutes : `0${minutes}`;
       secondes=secondes>=10 ? secondes : `0${secondes}`;
       countDown.innerHTML=`${minutes}:${secondes}`
       if(--duration < 0) {
        clearInterval(countinterval);
        button.click();

      }
    }),1000)
    }
}
