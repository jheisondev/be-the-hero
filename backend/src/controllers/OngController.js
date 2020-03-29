const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {

  async index (req, res) {

    try {
      const ongs = await connection('ongs').select('*');
  
      return res.status(200).json({ ONGs: ongs });  
    } catch (error) {  
      return res.status(401).json({ Erro: error }); 
    }

  },

  async create (req, res) {
    const { name, email, whatsapp, city, uf } = req.body;
  
    const id = crypto.randomBytes(4).toString('HEX');
  
    try{
      await connection('ongs').insert({
        id,
        name, 
        email, 
        whatsapp, 
        city, 
        uf
      });
  
      return res.status(200).json({ id });
    } catch(error) {
      return res.status(400).json({Erro: error})
    }  
  
  },

};