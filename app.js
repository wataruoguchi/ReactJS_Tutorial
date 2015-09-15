var todos = [{
  id: "_1",
  name: "Take a job interview",
  done: true
}, {
  id: "_2",
  name: "Write a letter",
  done: false
}];

/**
 * Todo Component
 * Display each todo item
 */
var Todo = React.createClass({
  render: function() {
    var todo = this.props.todo;
    return (
      <li>{todo.name}<button>Done</button></li>
    );
  }
});

/**
 * TodoList Component
 * Display undone todo items
 */
var TodoList = React.createClass({
  render: function() {
    var rows = this.props.todos.filter(function(todo) {
      return !todo.done;
    }).map(function(todo) {
      return (
        <Todo key={todo.id} todo={todo}></Todo>
      );
    });
    return (
      <div className="active-todos">
        <h2>Active</h2>
        <ul>{rows}</ul>
      </div>
    );
  }
});

/**
 * App Component
 * Display entire application
 */
var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>TODO App</h1>
        <TodoList todos={todos}/>
      </div>
    );
  }
});

React.render(
  <App></App>,
  document.getElementById("app-container")
);
