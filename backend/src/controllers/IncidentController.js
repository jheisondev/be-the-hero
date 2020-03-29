const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {

  async index (req, res) {
    const { page = 1 } = req.query;


    
    const [ count ] = await connection('incidents')
      .count();
    
    res.header('X-Total-Count', count['count(*)']);  

    try {
      const incidents = await connection('incidents')
      .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        'incidents.*', 
        'ongs.name', 
        'ongs.email',
        'ongs.whatsapp',
        'ongs.city',
        'ongs.uf'
      ]);
  
      return res.status(200).json({ Incidents: incidents });  
    } catch (error) {  
      return res.status(401).json({ Erro: error }); 
    }

  },

  async create (req, res) {

    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    
    try{
      const [id] = await connection('incidents').insert({
        title, 
        description, 
        value,
        ong_id,
      });
  
      return res.status(200).json({ id });
    } catch(error) {
      return res.status(400).json({Erro: error})
    }  
  
  },

  async delete(req , res) {
    const { id } =req.params;
    const ong_id = req.headers.authorization;

    try {
      const incident = await connection('incidents')
      .where('id', id)
      .select('ong_id')
      .first();

      if (incident.ong_id !== ong_id) {
        return res.status(401).json({ Erro: 'Usuário não autorizado!'});
      };

      await connection('incidents').where('id', id).delete();

      return res.status(204).send();

    } catch (error) {
      return res.status(404).json({ Erro: error});
      
    }


    
  }

};