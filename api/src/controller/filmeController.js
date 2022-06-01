import { alterarImagem, buscarPorID, buscarPorNome, inserirFilme, listarTodosFilmes, removerFilme  } from '../repository/filmeRepository.js'

import multer from 'multer'
import { Router } from 'express'

const server = Router();
const upload = multer({ dest: 'storage/capaFilmes'})

server.post('/filme', async (req,resp) => {
    try {
        const novoFilme = req.body;

        if(!novoFilme.nome)
            throw new Error('Nome do filme é obrigatório!');

        if(!novoFilme.sinopse)
            throw new Error('Sinopse do filme é obrigatória!');

        if(novoFilme.avaliacao == undefined || novoFilme.avaliacao < 0)
            throw new Error('Avaliação do filme é obrigatória!');

        if(!novoFilme.lancamento)
            throw new Error('Data de lançamento do filme é obrigatória!');

        if(!novoFilme.disponivel)
            throw new Error('Disponibilidade do filme é obrigatória!');

        if(!novoFilme.usuario)
            throw new Error('Usuário não logado!');


        const filmeInserido = await inserirFilme(novoFilme);

        resp.send(filmeInserido);
    } catch (err) {
        resp.status(400).send({
            erro: err.message 
        })
    }
})

server.put('/filme/:id/capa', upload.single('capa'), async (req,resp) => {
    try {
        const {id} = req.params;
        const imagem = req.file.path;

        const resposta = await alterarImagem(imagem,id);
        if(resposta != 1)
        throw new Error('A imagem não pode ser salva.');

        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro : err.message
        })
    }
})

server.get('/filme', async (req,resp) => {
    try {
        const resposta = await listarTodosFilmes();
        resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/busca', async (req,resp) => {
    try {
        const {nome}  = req.query;

        const resposta = await buscarPorNome(nome);

        if(resposta.length == 0)
            resp.status(404).send([])
        else
            resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.get('/filme/:id', async (req,resp) => {
    try {
        const { id } = req.params;

        const resposta = await buscarPorID(id);

        if(!resposta)
            resp.status(404).send([])
        else
            resp.send(resposta);
    } catch (err) {
        resp.status(400).send({
            erro: err.message
        })
    }
})

server.delete('/filme/:id', async (req,resp) => {
    try {
        const {id} = req.params;

        const resposta = await removerFilme(id);
        if(resposta != 1)
            throw new Error('Filme não pode ser removido');

        resp.status(204).send();
    } catch (err) {
        resp.status(400).send({
            erro : err.message
        })
    }
})

export default server;