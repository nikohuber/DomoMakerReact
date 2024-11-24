const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.attr) {
    return res.status(400).json({ error: 'Both name, age, and attribute are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    attr: req.body.attr,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, attr: newDomo.attr });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const makerPage = (req, res) => res.render('app');

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age attr id').lean().exec();
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const deleteDomo = async (req, res) => {
  console.log(`deleting ${req.body.id}`);
  const doc = await Domo.findByIdAndDelete(req.body.id);
  // const doc =  await Domo.findOneAndDelete({id: req.body.id});
  res.status(200).json({ response: `${doc} deleted!` });
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
