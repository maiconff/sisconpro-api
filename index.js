const express = require('express')
const cors = require('cors')

const { pool } = require('./config')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const getMaquinas = (request, response) => {
    pool.query('SELECT * FROM maquinas ORDER BY codigo',
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao consultar a tabela maquinas: ' + error
                    }
                )
            }
            response.status(200).json(results.rows);
        }
    )
}

const addMaquina = (request, response) => {
    const { nome, descricao, capacidade } = request.body;
    pool.query(`INSERT INTO maquinas (nome, descricao, capacidade) 
    VALUES ($1, $2 , $3)
    RETURNING codigo, nome, descricao, capacidade`,
        [nome, descricao, capacidade],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao inserir a maquina: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Maquina criada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const updateMaquina = (request, response) => {
    const { codigo, nome, descricao, capacidade } = request.body;
    pool.query(`UPDATE MAQUINAS SET nome=$1, 
    descricao=$2, capacidade=$3
    WHERE codigo = $4
    RETURNING codigo, nome, descricao, capacidade`,
        [nome, descricao, capacidade, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao atualizar a maquina: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Maquina atualizada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const deleteMaquina = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM maquinas where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao remover a maquina: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Maquina removida'
                }
            );
        }
    )
}

const getMaquinaPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`SELECT * FROM maquinas where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao recuperar a maquina: ' + error
                    }
                )
            }
            response.status(200).json(results.rows[0]);
        }
    )
}

const getPecas = (request, response) => {
    pool.query(`select p.codigo as codigo, p.nome as nome, 
    p.descricao as descricao, 
    p.nro_cavidade as nro_cavidade, 
    p.maquina as maquina, m.nome as nomemaquina
    from pecas p
    join maquinas m on p.maquina = m.codigo
    order by p.codigo`,
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao consultar a tabela peças: ' + error
                    }
                )
            }
            response.status(200).json(results.rows);
        }
    )
}

const addPeca = (request, response) => {
    const { nome, descricao, nro_cavidade, maquina } = request.body;
    pool.query(`insert into pecas (nome, descricao, nro_cavidade, maquina) 
    values ($1, $2, $3, $4)
    returning codigo, nome, descricao, nro_cavidade, maquina`,
        [nome, descricao, nro_cavidade, maquina],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao inserir a peça: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Peça criada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const updatePeca = (request, response) => {
    const { codigo, nome, descricao, nro_cavidade, maquina } = request.body;
    pool.query(`UPDATE pecas
	SET nome=$1, descricao=$2, nro_cavidade=$3, maquina=$4
	WHERE codigo=$5
    returning codigo, nome, descricao, nro_cavidade, maquina`,
        [nome, descricao, nro_cavidade, maquina, codigo],
        (error, results) => {
            if (error) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao atualizar a peça: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Peça atualizada',
                    objeto: results.rows[0]
                }
            );
        }
    )
}

const deletePeca = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`DELETE FROM pecas where codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao remover a peça: ' + error
                    }
                )
            }
            response.status(200).json(
                {
                    status: 'success', message: 'Peça removida'
                }
            );
        }
    )
}

const getPecaPorCodigo = (request, response) => {
    const codigo = parseInt(request.params.codigo);
    pool.query(`select p.codigo as codigo, p.nome as nome, 
    p.descricao as descricao, 
    p.nro_cavidade as nro_cavidade, 
    p.maquina as maquina, m.nome as nomemaquina
    from pecas p
    join maquinas m on p.maquina = m.codigo
    where p.codigo = $1`,
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(400).json(
                    {
                        status: 'error',
                        message: 'Erro ao recuperar a peça: ' + error
                    }
                )
            }
            response.status(200).json(results.rows[0]);
        }
    )
}

app.route('/maquinas')
    .get(getMaquinas)
    .post(addMaquina)
    .put(updateMaquina)

app.route('/maquinas/:codigo')
    .delete(deleteMaquina)
    .get(getMaquinaPorCodigo)

app.route('/pecas')
    .get(getPecas)
    .post(addPeca)
    .put(updatePeca)

app.route('/pecas/:codigo')
    .delete(deletePeca)
    .get(getPecaPorCodigo)    

app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor da API rodando')
})