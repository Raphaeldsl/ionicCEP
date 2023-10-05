import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RespostaCep {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  erro?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public alertButtons = ['OK'];
  cepConsulta = '';
  ruaConsulta = '';
  bairroConsulta = '';
  cidadeConsulta = '';
  ufConsulta = '';
  ibgeConsulta = '';
  mostrarResultadosConsulta = false;

  ufPesquisa = '';
  cidadePesquisa = '';
  nomeRuaPesquisa = '';
  cepPesquisa = '';
  ruaPesquisa = '';
  bairroPesquisa = '';
  cidadeResultadoPesquisa = '';
  ufResultadoPesquisa = '';
  ibgePesquisa = '';
  mostrarResultadosPesquisa = false;
  resultadosPesquisa: RespostaCep[] = [];

  constructor(private http: HttpClient) {}

  consultarCep() {
    const cep = this.cepConsulta.replace(/\D/g, '');

    if (cep) {
      const url = `https://viacep.com.br/ws/${cep}/json/`;

      this.http.get<RespostaCep>(url).subscribe(
        (data) => {
          if (!data.erro) {
            this.ruaConsulta = data.logradouro;
            this.bairroConsulta = data.bairro;
            this.cidadeConsulta = data.localidade;
            this.ufConsulta = data.uf;
            this.ibgeConsulta = data.ibge;
            this.mostrarResultadosConsulta = true;
          } else {
            this.limparCamposConsulta();
            alert('CEP não encontrado.');
          }
        },
        (error) => {
          console.error('Erro ao consultar CEP:', error);
          this.limparCamposConsulta();
          alert('Erro ao consultar CEP. Verifique a conexão ou tente novamente mais tarde.');
        }
      );
    } else {
      this.limparCamposConsulta();
      alert('Por favor, insira um CEP válido.');
    }
  }

  consultarEndereco() {
    const uf = this.ufPesquisa.trim().toUpperCase();
    const cidade = this.cidadePesquisa.trim();
    const nomeRua = this.nomeRuaPesquisa.trim();

    if (uf && cidade && nomeRua) {
      const url = `https://viacep.com.br/ws/${uf}/${cidade}/${nomeRua}/json/`;

      this.http.get<RespostaCep[]>(url).subscribe(
        (data) => {
          if (data && data.length > 0) {
            this.resultadosPesquisa = data;
            this.mostrarResultadosPesquisa = true;
          } else {
            this.limparCamposPesquisa();
            alert('Nenhum endereço encontrado para a consulta.');
          }
        },
        (error) => {
          console.error('Erro ao consultar:', error);
          this.limparCamposPesquisa();
          alert('Erro ao consultar. Verifique a conexão ou tente novamente mais tarde.');
        }
      );
    } else {
      this.limparCamposPesquisa();
      alert('Por favor, preencha todos os campos.');
    }
  }

  private limparCamposConsulta() {
    this.ruaConsulta = '';
    this.bairroConsulta = '';
    this.cidadeConsulta = '';
    this.ufConsulta = '';
    this.ibgeConsulta = '';
    this.mostrarResultadosConsulta = false;
  }

  private limparCamposPesquisa() {
    this.resultadosPesquisa = [];
    this.mostrarResultadosPesquisa = false;
  }
}
