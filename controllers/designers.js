const mongoose = require('mongoose')
const Designer = require('../models/Designer')
const mapDesigner = require('../mappers/designer')

module.exports.designerList = async function designerList(ctx, next) {
  const designers = await Designer.find()
  ctx.body = { designers: designers.map(mapDesigner) }
}

module.exports.designerById = async function designerById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'Invalid brand id')
  }
  
  const designer = await Designer.findById(ctx.params.id)
  ctx.body = { designer: mapDesigner(designer) }
}