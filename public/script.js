$(document).ready(function() {
    // Função para carregar e exibir as tarefas existentes
    function carregarTarefas() {
      $.get('/tasks', function(tasks) {
        $('#task-list').empty();
        tasks.forEach(function(task) {
          const li = $('<li class="list-group-item"></li>');
          const checkbox = $('<input type="checkbox">');
          checkbox.prop('checked', task.completed);
          checkbox.on('change', function() {
            const completed = $(this).prop('checked');
            $.ajax({
              url: '/tasks/' + task.id,
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify({ completed: completed }),
              success: function() {
                li.toggleClass('completed', completed);
              }
            });
          });
          li.append(checkbox, ' ', task.task);
          if (task.completed) {
            li.addClass('completed');
          }
          $('#task-list').append(li);
        });
      });
    }
  
    // Evento de clique do botão para carregar as tarefas
    $('#load-tasks-btn').click(function() {
      carregarTarefas();
    });
  
    // Carregar e exibir as tarefas existentes ao carregar a página
    carregarTarefas();
  
    // Evento de envio do formulário para adicionar uma nova tarefa
    $('#task-form').submit(function(event) {
      event.preventDefault();
      const taskInput = $('#task-input');
      const taskText = taskInput.val().trim();
      if (taskText !== '') {
        $.post('/tasks', { task: taskText }, function(data) {
          const li = $('<li class="list-group-item"></li>');
          const checkbox = $('<input type="checkbox">');
          checkbox.on('change', function() {
            const completed = $(this).prop('checked');
            $.ajax({
              url: '/tasks/' + data.insertId,
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify({ completed: completed }),
              success: function() {
                li.toggleClass('completed', completed);
              }
            });
          });
          li.append(checkbox, ' ', taskText);
          $('#task-list').append(li);
          taskInput.val('');
        });
      }
    });
  });
  