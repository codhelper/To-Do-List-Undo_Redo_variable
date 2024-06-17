let input_box = document.getElementById('input-box');
let outputBox = document.getElementById('list-container');
let btn = document.getElementById('button');

let idx = 0;

//stack will be used to make undo and redo
//it will store value in pair
//where each pair contains index and bool value (is done that job or not)
//if bool is false means you only create that job and want to remove that job using undo operation
//else if bool is true means you have done this job and want to make it again using undo

class Pair {
    idx;
    isDone;
    constructor(i, bool) {
        this.idx = i;
        this.isDone = bool;
    }
}

class Stack {
    st = new Array();

    push(p) {
        this.st.push(p);
    }

    pop() {
        return this.st.pop();
    }

    peek() {
        return this.st[this.st.length - 1];
    }

    isEmpty() {
        return this.st.length === 0;
    }
}

let undo = new Stack();

let redo = new Stack();
//remember redo will apply iff undo was the last operation of the user
//otherwise redo will remove all the stored value

//set will be used to store which job is done
//it will store the index of the job

let set = new Set();

btn.addEventListener('click', () => {
    if (input_box === "") {
        alert("You have to input your job");
        return false;
    }
    else {

        let li = document.createElement('li');
        li.innerHTML = input_box.value;
        li.setAttribute('id', idx);
        undo.push(new Pair(idx, false));
        idx++;

        outputBox.appendChild(li);
        redo = new Stack();
        // console.log(idx);
    }

    input_box.value = ' ';
    let id = document.querySelectorAll('li');
    id.forEach(function (val, idx) {
        
        val.addEventListener('click', () => {
            redo = new Stack();
            // console.log(val.getAttribute('id'));
                if (!set.has(idx)) {
                // console.log(idx);
                undo.push(new Pair(idx, true));
                set.add(idx);
                }
                val.setAttribute('class', 'checked');

            })
    });

})

let ApplyUndo = document.getElementById('undo');
let ReverseUndo = document.getElementById('redo');

ApplyUndo.addEventListener('click', () => {
    if (undo.isEmpty()) {
        //if not any list was created then we have nothing to undo
        return;
    }
    let p = undo.pop();

    // console.log(p.idx);
    // console.log(p.isDone);
    
    redo.push(new Pair(p.idx, p.isDone));

    let val = document.getElementById(p.idx);

    //check if user add something at last then after undo
    //we need to remove that step
    if (p.isDone === false) {
        val.style.display = 'none';
    }
    else {
        //if undo is applied after any work is Done then we need to mark that work as not done
        val.removeAttribute('class');
        set.delete(p.idx);
    }

})

ReverseUndo.addEventListener('click', () => {
    if (redo.isEmpty()) return;

    let p2 = redo.pop();
    undo.push(p2);

    val = document.getElementById(p2.idx);
    if (p2.isDone === false) {
        val.style.display = 'block';
    }
    else {
        val.setAttribute('class', 'checked');
        set.add(p2.idx);
    }
})