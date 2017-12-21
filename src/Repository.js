module.exports = class Repository {
  constructor(eventStore) {
    this._eventStore = eventStore
  }

  async create(EntityConstructor, entityId, eventAttributes) {
    if(!entityId) throw new Error('Missing entityId')
    const entity = new EntityConstructor(entityId, this._eventStore)
    await entity.create(eventAttributes)
    return entity
  }

  async load(EntityConstructor, entityId) {
    const entity = new EntityConstructor(entityId, this._eventStore)
    const events = await this._eventStore.findEventsByEntityUid(entityId)
    for (const event of events) {
      await entity.applyEvent(event)
    }
    return entity
  }
}