const formEl = document.querySelector('#form');
const inputEl = document.querySelector('#input');
const todosEl = document.querySelector('#todos');
const todos = JSON.parse(localStorage.getItem('todos'));
const todoArr = []; // 투두 목록 초기화

// 초기화면 저장된 투두 리스트 출력
if(todos){
    todos.forEach(todo=>{
        addTodo(todo.name);
    })
}

// 투두 입력 이벤트
formEl.addEventListener('submit',(e)=>{
    e.preventDefault();
    addTodo();
})

// 투두 리스트 추가
function addTodo(todo){
    let todoText= inputEl.value;

    if(todo)
        todoText = todo;
    if(todoText){
        const todolistEl = document.createElement('li');
        const todoData = {name: todoText, id: todoArr.length+1, complete: 'no'};
        todolistEl.innerText = todoText;
        
        // 왼쪽 마우스 클릭
        todolistEl.addEventListener('click',()=>{
            todolistEl.classList.toggle('completed');
            completedTodoInLs(todoData);
        })
        // 오른쪽 마우스 클릭
        todolistEl.addEventListener('contextmenu',(e)=>{
            e.preventDefault();
            removeTodoInLs(todoData);
            todolistEl.remove();
        })
        todosEl.append(todolistEl);
        inputEl.value = '';
        addTodoInLs(todoData);
    }
}

// 투두 목록 추가
function addTodoInLs(todoData){
    todoArr.push({name:todoData.name,id:todoData.id,complete: todoData.complete});
    localStorage.setItem('todos',JSON.stringify(todoArr));
}
// 투두 목록 제거
function removeTodoInLs(todoData){
    todoArr.forEach(todo=>{
        const idx = todoArr.indexOf(todo);
        if(todo.id === todoData.id)
           todoArr.splice(idx,1);
    });
    localStorage.setItem('todos',JSON.stringify(todoArr));
}
// 투두 목록 완료
function completedTodoInLs(todoData){
    todoArr.forEach(todo=>{
        if(todo.id === todoData.id){
            if(todo.complete === 'no')
                todo.complete = 'completed';
            else if(todo.complete === 'completed')
                todo.complete = 'no';
        }
    })
    localStorage.setItem('todos',JSON.stringify(todoArr));
}