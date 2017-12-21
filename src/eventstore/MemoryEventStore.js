module.exports = class MemoryEventStore {
  constructor() {
    this._events = []
  }

  async storeEvent(event) {
    this._events.push(event)
  }

  async findEventsByEntityUid(entityId) {
    return this._events.filter(event => event.entityId === entityId)
  }
}