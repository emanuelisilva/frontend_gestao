import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Disciplina {
  id?: number;
  nome: string;
  descricao: string;
  carga_horaria: number;
  departamento_id?: number;
}

interface Departamento {
  id: number;
  nome: string;
}

export default function EditarDisciplina() {
  const [disciplina, setDisciplina] = useState<Disciplina | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setCarregando(true);
        setErro('');
        
        // Carrega departamentos
        const depResponse = await fetch('http://localhost:3000/departamentos');
        if (!depResponse.ok) throw new Error('Erro ao carregar departamentos');
        const depData = await depResponse.json();
        setDepartamentos(depData);

        // Carrega disciplina
        const discResponse = await fetch(`http://localhost:3000/disciplinas/${id}`);
        if (!discResponse.ok) {
          if (discResponse.status === 404) {
            navigate('/');
            return;
          }
          throw new Error('Erro ao carregar disciplina');
        }
        const discData = await discResponse.json();
        setDisciplina(discData);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro('Ocorreu um erro desconhecido');
        }
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id, navigate]);

  const salvar = async () => {
    if (!disciplina || !disciplina.nome || disciplina.carga_horaria <= 0) {
      setErro('Nome e carga horária são obrigatórios');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/disciplinas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(disciplina),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar disciplina');
      }

      navigate('/');
    } catch (error) {
      setErro('Erro ao atualizar disciplina');
      console.error(error);
    }
  };

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (!disciplina) return <p>Disciplina não encontrada</p>;

  return (
    <div>
      <h2>Editar Disciplina</h2>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <div>
        <label>Nome:</label>
        <input
          placeholder="Nome"
          value={disciplina.nome}
          onChange={(e) => setDisciplina({ ...disciplina, nome: e.target.value })}
        />
      </div>

      <div>
        <label>Descrição:</label>
        <input
          placeholder="Descrição"
          value={disciplina.descricao}
          onChange={(e) => setDisciplina({ ...disciplina, descricao: e.target.value })}
        />
      </div>

      <div>
        <label>Carga horária:</label>
        <input
          placeholder="Carga horária"
          type="number"
          min="1"
          value={disciplina.carga_horaria}
          onChange={(e) => setDisciplina({ 
            ...disciplina, 
            carga_horaria: Number(e.target.value) 
          })}
        />
      </div>

      <div>
        <label>Departamento:</label>
        <select
          value={disciplina.departamento_id || ''}
          onChange={(e) => setDisciplina({
            ...disciplina,
            departamento_id: Number(e.target.value) || undefined
          })}
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