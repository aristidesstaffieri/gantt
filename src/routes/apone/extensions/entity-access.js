let extensions = [{
  name: 'entity-access',
  type: 'post'
  factoryFunc: (entityType) =>  (req, res, next) => {
    // if entity creator ID !== logged in ID, deny with unauthorized


    // return next()
  }
}]

export { extensions }
