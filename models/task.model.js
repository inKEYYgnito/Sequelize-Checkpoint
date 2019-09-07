'use strict';

const db = require('./database');
const Sequelize = require('sequelize');

// Make sure you have `postgres` running!

//---------VVVV---------  your code below  ---------VVV----------

const Task = db.define('Task', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  complete: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  due: Sequelize.DATE
});

Task.clearCompleted = () => {
  return Task.destroy({
    where: {
      complete: true
    }
  })
}

Task.completeAll = () => {
  return Task.update({
    complete: true
  }, {
    where: {
      complete: false
    }
  })
}

Task.belongsTo(Task, { as: 'parent' });

Task.prototype.getTimeRemaining = function () {
  if (!this.due) return Infinity
  else return this.due - (new Date())
}

Task.prototype.isOverdue = function () {
  if (this.complete) return false
  return !(this.getTimeRemaining() > 0)
}

Task.prototype.addChild = function ({ name }) {
  return Task.create({ name, parentId: this.id })
}

Task.prototype.getChildren = function () {
  return Task.findAll({ where: { parentId: this.id } })
}

Task.prototype.getSiblings = function () {
  return Task.findAll({ where: { parentId: this.parentId, id: { $ne: this.id } } })
}

//---------^^^---------  your code above  ---------^^^----------

module.exports = Task;

