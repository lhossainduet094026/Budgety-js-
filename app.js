
//BUDGET CONTROLLER
var budgetController=(function(){

var Expense=function(id,description,value){//function constructor
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage=-1;
};
Expense.prototype.calcPercentage=function(totalIncome){
    if(totalIncome>0){
        this.percentage = Math.round((this.value/totalIncome)*100);
        }
    else
    this.percentage = -1;
}
Expense.prototype.getPercentage=function(){
    return this.percentage;
}
var Income=function(id,description,value){//function constructor
    this.id = id;
    this.description = description;
    this.value = value;
};
//calculateBudget is a private method
var calculateTotal = function(type){
var sum =0;
    data.allItems[type].forEach(function(cur){
    sum+=cur.value;
});
data.totals[type]=sum;
};

var data={
        allItems:{
        inc:[],
        exp:[]
    },
        totals:{
            exp:0,
            inc:0
          },
          budget:0,
          percentage:-1
       
}

return{
            addItem:function(type,des,val){
                    var newItem,Id;
                    Id=0;
                    //create new id 
                    if(data.allItems[type].length>0){
                        Id = data.allItems[type][data.allItems[type].length-1].id+1;
                    }
                    else
                    {
                        Id=0;
                    }
                    
                    //create new item base on type 'inc' or 'exp'
                        if(type==='exp'){
                        newItem = new Expense(Id,des,val);
                    }
                    else if (type==='inc'){
                        newItem = new Income(Id,des,val);
                    }
                    //push it into our data structure 
                    data.allItems[type].push(newItem);
                    //return our new element
                    return newItem;
            },
              deleteItem:function(type,id){
                    var ids,index;
                    //id=6
                    //ids=[1 2 4 6 8]
                    //index=3
                    ids=data.allItems[type].map(function(current){
                        return current.id;
                    });
                    index = ids.indexOf(id);//returns the index of number of given id
                    if(index !==-1){
                        data.allItems[type].splice(index,1);
                    }
             },

            calculateBudget:function(){
                    //1.calculate total income & expenses
                    calculateTotal('inc');
                    calculateTotal('exp');
                    data.budget =data.totals.inc - data.totals.exp;

                    //2.calculate budget=total income - total expenses
                    data.budget = data.totals.inc-data.totals.exp;
                    //3.calculate percentages of income that we spent
                    if(data.totals.inc>0){
                    data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
                    }
                    else{
                        data.percentage=-1;
                    }
                    
            },
            calculatePercentage:function(){
             data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
            },
            getPercentages:function(){
            var allPerc = data.allItems.exp.map(function(cur){
             return cur.getPercentage();
            });
            return allPerc;
            },
            getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.inc,
                totalExp:data.totals.exp,
                percentage:data.percentage,
            };
            },
            testing:function(){
                return data;
            }
}

})();

//UI CONTROLLER
var UIController = (function(){
    var DOMstrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputButton:'.add__btn',
        incomeContainer:'.income__list',
        expenseContainer:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        container:'.container',
        expensesPercLabel:'.item__percentage',
        dateLabel:'.budget__title--month'

    };
     //These function is used for fomating the value in the UI
     var formatNumber=function(num,type){
        var numSplit,int,dec;
     /*-----Formatting rules-----------------
     + or - before number
     exactly two decimal point
     comma separating the thousands
      */
     num = Math.abs(num);
     num = num.toFixed(2);
     numSplit = num.split('.');
     int = numSplit[0];
     
     if(int.length>3){
         int = int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length);//input 2310 output 2,310
     }
     dec = numSplit[1];
     ;
     return (type==='exp'?'-':'+')+' '+int+'.'+dec;
    };
