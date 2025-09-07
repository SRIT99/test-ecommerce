const Vehicle = require('../models/Vehicle');

exports.create = async (req, res) => {
  const v = await Vehicle.create(req.body);
  res.status(201).json(v);
};

exports.list = async (_req, res) => {
  const list = await Vehicle.find().sort({ createdAt: -1 });
  res.json(list);
};
