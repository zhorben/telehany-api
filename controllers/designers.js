const Designer = require('../models/Designer')
const mapDesigner = require('../mappers/designer')

module.exports.designerList = async function designerList(ctx, next) {
  const designers = await Designer.find()
  ctx.body = { designers: designers.map(mapDesigner) }
}
