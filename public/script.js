
document.getElementById('displayTodos').addEventListener('click', async () => {
  const response = await fetch('/todos');
  const todos = await response.json();
  const todoDisplay = document.getElementById('todoDisplay');
  todoDisplay.innerHTML = ''; // clear previous display
  for (const todo of todos) {
    const div = document.createElement('div');
    div.textContent = `ID: ${todo.id} | Name: ${todo.name} | Priority: ${todo.priority} | IsFun: ${todo.isFun}`;
    todoDisplay.appendChild(div);
  }
});
  

  // There a bunch of missing keywords in the following code, fix them to have the code work corretly!

document.getElementById('submitTodo').addEventListener('click', async () => {
  const name = document.getElementById('todoName').value;
  const priority = document.getElementById('todoPriority').value || 'low';
  const isFun = document.getElementById('todoIsFun').value || 'true';

  const todo = { name, priority, isFun };

  const response = await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo)
  });

  const result = await response.json();
  alert(`Todo added: ${JSON.stringify(result)}`);
});
  
 document.getElementById('deleteTodo').addEventListener('click', async () => {
  const id = document.getElementById('todoIdToDelete').value;

  const response = await fetch(`/todos/${id}`, { method: 'DELETE' });
  const result = await response.json();
  alert(result.message);
});
