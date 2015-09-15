var generateId = (function() {
  var id = 0;
  return function() {
    return "_" + id++;
  };
})();
var todos = [{
  id: generateId(),
  name: "Take a job interview",
  done: true
}, {
  id: generateId(),
  name: "Write a letter",
  done: false
}];

/**
 * TodoStorage
 * Manage todo items
 */
var TodoStorage = {
  on: function(_, _callback) {
    this._onChangeCallback = _callback;
  },
  getAll: function(callback) {
    callback(todos);
  },
  complete: function(id) {
    for(var i = 0; i < todos.length; i++) {
      var todo = todos[i];
      if(todo.id === id) {
        var newTodo = React.addons.update(todo, {done: {$set: true}});
        todos = React.addons.update(todos, {$splice: [[i, 1, newTodo]]});
        this._onChangeCallback();
        break;
      }
    }
  },
  create: function(name, callback) {
    var newTodo = {
      id: generateId(),
      name: name
    };
    todos = React.addons.update(todos, {$push: [newTodo]});
    this._onChangeCallback();
    callback();
  }
};

/**
 * Todo Component
 * Display each todo item
 */
var Todo = React.createClass({
  handleClick: function() {
    TodoStorage.complete(this.props.todo.id);
  },
  render: function() {
    var todo = this.props.todo,
    doneButton = todo.done ? null : <button onClick={this.handleClick}>Done</button>;
    return (
      <li>{todo.name}{doneButton}</li>
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
        <TodoForm/>
      </div>
    );
  }
});

/**
 * TodoForm Component
 * Invoke an event
 */
var TodoForm = React.createClass({
  // getInitialState is a builtin method
  getInitialState: function() {
    return {
      name: ""
    };
  },
  handleNameChange: function(e) {
    this.setState({
      name: e.target.value
    });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var name = this.state.name.trim();
    TodoStorage.create(name, function() {
      this.setState({
        name: ""
      });
    }.bind(this));
  },
  render: function() {
    var disabled = this.state.name.trim().length <= 0;
    return (
      <form onSubmit={this.handleSubmit}>
        <input value={this.state.name} onChange={this.handleNameChange}></input>
        <input type="submit" disabled={disabled}></input>
      </form>
    );
  }
});

/**
 * App Component
 * Display entire application
 */
var App = React.createClass({
  getInitialState: function() {
    return {
      todos: []
    };
  },
  componentDidMount: function() {
    var setState = function() {
      TodoStorage.getAll(function(todos) {
        this.setState({
          todos: todos
        });
      }.bind(this));
    }.bind(this);
    TodoStorage.on("change", setState);
    setState();
  },
  render: function() {
    return (
      <div>
        <h1>TODO App</h1>
        <TodoList todos={this.state.todos}/>
      </div>
    );
  }
});

React.render(
  <App></App>,
  document.getElementById("app-container")
);