//some code here
return{
         getInput:function(){
       
             return{
                        type: document.querySelector(DOMstrings.inputType). value,// will be either inc or exp
                        description : document.querySelector(DOMstrings.inputDescription).value,
                        value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
                    };
            
    },

    addListItem:function(obj,type){
     var html,newHtml,element;
     //create html string with placeholder text
     if(type==='inc'){
            element = DOMstrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div>  <div class="right clearfix">   <div class="item__value">%value%</div><div class="item__delete">   <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>   </div>  </div></div>';
    }
    else if(type==='exp'){
          element = DOMstrings.expenseContainer;
          html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete">      <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';
    }
      //replace the placeholder text with some actual data
      newHtml = html.replace('%id%',obj.id);
      newHtml = newHtml.replace('%description%',obj.description);
      newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
     //insert the html into the dom 
     document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
    },

    deleteListItem:function(selectorId){
       var el =document.getElementById(selectorId); 
       el.parentNode.removeChild(el);//delete item means delete child element from parent in the ui
    },

    clearFields:function(){
        var fields,fieldArr;
        fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);//querySelectorAll return a list
        fieldArr = Array.prototype.slice.call(fields);//converting list into pure array
        fieldArr.forEach(function(current,index,array){
         current.value="";
         fieldArr[0].focus();
        })
    },
    displayBudget:function(obj){
            var type;
            obj.budget > 0 ? type='inc' : type = 'exp';
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent ='---';
            }
    },
    diplayPercentages:function(percentages){
    var fields=document.querySelectorAll(DOMstrings.expensesPercLabel);
    //old browser doesnot support foreach on nodelist .so either we convert into normal array or write own foreach method
    //we are going to write own foreach 
    var nodeListForEach=function(list,callback){
        for(var i=0;i<list.length;i++){
            callback(list[i],i);
        }
    }
    nodeListForEach(fields,function(current,index){
        if(percentages[index]>0){
            current.textContent = percentages[index]+'%';
        }
        else
        {
            current.textContent = '---';
        }
    
      
     });
    },
   displayMonth:function(){
       var now,month,year,months;
       months=['January','February','March','April','May','June','July','August','September','October','November','December'];
       now = new Date();
        month=now.getMonth();
       year = now.getFullYear();
       document.querySelector(DOMstrings.dateLabel).textContent =months[month]+"-"+ year;
   },
    getDOMstrings:function(){
        return DOMstrings;
    }
}
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl,UICtrl){
   var setupEventListeners=function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13|| event.which===13)
            {
                ctrlAddItem();
                console.log('Enter is pressed');
                
            }
        });

       // document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
       document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
   };
   var updateBudget=function(){
    //1.CALCULATE THE BUDGET
    budgetCtrl.calculateBudget();

    //2.RETURN THE BUDGET
    var budget = budgetCtrl.getBudget();
    //3.DISPLAY THE BUDGET ON TO THE UI
    UICtrl.displayBudget(budget);
    
   }
   var updatePercentages = function(){
    //1.calculate the percentages
     budgetCtrl.calculatePercentage();
    //2.read percentages from the budgetcontroller
     var percentages=budgetCtrl.getPercentages();
     console.log(percentages);
    //3.update UI with the new percentages
    UICtrl.diplayPercentages(percentages);
   }
   
    var ctrlAddItem  = function(){
    var input,newItem;
    //1.GET THE FIELD INPUT DATA
     input = UICtrl.getInput();
     console.log(input);
     if(input.description!=="" && !isNaN(input.value) && input.value>0)
     { 
            //2.ADD THE ITEM TO THE BUDGET CONTROLLER
            newItem=budgetCtrl.addItem(input.type,input.description,input.value);
            //3.ADD ITEM TO THE UI
            UICtrl.addListItem(newItem,input.type);
            //4.Clear the input fields
            UICtrl.clearFields();
            //5.CALCULAE AND UPDATE BUDGET
            updateBudget();

            //6.calculate and update percentages
            updatePercentages();  
        }
    };
    var ctrlDeleteItem = function(event){
        var itemId,splitId,type,id;
        itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemId){
            //inc-1
            splitId = itemId.split('-');
            type = splitId[0];
            id = parseInt(splitId[1]);

            //1.Delete the item from the datastructure 
             budgetCtrl.deleteItem(type,id);
            //2.delete the item from the UI
             UICtrl.deleteListItem(itemId);
            //3.update and show the new totals
            updateBudget();
             //4.calculate and update percentages
             updatePercentages();
        }
    }
return {
        init:function()
        {
            console.log('application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:-1
            });
            setupEventListeners();
        }
   }

})(budgetController,UIController);

controller.init();