import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Disciplina {
  id: number;
  nome: string;
  carga_horaria: number;
  departamento: string;
}

export default function ListaDisciplinas() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filtro, setFiltro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro('');
    try {
      const url = filtro 
        ? `http://localhost:3000/disciplinas?filtro=${encodeURIComponent(filtro)}`
        : 'http://localhost:3000/disciplinas';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao carregar disciplinas');
      }
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      }
      else {
        setErro('Ocorreu um erro desconhecido');
      }
      console.error(error);
      // Limpa a lista de disciplinas em caso de erro
      setDisciplinas([]);
    } finally {
      setCarregando(false);
    }
  }, [filtro]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const deletar = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta disciplina?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/disciplinas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar disciplina');
      }

      carregar();
    } catch (error) {
      setErro('Erro ao deletar disciplina');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Lista de Disciplinas</h2>
      
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      <div>
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <button onClick={carregar}>Buscar</button>
        <Link to="/nova" style={{ marginLeft: '10px' }}>
          <button>Nova Disciplina</button>
        </Link>
      </div>

      <hr />

      {carregando ? (
        <p>Carregando...</p>
      ) : disciplinas.length > 0 ? (
        <ul>
          {disciplinas.map((d) => (
            <li key={d.id}>
              {d.nome} - {d.carga_horaria}h ({d.departamento || 'Sem departamento'})
              <Link to={`/editar/${d.id}`} style={{ marginLeft: '10px', marginRight: '5px' }}>✏️</Link>
              <button onClick={() => deletar(d.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma disciplina encontrada.</p>
      )}
    </div>
  );
}