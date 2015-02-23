$(document).ready(function(){
  $("#new-task").on('click', function(){
    var title = prompt("Task:")
    var task = new Task;
    task.set('title', title);
    task.save()
    tasks.add(task);
  })
})

var Task = Backbone.Model.extend({    
    url: function (){
      return this.id ? "tasks.php?id="+this.id : "tasks.php";
    },
    defaults: { done: 0 }
});

var Tasks = Backbone.Collection.extend({
  model: Task,
  url: 'tasks.php'
});

var TasksView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add remove', this.render, this)
    this.collection.on('remove', this.remove, this)
  },
  remove: function(task){
    Backbone.sync("delete", task)
  },
  tagName: 'ul',
  render:function () {
    $("#tasks").children().detach();
    $("#tasks").append(
      this.collection.map(function(task){
        return new TaskView({model: task}).render();
      })
    );
  }
});

var TaskView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click a': function(){
      tasks.remove(this.model)
    },
    'click input': function(){
      this.model.set('done', this.model.get('done') == 0 ? 1 : 0)
      Backbone.sync("update", this.model)
    }
  },
  template: _.template('<p><input type="checkbox" <% if (done == 1){ %>checked<% } %>/> <%= title %> <a href="javascript:;">Delete</a></p>'),
  render: function(){
    return this.$el.html(this.template(this.model.attributes));
  }
})

var tasks = new Tasks(); //Create a new collection
var tasksView = new TasksView({collection: tasks }); //Assign it to a view    
tasks.fetch(); //Get current tasks from DB
