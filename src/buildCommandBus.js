const CommandBus = require('./CommandBus')
const Repository = require('./Repository')
const EventDispatcher = require('./EventDispatcher')
const DispatchingEventStore = require('./eventstore/DispatchingEventStore')

module.exports = function buildCommandBus(eventStore, projectors, sagaClasses) {
  const projectorDispatchers = projectors.map(projector => new EventDispatcher(projector))
  const sagaClassDispatchers = sagaClasses.map(sagaClass => new EventDispatcher(sagaClass))
  const dispatchingEventStore = new DispatchingEventStore(eventStore, projectorDispatchers, sagaClassDispatchers)
  const repository = new Repository(dispatchingEventStore)
  const commandBus = new CommandBus(repository)
  dispatchingEventStore.commandBus = commandBus
  return commandBus
}