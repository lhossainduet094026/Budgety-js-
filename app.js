
//BUDGET CONTROLLER
var budgetController=(function(){

var Expense=function(id,description,value){//function constructor
    this.id = id;
    this.description = description;
    this.value = value;
};

var Income=function(id,description,value){
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
                    index = ids.indexOf(id);
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
                    console.log('calculate budget working');
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
        container:'.container'

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
      newHtml = newHtml.replace('%value%',obj.value);
     //insert the html into the dom 
     document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
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
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
            
            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent ='---';
            }
      
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

        // console.log('it works.');
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

            //3.update and show the new totals
        }
    }
return {
        init:function()
        {
            console.log('application has started.');
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