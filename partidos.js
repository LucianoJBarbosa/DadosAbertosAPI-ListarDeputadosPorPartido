$(document).ready(() => {
    function listarPartidos(partido) {
        let div = `<option value="${partido.id}">${partido.nome}</option>`;
        $('#select-partidos').append(div);
    }

    function listarDeputadosPartido(deputado) {
        let div = `<option value="${deputado.id}">${deputado.nome}</option>`;
        $('#select-deputados').append(div);
    }

    function exibeDadosDeputado(dados) {
        $('#redes-sociais').empty();
        $('#deputado-form').trigger("reset");

        if (!$('#collapse-dados').hasClass('show')) {
            new bootstrap.Collapse('#collapse-dados', {
                toggle: true
            })
        }

        $('#img-deputado').attr('src', dados.ultimoStatus.urlFoto);

        $('#nome-deputado').val(dados.nomeCivil);
        $('#partido-deputado').val(dados.ultimoStatus.siglaPartido);
        $('#cpf-deputado').val(dados.cpf);
        $('#sexo-deputado').val(dados.sexo);
        $('#data-nascimento').val(dados.dataNascimento);
        $('#uf-nascimento').val(dados.ufNascimento);
        $('#municipio-nascimento').val(dados.municipioNascimento);
        $('#escolaridade').val(dados.escolaridade);
        $('#situacao').val(dados.ultimoStatus.situacao);
        $('#condicao-eleitoral').val(dados.ultimoStatus.condicaoEleitoral);
        
        dados.redeSocial.map((link) => {
            let div = `<a href="${link}" target="_blank">${link}</a> <br>`
            $('#redes-sociais').append(div);
        });

        $('#gabinete-nome').val(dados.ultimoStatus.gabinete.nome);
        $('#gabinete-predio').val(dados.ultimoStatus.gabinete.predio);
        $('#gabinete-sala').val(dados.ultimoStatus.gabinete.sala);
        $('#gabinete-andar').val(dados.ultimoStatus.gabinete.andar);

        $('#email-gabinete').val(dados.ultimoStatus.gabinete.email);
        $('#telefone-gabinete').val(dados.ultimoStatus.gabinete.telefone)
    }

    function apiListaPartidos(pagina) {
        let url = `https://dadosabertos.camara.leg.br/api/v2/partidos?pagina=${pagina}`;
        let req = new XMLHttpRequest();
        let corpo;
        req.open ("GET", url);
        req.onreadystatechange = (evt) => {
            if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                console.log(req.responseText);
                corpo = JSON.parse(req.responseText);
                console.log(corpo.dados);
                let i = 0;
                console.log(corpo.dados.length);
                if (corpo.dados.length > 0) {
                    corpo.dados.map((partido) => {
                        listarPartidos(partido, i);
                        i++;
                    })
                    apiListaPartidos(pagina+1);
                    $('#select-partidos')[0][0].innerText = "Selecione o partido...";
                }
            }
        }
        req.setRequestHeader("Accept", "application/json");
        req.send();
    }

    function apiListaDeputados(idLegislatura, sigla, pagina) {
        let url = `https://dadosabertos.camara.leg.br/api/v2/deputados?idLegislatura=${idLegislatura}&siglaPartido=${sigla}&pagina=${pagina}`;
        let req = new XMLHttpRequest();
        let corpo;
        req.open("GET", url);
        req.onreadystatechange = (evt) => {
            if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                corpo = JSON.parse(req.responseText);
                let i = 0;
                if (corpo.dados.length > 0) {
                    corpo.dados.map((deputados) => {
                        listarDeputadosPartido(deputados, i);
                        i++;
                    })
                    apiListaDeputados(idLegislatura, sigla, pagina+1);
                }
            }
        }
        req.setRequestHeader("Accept", "application/json");
        req.send();
    }

    function apiDadosDeputado(id) {
        let url = `https://dadosabertos.camara.leg.br/api/v2/deputados/${id}`;
        let req = new XMLHttpRequest();
        let corpo;
        req.open("GET", url);
        req.onreadystatechange = (evt) => {
            if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                corpo = JSON.parse(req.responseText);
                exibeDadosDeputado(corpo.dados);
            }
        }
        req.setRequestHeader("Accept", "application/json");
        req.send();
    }

    function apiPartido(partido) {
        let url = `https://dadosabertos.camara.leg.br/api/v2/partidos/${partido}`;
        let req = new XMLHttpRequest();
        let corpo;
        req.open("GET", url);
        req.onreadystatechange = (evt) => {
            if (req.readyState === req.DONE && req.status >= 200 && req.status < 300) {
                corpo = JSON.parse(req.responseText);
                console.log(corpo.dados);
                apiListaDeputados(corpo.dados.status.idLegislatura, corpo.dados.sigla, 1);
            }
        }
        req.setRequestHeader("Accept", "application/json");
        req.send();
    }

    apiListaPartidos(1);
    
    $('#select-partidos').on('change', () => {
        $('#select-deputados').empty();
        let div = `<option selected disabled>Selecione o deputado...</option>`;
        $('#select-deputados').append(div);
        apiPartido($('#select-partidos').val());
        if (!$('#collapse-deputados').hasClass('show')) {
            new bootstrap.Collapse('#collapse-deputados', {
                toggle: true
            })
        }
    })

    $('#select-deputados').on('change', () => {
        console.log($('#select-deputados').val());
        apiDadosDeputado($('#select-deputados').val());
    })

})
