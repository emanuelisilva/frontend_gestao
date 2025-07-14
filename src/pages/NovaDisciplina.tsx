import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Departamento {
  id: number;
  nome: string;
}

export default function NovaDisciplina() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carga, setCarga] = useState(0);
  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/departamentos')
      .then(res => res.json())
      .then(data => setDepartamentos(data))
      .catch(() => setErro('Erro ao carregar departamentos'));
  }, []);

  const salvar = async () => {
    if (!nome || carga <= 0) {
      setErro('Nome e carga horária são obrigatórios');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/disciplinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nome, 
          descricao, 
          carga_horaria: carga,
          departamento_id: departamentoId 
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar disciplina');
      }

      navigate('/');
    } catch (error) {
      setErro('Erro ao salvar disciplina');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Nova Disciplina</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <div>
        <label>Nome:</label>
        <input 
          placeholder="Nome" 
          value={nome} 
          onChange={(e) => setNome(e.target.value)} 
        />
      </div>

      <div>
        <label>Descrição:</label>
        <input 
          placeholder="Descrição" 
          value={descricao} 
          onChange={(e) => setDescricao(e.target.value)} 
        />
      </div>

      <div>
        <label>Carga horária:</label>
        <input
          placeholder="Carga horária"
          type="number"
          min="1"
          value={carga}
          onChange={(e) => setCarga(Number(e.target.value))}
        />
      </div>

      <div>
        <label>Departamento:</label>
        <select
          value={departamentoId || ''}
          onChange={(e) => setDepartamentoId(Number(e.target.value) || null)}
        >
          <option value="">Selecione um departamento</option>
          {departamentos.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.nome}
            </option>
          ))}
        </select>
      </div>

      <button onClick={salvar}>Salvar</button>
      <button onClick={() => navigate('/')}>Cancelar</button>
    </div>
  );
}