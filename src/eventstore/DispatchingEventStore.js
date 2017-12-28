const EventDispatcher = require('../EventDispatcher')

module.exports = class DispatchingEventStore {
  constructor(eventStore, projectorDispatchers, sagaClassDispatchers) {
    this._eventStore = eventStore
    this._projectorDispatchers = projectorDispatchers
    this._sagaClassDispatchers = sagaClassDispatchers
    this._sagaDispatchers = new Set()
  }

  set commandBus(commandBus) {
    this._commandBus = commandBus
  }

  async storeEvent(event) {
    await this._eventStore.storeEvent(event)
    for (const projectorDispatcher of this._projectorDispatchers) {
      await projectorDispatcher.dispatch(event)
    }
    for (const sagaDispatcher of this._sagaDispatchers) {
      await sagaDispatcher.dispatch(event)
    }

    for (const sagaClassDispatcher of this._sagaClassDispatchers) {
      let result = await sagaClassDispatcher.dispatch(event)
      if (result) {
        const Saga = sagaClassDispatcher.target
        let saga
        const end = () => {
          this._sagaDispatchers.delete(saga)
        }
        saga = new Saga({ commandBus: this._commandBus, end })
        const sagaDispatcher = new EventDispatcher(saga)
        this._sagaDispatchers.add(sagaDispatcher)
        await sagaDispatcher.dispatch(event)
      }
    }
  }

  async findEventsByEntityUid(entityId) {
    return this._eventStore.findEventsByEntityUid(entityId)
  }
}